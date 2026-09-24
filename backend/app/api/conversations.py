from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import desc, or_
from app.database import get_db
from app.models.conversation import Conversation, Message
from app.models.user import User
from app.schemas.conversation import (
    ConversationCreate,
    ConversationUpdate,
    ConversationOut,
    ConversationDetailOut,
    MessageCreate,
    MessageOut,
)
from app.security.dependencies import get_current_user
from app.ai.service import AIService
from app.ai.prompts.modes import VALID_MODES
from app.middleware.rate_limit import check_rate_limit
import json

router = APIRouter(prefix="/conversations", tags=["Conversations"])

@router.get("", response_model=List[ConversationOut])
def list_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    convs = (
        db.query(Conversation)
        .filter(Conversation.user_id == current_user.id)
        .order_by(desc(Conversation.is_pinned), desc(Conversation.updated_at))
        .all()
    )
    result = []
    for c in convs:
        result.append({
            "id": c.id,
            "title": c.title,
            "mode": c.mode,
            "is_pinned": c.is_pinned,
            "created_at": c.created_at,
            "updated_at": c.updated_at,
            "message_count": len(c.messages)
        })
    return result

@router.get("/search", response_model=List[ConversationOut])
def search_conversations(
    q: str = Query(..., min_length=1),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Search conversations by title or message contents.
    """
    search_term = f"%{q.strip()}%"
    convs = (
        db.query(Conversation)
        .outerjoin(Message, Message.conversation_id == Conversation.id)
        .filter(
            Conversation.user_id == current_user.id,
            or_(
                Conversation.title.ilike(search_term),
                Message.content.ilike(search_term)
            )
        )
        .distinct()
        .order_by(desc(Conversation.updated_at))
        .limit(30)
        .all()
    )
    return [
        {
            "id": c.id,
            "title": c.title,
            "mode": c.mode,
            "is_pinned": c.is_pinned,
            "created_at": c.created_at,
            "updated_at": c.updated_at,
            "message_count": len(c.messages)
        }
        for c in convs
    ]

@router.post("", response_model=ConversationOut, status_code=status.HTTP_201_CREATED)
def create_conversation(
    req: ConversationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    mode = req.mode.upper().strip() if req.mode else "GENERAL"
    if mode not in VALID_MODES:
        mode = "GENERAL"

    conv = Conversation(
        user_id=current_user.id,
        title=req.title or "New Security Investigation",
        mode=mode
    )
    db.add(conv)
    db.commit()
    db.refresh(conv)
    return {
        "id": conv.id,
        "title": conv.title,
        "mode": conv.mode,
        "is_pinned": conv.is_pinned,
        "created_at": conv.created_at,
        "updated_at": conv.updated_at,
        "message_count": 0
    }

@router.get("/{conversation_id}", response_model=ConversationDetailOut)
def get_conversation(
    conversation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    conv = (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id, Conversation.user_id == current_user.id)
        .first()
    )
    if not conv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")

    messages_out = []
    for m in conv.messages:
        sec_meta = None
        if m.security_metadata:
            try:
                sec_meta = json.loads(m.security_metadata)
            except Exception:
                sec_meta = None
        messages_out.append({
            "id": m.id,
            "conversation_id": m.conversation_id,
            "role": m.role,
            "content": m.content,
            "token_count": m.token_count,
            "security_metadata": sec_meta,
            "created_at": m.created_at
        })

    return {
        "id": conv.id,
        "title": conv.title,
        "mode": conv.mode,
        "is_pinned": conv.is_pinned,
        "created_at": conv.created_at,
        "updated_at": conv.updated_at,
        "message_count": len(conv.messages),
        "messages": messages_out
    }

@router.patch("/{conversation_id}", response_model=ConversationOut)
def update_conversation(
    conversation_id: str,
    req: ConversationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    conv = (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id, Conversation.user_id == current_user.id)
        .first()
    )
    if not conv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")

    if req.title is not None:
        conv.title = req.title.strip()[:200]
    if req.mode is not None:
        normalized_mode = req.mode.upper().strip()
        if normalized_mode in VALID_MODES:
            conv.mode = normalized_mode
    if req.is_pinned is not None:
        conv.is_pinned = req.is_pinned

    db.commit()
    db.refresh(conv)

    return {
        "id": conv.id,
        "title": conv.title,
        "mode": conv.mode,
        "is_pinned": conv.is_pinned,
        "created_at": conv.created_at,
        "updated_at": conv.updated_at,
        "message_count": len(conv.messages)
    }

@router.delete("/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_conversation(
    conversation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    conv = (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id, Conversation.user_id == current_user.id)
        .first()
    )
    if not conv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")

    db.delete(conv)
    db.commit()
    return None

@router.post("/{conversation_id}/messages")
async def send_chat_message(
    conversation_id: str,
    req: MessageCreate,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Streams AI responses token-by-token using Server-Sent Events (SSE).
    Validates authentication, ownership, safety policies, and updates metered token accounting.
    """
    check_rate_limit(request)

    conv = (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id, Conversation.user_id == current_user.id)
        .first()
    )
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found or access denied."
        )

    # Validate mode
    active_mode = (req.mode or conv.mode or "GENERAL").upper().strip()
    if active_mode not in VALID_MODES:
        active_mode = "GENERAL"

    # Stream generator
    return StreamingResponse(
        AIService.process_chat_stream(
            db=db,
            user=current_user,
            conversation=conv,
            user_content=req.content,
            mode=active_mode
        ),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

@router.post("/{conversation_id}/regenerate")
async def regenerate_last_message(
    conversation_id: str,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Regenerates the assistant response for the last user prompt in the conversation.
    """
    check_rate_limit(request)

    conv = (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id, Conversation.user_id == current_user.id)
        .first()
    )
    if not conv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found.")

    # Find the last user message
    last_user_message = (
        db.query(Message)
        .filter(Message.conversation_id == conv.id, Message.role == "user")
        .order_by(desc(Message.created_at))
        .first()
    )

    if not last_user_message:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No user message found to regenerate.")

    return StreamingResponse(
        AIService.process_chat_stream(
            db=db,
            user=current_user,
            conversation=conv,
            user_content=last_user_message.content,
            mode=conv.mode
        ),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
