import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings

logger = logging.getLogger(__name__)

# Primary PostgreSQL or SQLite fallback setup
DATABASE_URL = settings.DATABASE_URL

def get_db_engine():
    try:
        # Test connecting to Postgres
        engine = create_engine(DATABASE_URL, pool_pre_ping=True, connect_args={"connect_timeout": 3})
        with engine.connect() as conn:
            logger.info("Successfully connected to PostgreSQL database.")
            return engine
    except Exception as e:
        logger.warning(f"Could not connect to PostgreSQL ({e}). Falling back to local SQLite database.")
        sqlite_engine = create_engine(
            settings.SQLITE_URL,
            connect_args={"check_same_thread": False}
        )
        return sqlite_engine

engine = get_db_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
