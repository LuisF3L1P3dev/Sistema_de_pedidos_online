from fastapi import FastAPI

from clientes.schemas import ClientePublic

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}