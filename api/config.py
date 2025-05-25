import os
from pathlib import Path
from typing import Any, Dict, List, Optional, Union

from dotenv import load_dotenv
from pydantic import AnyHttpUrl, BaseSettings, EmailStr, HttpUrl, PostgresDsn, validator

# Load environment variables from .env file
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)


class Settings(BaseSettings):
    # Application settings
    PROJECT_NAME: str = "Life Manager"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"

    # Server configuration
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    GRPC_PORT: int = int(os.getenv("GRPC_PORT", "50051"))
    WORKERS: int = int(os.getenv("WORKERS", "10"))

    # gRPC settings
    GRPC_MAX_MESSAGE_LENGTH: int = 100 * 1024 * 1024  # 100MB
    GRPC_MAX_METADATA_SIZE: int = 32 * 1024  # 32KB
    GRPC_MAX_CONCURRENT_RPCS: int = 1000
    GRPC_KEEPALIVE_TIME_MS: int = 30000  # 30 seconds
    GRPC_KEEPALIVE_TIMEOUT_MS: int = 10000  # 10 seconds
    GRPC_KEEPALIVE_MIN_TIME_MS: int = 60000  # 1 minute
    GRPC_HTTP2_MAX_PINGS_WITHOUT_DATA: int = 0  # Unlimited
    GRPC_HTTP2_MIN_RECV_PING_INTERVAL_WITHOUT_DATA_SEC: int = 300  # 5 minutes

    # Security
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    ALGORITHM: str = "HS256"
    PASSWORD_SALT_ROUNDS: int = 10

    # JWT settings
    JWT_ISSUER: str = os.getenv("JWT_ISSUER", "life-manager-api")
    JWT_AUDIENCE: str = os.getenv("JWT_AUDIENCE", "life-manager")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")

    # CORS
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
        "http://localhost:3000",  # Frontend URL
        "http://localhost:8000",  # Backend API URL
        "http://localhost:50051",  # gRPC Web URL
        "http://localhost:8080",  # gRPC Web Proxy
    ]

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # Database
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "life-manager-db")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "postgres")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "lifemanager")
    DATABASE_URI: Optional[PostgresDsn] = None

    @validator("DATABASE_URI", pre=True)
    def assemble_db_connection(cls, v: Optional[str], values: Dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        return PostgresDsn.build(
            scheme="postgresql",
            user=values.get("POSTGRES_USER"),
            password=values.get("POSTGRES_PASSWORD"),
            host=values.get("POSTGRES_SERVER"),
            path=f"/{values.get('POSTGRES_DB') or ''}",
        )

    # First superuser
    FIRST_SUPERUSER_EMAIL: EmailStr = os.getenv(
        "FIRST_SUPERUSER_EMAIL", "admin@example.com"
    )
    FIRST_SUPERUSER_PASSWORD: str = os.getenv(
        "FIRST_SUPERUSER_PASSWORD", "ChangeMe123!"
    )

    # Email settings (for password reset, etc.)
    SMTP_TLS: bool = True
    SMTP_PORT: Optional[int] = None
    SMTP_HOST: Optional[str] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[EmailStr] = None
    EMAILS_FROM_NAME: Optional[str] = None

    @validator("EMAILS_FROM_NAME")
    def get_project_name(cls, v: Optional[str], values: Dict[str, Any]) -> str:
        if not v:
            return values["PROJECT_NAME"]
        return v

    EMAIL_RESET_TOKEN_EXPIRE_HOURS: int = 48
    EMAIL_TEMPLATES_DIR: str = "/app/app/email-templates/build"
    EMAILS_ENABLED: bool = False

    @validator("EMAILS_ENABLED", pre=True)
    def get_emails_enabled(cls, v: bool, values: Dict[str, Any]) -> bool:
        return bool(
            values.get("SMTP_HOST")
            and values.get("SMTP_PORT")
            and values.get("EMAILS_FROM_EMAIL")
        )

    class Config:
        case_sensitive = True
        env_file = ".env"


# Create settings instance
settings = Settings()

# Export commonly used settings
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES
DATABASE_URL = settings.DATABASE_URI or os.getenv("DATABASE_URL", "")
API_V1_STR = settings.API_V1_STR
