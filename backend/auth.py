from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext

# ======================
# JWT CONFIG
# ======================
import os
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-me-in-.env")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# ======================
# PASSWORD HASHING
# (FIXED: argon2 instead of bcrypt)
# ======================
pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto"
)

def hash_password(password: str) -> str:
    if not isinstance(password, str):
        raise ValueError("Password must be a string")

    password = password.strip()
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password.strip(), hashed_password)

# ======================
# TOKEN
# ======================
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
