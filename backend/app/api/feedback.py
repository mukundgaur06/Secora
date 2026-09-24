from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.audit import Feedback
from app.models.conversation import Message
from app.models.user import User
from app.schemas.feedback import FeedbackCreate, FeedbackOut
from app.security.dependencies import get_current_user

router = APIRouter(prefix="/feedback", tags=["Message Feedback"])

@router.post("", response_model=FeedbackOut, status_code=status.HTTP_201_CREATED)
def submit_message_feedback(
    req: FeedbackCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify message exists and user owns conversation
    message = db.query(Message).filter(Message.id == req.message_id).first()
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target message not found."
        )

    if message.conversation.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot submit feedback for another user's conversation."
        )

    # Check if feedback already exists for this message
    existing = db.query(Feedback).filter(
        Feedback.message_id == req.message_id,
        Feedback.user_id == current_user.id
    ).first()

    if existing:
        existing.rating = req.rating
        existing.comment = req.comment
        db.commit()
        db.refresh(existing)
        return {
            "id": existing.id,
            "message_id": existing.message_id,
            "rating": existing.rating,
            "comment": existing.comment,
            "status": "updated"
        }

    feedback = Feedback(
        user_id=current_user.id,
        message_id=req.message_id,
        rating=req.rating,
        comment=req.comment
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)

    return {
        "id": feedback.id,
        "message_id": feedback.message_id,
        "rating": feedback.rating,
        "comment": feedback.comment,
        "status": "created"
    }
