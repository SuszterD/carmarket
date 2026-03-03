from fastapi import FastAPI

app = FastAPI(title="CarMarket API")


@app.get("/")
def root():
    return {"message": "CarMarket API is running"}
