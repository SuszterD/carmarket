from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import pytest

from app.database import Base, get_db
from app.main import app

client = TestClient(app)

engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture()
def test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def test_user(test_db):
    def _create_user(username):
        client.post(
            "/auth/register",
            json={
                "username": f"{username}",
                "email": f"{username}testuser@example.com",
                "password": "testpassword",
            },
        )
        response = client.post(
            "/auth/login",
            data={
                "username": f"{username}",
                "password": "testpassword",
            },
        )

        token = response.json()["access_token"]

        return {"Authorization": f"Bearer {token}"}

    return _create_user
