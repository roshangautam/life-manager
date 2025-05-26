# Life Manager

[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.95.0-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)
[![Imports: isort](https://img.shields.io/badge/%20imports-isort-%231674b1?style=flat&labelColor=ef8336)](https://pycqa.github.io/isort/)

A comprehensive household and personal finance management system built with FastAPI and React with Tailwind CSS. Life Manager helps you manage your household, track expenses, plan budgets, and organize events in one place with a modern, minimal UI.

## ✨ Features

- 🔐 **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control
  - Email verification
  - Password reset

- 🏠 **Household Management**
  - Create and manage multiple households
  - Invite family members
  - Assign roles and permissions

- 💰 **Finance Tracking**
  - Track income and expenses
  - Categorize transactions
  - Generate financial reports
  - Set and track budgets

- 📅 **Calendar & Events**
  - Shared family calendar
  - Event reminders
  - Recurring events

- 📱 **Modern UI & Responsive Design**
  - Clean, minimal interface with Tailwind CSS v3.3.5
  - Works on desktop and mobile devices
  - Admin portal layout with sidebar navigation
  - Custom-themed components and consistent styling
  - Progressive Web App (PWA) support

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- PostgreSQL 12+
- gRPC & Protocol Buffers (for gRPC API)
- Node.js 16+ (for frontend development)
- Docker & Docker Compose (optional)
- Git

### Quick Start with Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/life-manager.git
   cd life-manager
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration.

3. Start the services:
   ```bash
   docker-compose up -d
   ```

4. Access the application:
   - API: http://localhost:8000
   - API Docs: http://localhost:8000/docs
   - Frontend: http://localhost:3000

### Manual Installation

#### Backend Setup

1. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Initialize and upgrade the database:
   ```bash
   alembic upgrade head
   ```

5. Create the first superuser:
   ```bash
   python -m api.cli create-superuser
   ```

6. Run the development server:
   ```bash
   uvicorn api.main:app --reload
   ```

#### App Setup

1. Navigate to the app directory:
   ```bash
   cd app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

### 4. Access the application

- Frontend: http://localhost:3000
- API Documentation: http://localhost:8000/docs
- Admin Interface: http://localhost:8000/admin

## gRPC API

Life Manager provides a high-performance gRPC API alongside the REST API. The gRPC API is ideal for performance-critical operations and internal service communication.

### Prerequisites

- Python 3.8+
- `grpcio` and `grpcio-tools` packages
- Protocol Buffer compiler (`protoc`)

### Generating gRPC Code

1. Install required tools:
   ```bash
   pip install grpcio grpcio-tools
   ```

2. Generate Python code from .proto files:
   ```bash
   ./scripts/generate_grpc_code.sh
   ```

### Running the gRPC Server

The gRPC server runs alongside the HTTP server by default on port 50051. You can start it using:

```bash
python -m api
```

Or using Docker Compose:

```bash
docker-compose up -d
```

### gRPC Client Library

A Python client library is provided for easy interaction with the gRPC API:

1. Install the client library:
   ```bash
   cd clients/python
   pip install -e .
   ```

2. Basic usage:
   ```python
   from life_manager_client import Client
   
   # Create a client instance
   client = Client(host="localhost", port=50051)
   
   try:
       # Authenticate
       auth = client.authenticate("user@example.com", "password")
       print(f"Authenticated as {auth.user.email}")
       
       # Get current user
       user = client.get_me()
       print(f"User: {user.full_name}")
       
   finally:
       client.close()
   ```

### gRPC Services

The following gRPC services are available:

- **UserService**: User management and authentication
- **HouseholdService**: Household operations
- **FinanceService**: Financial transactions and reporting
- **CalendarService**: Event and scheduling

### gRPC Reflection

gRPC reflection is enabled by default, allowing tools like `grpcurl` to inspect the API:

```bash
grpcurl -plaintext localhost:50051 list
```

## Development

### gRPC Development

1. To add a new gRPC service:
   - Create a new `.proto` file in `api/proto/api/v1/`
   - Define your service and messages
   - Run `./scripts/generate_grpc_code.sh`
   - Implement the service in `api/services/grpc/`
   - Add the service to `api/grpc_server.py`

2. Testing gRPC services:
   ```bash
   # Run tests
   pytest tests/grpc/
   
   # Generate coverage report
   pytest --cov=api.services.grpc tests/grpc/
   ```

3. Debugging:
   - Use `grpcurl` for manual API testing:
     ```bash
     grpcurl -plaintext -d '{"email":"test@example.com"}' localhost:50051 user.UserService/GetUserByEmail
     ```
   - Enable debug logging by setting `LOG_LEVEL=DEBUG`

4. Performance testing:
   ```bash
   # Install ghz
   brew install ghz
   
   # Run load test
   ghz --insecure --proto api/proto/api/v1/user.proto \
       --call user.UserService.GetUser \
       -d '{"id":"1"}' \
       -n 1000 -c 10 \
       localhost:50051
   ```

### gRPC Best Practices

1. **Error Handling**:
   - Use standard gRPC status codes
   - Include detailed error messages in the status details
   - Implement proper error handling in the client

2. **Performance**:
   - Use streaming for large datasets
   - Implement proper connection pooling
   - Use deadlines to prevent hanging requests

3. **Security**:
   - Always use TLS in production
   - Implement proper authentication and authorization
   - Validate all inputs

4. **Monitoring**:
   - Enable gRPC metrics
   - Use interceptors for logging and monitoring
   - Track request/response sizes and latencies

### Project Structure

```
LifeManager/
├── api/                    # Backend API code
│   ├── models/             # Database models
│   ├── routers/            # API route handlers
│   ├── schemas/            # Pydantic models
│   ├── config.py           # Application configuration
│   ├── database.py         # Database configuration
│   └── main.py             # FastAPI application
├── app/                    # App React application
├── migrations/             # Database migrations
├── tests/                  # Test files
├── .env.example            # Example environment variables
├── .gitignore
├── alembic.ini             # Alembic configuration
├── docker-compose.yml      # Docker Compose configuration
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

### Running Tests

```bash
# Run backend tests
pytest

# Run app tests
cd app
npm test
```

## Deployment

### With Docker

1. Build and start the containers:
   ```bash
   docker-compose up -d --build
   ```

2. Run database migrations:
   ```bash
   docker-compose exec web alembic upgrade head
   ```

3. Access the application at http://localhost:8000

## 📚 Documentation

- [API Documentation](http://localhost:8000/docs) (available after starting the backend)
- [App Documentation](./app/README.md)
- [Architecture Decision Records](./docs/adr/)
- [API Reference](./docs/API_REFERENCE.md)

## 🛠 Development

### Code Style

We use:
- [Black](https://github.com/psf/black) for code formatting
- [isort](https://pycqa.github.io/isort/) for import sorting
- [mypy](http://mypy-lang.org/) for static type checking

Before committing, run:
```bash
make format  # Runs black and isort
make lint    # Runs flake8 and mypy
```

### Testing

Run tests with:
```bash
make test
```

### Git Hooks

Pre-commit hooks are set up to ensure code quality. Install them with:
```bash
pre-commit install
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) to get started.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - The web framework used
- [SQLAlchemy](https://www.sqlalchemy.org/) - The ORM used
- [React](https://reactjs.org/) - Frontend library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Heroicons](https://heroicons.com/) - SVG icon library

---
<div align="center">
Made with ❤️ by [Roshan Gautam](https://roshangautam.com/)
</div>
