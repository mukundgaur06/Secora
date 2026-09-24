import time
from collections import defaultdict
from fastapi import Request, HTTPException, status
from app.config import settings

# IP -> list of timestamps
_request_records = defaultdict(list)

def check_rate_limit(request: Request):
    client_ip = request.client.host if request.client else "127.0.0.1"
    now = time.time()
    
    # Filter out requests older than 60 seconds
    _request_records[client_ip] = [
        t for t in _request_records[client_ip] if now - t < 60
    ]
    
    if len(_request_records[client_ip]) >= settings.RATE_LIMIT_PER_MINUTE:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Please wait a moment before sending more requests."
        )
        
    _request_records[client_ip].append(now)
