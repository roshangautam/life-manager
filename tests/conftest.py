import pytest
from api.main import app
from fastapi.testclient import TestClient

@pytest.fixture
def client():
    return TestClient(app)
