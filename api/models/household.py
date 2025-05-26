from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .base import Base


class Household(Base):
    __tablename__ = "households"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    created_by = Column(Integer, ForeignKey("users.id"))

    # Relationships
    members = relationship(
        "HouseholdMember", back_populates="household", cascade="all, delete-orphan"
    )

    # Relationship to the creator user
    creator = relationship("User", foreign_keys=[created_by], viewonly=True)


class HouseholdMember(Base):
    __tablename__ = "household_members"

    id = Column(Integer, primary_key=True, index=True)
    household_id = Column(Integer, ForeignKey("households.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    role = Column(String, default="member")

    # Relationships
    household = relationship("Household", back_populates="members")
    user = relationship("User", back_populates="household_memberships")


class HouseholdInvitation(Base):
    __tablename__ = "household_invitations"

    id = Column(Integer, primary_key=True, index=True)
    household_id = Column(Integer, ForeignKey("households.id"))
    email = Column(String)
    token = Column(String, unique=True)
    status = Column(String, default="pending")
