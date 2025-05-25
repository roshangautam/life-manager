"""
gRPC User Service

This module implements the gRPC UserService defined in the protobuf files.
"""

import logging
from datetime import datetime, timezone
from typing import Optional

import grpc
from google.protobuf import empty_pb2
from sqlalchemy.orm import Session

from api.core.security import create_access_token, get_password_hash, verify_password
from api.db.session import get_db

# Import generated protobuf code
from api.generated.api.v1 import user_pb2, user_pb2_grpc
from api.models.user import User as UserModel
from api.schemas.user import User as UserSchema
from api.schemas.user import UserCreate, UserUpdate

from .base import BaseGRPCService

logger = logging.getLogger(__name__)


class UserService(user_pb2_grpc.UserServiceServicer, BaseGRPCService):
    """gRPC servicer for User operations."""

    def __init__(self, db: Optional[Session] = None):
        """Initialize the UserService.

        Args:
            db: Optional SQLAlchemy session. If not provided, a new one will be created.
        """
        super().__init__(db)

    def CreateUser(self, request, context):
        """Create a new user.

        Implements the CreateUser RPC method.
        """
        try:
            # Check if user with this email already exists
            existing_user = (
                self.db.query(UserModel)
                .filter(UserModel.email == request.email)
                .first()
            )
            if existing_user:
                context.abort(
                    grpc.StatusCode.ALREADY_EXISTS,
                    f"User with email {request.email} already exists",
                )

            # Create new user
            user_in = UserCreate(
                email=request.email,
                password=request.password,
                full_name=request.full_name,
            )

            # Hash the password
            hashed_password = self._hash_password(user_in.password)

            # Create user in database
            user = UserModel(
                email=user_in.email,
                hashed_password=hashed_password,
                full_name=user_in.full_name,
                is_active=True,
                is_superuser=False,
            )

            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)

            # Create access token
            access_token = create_access_token(
                data={"sub": user.email, "user_id": str(user.id)}
            )

            # Prepare response
            user_response = self._user_to_proto(user)
            response = user_pb2.UserResponse(user=user_response)

            # Set authorization header
            context.send_initial_metadata(
                (("authorization", f"Bearer {access_token}"),)
            )

            return response

        except Exception as e:
            logger.exception("Error in CreateUser")
            context.abort(grpc.StatusCode.INTERNAL, str(e))

    def GetUser(self, request, context):
        """Get a user by ID.

        Implements the GetUser RPC method.
        """
        try:
            user = self._get_user_by_id(request.id, context)
            return user_pb2.UserResponse(user=self._user_to_proto(user))
        except Exception as e:
            logger.exception("Error in GetUser")
            context.abort(grpc.StatusCode.INTERNAL, str(e))

    def GetUserByEmail(self, request, context):
        """Get a user by email.

        Implements the GetUserByEmail RPC method.
        """
        try:
            user = (
                self.db.query(UserModel)
                .filter(UserModel.email == request.email)
                .first()
            )

            if not user:
                context.abort(
                    grpc.StatusCode.NOT_FOUND,
                    f"User with email {request.email} not found",
                )

            return user_pb2.UserResponse(user=self._user_to_proto(user))

        except Exception as e:
            logger.exception("Error in GetUserByEmail")
            context.abort(grpc.StatusCode.INTERNAL, str(e))

    def ListUsers(self, request, context):
        """List all users.

        Implements the ListUsers RPC method.
        """
        try:
            # Get pagination parameters
            page = request.page if request.HasField("page") else 1
            page_size = request.page_size if request.HasField("page_size") else 10

            # Query users with pagination
            query = self.db.query(UserModel)
            total = query.count()
            users = query.offset((page - 1) * page_size).limit(page_size).all()

            # Convert to protobuf
            user_messages = [self._user_to_proto(user) for user in users]

            return user_pb2.UserListResponse(
                users=user_messages, total=total, page=page, page_size=page_size
            )

        except Exception as e:
            logger.exception("Error in ListUsers")
            context.abort(grpc.StatusCode.INTERNAL, str(e))

    def UpdateUser(self, request, context):
        """Update a user.

        Implements the UpdateUser RPC method.
        """
        try:
            # Get the current user from context (set by auth interceptor)
            current_user_email = dict(context.invocation_metadata()).get("x-user-email")
            if not current_user_email:
                context.abort(
                    grpc.StatusCode.UNAUTHENTICATED, "Authentication required"
                )

            # Get the user to update
            user = self._get_user_by_id(request.id, context)

            # Check permissions (users can only update their own profile unless they're superusers)
            current_user = (
                self.db.query(UserModel)
                .filter(UserModel.email == current_user_email)
                .first()
            )

            if not current_user:
                context.abort(grpc.StatusCode.NOT_FOUND, "Current user not found")

            if not current_user.is_superuser and str(user.id) != str(current_user.id):
                context.abort(
                    grpc.StatusCode.PERMISSION_DENIED,
                    "Not authorized to update this user",
                )

            # Update user fields
            if request.HasField("email"):
                user.email = request.email
            if request.HasField("full_name"):
                user.full_name = request.full_name
            if request.HasField("is_active"):
                # Only superusers can update is_active
                if current_user.is_superuser:
                    user.is_active = request.is_active
                else:
                    context.abort(
                        grpc.StatusCode.PERMISSION_DENIED,
                        "Not authorized to update is_active",
                    )
            if request.HasField("is_superuser"):
                # Only superusers can update is_superuser
                if current_user.is_superuser:
                    user.is_superuser = request.is_superuser
                else:
                    context.abort(
                        grpc.StatusCode.PERMISSION_DENIED,
                        "Not authorized to update is_superuser",
                    )

            # Update timestamps
            user.updated_at = datetime.now(timezone.utc)

            self.db.commit()
            self.db.refresh(user)

            return user_pb2.UserResponse(user=self._user_to_proto(user))

        except Exception as e:
            logger.exception("Error in UpdateUser")
            context.abort(grpc.StatusCode.INTERNAL, str(e))

    def DeleteUser(self, request, context):
        """Delete a user.

        Implements the DeleteUser RPC method.
        """
        try:
            # Get the current user from context (set by auth interceptor)
            current_user_email = dict(context.invocation_metadata()).get("x-user-email")
            if not current_user_email:
                context.abort(
                    grpc.StatusCode.UNAUTHENTICATED, "Authentication required"
                )

            # Get the user to delete
            user = self._get_user_by_id(request.id, context)

            # Check permissions (users can only delete their own profile unless they're superusers)
            current_user = (
                self.db.query(UserModel)
                .filter(UserModel.email == current_user_email)
                .first()
            )

            if not current_user:
                context.abort(grpc.StatusCode.NOT_FOUND, "Current user not found")

            if not current_user.is_superuser and str(user.id) != str(current_user.id):
                context.abort(
                    grpc.StatusCode.PERMISSION_DENIED,
                    "Not authorized to delete this user",
                )

            # Delete the user
            self.db.delete(user)
            self.db.commit()

            return empty_pb2.Empty()

        except Exception as e:
            logger.exception("Error in DeleteUser")
            context.abort(grpc.StatusCode.INTERNAL, str(e))

    def Authenticate(self, request, context):
        """Authenticate a user and return an access token.

        Implements the Authenticate RPC method.
        """
        try:
            # Find user by email
            user = (
                self.db.query(UserModel)
                .filter(UserModel.email == request.email)
                .first()
            )

            if not user:
                context.abort(
                    grpc.StatusCode.UNAUTHENTICATED, "Incorrect email or password"
                )

            # Verify password
            if not verify_password(request.password, user.hashed_password):
                context.abort(
                    grpc.StatusCode.UNAUTHENTICATED, "Incorrect email or password"
                )

            # Check if user is active
            if not user.is_active:
                context.abort(
                    grpc.StatusCode.PERMISSION_DENIED, "User account is disabled"
                )

            # Create access token
            access_token = create_access_token(
                data={"sub": user.email, "user_id": str(user.id)}
            )

            # Prepare response
            user_response = self._user_to_proto(user)
            response = user_pb2.AuthResponse(
                access_token=access_token, token_type="bearer", user=user_response
            )

            # Set authorization header
            context.send_initial_metadata(
                (("authorization", f"Bearer {access_token}"),)
            )

            return response

        except Exception as e:
            logger.exception("Error in Authenticate")
            context.abort(grpc.StatusCode.INTERNAL, str(e))

    def VerifyToken(self, request, context):
        """Verify an access token and return the associated user.

        Implements the VerifyToken RPC method.
        """
        try:
            # The token is already verified by the auth interceptor
            # Just return the user from the context
            user_email = dict(context.invocation_metadata()).get("x-user-email")
            if not user_email:
                context.abort(
                    grpc.StatusCode.UNAUTHENTICATED, "Invalid or expired token"
                )

            # Get the user from the database
            user = (
                self.db.query(UserModel).filter(UserModel.email == user_email).first()
            )

            if not user:
                context.abort(
                    grpc.StatusCode.NOT_FOUND, f"User with email {user_email} not found"
                )

            return user_pb2.UserResponse(user=self._user_to_proto(user))

        except Exception as e:
            logger.exception("Error in VerifyToken")
            context.abort(grpc.StatusCode.INTERNAL, str(e))

    def _get_user_by_id(self, user_id: str, context):
        """Helper method to get a user by ID or raise an error."""
        user = self.db.query(UserModel).filter(UserModel.id == user_id).first()

        if not user:
            context.abort(
                grpc.StatusCode.NOT_FOUND, f"User with ID {user_id} not found"
            )

        return user

    def _user_to_proto(self, user: UserModel) -> user_pb2.User:
        """Convert a User model to a protobuf User message."""
        return user_pb2.User(
            id=str(user.id),
            email=user.email,
            full_name=user.full_name,
            is_active=user.is_active,
            is_superuser=user.is_superuser,
            created_at=self._datetime_to_timestamp(user.created_at),
            updated_at=self._datetime_to_timestamp(user.updated_at),
        )

    @staticmethod
    def _datetime_to_timestamp(dt):
        """Convert a datetime to a protobuf Timestamp."""
        if dt is None:
            return None
        from google.protobuf.timestamp_pb2 import Timestamp

        timestamp = Timestamp()
        timestamp.FromDatetime(dt)
        return timestamp
