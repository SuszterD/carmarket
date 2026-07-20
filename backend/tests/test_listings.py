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

listings = [
    {"brand": "Toyota", "fuel_type": "Benzin", "year": 2015, "price": 5000},
    {"brand": "Toyota", "fuel_type": "Hybrid", "year": 2020, "price": 12000},
    {"brand": "Honda", "fuel_type": "Gázolaj", "year": 2018, "price": 8000},
]


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


def test_filters_all(test_db, test_user):
    user = test_user("testuser")

    for listing in listings:
        client.post("/listings", json={**test_data, **listing}, headers=user)

    response = client.get(
        "/listings",
        params={
            "brand": "honda",
            "fuel_type": "Gázolaj",
            "year_min": 2010,
            "year_max": 2020,
            "price_min": 7000,
            "price_max": 9000,
        },
    )

    assert response.status_code == 200
    assert response.json()["total"] == 1
    assert response.json()["items"][0]["brand"] == "Honda"
    assert response.json()["items"][0]["fuel_type"] == "Gázolaj"


def test_filters_wrong_ranges():
    price_response = client.get("/listings", params={"price_min": 100, "price_max": 0})
    year_response = client.get("/listings", params={"year_min": 2000, "year_max": 1900})

    assert price_response.status_code == 422
    assert year_response.status_code == 422
    assert year_response.json()["detail"] == "year_min cannot be greater than year_max"
    assert (
        price_response.json()["detail"] == "price_min cannot be greater than price_max"
    )


def test_filters_by_brand(test_db, test_user):
    user = test_user("testuser")

    for listing in listings:
        client.post("/listings", json={**test_data, **listing}, headers=user)

    response = client.get("/listings", params={"brand": "toyo"})

    assert response.status_code == 200
    assert response.json()["total"] == 2
    assert response.json()["items"][0]["brand"] == "Toyota"


def test_filter_by_fuel_type(test_db, test_user):
    user = test_user("testuser")

    for listing in listings:
        client.post("/listings", json={**test_data, **listing}, headers=user)

    response = client.get("/listings", params={"fuel_type": "Benzin"})

    assert response.status_code == 200
    assert response.json()["total"] == 1
    assert response.json()["items"][0]["year"] == 2015
    assert response.json()["items"][0]["price"] == 5000
