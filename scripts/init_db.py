#!/usr/bin/env python3
"""
Initialize the database with the first superuser.

This script should be run after the database is created and migrations are applied.
"""
import os
import sys
from getpass import getpass

# Add the project root to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from api.database import init_db

def main():
    """Initialize the database and create the first superuser."""
    print("Initializing database...")
    
    # Get superuser email and password from environment or prompt
    email = os.getenv("FIRST_SUPERUSER_EMAIL")
    password = os.getenv("FIRST_SUPERUSER_PASSWORD")
    
    if not email:
        email = input("Enter email for the first superuser: ")
    if not password:
        password = getpass("Enter password for the first superuser: ")
    
    # Initialize the database and create the first superuser
    init_db(first_superuser_email=email, first_superuser_password=password)
    print("Database initialization complete!")

if __name__ == "__main__":
    main()
