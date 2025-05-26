"""
Database models for the Life Manager application.

This module contains all the SQLAlchemy models and database utilities.
"""

# Import base first
from .base import Base

# Import other models
from .calendar import Event

# Database utilities
from .database import SessionLocal, get_db, init_db
from .finance import Budget, Category, Transaction, TransactionStatus, TransactionType
from .household import Household, HouseholdInvitation, HouseholdMember

# Import all models to ensure they are registered with SQLAlchemy
from .user import User, UserRole

# Re-export models for easier imports
__all__ = [
    # Base
    "Base",
    # User models
    "User",
    "UserRole",
    # Household models
    "Household",
    "HouseholdMember",
    "HouseholdInvitation",
    # Database utilities
    "SessionLocal",
    "get_db",
    "init_db",
    # Models
    "User",
    "UserRole",
    "Household",
    "HouseholdMember",
    "HouseholdInvitation",
    "Transaction",
    "Category",
    "Budget",
    "TransactionType",
    "TransactionStatus",
    "Event",
]
