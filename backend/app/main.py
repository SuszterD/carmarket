from fastapi import FastAPI

from .routers import listings, auth
from .core.logging_config import setup_logging
from .middleware.setup import setup_middlewares

setup_logging()

app = FastAPI(redirect_slashes=False, title="CarMarket API")


setup_middlewares(app)


app.include_router(listings.router)
app.include_router(auth.router)


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "carmarket-backend"}
