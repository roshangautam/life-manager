"""
Base gRPC Service

This module provides a base class for gRPC service implementations.
"""

import logging
from typing import Any, Dict, Optional, Type, TypeVar

import grpc
from google.protobuf.message import Message
from sqlalchemy.orm import Session

from api.core.security import get_password_hash
from api.db.session import get_db
from api.grpc_utils import from_proto_message, to_proto_message
from api.models.base import BaseModel

# Type variables
T = TypeVar("T", bound=BaseModel)
RequestType = TypeVar("RequestType", bound=Message)
ResponseType = TypeVar("ResponseType", bound=Message)

logger = logging.getLogger(__name__)


class BaseGRPCService:
    """Base class for gRPC service implementations."""

    def __init__(self, db: Optional[Session] = None):
        """Initialize the service with an optional database session.

        Args:
            db: Optional SQLAlchemy session. If not provided, a new one will be created.
        """
        self._db = db

    @property
    def db(self) -> Session:
        """Get a database session.

        Returns:
            A SQLAlchemy session.
        """
        if self._db is None:
            self._db = next(get_db())
        return self._db

    def _get_by_id(
        self, model: Type[T], id: Any, not_found_error: str = "Resource not found"
    ) -> T:
        """Get a model instance by ID.

        Args:
            model: The SQLAlchemy model class.
            id: The ID of the resource to retrieve.
            not_found_error: Error message if the resource is not found.

        Returns:
            The model instance.

        Raises:
            grpc.RpcError: If the resource is not found.
        """
        instance = self.db.query(model).filter(model.id == id).first()
        if not instance:
            self._raise_not_found(not_found_error)
        return instance

    def _raise_not_found(self, message: str = "Resource not found") -> None:
        """Raise a gRPC not found error.

        Args:
            message: The error message.

        Raises:
            grpc.RpcError: Always raises with NOT_FOUND status.
        """
        context = grpc.ServicerContext()
        context.set_code(grpc.StatusCode.NOT_FOUND)
        context.set_details(message)
        context.abort(grpc.StatusCode.NOT_FOUND, message)

    def _raise_permission_denied(self, message: str = "Permission denied") -> None:
        """Raise a gRPC permission denied error.

        Args:
            message: The error message.

        Raises:
            grpc.RpcError: Always raises with PERMISSION_DENIED status.
        """
        context = grpc.ServicerContext()
        context.set_code(grpc.StatusCode.PERMISSION_DENIED)
        context.set_details(message)
        context.abort(grpc.StatusCode.PERMISSION_DENIED, message)

    def _raise_invalid_argument(self, message: str = "Invalid argument") -> None:
        """Raise a gRPC invalid argument error.

        Args:
            message: The error message.

        Raises:
            grpc.RpcError: Always raises with INVALID_ARGUMENT status.
        """
        context = grpc.ServicerContext()
        context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
        context.set_details(message)
        context.abort(grpc.StatusCode.INVALID_ARGUMENT, message)

    def _raise_already_exists(self, message: str = "Resource already exists") -> None:
        """Raise a gRPC already exists error.

        Args:
            message: The error message.

        Raises:
            grpc.RpcError: Always raises with ALREADY_EXISTS status.
        """
        context = grpc.ServicerContext()
        context.set_code(grpc.StatusCode.ALREADY_EXISTS)
        context.set_details(message)
        context.abort(grpc.StatusCode.ALREADY_EXISTS, message)

    def _hash_password(self, password: str) -> str:
        """Hash a password.

        Args:
            password: The plain text password.

        Returns:
            The hashed password.
        """
        return get_password_hash(password)

    def _to_proto_message(
        self, obj: Any, message_class: Type[ResponseType], **kwargs
    ) -> ResponseType:
        """Convert an object to a protobuf message.

        Args:
            obj: The object to convert.
            message_class: The protobuf message class.
            **kwargs: Additional fields to include in the message.

        Returns:
            An instance of the specified protobuf message class.
        """
        return to_proto_message(obj, message_class, **kwargs)

    def _from_proto_message(
        self, message: RequestType, output_class: Optional[Type[T]] = None, **kwargs
    ) -> Union[Dict[str, Any], T]:
        """Convert a protobuf message to a dictionary or an instance of the specified class.

        Args:
            message: The protobuf message to convert.
            output_class: The class to create an instance of. If None, returns a dictionary.
            **kwargs: Additional fields to include in the output.

        Returns:
            A dictionary or an instance of the specified class.
        """
        return from_proto_message(message, output_class, **kwargs)
