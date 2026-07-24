import pytest
import jwt
from datetime import datetime, timedelta, timezone
from fastapi.testclient import TestClient
from app.core.config import settings
from app.main import app

client = TestClient(app)

test_data = {
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "testpassword",
}


@pytest.mark.parametrize(
    "field, invalid_value",
    [
        ("email", "invalid_email.com"),
        ("username", "a" * 5),
        ("username", "a" * 13),
        ("password", "a" * 7),
        ("password", "a" * 73),
    ],
)
def test_register_invalid_fields(test_db, field, invalid_value):
    payload = {**test_data, field: invalid_value}

    response = client.post("/auth/register", json=payload)

    assert response.status_code == 422


def test_register_success(test_db):
    response = client.post("/auth/register", json=test_data)

    assert response.status_code == 201
    assert "password" not in response.json()


@pytest.mark.parametrize(
    "username, email, password",
    [
        ("testuser", "testuser@example.com", "testpassword"),
        ("testuser", "different@example.com", "testpassword"),
        ("different", "testuser@example.com", "testpassword"),
    ],
)
def test_register_duplicate(test_db, username, email, password):
    client.post("/auth/register", json=test_data)

    response = client.post(
        "/auth/register",
        json={"username": username, "email": email, "password": password},
    )

    assert response.status_code == 409


def test_login_success(test_db):
    client.post("/auth/register", json=test_data)

    response = client.post(
        "/auth/login",
        data={"username": "testuser", "password": "testpassword"},
    )

    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"


def test_login_wrong_password(test_db):
    client.post("/auth/register", json=test_data)

    response = client.post(
        "/auth/login",
        data={"username": "testuser", "password": "wrongpassword"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect username or password"


def test_login_nonexistent_user(test_db):
    response = client.post(
        "/auth/login",
        data={"username": "testuser", "password": "testpassword"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect username or password"


def test_get_me_success(test_db, test_user):
    user = test_user("testuser")

    response = client.get("/auth/me", headers=user)

    assert response.status_code == 200
    assert response.json()["username"] == "testuser"
    assert response.json()["email"] == "testuser@example.com"


def test_get_me_no_token(test_db):
    response = client.get("/auth/me")

    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


def test_get_me_invalid_token(test_db):
    response = client.get(
        "/auth/me",
        headers={"Authorization": "Bearer wrong_token"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Could not validate credentials"


def test_refresh_token_success(test_db, test_user):
    user = test_user("testuser")
    
    response = client.post("/auth/refresh", headers=user)

    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"


def test_refresh_token_no_token(test_db):
    response = client.post("/auth/refresh")

    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


def test_refresh_token_invalid_token(test_db):
    response = client.post(
        "/auth/refresh",
        headers={"Authorization": "Bearer wrong_token"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Could not validate credentials"


def test_me_get_expired_token(test_db, test_user):
    test_user("testuser")

    expired_token = jwt.encode(
        {"sub": "testuser", "exp": datetime.now(timezone.utc) - timedelta(minutes=1)},
        key=settings.secret_key,
        algorithm=settings.algorithm,
    )

    response = client.get(
        "/auth/me", headers={"Authorization": f"Bearer {expired_token}"}
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Could not validate credentials"


def test_refresh_expired_token(test_db, test_user):
    test_user("testuser")

    expired_token = jwt.encode(
        {"sub": "testuser", "exp": datetime.now(timezone.utc) - timedelta(minutes=1)},
        key=settings.secret_key,
        algorithm=settings.algorithm,
    )

    response = client.post(
        "/auth/refresh",
        headers={"Authorization": f"Bearer {expired_token}"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Could not validate credentials"
