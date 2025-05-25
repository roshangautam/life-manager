from datetime import date
from typing import Optional

from pydantic import BaseModel, EmailStr

from .models.finance import TransactionType  # Import enum


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    is_active: bool
    role: str
    household_id: Optional[int] = None

    class Config:
        orm_mode = True  # For SQLAlchemy model conversion


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
    role: Optional[str] = None


class UserInDB(UserBase):
    id: int
    is_active: bool
    role: str
    hashed_password: Optional[str] = None
    household_id: Optional[int] = None

    class Config:
        orm_mode = True


# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# Household Schemas
class HouseholdBase(BaseModel):
    name: str


class HouseholdCreate(HouseholdBase):
    pass


class HouseholdResponse(HouseholdBase):
    id: int
    created_by: int  # User ID of the creator
    members: list[UserResponse] = []  # Include members

    class Config:
        orm_mode = True


# Finance Schemas


# Category Schemas
class CategoryBase(BaseModel):
    name: str
    type: TransactionType


class CategoryCreate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    id: int
    household_id: int

    class Config:
        orm_mode = True


# Transaction Schemas (Generic for Expense/Income)
class TransactionBase(BaseModel):
    description: str
    amount: float
    date: date
    category_id: int


class TransactionCreate(TransactionBase):
    pass


class TransactionResponse(TransactionBase):
    id: int
    type: TransactionType
    user_id: int
    household_id: int
    category: CategoryResponse  # Nested category info

    class Config:
        orm_mode = True


# Budget Schemas
class BudgetBase(BaseModel):
    category_id: int
    threshold: float
    month: int  # 1-12
    year: int


class BudgetCreate(BudgetBase):
    pass


class BudgetResponse(BudgetBase):
    id: int
    household_id: int
    category: CategoryResponse  # Nested category info

    class Config:
        orm_mode = True
