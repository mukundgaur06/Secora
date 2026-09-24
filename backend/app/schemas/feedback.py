from typing import Optional
from pydantic import BaseModel, Field

class FeedbackCreate(BaseModel):
    message_id: str
    rating: int = Field(..., description="1 for helpful/positive, -1 for unhelpful/negative")
    comment: Optional[str] = None
    category: Optional[str] = None

class FeedbackOut(BaseModel):
    id: str
    message_id: str
    rating: int
    comment: Optional[str] = None
    status: str = "success"
