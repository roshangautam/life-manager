from datetime import datetime, timedelta
from typing import Optional, TypeVar, Type, Any, Dict, Union, List, Callable

from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, HTTPBearer, HTTPAuthorizationCredentials
from fastapi.security.utils import get_authorization_scheme_param
from jose import JWTError, jwt
from pydantic import BaseModel
from sqlalchemy.orm import Session, Query

from .config import settings
from .models.database import SessionLocal
from .models.user import User, UserRole
from .schemas.token import TokenData

# Type variables for dependency injection
T = TypeVar('T')
ModelType = TypeVar('ModelType', bound=Any)
CreateSchemaType = TypeVar('CreateSchemaType', bound=BaseModel)
UpdateSchemaType = TypeVar('UpdateSchemaType', bound=BaseModel)

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/token",
    auto_error=False
)

# HTTP Bearer scheme for token authentication
security = HTTPBearer(auto_error=False)

def get_db() -> Session:
    """Dependency that provides a database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """Dependency to get the current authenticated user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if not credentials:
        raise credentials_exception
    
    token = credentials.credentials
    
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
            options={"verify_aud": False}
        )
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """Dependency to check if the current user is active"""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user

async def get_current_active_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    """Dependency to check if the current user is a superuser"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return current_user

def get_optional_user(
    request: Request,
    db: Session = Depends(get_db)
) -> Optional[User]:
    """Dependency that optionally gets the current user if a valid token is provided"""
    authorization: str = request.headers.get("Authorization")
    if not authorization:
        return None
    
    try:
        scheme, token = get_authorization_scheme_param(authorization)
        if not authorization or scheme.lower() != "bearer":
            return None
            
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
            options={"verify_aud": False}
        )
        email: str = payload.get("sub")
        if email is None:
            return None
            
        return db.query(User).filter(User.email == email).first()
    except JWTError:
        return None

# Generic CRUD dependencies
def get_object_or_404(
    model: Type[ModelType],
    id: int,
    db: Session,
    detail: str = "Item not found"
) -> ModelType:
    """Get an object by ID or raise 404 if not found"""
    obj = db.query(model).filter(model.id == id).first()
    if not obj:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=detail)
    return obj

def get_queryset(
    model: Type[ModelType],
    db: Session,
    *criterion,
    skip: int = 0,
    limit: int = 100,
    order_by: Optional[str] = None
) -> Query:
    """Get a filtered and paginated queryset"""
    query = db.query(model).filter(*criterion)
    if order_by:
        query = query.order_by(order_by)
    return query.offset(skip).limit(limit)

def create_object(
    model: Type[ModelType],
    db: Session,
    obj_in: Union[CreateSchemaType, Dict[str, Any]],
    **extra_fields
) -> ModelType:
    """Create a new object in the database"""
    if isinstance(obj_in, dict):
        create_data = obj_in
    else:
        create_data = obj_in.dict(exclude_unset=True)
    
    create_data.update(extra_fields)
    db_obj = model(**create_data)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_object(
    db_obj: ModelType,
    db: Session,
    obj_in: Union[UpdateSchemaType, Dict[str, Any]],
    **extra_fields
) -> ModelType:
    """Update an existing object in the database"""
    if isinstance(obj_in, dict):
        update_data = obj_in
    else:
        update_data = obj_in.dict(exclude_unset=True)
    
    update_data.update(extra_fields)
    
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_object(
    db_obj: ModelType,
    db: Session,
) -> ModelType:
    """Delete an object from the database"""
    db.delete(db_obj)
    db.commit()
    return db_obj
