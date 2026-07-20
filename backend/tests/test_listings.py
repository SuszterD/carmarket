from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

test_data = {
    "brand": "string",
    "model": "string",
    "year": 1900,
    "price": 0,
    "mileage": 0,
    "fuel_type": "Benzin",
    "description": "string",
}


def test_create_listing_requires_auth(test_db):
    response = client.post("/listings", json=test_data)

    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


def test_create_listing_success(test_db, test_user):

    response = client.post("/listings", json=test_data, headers=test_user("testuser"))

    assert response.status_code == 201
    assert response.json()["brand"] == "string"
    assert "id" in response.json()


def test_update_listing_wrong_owner(test_db, test_user):
    user1 = test_user("testuser1")
    user2 = test_user("testuser2")

    listing_response = client.post("/listings", json=test_data, headers=user1)

    listing_id = listing_response.json()["id"]

    response = client.put(
        f"/listings/{listing_id}", json={**test_data, "brand": "string1"}, headers=user2
    )

    verify_response = client.get(f"/listings/{listing_id}")

    assert response.status_code == 403
    assert response.json()["detail"] == "Not authorized to modify this listing"
    assert verify_response.json()["brand"] == "string"


def test_delete_listing_wrong_owner(test_db, test_user):
    user1 = test_user("testuser1")
    user2 = test_user("testuser2")

    listing_response = client.post("/listings", json=test_data, headers=user1)

    listing_id = listing_response.json()["id"]

    response = client.delete(f"/listings/{listing_id}", headers=user2)

    verify_response = client.get(f"/listings/{listing_id}")

    assert response.status_code == 403
    assert response.json()["detail"] == "Not authorized to delete this listing"
    assert verify_response.status_code == 200


def test_pagination_default_values(test_db, test_user):
    user = test_user("testuser")
    for _ in range(40):
        client.post("/listings", json=test_data, headers=user)

    response = client.get("/listings")

    assert response.status_code == 200
    assert response.json()["total"] == 40
    assert response.json()["page"] == 1
    assert response.json()["page_size"] == 25
    assert len(response.json()["items"]) == 25


def test_pagination_page_two(test_db, test_user):
    user = test_user("testuser")
    for _ in range(60):
        client.post("/listings", json=test_data, headers=user)

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
