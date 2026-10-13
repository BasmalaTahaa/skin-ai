from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import jwt, JWTError
import shutil
import os
from grok_client import ask_grok
from prompt_builder import build_prompt
from database import SessionLocal, engine
import models
from models import User
from ml import predict_skin
from prompt_builder import chat_with_user
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    SECRET_KEY,
    ALGORITHM
)
from schemas import UserCreate, ChatRequest
from grok_client import ask_grok
from prompt_builder import build_prompt

# ======================
# App & DB
# ======================
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Skin AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ======================
# Database Dependency
# ======================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ======================
# Auth utils
# ======================
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user

# ======================
# Routes
# ======================

@app.get("/")
def root():
    return {"status": "Skin AI backend running 💖"}

# ---------- AUTH ----------

@app.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=user.email,
        hashed_password=hash_password(user.password),  # 👈 هنا
        full_name=user.full_name
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": new_user.email})
    return {"access_token": token, "token_type": "bearer"}


from fastapi.security import OAuth2PasswordRequestForm

@app.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.email})
    return {
        "access_token": token,
        "token_type": "bearer"
    }


@app.get("/me")
def read_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name
    }

# ---------- ANALYZE ----------

from fastapi import Form

@app.post("/analyze")
def analyze_skin(
    file: UploadFile = File(...),
    user_message: str = Form(""),   # 👈 optional message
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    prediction = predict_skin(file_path, user_message=user_message)

    return {
        "user": current_user.email,
        "analysis": prediction
    }



# ---------- CHATBOT (GROK) ----------
from schemas import ChatRequest

@app.post("/chat")
def chat(
    req: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        system_prompt, user_prompt = build_prompt(
            user_message=req.message,
            prediction=req.prediction,
            confidence=req.confidence,
            mode=req.mode
        )

        reply = ask_grok(system_prompt, user_prompt)

        return {
            "reply": reply
        }
    except Exception as e:
        # Log the error for debugging
        import traceback
        print(f"Chat error: {str(e)}")
        print(traceback.format_exc())
        
        # Return a friendly error message instead of crashing
        error_msg = str(e)
        return {
            "reply": f"Sorry love 💕 I'm having trouble connecting right now. Please try again in a moment."
        }


