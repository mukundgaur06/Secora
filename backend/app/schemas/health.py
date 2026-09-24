from datetime import datetime
from typing import Dict
from pydantic import BaseModel

class HealthComponentStatus(BaseModel):
    status: str  # healthy, degraded, offline
    details: str
    latency_ms: float

class HealthOut(BaseModel):
    status: str
    timestamp: datetime
    version: str
    components: Dict[str, HealthComponentStatus]
