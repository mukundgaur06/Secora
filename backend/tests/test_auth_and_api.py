import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.main import app
from app.database import Base, get_db
from app.models.user import User, UserPlan
from app.security.passwords import hash_password

# Use StaticPool so all threads/sessions share the exact same in-memory database during tests
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    # Create test user
    u = User(
        email="testanalyst@secora.internal",
        username="test_analyst",
        password_hash=hash_password("SecoraPass123!"),
        role="USER",
        status="ACTIVE"
    )
    db.add(u)
    db.flush()
    plan = UserPlan(
        user_id=u.id,
        plan="FREE_ANALYST",
        monthly_token_limit=100000,
        tokens_used=500
    )
    db.add(plan)
    db.commit()
    db.close()
    yield
    Base.metadata.drop_all(bind=engine)

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["healthy", "operational"]
    assert "components" in data
    assert "database" in data["components"]
    assert data["components"]["database"]["status"] == "healthy"

def test_login_success():
    response = client.post("/api/auth/login", json={
        "username_or_email": "test_analyst",
        "password": "SecoraPass123!"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["user"]["username"] == "test_analyst"
    assert data["user"]["role"] == "USER"

def test_login_invalid_password():
    response = client.post("/api/auth/login", json={
        "username_or_email": "test_analyst",
        "password": "WrongPassword123!"
    })
    assert response.status_code == 401

def test_register_new_user():
    response = client.post("/api/auth/register", json={
        "email": "newuser@secora.internal",
        "username": "new_sec_user",
        "password": "ValidPassword999!"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["user"]["username"] == "new_sec_user"
    assert data["user"]["plan"]["tokens_remaining"] == 100000

def test_get_current_user_profile():
    # Login first
    login_resp = client.post("/api/auth/login", json={
        "username_or_email": "test_analyst",
        "password": "SecoraPass123!"
    })
    token = login_resp.json()["access_token"]
    
    # Call /api/users/me
    headers = {"Authorization": f"Bearer {token}"}
    me_resp = client.get("/api/users/me", headers=headers)
    assert me_resp.status_code == 200
    me_data = me_resp.json()
    assert me_data["username"] == "test_analyst"
    assert me_data["plan"]["monthly_token_limit"] == 100000
