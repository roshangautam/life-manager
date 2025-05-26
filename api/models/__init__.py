"""
Database models for the Life Manager application.

This module contains all the SQLAlchemy models and database utilities.
"""

# Import base first
from .base import Base

# Import all models to ensure they are registered with SQLAlchemy
from .user import User, UserRole
from .household import Household, HouseholdMember, HouseholdInvitation

# Import other models
from .calendar import Event
from .finance import Budget, Category, Transaction, TransactionStatus, TransactionType

# Database utilities
from .database import SessionLocal, get_db, init_db

# Re-export models for easier imports
__all__ = [
    # Base
    'Base',
    
    # User models
    'User',
    'UserRole',
    
    # Household models
    'Household',
    'HouseholdMember',
    'HouseholdInvitation',
    
    # Database utilities
    'SessionLocal',
    'get_db',
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
