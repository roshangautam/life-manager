import logging
from typing import Any, Optional, TypeVar, Generic, Type
from datetime import datetime
from google.protobuf.timestamp_pb2 import Timestamp

import grpc
from grpc import StatusCode
from google.protobuf.message import Message
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

# Generic type variable for SQLAlchemy models
ModelType = TypeVar("ModelType")
# Generic type variable for Pydantic schemas
CreateSchemaType = TypeVar("CreateSchemaType")
UpdateSchemaType = TypeVar("UpdateSchemaType")
ResponseSchemaType = TypeVar("ResponseSchemaType")


class ServiceException(grpc.RpcError):
    """Base exception for service errors that should be translated to gRPC status codes."""
    
    def __init__(self, message: str, status_code: StatusCode = StatusCode.INTERNAL, details: Optional[str] = None):
        self.message = message
        self.status_code = status_code
        self.details = details or message
        super().__init__(self.details)
    
    def __str__(self) -> str:
        return f"{self.status_code.name}: {self.message}"


class NotFoundError(ServiceException):
    """Raised when a resource is not found."""
    def __init__(self, resource: str, id: Any, details: Optional[str] = None):
        message = f"{resource} with id {id} not found"
        super().__init__(message, StatusCode.NOT_FOUND, details)


class AlreadyExistsError(ServiceException):
    """Raised when a resource already exists."""
    def __init__(self, resource: str, field: str, value: Any, details: Optional[str] = None):
        message = f"{resource} with {field} '{value}' already exists"
        super().__init__(message, StatusCode.ALREADY_EXISTS, details)


class ValidationError(ServiceException):
    """Raised when input validation fails."""
    def __init__(self, message: str, details: Optional[str] = None):
        super().__init__(message, StatusCode.INVALID_ARGUMENT, details)


class UnauthorizedError(ServiceException):
    """Raised when authentication or authorization fails."""
    def __init__(self, message: str = "Unauthorized", details: Optional[str] = None):
        super().__init__(message, StatusCode.UNAUTHENTICATED, details)


class PermissionDeniedError(ServiceException):
    """Raised when the user doesn't have permission to perform an action."""
    def __init__(self, message: str = "Permission denied", details: Optional[str] = None):
        super().__init__(message, StatusCode.PERMISSION_DENIED, details)


class BaseService(Generic[ModelType, CreateSchemaType, UpdateSchemaType, ResponseSchemaType]):
    """Base class for service implementations with common CRUD operations."""
    
    def __init__(self, model: Type[ModelType], db_session: Session):
        """Initialize with SQLAlchemy model class and database session."""
        self.model = model
        self.db = db_session
    
    def _to_proto_timestamp(self, dt: Optional[datetime]) -> Optional[Timestamp]:
        """Convert a datetime to a protobuf Timestamp."""
        if dt is None:
            return None
        timestamp = Timestamp()
        timestamp.FromDatetime(dt)
        return timestamp
    
    def _from_proto_timestamp(self, timestamp: Optional[Timestamp]) -> Optional[datetime]:
        """Convert a protobuf Timestamp to a datetime."""
        if timestamp is None:
            return None
        return timestamp.ToDatetime()
    
    def _to_response(self, obj: ModelType) -> ResponseSchemaType:
        """Convert a model instance to a response schema.
        
        This method should be implemented by subclasses to handle specific model-to-response conversions.
        """
        raise NotImplementedError("Subclasses must implement _to_response")
    
    def _validate_create(self, obj_in: CreateSchemaType) -> None:
        """Validate data before creating a new object.
        
        Can be overridden by subclasses to add custom validation logic.
        """
        pass
    
    def _validate_update(self, obj_in: UpdateSchemaType) -> None:
        """Validate data before updating an existing object.
        
        Can be overridden by subclasses to add custom validation logic.
        """
        pass
    
    def _pre_create(self, obj_in: CreateSchemaType) -> ModelType:
        """Hook for pre-processing before creating a new object.
        
        Can be overridden by subclasses to modify the input data before creation.
        """
        return obj_in
    
    def _post_create(self, obj: ModelType) -> None:
        """Hook for post-processing after creating a new object.
        
        Can be overridden by subclasses to perform additional actions after creation.
        """
        pass
    
    def _pre_update(self, obj_in: UpdateSchemaType, obj_id: Any) -> ModelType:
        """Hook for pre-processing before updating an existing object.
        
        Can be overridden by subclasses to modify the input data before update.
        """
        return obj_in
    
    def _post_update(self, obj: ModelType) -> None:
        """Hook for post-processing after updating an existing object.
        
        Can be overridden by subclasses to perform additional actions after update.
        """
        pass
    
    def _pre_delete(self, obj: ModelType) -> None:
        """Hook for pre-processing before deleting an object.
        
        Can be overridden by subclasses to perform additional actions before deletion.
        """
        pass
    
    def get(self, id: Any) -> Optional[ModelType]:
        """Get a single object by ID."""
        return self.db.query(self.model).filter(self.model.id == id).first()
    
    def get_multi(self, skip: int = 0, limit: int = 100) -> list[ModelType]:
        """Get multiple objects with pagination."""
        return self.db.query(self.model).offset(skip).limit(limit).all()
    
    def create(self, obj_in: CreateSchemaType) -> ModelType:
        """Create a new object."""
        self._validate_create(obj_in)
        
        # Pre-process the input data
        obj_in = self._pre_create(obj_in)
        
        # Convert to ORM model
        db_obj = self.model(**obj_in.dict(exclude_unset=True))
        
        # Add to session and commit
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        
        # Post-process the created object
        self._post_create(db_obj)
        
        return db_obj
    
    def update(self, id: Any, obj_in: UpdateSchemaType) -> Optional[ModelType]:
        """Update an existing object."""
        self._validate_update(obj_in)
        
        # Get the existing object
        db_obj = self.get(id)
        if not db_obj:
            return None
        
        # Pre-process the input data
        update_data = self._pre_update(obj_in, id)
        
        # Update the object
        for field, value in update_data.dict(exclude_unset=True).items():
            setattr(db_obj, field, value)
        
        # Commit the changes
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        
        # Post-process the updated object
        self._post_update(db_obj)
        
        return db_obj
    
    def delete(self, id: Any) -> bool:
        """Delete an object by ID."""
        db_obj = self.get(id)
        if not db_obj:
            return False
        
        # Pre-process before deletion
        self._pre_delete(db_obj)
        
        # Delete the object
        self.db.delete(db_obj)
        self.db.commit()
        
        return True
