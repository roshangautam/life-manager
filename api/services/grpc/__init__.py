"""
gRPC Services

This package contains gRPC service implementations for the Life Manager API.
"""

from .base import BaseGRPCService
from .user_service import UserService

__all__ = [
    'BaseGRPCService',
    'UserService',
]
