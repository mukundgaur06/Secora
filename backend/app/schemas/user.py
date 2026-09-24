from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict

class UserPlanOut(BaseModel):
    plan: str
    monthly_token_limit: int
    tokens_used: int
    tokens_remaining: int
    reset_date: datetime

    model_config = ConfigDict(from_attributes=True)

class UserOut(BaseModel):
    id: str
    email: EmailStr
    username: str
    role: str
    status: str
    created_at: datetime
    plan: Optional[UserPlanOut] = None

    model_config = ConfigDict(from_attributes=True)

class UserProfileUpdate(BaseModel):
    username: Optional[str] = None
