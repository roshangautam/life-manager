from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import crud, models, schemas
from ..models.database import get_db
from .users import get_current_user # Reuse authentication dependency

router = APIRouter(
    prefix="/finance",
    tags=["Finance"],
    dependencies=[Depends(get_current_user)] # Protect all finance routes
)

# == Categories ==

@router.post("/categories/", response_model=schemas.CategoryResponse)
def create_category_endpoint(
    category: schemas.CategoryCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Create a new expense or income category for the user's household."""
    if current_user.household_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User does not belong to a household")
    
    # Optional: Check if category name already exists for this household and type
    # existing_categories = crud.get_categories_by_household(db, household_id=current_user.household_id, type=category.type)
    # if any(c.name == category.name for c in existing_categories):
    #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category name already exists for this type")

    return crud.create_category(db=db, category=category, household_id=current_user.household_id)

@router.get("/categories/", response_model=List[schemas.CategoryResponse])
def read_categories(
    type: Optional[schemas.TransactionType] = None, # Allow filtering by type (expense/income)
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get all categories for the user's household, optionally filtered by type."""
    if current_user.household_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User does not belong to a household")

    categories = crud.get_categories_by_household(db, household_id=current_user.household_id, type=type)
    return categories

# == Transactions (Expenses/Income) ==

@router.post("/transactions/", response_model=schemas.TransactionResponse)
def create_transaction_endpoint(
    transaction: schemas.TransactionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Create a new transaction (expense or income)."""
    if current_user.household_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User does not belong to a household")

    # Verify the category exists and belongs to the user's household
    category = crud.get_category(db, category_id=transaction.category_id, household_id=current_user.household_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id {transaction.category_id} not found in this household"
        )

    created_transaction = crud.create_transaction(
        db=db,
        transaction=transaction,
        user_id=current_user.id,
        household_id=current_user.household_id
    )
    # The CRUD function already populates the type based on category
    # The response model should handle nested category details
    return created_transaction

@router.get("/transactions/", response_model=List[schemas.TransactionResponse])
def read_transactions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get transactions for the user's household."""
    if current_user.household_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User does not belong to a household")

    transactions = crud.get_transactions_by_household(db, household_id=current_user.household_id, skip=skip, limit=limit)
    return transactions

# == Budgets ==

@router.post("/budgets/", response_model=schemas.BudgetResponse)
def create_or_update_budget_endpoint(
    budget: schemas.BudgetCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Create or update a budget threshold for a category in a specific month/year."""
    if current_user.household_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User does not belong to a household")

    # Verify the category exists and belongs to the user's household
    category = crud.get_category(db, category_id=budget.category_id, household_id=current_user.household_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with id {budget.category_id} not found in this household"
        )
        
    # Ensure budget is for an expense category (optional rule)
    if category.type != schemas.TransactionType.EXPENSE:
         raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Budgets can only be set for expense categories"
        )

    # Validate month/year if necessary (e.g., month between 1-12)
    if not 1 <= budget.month <= 12:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Month must be between 1 and 12")

    created_or_updated_budget = crud.create_or_update_budget(
        db=db,
        budget=budget,
        household_id=current_user.household_id
    )
    return created_or_updated_budget

@router.get("/budgets/", response_model=List[schemas.BudgetResponse])
def read_budgets(
    month: int,
    year: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get all budgets set for the user's household for a specific month and year."""
    if current_user.household_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User does not belong to a household")

    # Validate month/year if necessary
    if not 1 <= month <= 12:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Month must be between 1 and 12")

    budgets = crud.get_budgets_by_household(db, household_id=current_user.household_id, month=month, year=year)
    return budgets
