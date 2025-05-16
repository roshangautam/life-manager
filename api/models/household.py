from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Household(Base):
    __tablename__ = "households"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    created_by = Column(Integer, ForeignKey("users.id"))
    
    members = relationship("User", back_populates="household")

class HouseholdInvitation(Base):
    __tablename__ = "household_invitations"
    
    id = Column(Integer, primary_key=True, index=True)
    household_id = Column(Integer, ForeignKey("households.id"))
    email = Column(String)
    token = Column(String, unique=True)
    status = Column(String, default="pending")
