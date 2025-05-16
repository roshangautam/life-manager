# Life Manager

[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.95.0-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)
[![Imports: isort](https://img.shields.io/badge/%20imports-isort-%231674b1?style=flat&labelColor=ef8336)](https://pycqa.github.io/isort/)

A comprehensive household and personal finance management system built with FastAPI and React. Life Manager helps you manage your household, track expenses, plan budgets, and organize events in one place.

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

- 📱 **Responsive Design**
  - Works on desktop and mobile
  - Progressive Web App (PWA) support

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- PostgreSQL 12+
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

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## 📚 Documentation

- [API Documentation](http://localhost:8000/docs) (available after starting the backend)
- [Frontend Documentation](./frontend/README.md)
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
- [MUI](https://mui.com/) - React component library

---

<div align="center">
  Made with ❤️ by Your Name
</div>
   ```

5. Start the backend server:
   ```bash
   uvicorn api.main:app --reload
   ```

### 3. Set up the frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
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

## Development

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
├── frontend/               # Frontend React application
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

# Run frontend tests
cd frontend
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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
