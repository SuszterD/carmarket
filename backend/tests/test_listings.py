from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_create_listing_requires_auth(test_db):
    response = client.post(
        "/listings",
        json={
            "brand": "string",
            "model": "string",
            "year": 1900,
            "price": 0,
            "mileage": 0,
            "fuel_type": "Benzin",
            "description": "string",
        },
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


def test_create_listing_success(test_db):
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
        data={
            "username": "testuser",
            "password": "testpassword",
        },
    )

    token = login_response.json()["access_token"]

    response = client.post(
        "/listings",
        json={
            "brand": "string",
            "model": "string",
            "year": 1900,
            "price": 0,
            "mileage": 0,
            "fuel_type": "Benzin",
            "description": "string",
        },
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 201
    assert response.json()["brand"] == "string"
    assert "id" in response.json()


def test_update_listing_wrong_owner(test_db):
    client.post(
        "/auth/register",
        json={
            "username": "testuser1",
            "email": "testuser1@example.com",
            "password": "testpassword",
        },
    )

    login_response = client.post(
        "/auth/login",
        data={
            "username": "testuser1",
            "password": "testpassword",
        },
    )

    token = login_response.json()["access_token"]

    listing_response = client.post(
        "/listings",
        json={
            "brand": "string",
            "model": "string",
            "year": 1900,
            "price": 0,
            "mileage": 0,
            "fuel_type": "Benzin",
            "description": "string",
        },
        headers={"Authorization": f"Bearer {token}"},
    )

    listing_id = listing_response.json()["id"]

    client.post(
        "/auth/register",
        json={
            "username": "testuser2",
            "email": "testuser2@example.com",
            "password": "testpassword",
        },
    )

    login_response_user2 = client.post(
        "/auth/login",
        data={
            "username": "testuser2",
            "password": "testpassword",
        },
    )

    token = login_response_user2.json()["access_token"]

    response = client.put(
        f"/listings/{listing_id}",
        json={
            "brand": "string1",
            "model": "string",
            "year": 1900,
            "price": 0,
            "mileage": 0,
            "fuel_type": "Benzin",
            "description": "string",
        },
        headers={"Authorization": f"Bearer {token}"},
    )

    verify_response = client.get(f"/listings/{listing_id}")

    assert response.status_code == 403
    assert response.json()["detail"] == "Not authorized to modify this listing"
    assert verify_response.json()["brand"] == "string"


def test_delete_listing_wrong_owner(test_db):
    client.post(
        "/auth/register",
        json={
            "username": "testuser1",
            "email": "testuser1@example.com",
            "password": "testpassword",
        },
    )

    login_response = client.post(
        "/auth/login",
        data={
            "username": "testuser1",
            "password": "testpassword",
        },
    )

    token = login_response.json()["access_token"]

    listing_response = client.post(
        "/listings",
        json={
            "brand": "string",
            "model": "string",
            "year": 1900,
            "price": 0,
            "mileage": 0,
            "fuel_type": "Benzin",
            "description": "string",
        },
        headers={"Authorization": f"Bearer {token}"},
    )

    listing_id = listing_response.json()["id"]

    client.post(
        "/auth/register",
        json={
            "username": "testuser2",
            "email": "testuser2@example.com",
            "password": "testpassword",
        },
    )

    login_response_user2 = client.post(
        "/auth/login",
        data={
            "username": "testuser2",
            "password": "testpassword",
        },
    )

    token = login_response_user2.json()["access_token"]

    response = client.delete(
        f"/listings/{listing_id}",
        headers={"Authorization": f"Bearer {token}"},
    )

    verify_response = client.get(f"/listings/{listing_id}")

    assert response.status_code == 403
    assert response.json()["detail"] == "Not authorized to delete this listing"
    assert verify_response.status_code == 200


def test_pagination_default_values(test_db, test_user):
    listing_data = {
        "brand": "string",
        "model": "string",
        "year": 1900,
        "price": 0,
        "mileage": 0,
        "fuel_type": "Benzin",
        "description": "string",
    }

    for _ in range(40):
        client.post("/listings", json=listing_data, headers=test_user)

    response = client.get("/listings")

    assert response.status_code == 200
    assert response.json()["total"] == 40
    assert response.json()["page"] == 1
    assert response.json()["page_size"] == 25
    assert len(response.json()["items"]) == 25


def test_pagination_page_two(test_db, test_user):
    listing_data = {
        "brand": "string",
        "model": "string",
        "year": 1900,
        "price": 0,
        "mileage": 0,
        "fuel_type": "Benzin",
        "description": "string",
    }
    for _ in range(60):
        client.post("/listings", json=listing_data, headers=test_user)

    response = client.get("/listings", params={"page": 2, "page_size": 50})

    assert response.status_code == 200
    assert response.json()["total"] == 60
    assert response.json()["page"] == 2
    assert response.json()["page_size"] == 50
    assert len(response.json()["items"]) == 10


def test_pagination_invalid_page_size():
    response = client.get("/listings", params={"page_size": 100})

    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"] == ["query", "page_size"]
