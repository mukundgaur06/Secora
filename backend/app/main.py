from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
import app.models  # Ensures all models are imported before create_all
from app.middleware.security_headers import SecurityHeadersMiddleware

# Import API routers
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.conversations import router as conv_router
from app.api.usage import router as usage_router
from app.api.health import router as health_router
from app.api.admin import router as admin_router
from app.api.knowledge import router as knowledge_router
from app.api.feedback import router as feedback_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables if not existing
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title="CyberForge / SECORA",
    version=settings.VERSION,
    description="CyberForge: Production AI Cybersecurity & Ethical Hacking Operating System API Gateway",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Custom Security Headers Middleware
app.add_middleware(SecurityHeadersMiddleware)

# Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS + ["*"],  # Permissive for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Sub-Routers under /api
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(users_router, prefix=settings.API_V1_STR)
app.include_router(conv_router, prefix=settings.API_V1_STR)
app.include_router(usage_router, prefix=settings.API_V1_STR)
app.include_router(feedback_router, prefix=settings.API_V1_STR)
app.include_router(knowledge_router, prefix=settings.API_V1_STR)
app.include_router(admin_router, prefix=settings.API_V1_STR)
app.include_router(health_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "system": "CyberForge AI",
        "status": "OPERATIONAL",
        "version": settings.VERSION,
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health"
    }
