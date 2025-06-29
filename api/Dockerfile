# ==============================================
# Build stage
# ==============================================
FROM python:3.11-slim as builder

WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential && \
    apt-get install -y procps lsof && \ 
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install poetry && \
    pip install setuptools wheel

# Copy dependency definition files
COPY README.md pyproject.toml poetry.lock* ./
COPY scripts/ ./scripts/
COPY alembic.ini /app/
COPY .env.example /app/.env
COPY migrations /app/migrations
# Install project dependencies (including the project itself)
# Exclude development dependencies for production
RUN poetry install --no-interaction --no-ansi --no-root

# Copy the application
COPY . .


# ==============================================
# Runtime stage
# ==============================================
FROM python:3.11-slim as runtime

WORKDIR /app

ARG USERNAME=lifemanager
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Create the user
RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
    #
    # [Optional] Add sudo support. Omit if you don't need to install software after connecting.
    && apt-get update \
    && apt-get install -y sudo \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# ********************************************************
# * Anything else you want to do like clean up goes here *
# ********************************************************

# Create necessary directories and set permissions
RUN mkdir -p /app/uploads && \
    chown -R ${USERNAME}:${USERNAME} /app/uploads && \
    chmod -R 755 /app/uploads

# Copy from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY --from=builder /app /app

# Set environment variables
ENV PYTHONPATH=/app \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/app/.venv/bin:/home/${USERNAME}}/.local/bin:$PATH"

# [Optional] Set the default user. Omit if you want to keep the default as root.
USER $USERNAME

# Expose the ports the app runs on
#FastAPI
EXPOSE 8000
#gRPC
EXPOSE 50051

# Command to run the application
CMD ["/app/scripts/run_server.sh", "--migrate"]
