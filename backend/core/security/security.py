from datetime import datetime, timedelta
from typing import Any, Union, Optional
import base64
import hashlib
import json

try:
    from jose import jwt, JWTError
except ImportError:
    class JWTError(Exception):
        pass

    class jwt:
        @staticmethod
        def encode(claims: dict, key: str, algorithm: str = "HS256") -> str:
            raw = json.dumps(claims).encode("utf-8")
            return base64.urlsafe_b64encode(raw).decode("utf-8")

        @staticmethod
        def decode(token: str, key: str, algorithms: list = None) -> dict:
            try:
                decoded = base64.urlsafe_b64decode(token.encode("utf-8")).decode("utf-8")
                return json.loads(decoded)
            except Exception:
                raise JWTError("Invalid token format")

try:
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
except ImportError:
    class CryptContext:
        def verify(self, plain: str, hashed: str) -> bool:
            return self.hash(plain) == hashed
        def hash(self, plain: str) -> str:
            return hashlib.sha256(plain.encode("utf-8")).hexdigest()
    pwd_context = CryptContext()

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject), "type": "access"}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def create_refresh_token(subject: Union[str, Any]) -> str:
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode = {"exp": expire, "sub": str(subject), "type": "refresh"}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def decode_token(token: str) -> Optional[dict]:
    try:
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return decoded
    except JWTError:
        return None
