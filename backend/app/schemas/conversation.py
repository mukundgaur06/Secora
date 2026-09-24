from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, Field, ConfigDict

class MessageCreate(BaseModel):
    content: str = Field(..., min_length=1)
    mode: Optional[str] = "GENERAL"  # GENERAL, LEARNING, DEFENSIVE, TROUBLESHOOTING, CTF, CODE_REVIEW

class MessageOut(BaseModel):
    id: str
    conversation_id: str
    role: str
    content: str
    token_count: int
    security_metadata: Optional[Any] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ConversationCreate(BaseModel):
    title: Optional[str] = "New Security Investigation"
    mode: Optional[str] = "GENERAL"

class ConversationUpdate(BaseModel):
    title: Optional[str] = None
    mode: Optional[str] = None
    is_pinned: Optional[bool] = None

class ConversationOut(BaseModel):
    id: str
    title: str
    mode: str
    is_pinned: bool
    created_at: datetime
    updated_at: datetime
    message_count: Optional[int] = 0

    model_config = ConfigDict(from_attributes=True)

class ConversationDetailOut(ConversationOut):
    messages: List[MessageOut] = []
