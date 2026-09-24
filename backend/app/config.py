import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "SECORA"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Security & JWT
    SECRET_KEY: str = "secora_production_grade_jwt_secret_key_change_in_production_2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Database (Default: SQLite for seamless standalone execution, overridden by DATABASE_URL for Postgres)
    DATABASE_URL: str = "sqlite:///./secora.db"
    
    # Redis (Optional: fallbacks to in-memory)
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # AI Inference Settings
    LLM_PROVIDER: str = "gemini"  # gemini | openai | anthropic | mock
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    DEFAULT_MODEL: str = "gemini-2.5-flash"
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 120
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
