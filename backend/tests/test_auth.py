from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_register_success(test_db):
    response = client.post(
        "/auth/register",
        json={
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "testpassword",
        },
    )

    assert response.status_code == 201
    assert "password" not in response.json()


def test_register_duplicate(test_db):
    payload = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "testpassword",
    }

    client.post("/auth/register", json=payload)
    response = client.post("/auth/register", json=payload)

    assert response.status_code == 409
