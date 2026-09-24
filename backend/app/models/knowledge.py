import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

def get_utc_now() -> datetime:
    return datetime.now(timezone.utc)

class Document(Base):
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    source = Column(String(50), nullable=False)  # OWASP, CWE, MITRE, NIST, LINUX, SECORA
    url = Column(String(500), nullable=True)
    category = Column(String(50), nullable=False)  # Web Security, Network, Linux, Cryptography, etc.
    version = Column(String(30), default="1.0", nullable=False)
    tags = Column(String(255), nullable=True)  # Comma-separated tags
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)

    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")

class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    document_id = Column(String(36), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    chunk_index = Column(Integer, default=0, nullable=False)
    content = Column(Text, nullable=False)
    embedding = Column(Text, nullable=True)  # Serialized float vector or pgvector
    chunk_metadata = Column(Text, nullable=True)  # JSON string

    document = relationship("Document", back_populates="chunks")

class Lab(Base):
    __tablename__ = "labs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    category = Column(String(50), nullable=False)
    difficulty = Column(String(20), default="BEGINNER", nullable=False)  # BEGINNER, INTERMEDIATE, ADVANCED
    description = Column(Text, nullable=False)
    learning_objectives = Column(Text, nullable=False)  # JSON array string
    instructions = Column(Text, nullable=False)
    hints = Column(Text, nullable=True)  # JSON array string
    solution = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=get_utc_now, nullable=False)
