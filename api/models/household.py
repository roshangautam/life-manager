from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Household(Base):
    __tablename__ = "households"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    created_by = Column(Integer, ForeignKey("users.id"))
    
    members = relationship("HouseholdMember", back_populates="household")

class HouseholdMember(Base):
    __tablename__ = "household_members"
    
    id = Column(Integer, primary_key=True, index=True)
    household_id = Column(Integer, ForeignKey("households.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(String, default="member")
    
    household = relationship("Household", back_populates="members")
    user = relationship("User", back_populates="household_memberships")


class HouseholdInvitation(Base):
    __tablename__ = "household_invitations"
    
    id = Column(Integer, primary_key=True, index=True)
    household_id = Column(Integer, ForeignKey("households.id"))
    email = Column(String)
    token = Column(String, unique=True)
    status = Column(String, default="pending")
