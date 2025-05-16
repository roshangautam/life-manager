"""
Database models for the Life Manager application.

This module contains all the SQLAlchemy models and database utilities.
"""

# Database utilities
from .database import Base, SessionLocal, get_db, init_db

# Import all models to ensure they are registered with SQLAlchemy
from .user import User, UserRole
from .household import Household, HouseholdMember, HouseholdInvitation
from .finance import Transaction, Category, Budget, TransactionType, TransactionStatus
from .calendar import Event, EventType, EventStatus

# Re-export models for easier imports
__all__ = [
    # Database utilities
    'Base',
    'SessionLocal',
    'get_db',
    'init_db',
    
    # Models
    'User',
    'UserRole',
    'Household',
    'HouseholdMember',
    'HouseholdInvitation',
    'Transaction',
    'Category',
    'Budget',
    'TransactionType',
    'TransactionStatus',
    'Event',
    'EventType',
    'EventStatus',
]
