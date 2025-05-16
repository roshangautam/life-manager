from pydantic import BaseModel

class Token(BaseModel):
    """Schema for JWT token response"""
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """Schema for token data payload"""
    email: str | None = None
