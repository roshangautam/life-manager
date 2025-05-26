import os
from typing import Generator, Optional

from dotenv import load_dotenv
from sqlalchemy import create_engine, event
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

from .models.base import Base

# Load environment variables
load_dotenv()

# Get database URL from environment variables
DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://postgres:postgres@db:5432/life_manager"
)

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,  # Recycle connections after 5 minutes
)

# Create a SessionLocal class for database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# For SQLite, enable foreign key support
if DATABASE_URL.startswith("sqlite"):

    @event.listens_for(Engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


def get_db() -> Generator[Session, None, None]:
    """
    Dependency function that yields db sessions.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db(
    first_superuser_email: Optional[str] = None,
    first_superuser_password: Optional[str] = None,
) -> None:
    """
    Initialize the database by creating all tables and optionally creating a superuser.

    Args:
        first_superuser_email: Email for the first superuser (optional)
        first_superuser_password: Password for the first superuser (optional)
    """
    # Import models here to avoid circular imports
    from .models.user import User, UserRole

    # Create all tables
    Base.metadata.create_all(bind=engine)

    # Create first superuser if credentials are provided
    if first_superuser_email and first_superuser_password:
        db = SessionLocal()
        try:
            # Check if user already exists
            user = db.query(User).filter(User.email == first_superuser_email).first()
            if not user:
                # Create new superuser
                new_user = User(
                    email=first_superuser_email,
                    full_name="Admin",
                    role=UserRole.ADMIN,
                    is_active=True,
                )
                new_user.set_password(first_superuser_password)
                db.add(new_user)
                db.commit()
                print(f"Created first superuser with email: {first_superuser_email}")
        except Exception as e:
            print(f"Error creating first superuser: {e}")
            db.rollback()
        finally:
            db.close()
