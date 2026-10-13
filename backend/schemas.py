from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None


class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str | None = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class ChatRequest(BaseModel):
    message: str | None = None
    prediction: str
    confidence: float
    mode: str = "user"  # "auto" أو "user"

