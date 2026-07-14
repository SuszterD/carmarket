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


def test_login_success(test_db):
    client.post(
        "/auth/register",
        json={
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "testpassword",
        },
    )

    response = client.post(
        "/auth/login",
        data={"username": "testuser", "password": "testpassword"},
    )

    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"


def test_login_wrong_password(test_db):
    client.post(
        "/auth/register",
        json={
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "testpassword",
        },
    )

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


def test_get_me_success(test_db):
    client.post(
        "/auth/register",
        json={
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "testpassword",
        },
    )

    login_response = client.post(
        "/auth/login",
        data={"username": "testuser", "password": "testpassword"},
    )

    token = login_response.json()["access_token"]

    response = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )

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
