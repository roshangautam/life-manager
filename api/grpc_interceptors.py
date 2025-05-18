import logging
import traceback
from typing import Any, Callable, Dict, List, Optional, Tuple, Union

import grpc
from google.protobuf import message as _message
from grpc import StatusCode

from api.config import settings
from api.security import decode_access_token

logger = logging.getLogger(__name__)

# Type aliases
RequestType = _message.Message
ResponseType = _message.Message
HandlerCallDetails = grpc.HandlerCallDetails

# Public methods that don't require authentication
PUBLIC_METHODS = [
    "api.v1.UserService/Authenticate",
    "api.v1.UserService/CreateUser",
    "grpc.health.v1.Health/Check",
    "grpc.health.v1.Health/Watch",
]


class AuthInterceptor(grpc.ServerInterceptor):
    """gRPC interceptor for JWT authentication."""
    
    def __init__(self, public_methods: Optional[List[str]] = None):
        """Initialize the interceptor with optional list of public methods."""
        self.public_methods = set(public_methods or [])
        self.public_methods.update(PUBLIC_METHODS)
        
        # Initialize the RPC state
        self._rpc_state = {}
    
    def _get_auth_token(self, metadata: List[Tuple[str, str]]) -> Optional[str]:
        """Extract the JWT token from metadata."""
        if not metadata:
            return None
            
        # Look for the authorization header
        for key, value in metadata:
            if key.lower() == 'authorization':
                # Handle 'Bearer ' prefix
                if value.lower().startswith('bearer '):
                    return value[7:].strip()
                return value.strip()
        return None
    
    def _is_public_method(self, method_name: str) -> bool:
        """Check if the method is public."""
        # Check exact match
        if method_name in self.public_methods:
            return True
            
        # Check wildcard patterns (e.g., "service/Method*")
        for pattern in self.public_methods:
            if pattern.endswith('*') and method_name.startswith(pattern[:-1]):
                return True
                
        return False
    
    def _authenticate(self, token: str) -> Optional[Dict[str, Any]]:
        """Authenticate the token and return the user data."""
        try:
            email = decode_access_token(token)
            if email:
                # Return a simple user dict with the email
                return {"email": email}
            return None
        except Exception as e:
            logger.warning(f"Token verification failed: {e}")
            return None
    
    def intercept_service(self, continuation, handler_call_details):
        """Intercept incoming RPCs before handing them over to a handler."""
        method_name = handler_call_details.method
        
        # Skip authentication for public methods
        if self._is_public_method(method_name):
            return continuation(handler_call_details)
        
        # Get the metadata
        metadata = dict(handler_call_details.invocation_metadata)
        
        # Check for authorization header
        token = self._get_auth_token(handler_call_details.invocation_metadata)
        if not token:
            logger.warning(f"No token provided for method: {method_name}")
            return self._abort_with_status(
                StatusCode.UNAUTHENTICATED,
                "Authentication required"
            )
        
        # Verify the token
        user = self._authenticate(token)
        if not user:
            return self._abort_with_status(
                StatusCode.UNAUTHENTICATED,
                "Invalid or expired token"
            )
        
        # Add user to the RPC context
        context_vars = {
            'user': user,
            'token': token,
        }
        
        # Continue with the RPC
        try:
            return self._continue_rpc(continuation, handler_call_details, context_vars)
        except Exception as e:
            logger.error(f"RPC failed: {e}", exc_info=True)
            raise
    
    def _continue_rpc(self, continuation, handler_call_details, context_vars):
        """Continue the RPC with the given context variables."""
        # Create a new handler with the context variables
        handler = continuation(handler_call_details)
        
        # If this is a unary-unary RPC, wrap the handler
        if handler and (handler.request_streaming, handler.response_streaming) == (False, False):
            return grpc.unary_unary_rpc_method_handler(
                self._unary_unary_handler(handler.handle_unary_unary, context_vars),
                request_deserializer=handler.request_deserializer,
                response_serializer=handler.response_serializer
            )
        
        # For other types of RPCs, return the original handler
        return handler
    
    def _unary_unary_handler(self, handler, context_vars):
        """Wrap a unary-unary handler to inject context variables."""
        def wrapper(request, context):
            # Inject context variables
            for key, value in context_vars.items():
                setattr(context, key, value)
            
            # Call the original handler
            return handler(request, context)
        return wrapper
    
    def _abort_with_status(self, status_code: StatusCode, details: str):
        """Abort the RPC with the given status code and details."""
        # Create a generic handler that will raise the error
        def abort_handler(request, context):
            context.abort(status_code, details)
        
        return grpc.unary_unary_rpc_method_handler(abort_handler)


class LoggingInterceptor(grpc.ServerInterceptor):
    """gRPC interceptor for request/response logging."""
    
    def intercept_service(self, continuation, handler_call_details):
        """Intercept incoming RPCs for logging."""
        method_name = handler_call_details.method
        logger.info(f"gRPC request started: {method_name}")
        
        try:
            # Continue with the RPC
            return continuation(handler_call_details)
        except Exception as e:
            logger.error(
                f"gRPC request failed: {method_name}",
                exc_info=True,
                extra={"error": str(e)}
            )
            raise


class ErrorHandlingInterceptor(grpc.ServerInterceptor):
    """gRPC interceptor for error handling and status code mapping."""
    
    def intercept_service(self, continuation, handler_call_details):
        """Intercept incoming RPCs to handle errors."""
        try:
            return continuation(handler_call_details)
        except Exception as e:
            logger.error(
                f"Unhandled exception in gRPC method {handler_call_details.method}",
                exc_info=True
            )
            
            # Map exception to gRPC status code
            status_code = StatusCode.INTERNAL
            details = "Internal server error"
            
            if isinstance(e, grpc.RpcError):
                # Already a gRPC error, re-raise
                raise
                
            # Map common exception types to gRPC status codes
            if isinstance(e, (ValueError, TypeError, AttributeError)):
                status_code = StatusCode.INVALID_ARGUMENT
                details = str(e) or "Invalid argument"
            elif isinstance(e, PermissionError):
                status_code = StatusCode.PERMISSION_DENIED
                details = str(e) or "Permission denied"
            elif isinstance(e, FileNotFoundError):
                status_code = StatusCode.NOT_FOUND
                details = str(e) or "Resource not found"
            elif isinstance(e, TimeoutError):
                status_code = StatusCode.DEADLINE_EXCEEDED
                details = str(e) or "Request timed out"
            elif isinstance(e, NotImplementedError):
                status_code = StatusCode.UNIMPLEMENTED
                details = str(e) or "Not implemented"
            
            # Log the error
            logger.error(f"gRPC error: {status_code.name} - {details}")
            
            # Raise a gRPC error
            context = grpc.ServicerContext()
            context.set_code(status_code)
            context.set_details(details)
            context.abort(status_code, details)


def create_grpc_interceptors() -> List[grpc.ServerInterceptor]:
    """Create and return a list of gRPC interceptors."""
    return [
        LoggingInterceptor(),
        AuthInterceptor(),
        ErrorHandlingInterceptor(),
    ]
