from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.knowledge import Document, Lab

router = APIRouter(tags=["Knowledge & Labs"])

@router.get("/knowledge")
def list_knowledge_documents(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Document)
    if category:
        query = query.filter(Document.category.ilike(f"%{category}%"))
    docs = query.order_by(Document.created_at.desc()).all()
    return [
        {
            "id": d.id,
            "title": d.title,
            "source": d.source,
            "category": d.category,
            "url": d.url,
            "version": d.version,
            "tags": d.tags.split(",") if d.tags else [],
            "summary": d.content[:220] + "..." if len(d.content) > 220 else d.content,
            "created_at": d.created_at
        }
        for d in docs
    ]

@router.get("/knowledge/{doc_id}")
def get_knowledge_document(doc_id: str, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return {
        "id": doc.id,
        "title": doc.title,
        "source": doc.source,
        "category": doc.category,
        "url": doc.url,
        "version": doc.version,
        "tags": doc.tags.split(",") if doc.tags else [],
        "content": doc.content,
        "created_at": doc.created_at
    }

@router.get("/labs")
def list_labs(db: Session = Depends(get_db)):
    labs = db.query(Lab).order_by(Lab.created_at.asc()).all()
    return [
        {
            "id": l.id,
            "slug": l.slug,
            "title": l.title,
            "category": l.category,
            "difficulty": l.difficulty,
            "description": l.description,
            "created_at": l.created_at
        }
        for l in labs
    ]

@router.get("/labs/{slug}")
def get_lab_detail(slug: str, db: Session = Depends(get_db)):
    lab = db.query(Lab).filter(Lab.slug == slug).first()
    if not lab:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lab not found")
    return {
        "id": lab.id,
        "slug": lab.slug,
        "title": lab.title,
        "category": lab.category,
        "difficulty": lab.difficulty,
        "description": lab.description,
        "learning_objectives": lab.learning_objectives,
        "instructions": lab.instructions,
        "hints": lab.hints,
        "solution": lab.solution
    }
