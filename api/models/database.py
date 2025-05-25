from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

from ..config import DATABASE_URL

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
)

# Create a scoped session factory
SessionLocal = scoped_session(
    sessionmaker(autocommit=False, autoflush=False, bind=engine)
)

from .calendar import Event  # noqa
from .finance import Budget, Category, Transaction  # noqa
from .household import Household  # noqa

# Import all models here to ensure they are registered with SQLAlchemy
from .user import User  # noqa


def get_db():
    """Dependency that provides a database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize the database with tables"""
    Base.metadata.create_all(bind=engine)
