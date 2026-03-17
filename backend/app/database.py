import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from typing import Generator
from pathlib import Path

env_path = Path(__file__).resolve().parent.parent / ".env.dev"

load_dotenv(env_path)

DATABASE_URL = os.getenv("DATABASE_URL")
assert DATABASE_URL is not None

engine = create_engine(DATABASE_URL)


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
