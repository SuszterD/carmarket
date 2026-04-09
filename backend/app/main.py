import os
from fastapi import FastAPI
from .database import engine, Base
from .routers import listings

from .core.logging_config import setup_logging
from .middleware.setup import setup_middlewares

setup_logging()

app = FastAPI(redirect_slashes=False, title="CarMarket API")
origins = [
    "http://localhost:4200",
]


setup_middlewares(app)

if os.getenv("RUN_DB_INIT") == "true":
    Base.metadata.create_all(bind=engine)

app.include_router(listings.router)


@app.get("/")
def root():
    return {"message": "CarMarket API is running"}


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "carmarket-backend"}
