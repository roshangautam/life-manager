""" Module for CRUD operations in the finance management application"""
from typing import Optional
from sqlalchemy.orm import Session

from . import models, security
from .schemas_main import (
    BudgetCreate,
    CategoryCreate,
    HouseholdCreate,
    TransactionCreate,
    TransactionType,
    UserCreate,
)


def get_user_by_email(db: Session, email: str):
    """Get a user by email"""
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: UserCreate):
    """Create a new user"""
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        # Default role and household assignment can be handled later
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# Household CRUD operations
def get_household_by_name(db: Session, name: str):
    return db.query(models.Household).filter(models.Household.name == name).first()


def create_household(db: Session, household: HouseholdCreate, user_id: int):
    db_household = models.Household(name=household.name, created_by=user_id)
    db.add(db_household)
    db.commit()
    db.refresh(db_household)

    # Add creator as the first member (admin)
    creator_user = db.query(models.User).filter(models.User.id == user_id).first()
    if creator_user:
        creator_user.household_id = db_household.id
        creator_user.role = models.UserRole.ADMIN  # Assign admin role
        db.add(creator_user)
        db.commit()
        db.refresh(creator_user)  # Refresh to reflect changes

    return db_household


# Finance CRUD operations


# Category
def get_category(db: Session, category_id: int, household_id: int):
    return (
        db.query(models.Category)
        .filter(
            models.Category.id == category_id,
            models.Category.household_id == household_id,
        )
        .first()
    )


def get_categories_by_household(
    db: Session, household_id: int, type: Optional[TransactionType] = None
):
    query = db.query(models.Category).filter(
        models.Category.household_id == household_id
    )
    if type:
        query = query.filter(models.Category.type == type)
    return query.all()


def create_category(db: Session, category: CategoryCreate, household_id: int):
    db_category = models.Category(**category.dict(), household_id=household_id)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


# Transaction (Expense/Income)
def create_transaction(
    db: Session, transaction: TransactionCreate, user_id: int, household_id: int
):
    # Fetch category to determine type (or pass type explicitly?)
    category = get_category(db, transaction.category_id, household_id)
    if not category:
        return None  # Or raise error

    db_transaction = models.Transaction(
        **transaction.dict(),
        user_id=user_id,
        household_id=household_id,
        type=category.type,  # Set type based on category
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction


def get_transactions_by_household(
    db: Session, household_id: int, skip: int = 0, limit: int = 100
):
    return (
        db.query(models.Transaction)
        .filter(models.Transaction.household_id == household_id)
        .offset(skip)
        .limit(limit)
        .all()
    )


# Budget
def get_budget(db: Session, category_id: int, household_id: int, month: int, year: int):
    return (
        db.query(models.Budget)
        .filter(
            models.Budget.category_id == category_id,
            models.Budget.household_id == household_id,
            models.Budget.month == month,
            models.Budget.year == year,
        )
        .first()
    )


def create_or_update_budget(db: Session, budget: BudgetCreate, household_id: int):
    db_budget = get_budget(
        db, budget.category_id, household_id, budget.month, budget.year
    )
    if db_budget:
        # Update existing budget
        db_budget.threshold = budget.threshold
    else:
        # Create new budget
        db_budget = models.Budget(**budget.dict(), household_id=household_id)
        db.add(db_budget)
    db.commit()
    db.refresh(db_budget)
    return db_budget


def get_budgets_by_household(db: Session, household_id: int, month: int, year: int):
    return (
        db.query(models.Budget)
        .filter(
            models.Budget.household_id == household_id,
            models.Budget.month == month,
            models.Budget.year == year,
        )
        .all()
    )
