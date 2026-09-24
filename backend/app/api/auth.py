from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserPlan
from app.models.audit import AuditLog
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, RefreshTokenRequest, MessageResponse
from app.security.passwords import hash_password, verify_password
from app.security.jwt import create_access_token, create_refresh_token, decode_token
from app.middleware.rate_limit import check_rate_limit
import json
import hashlib

router = APIRouter(prefix="/auth", tags=["Authentication"])

def hash_ip(ip: str) -> str:
    return hashlib.sha256(ip.encode()).hexdigest()[:16]

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(req: RegisterRequest, request: Request, db: Session = Depends(get_db)):
    check_rate_limit(request)
    
    # Check if email or username already taken
    existing_email = db.query(User).filter(User.email == req.email.lower()).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists"
        )
        
    existing_user = db.query(User).filter(User.username == req.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This username is already taken"
        )
        
    # Create new user
    new_user = User(
        email=req.email.lower(),
        username=req.username,
        password_hash=hash_password(req.password),
        role="USER",
        status="ACTIVE"
    )
    db.add(new_user)
    db.flush()

    # Assign default free plan
    plan = UserPlan(
        user_id=new_user.id,
        plan="FREE_ANALYST",
        monthly_token_limit=100000,
        tokens_used=0
    )
    db.add(plan)

    # Audit log
    client_ip = request.client.host if request.client else "127.0.0.1"
    audit = AuditLog(
        user_id=new_user.id,
        event="USER_REGISTERED",
        details=json.dumps({"email": new_user.email, "username": new_user.username}),
        ip_hash=hash_ip(client_ip)
    )
    db.add(audit)
    db.commit()
    db.refresh(new_user)

    # Generate tokens
    access_token = create_access_token({"sub": new_user.id, "role": new_user.role, "username": new_user.username})
    refresh_token = create_refresh_token({"sub": new_user.id})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "username": new_user.username,
            "role": new_user.role,
            "status": new_user.status,
            "created_at": new_user.created_at.isoformat(),
            "plan": {
                "plan": plan.plan,
                "monthly_token_limit": plan.monthly_token_limit,
                "tokens_used": plan.tokens_used,
                "tokens_remaining": plan.monthly_token_limit - plan.tokens_used,
            }
        }
    }

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, request: Request, db: Session = Depends(get_db)):
    check_rate_limit(request)
    
    identifier = req.username_or_email.strip().lower()
    user = db.query(User).filter(
        (User.email == identifier) | (User.username.ilike(req.username_or_email.strip()))
    ).first()

    client_ip = request.client.host if request.client else "127.0.0.1"

    if not user or not verify_password(req.password, user.password_hash):
        # Audit failed login attempt
        audit = AuditLog(
            user_id=user.id if user else None,
            event="AUTH_LOGIN_FAILED",
            details=json.dumps({"identifier": req.username_or_email}),
            ip_hash=hash_ip(client_ip)
        )
        db.add(audit)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if user.status != "ACTIVE":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is suspended or deactivated"
        )

    # Audit successful login
    audit = AuditLog(
        user_id=user.id,
        event="AUTH_LOGIN_SUCCESS",
        details=json.dumps({"username": user.username}),
        ip_hash=hash_ip(client_ip)
    )
    db.add(audit)
    db.commit()

    access_token = create_access_token({"sub": user.id, "role": user.role, "username": user.username})
    refresh_token = create_refresh_token({"sub": user.id})

    plan = user.plan
    plan_info = {
        "plan": plan.plan if plan else "FREE_ANALYST",
        "monthly_token_limit": plan.monthly_token_limit if plan else 100000,
        "tokens_used": plan.tokens_used if plan else 0,
        "tokens_remaining": (plan.monthly_token_limit - plan.tokens_used) if plan else 100000,
    }

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "role": user.role,
            "status": user.status,
            "created_at": user.created_at.isoformat(),
            "plan": plan_info
        }
    }

@router.post("/refresh")
def refresh_token_endpoint(req: RefreshTokenRequest, db: Session = Depends(get_db)):
    payload = decode_token(req.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )
        
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    if not user or user.status != "ACTIVE":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )

    access_token = create_access_token({"sub": user.id, "role": user.role, "username": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout", response_model=MessageResponse)
def logout():
    return {"message": "Successfully logged out"}
