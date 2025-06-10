from fastapi import FastAPI, Depends, HTTPException
from http import HTTPStatus
from sqlalchemy.orm import Session
from models import Cliente
from schemas import ClienteBase, ClienteCreate, ClientePublic
from database import Base, SessionLocal, engine 
Base.metadata.create_all(bind=engine)

app = FastAPI(title='Clientes')

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post(
  '/cliente/', 
  response_model=ClienteBase,
  status_code=HTTPStatus.CREATED
)
def criar_cliente(
  cliente: ClienteCreate,
  db: Session = Depends(get_db)
):
  db_cliente = Cliente(**cliente.dict())
  db.add(db_cliente)
  db.commit()
  db.refresh(db_cliente)
  return db_cliente   