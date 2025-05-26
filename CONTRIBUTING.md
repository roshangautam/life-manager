# Contributing to Life Manager

Thank you for your interest in contributing to Life Manager! This document will guide you through the process of setting up the development environment and making contributions.

## Development Setup

### Prerequisites

- Python 3.8+
- Poetry (Python package manager)
- Docker & Docker Compose (for containerized development)
- Node.js 16+ (for frontend development)

### Getting Started

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/life-manager.git
   cd life-manager
   ```

2. **Set up Python environment**
   ```bash
   # Install Poetry if you haven't already
   curl -sSL https://install.python-poetry.org | python3 -
   
   # Install project dependencies
   poetry install
   
   # Activate the virtual environment
   poetry shell
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development services**
   ```bash
   # Start all services (PostgreSQL, Redis, etc.)
   poetry run docker-up
   
   # Run database migrations
   poetry run db-upgrade
   ```

## Development Workflow

### Code Formatting and Linting

```bash
# Format code with black and isort
poetry run format

# Run linters (black, isort, flake8, mypy)
poetry run lint
```

### Testing

```bash
# Run tests with coverage
poetry run test

# Show coverage report
poetry run coverage
```

### Database Management

```bash
# Create a new database migration
poetry run db-migrate

# Upgrade database to the latest migration
poetry run db-upgrade

# Downgrade database by one migration
poetry run db-downgrade

# Show current database revision
poetry run db-show

# Reset database (drop, create, upgrade)
poetry run db-reset
```

### gRPC Development

```bash
# Generate gRPC code from .proto files
poetry run grpc-generate

# Clean generated gRPC code
poetry run grpc-clean
```

### Server Management

```bash
# Run the server in production mode
poetry run server-run

# Run the server in development mode (with auto-reload)
poetry run server-dev
```

### Docker Management

```bash
# Start all services in detached mode
poetry run docker-up

# Stop and remove all containers
poetry run docker-down

# Restart all services
poetry run docker-restart

# Show logs for all services
poetry run docker-logs
```

## Submitting Changes

1. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them with a descriptive message:
   ```bash
   git commit -m "Add your feature description"
   ```

3. Push your changes to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Open a pull request against the main repository's `main` branch.

## Code Style

- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) for Python code
- Use [Google-style docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings)
- Run `poetry run format` before committing
- Run `poetry run lint` to check for any style issues

## Testing

- Write tests for all new features and bug fixes
- Run `poetry run test` to run the test suite
- Aim for at least 80% test coverage

## Reporting Issues

When reporting issues, please include:

1. A clear title and description
2. Steps to reproduce the issue
3. Expected vs. actual behavior
4. Any relevant logs or error messages
5. Your environment details (OS, Python version, etc.)

## Code Review Process

1. All pull requests require at least one approval from a maintainer
2. All tests must pass before merging
3. Code must be properly documented
4. Follow the project's coding style and conventions
