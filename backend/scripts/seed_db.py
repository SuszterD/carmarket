import random
from uuid import uuid4
from datetime import datetime

from app.database import SessionLocal
from app import models

brands_models = {
    "BMW": ["320", "X5", "M3"],
    "Audi": ["A4", "A6", "Q5"],
    "Mercedes": ["C200", "E220", "GLC"],
    "Volkswagen": ["Golf", "Passat", "Tiguan"],
    "Toyota": ["Corolla", "Camry", "RAV4"],
}

fuel_types = ["Benzin", "Gázolaj", "Hybrid"]

db = SessionLocal()

db.query(models.CarListing).delete()
db.commit()

size = 50

for x in range(size):
    brand = random.choice(list(brands_models.keys()))
    model = random.choice(brands_models[brand])

    listing = models.CarListing(
        id=str(uuid4()),
        brand=brand,
        model=model,
        year=random.randint(2010, 2025),
        price=random.randint(5000000, 25000000),
        mileage=random.randint(20000, 250000),
        fuel_type=random.choice(fuel_types),
        description="Ide kerül a leírás",
        created_at=datetime.utcnow(),
    )

    db.add(listing)


db.commit()
db.close()

print(f"{size} teszt hirdetés sikeresen létrehozva")
