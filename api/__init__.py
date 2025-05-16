"""
Life Manager API - A comprehensive household and personal finance management system.

This package contains the FastAPI application and all its components.
"""

# Version of the application
__version__ = "0.1.0"

# Import key components for easier access
from .config import settings
from .database import engine, SessionLocal, get_db, init_db
from . import models, routers, schemas, dependencies

# Initialize the database tables
# init_db()  # Uncomment this line if you want to auto-create tables on import

# Define what gets imported with 'from api import *'
__all__ = [
    '__version__',
    'settings',
    'engine',
    'SessionLocal',
    'get_db',
    'init_db',
    'models',
    'routers',
    'schemas',
    'dependencies',
]
