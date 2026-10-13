from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Float,
    TIMESTAMP
)
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)



class SkinImage(Base):
    __tablename__ = "skin_images"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    image_path = Column(String, nullable=False)
    uploaded_at = Column(TIMESTAMP, server_default=func.now())


class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, index=True)
    image_id = Column(Integer, ForeignKey("skin_images.id"))
    result = Column(String, nullable=False)
    confidence = Column(Float)
    created_at = Column(TIMESTAMP, server_default=func.now())
