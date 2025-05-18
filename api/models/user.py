from enum import Enum
from typing import Optional
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from passlib.context import CryptContext

from .database import Base

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserRole(str, Enum):
    ADMIN = "admin"
    MEMBER = "member"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    role = Column(String, default=UserRole.MEMBER)
    household_id = Column(Integer, ForeignKey("households.id"), nullable=True)
    
    # Relationships
    household = relationship("Household", foreign_keys=[household_id])
    household_memberships = relationship("HouseholdMember", back_populates="user")
    
    def set_password(self, password: str):
        """Hash and set the user's password"""
        self.hashed_password = pwd_context.hash(password)
    
    def verify_password(self, password: str) -> bool:
        """Verify a password against the stored hash"""
        return pwd_context.verify(password, self.hashed_password)
    
    @classmethod
    def create_user(
        cls, 
        email: str, 
        password: str, 
        full_name: Optional[str] = None,
        is_active: bool = True,
        role: UserRole = UserRole.MEMBER
    ) -> 'User':
        """Helper method to create a new user with a hashed password"""
        user = cls(
            email=email,
            full_name=full_name,
            is_active=is_active,
            role=role
        )
        user.set_password(password)
        return user
