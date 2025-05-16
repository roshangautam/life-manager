from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from .database import Base
import enum

class TransactionType(str, enum.Enum):
    EXPENSE = "expense"
    INCOME = "income"

class TransactionStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    FAILED = "failed"

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    household_id = Column(Integer, ForeignKey("households.id")) # Link category to a household
    type = Column(SQLEnum(TransactionType)) # 'expense' or 'income'

    transactions = relationship("Transaction", back_populates="category")
    budget = relationship("Budget", back_populates="category", uselist=False)

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String)
    amount = Column(Float)
    date = Column(Date)
    type = Column(SQLEnum(TransactionType)) # Redundant? Or useful for direct query?
    status = Column(SQLEnum(TransactionStatus), default=TransactionStatus.PENDING) # Status of the transaction
    category_id = Column(Integer, ForeignKey("categories.id"))
    user_id = Column(Integer, ForeignKey("users.id")) # Who entered it
    household_id = Column(Integer, ForeignKey("households.id")) # Which household it belongs to

    category = relationship("Category", back_populates="transactions")
    user = relationship("User") # Basic relationship to User

class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), unique=True) # One budget per category
    household_id = Column(Integer, ForeignKey("households.id"))
    threshold = Column(Float)
    month = Column(Integer) # e.g., 1 for January, 12 for December
    year = Column(Integer)

    category = relationship("Category", back_populates="budget")
