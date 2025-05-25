import time
from typing import Any, Dict, List, Optional, Union

from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from starlette.middleware.base import BaseHTTPMiddleware

from . import __version__, models
from . import schemas_main as schemas
from .config import settings
from .dependencies import get_db
from .models import User
from .models.database import SessionLocal
from .routers import auth, finance, households, users

# Initialize FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Life Manager API - A comprehensive household and personal finance management system",
    version=__version__,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Set up CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


# Add middleware for request timing
class ProcessTimeMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        return response


app.add_middleware(ProcessTimeMiddleware)

# Include API routers
app.include_router(
    users.router,
    prefix=f"{settings.API_V1_STR}/users",
    tags=["users"],
)
app.include_router(
    households.router,
    prefix=f"{settings.API_V1_STR}/households",
    tags=["households"],
)
app.include_router(
    finance.router,
    prefix=f"{settings.API_V1_STR}/finance",
    tags=["finance"],
)
app.include_router(
    auth.router,
    prefix=f"{settings.API_V1_STR}/auth",
    tags=["auth"],
)


# Custom exception handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers=exc.headers if hasattr(exc, "headers") else None,
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({"detail": exc.errors(), "body": exc.body}),
    )


# Health check endpoint
@app.get("/health", tags=["health"])
async def health_check() -> Dict[str, str]:
    """Health check endpoint for load balancers and monitoring."""
    return {"status": "ok"}


# Root endpoint
@app.get("/", tags=["root"])
async def root() -> Dict[str, str]:
    """Root endpoint with API information."""
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} API",
        "version": __version__,
        "docs": "/docs",
        "redoc": "/redoc",
    }


# Create first superuser on startup
@app.on_event("startup")
def create_first_superuser() -> None:
    """Create first superuser on startup if it doesn't exist."""
    db = SessionLocal()
    try:
        user = (
            db.query(models.User)
            .filter(models.User.email == settings.FIRST_SUPERUSER_EMAIL)
            .first()
        )
        if not user:
            user_in = schemas.UserCreate(
                email=settings.FIRST_SUPERUSER_EMAIL,
                password=settings.FIRST_SUPERUSER_PASSWORD,
                full_name="Admin",
            )
            user = models.User(
                email=user_in.email,
                full_name=user_in.full_name,
                role="admin",
                is_active=True,
            )
            user.set_password(user_in.password)
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"Created first superuser: {user.email}")
    except Exception as e:
        print(f"Error creating first superuser: {e}")
    finally:
        db.close()
