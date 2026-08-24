import random
import argparse
from datetime import datetime, timedelta, timezone

from app.database import SessionLocal
from app import models
from app.core.security import hash_password

random.seed(42)

SEED_EPOCH = datetime(2026, 1, 1, tzinfo=timezone.utc)

DEMO_USERS = {
    ("demo_user", "demo@example.com", "demo123"),
    ("other_user", "other@example.com", "other123"),
}

brands_models = {
    "BMW": ["320", "X5", "M3"],
    "Audi": ["A4", "A6", "Q5"],
    "Mercedes": ["C200", "E220", "GLC"],
    "Volkswagen": ["Golf", "Passat", "Tiguan"],
    "Toyota": ["Corolla", "Camry", "RAV4"],
}

base_prices = {
    "BMW": 18_000_000,
    "Audi": 17_000_000,
    "Mercedes": 19_000_000,
    "Volkswagen": 12_000_000,
    "Toyota": 13_000_000,
}

fuel_types = ["Benzin", "Gázolaj", "Hybrid"]

description_choices = [
    "Megkímélt állapotú.",
    "Jégkár érte, az ár alku nélkül értendő.",
    "Első tulajdonostól, garázsban tartva.",
    "Nem dohányzó tulajdonostól, végig szervizkönyvvel.",
    "Friss műszakival, négy évszakos gumikkal, azonnal vihető. "
    "Kisebb használati nyomok a kárpiton, a karosszéria karcmentes.",
    "Végig hivatalos márkaszervizben karbantartva, számlákkal igazolt "
    "múlttal. A vezérműszíj és a vízpumpa nemrég cserélve, a fékbetétek "
    "az idén lettek felújítva.",
    "Első tulajdonostól, végig hivatalos márkaszervizben karbantartva, "
    "teljes szervizkönyvvel és számlákkal igazolt múlttal. A vezérműszíj "
    "és a vízpumpa nemrég cserélve, négy évszakos gumikkal, friss "
    "műszakival. Garázsban tartott, nem dohányzó autó. Extrái: "
    "tolatókamera, ülésfűtés, kétzónás digitális klíma, adaptív "
    "tempomat, LED fényszórók és gyári navigáció. Kisebb kőfelverődés "
    "nyomok a motorháztetőn, egyébként karcmentes karosszéria. "
    "Csere nem érdekel, az ár irányár.",
]

parser = argparse.ArgumentParser()
parser.add_argument("--wipe", action="store_true")
args = parser.parse_args()

db = SessionLocal()


def get_or_create_users():
    users = []

    for username, email, password in DEMO_USERS:
        user = db.query(models.User).filter_by(username=username).first()

        if user is None:
            user = models.User(
                username=username, email=email, hashed_password=hash_password(password)
            )
            db.add(user)

        users.append(user)

    db.commit()

    return users


def seed():
    size = 100
    users = get_or_create_users()

    for x in range(size):
        brand = random.choice(list(brands_models.keys()))
        model = random.choice(brands_models[brand])
        year = random.randint(2010, 2026)
        age = SEED_EPOCH.year - year
        mileage = age * random.randint(8000, 22000) + random.randint(0, 5000)
        price = round(base_prices[brand] * (0.92**age) / 100_000) * 100_000

        listing = models.CarListing(
            user_id=random.choice(users).id,
            brand=brand,
            model=model,
            year=year,
            price=max(price, 1_500_000),
            mileage=mileage,
            fuel_type=random.choice(fuel_types),
            description=random.choice(description_choices),
            created_at=SEED_EPOCH + timedelta(hours=x),
        )

        db.add(listing)

    db.commit()
    db.close()

    print(f"{size} test listings created successfully ")


existing_count = db.query(models.CarListing).count()

if existing_count > 0 and args.wipe:

    db.query(models.CarListing).delete()
    db.commit()

    seed()

elif existing_count > 0 and not args.wipe:
    print("Data already exists, skipping (use --wipe to force reseed).")

else:

    seed()
