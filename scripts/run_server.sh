#!/bin/bash
set -e

# Define the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Activate virtual environment if it exists
if [ -d "${PROJECT_ROOT}/venv" ]; then
  echo "Activating virtual environment..."
  source "${PROJECT_ROOT}/venv/bin/activate"
fi

# Set environment variables
export PYTHONPATH="${PROJECT_ROOT}:${PYTHONPATH}"

# Generate gRPC code if needed
if [ "$1" = "--generate" ] || [ "$1" = "-g" ]; then
  echo "Generating gRPC code..."
  "${PROJECT_ROOT}/scripts/generate_grpc_code.sh"
  shift
fi

# Check if we should run migrations
if [ "$1" = "--migrate" ] || [ "$1" = "-m" ]; then
  echo "Running database migrations..."
  alembic upgrade head
  shift
fi

# Run the server
echo "Starting server..."
python -m api.run "$@"
