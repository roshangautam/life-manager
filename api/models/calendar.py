from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

# Base class for declarative models
Base = declarative_base()


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    start_time = Column(DateTime, index=True)
    end_time = Column(DateTime, nullable=True)
    is_all_day = Column(Boolean, default=False)
    location = Column(String, nullable=True)

    household_id = Column(Integer, ForeignKey("households.id"))
    created_by_user_id = Column(Integer, ForeignKey("users.id"))

    # Reminder settings (can be expanded later)
    reminder_enabled = Column(Boolean, default=False)
    reminder_time_before = Column(Integer, nullable=True)  # e.g., minutes before event

    # Relationship to household (optional, if needed)
    # household = relationship("Household")
    creator = relationship("User")
