from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import crud, models
from ..schemas_main import HouseholdResponse, HouseholdCreate
from ..models.database import get_db
from ..dependencies import get_current_user # Import from dependencies, not users

router = APIRouter(
    prefix="/households",
    tags=["Households"],
    dependencies=[Depends(get_current_user)] # Protect all routes in this router
)

@router.post("/", response_model=HouseholdResponse)
async def create_new_household(
    household: HouseholdCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Create a new household. The creator becomes the admin."""
    # Check if user already belongs to a household (optional rule)
    if current_user.household_id is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already belongs to a household"
        )
        
    # Check if household name is unique (optional rule)
    db_household = crud.get_household_by_name(db, name=household.name)
    if db_household:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Household name already exists"
        )

    created_household = crud.create_household(db=db, household=household, user_id=current_user.id)
    # Need to refetch the household with member details populated
    # This might require another CRUD function or adjusting the create_household response
    # For now, returning the basic created object
    # A better approach would be to query the household again including members
    refetched_household = db.query(models.Household).filter(models.Household.id == created_household.id).first()
    return refetched_household
