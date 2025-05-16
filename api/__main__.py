"""
Life Manager API - Main Entry Point

This module serves as the main entry point for running the Life Manager API
using Python's module syntax: `python -m api`
"""

import uvicorn
from .main import app

def run() -> None:
    """Run the FastAPI application using Uvicorn."""
    uvicorn.run(
        "api.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        workers=1,
    )

if __name__ == "__main__":
    run()
