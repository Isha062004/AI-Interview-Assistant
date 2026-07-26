from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from core.security.security import create_access_token, create_refresh_token, verify_password, get_password_hash

router = APIRouter(prefix="/auth", tags=["Authentication & Security"])

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest):
    # Simulated enterprise auth validation
    if req.username and req.password:
        access_token = create_access_token(subject=req.username)
        refresh_token = create_refresh_token(subject=req.username)
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user={
                "username": req.username,
                "role": "Senior Engineer Candidate",
                "permissions": ["interview:create", "interview:read", "evaluation:export"]
            }
        )
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
