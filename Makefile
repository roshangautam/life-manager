.PHONY: help install format lint test coverage clean docker-up docker-down docker-restart docker-logs db-migrate db-upgrade db-downgrade db-revision db-show db-reset

# Define variables
DOCKER_COMPOSE := docker compose -f docker-compose.yml -f docker-compose.override.yml
DOCKER_COMPOSE_PROD := docker compose -f docker-compose.yml -f docker-compose.prod.yml
DOCKER_COMPOSE_TEST := docker compose -f docker-compose.yml -f docker-compose.test.yml

# Default target when you just type 'make'
help:
	@echo "Available targets:"
	@echo "  install     - Install development dependencies"
	@echo "  format     - Format code with black and isort"
	@echo "  lint       - Run linters (black, isort, flake8, mypy)"
	@echo "  test       - Run tests with coverage"
	@echo "  coverage   - Show test coverage report"
	@echo "  clean      - Clean up Python and build artifacts"
	@echo "  docker-up  - Start all services in detached mode"
	@echo "  docker-down - Stop and remove all containers"
	@echo "  docker-clean - Clean up docker containers"
	@echo "  docker-restart - Restart all services"
	@echo "  docker-logs - Show logs for all services"
	@echo "  db-migrate - Create a new database migration"
	@echo "  db-upgrade - Upgrade database to the latest migration"
	@echo "  db-downgrade - Downgrade database by one migration"
	@echo "  db-revision - Create a new revision file"
	@echo "  db-show     - Show current database revision"
	@echo "  db-reset   - Reset database (drop, create, upgrade)"

# Install development dependencies
install:
	poetry install
	poetry run pre-commit install

# Format code
format:
	black .
	isort .


# Run linters
lint:
	black --check .
	isort --check-only .
	flake8 .
	mypy .


# Run tests with coverage
test:
	pytest --cov=api --cov-report=term-missing --cov-fail-under=80

# Show coverage report
coverage:
	coverage report -m
	coverage html

# Clean up Python and build artifacts
clean:
	find . -type d -name "__pycache__" -exec rm -r {} +
	find . -type d -name ".pytest_cache" -exec rm -r {} +
	find . -type d -name ".mypy_cache" -exec rm -r {} +
	rm -rf .coverage htmlcov build dist *.egg-info

# Docker Compose commands
docker-up:
	$(DOCKER_COMPOSE) up -d

# Stop and remove all containers
docker-down:
	$(DOCKER_COMPOSE) down

# Stop and remove all containers
docker-clean:
	docker system prune -a

# Restart all services
docker-restart: docker-down docker-up

# Show logs for all services
docker-logs:
	$(DOCKER_COMPOSE) logs -f

# Database migration commands
db-migrate:
	@read -p "Enter migration message: " message; \
	$(DOCKER_COMPOSE) exec api alembic revision --autogenerate -m "$$message"

db-upgrade:
	$(DOCKER_COMPOSE) exec api alembic upgrade head

db-downgrade:
	$(DOCKER_COMPOSE) exec api alembic downgrade -1

db-revision:
	@read -p "Enter revision message: " message; \
	$(DOCKER_COMPOSE) exec api alembic revision -m "$$message"

db-show:
	$(DOCKER_COMPOSE) exec api alembic current

db-reset:
	@echo "WARNING: This will drop and recreate the database. Are you sure? [y/N]" && read ans && [ $${ans:-N} = y ]
	$(DOCKER_COMPOSE) down -v
	$(DOCKER_COMPOSE) up -d postgres
	@echo "Waiting for database to be ready..."
	@until $(DOCKER_COMPOSE) exec postgres pg_isready -U postgres; do \
		sleep 1; \
	done
	$(DOCKER_COMPOSE) exec api alembic upgrade head
	@echo "Database has been reset and migrated to the latest version."

# Production deployment (example)
prod-up:
	$(DOCKER_COMPOSE_PROD) up -d

prod-down:
	$(DOCKER_COMPOSE_PROD) down

# Test environment
test-up:
	$(DOCKER_COMPOSE_TEST) up -d

test-down:
	$(DOCKER_COMPOSE_TEST) down

# Helpful aliases
up: docker-up
down: docker-down
restart: docker-restart
logs: docker-logs
migrate: db-migrate
upgrade: db-upgrade
downgrade: db-downgrade
revision: db-revision
show: db-show
reset: db-reset
