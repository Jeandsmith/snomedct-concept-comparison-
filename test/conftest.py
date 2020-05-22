import pytest
from app import app as my_app

@pytest.fixture
def app():
    test_app = my_app
    yield test_app

@pytest.fixture
def client(app):
    return app.test_client()