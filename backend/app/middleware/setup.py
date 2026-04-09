from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.middleware.logging_middleware import logging_middleware


def setup_middlewares(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.middleware("http")(logging_middleware)
