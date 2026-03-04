from fastapi import FastAPI
from .database import engine, Base
from .routers import listings
from . import models
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="CarMarket API")
origins = [
    "http://localhost:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(listings.router)


@app.get("/")
def root():
    return {"message": "CarMarket API is running"}
