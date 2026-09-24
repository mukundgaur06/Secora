from datetime import datetime
from typing import List, Dict, Any
from pydantic import BaseModel

class UsageSummaryOut(BaseModel):
    tokens_used: int
    monthly_limit: int
    tokens_remaining: int
    percentage_used: float
    request_count: int
    avg_tokens_per_request: float
    current_model: str
    reset_date: datetime
    daily_history: List[Dict[str, Any]]

class HealthComponentStatus(BaseModel):
    status: str  # healthy, degraded, offline
    details: str
    latency_ms: float

class HealthOut(BaseModel):
    status: str
    timestamp: datetime
    version: str
    components: Dict[str, HealthComponentStatus]
