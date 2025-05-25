"""
gRPC Utilities

This module provides utility functions for working with gRPC in the Life Manager API.
"""

from datetime import datetime
from typing import Any, Dict, Optional, Type, TypeVar, Union

from google.protobuf import timestamp_pb2
from google.protobuf.message import Message

# Type variable for protobuf message classes
T = TypeVar("T", bound=Message)


def to_proto_timestamp(dt: Optional[datetime]) -> Optional[timestamp_pb2.Timestamp]:
    """Convert a Python datetime to a protobuf Timestamp.

    Args:
        dt: The datetime to convert, or None.

    Returns:
        A protobuf Timestamp, or None if the input was None.
    """
    if dt is None:
        return None

    timestamp = timestamp_pb2.Timestamp()
    timestamp.FromDatetime(dt)
    return timestamp


def from_proto_timestamp(timestamp: timestamp_pb2.Timestamp) -> Optional[datetime]:
    """Convert a protobuf Timestamp to a Python datetime.

    Args:
        timestamp: The protobuf Timestamp to convert.

    Returns:
        A Python datetime, or None if the input was None.
    """
    if timestamp is None:
        return None
    return timestamp.ToDatetime()


def to_proto_message(
    data: Union[Dict[str, Any], Any], message_class: Type[T], **kwargs
) -> T:
    """Convert a dictionary or object to a protobuf message.

    Args:
        data: The data to convert. Can be a dictionary or an object with attributes.
        message_class: The protobuf message class to create an instance of.
        **kwargs: Additional fields to set on the message.

    Returns:
        An instance of the specified protobuf message class.
    """
    if isinstance(data, dict):
        message_data = {**data, **kwargs}
    else:
        # Convert object to dict
        message_data = {
            field: getattr(data, field)
            for field in message_class.DESCRIPTOR.fields_by_name
            if hasattr(data, field)
        }
        message_data.update(kwargs)

    # Create and return the message
    return message_class(**message_data)


def from_proto_message(
    message: Message, output_class: Optional[Type[T]] = None, **kwargs
) -> Union[Dict[str, Any], T]:
    """Convert a protobuf message to a dictionary or an instance of the specified class.

    Args:
        message: The protobuf message to convert.
        output_class: The class to create an instance of. If None, returns a dictionary.
        **kwargs: Additional fields to include in the output.

    Returns:
        A dictionary or an instance of the specified class.
    """
    if message is None:
        return None

    # Convert message to dict
    result = {}
    for field in message.DESCRIPTOR.fields_by_name.values():
        value = getattr(message, field.name)

        # Handle nested messages
        if field.message and hasattr(field.message, "_concrete_class"):
            if field.label == field.LABEL_REPEATED:
                value = [from_proto_message(item) for item in value]
            else:
                value = from_proto_message(value)

        # Handle timestamps
        elif (
            field.type == field.TYPE_MESSAGE and field.message_type.name == "Timestamp"
        ):
            if field.label == field.LABEL_REPEATED:
                value = [from_proto_timestamp(ts) for ts in value]
            else:
                value = from_proto_timestamp(value)

        result[field.name] = value

    # Add any additional fields
    result.update(kwargs)

    # Return as dictionary or create an instance of the output class
    if output_class is None:
        return result

    return output_class(**result)


def create_grpc_error(
    status_code: int, message: str, details: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """Create a standardized error response for gRPC services.

    Args:
        status_code: The gRPC status code.
        message: A human-readable error message.
        details: Additional error details.

    Returns:
        A dictionary representing the error response.
    """
    error = {
        "code": status_code,
        "message": message,
    }

    if details:
        error["details"] = details

    return error
