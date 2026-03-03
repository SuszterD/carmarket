from fastapi import FastAPI
from .database import engine, Base
from . import models

app = FastAPI(title="CarMarket API")

Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "CarMarket API is running"}
