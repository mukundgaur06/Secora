from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserOut, UserProfileUpdate
from app.security.dependencies import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserOut)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    plan = current_user.plan
    plan_data = None
    if plan:
        plan_data = {
            "plan": plan.plan,
            "monthly_token_limit": plan.monthly_token_limit,
            "tokens_used": plan.tokens_used,
            "tokens_remaining": max(0, plan.monthly_token_limit - plan.tokens_used),
            "reset_date": plan.reset_date
        }

    return {
        "id": current_user.id,
        "email": current_user.email,
        "username": current_user.username,
        "role": current_user.role,
        "status": current_user.status,
        "created_at": current_user.created_at,
        "plan": plan_data
    }

@router.put("/profile", response_model=UserOut)
def update_profile(
    req: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if req.username and req.username != current_user.username:
        # Check if username is already taken
        existing = db.query(User).filter(User.username == req.username).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username is already taken"
            )
        current_user.username = req.username
        db.commit()
        db.refresh(current_user)

    return get_current_user_profile(current_user)
