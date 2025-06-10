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

@app.get(
  '/cliente/', 
  response_model=list[ClientePublic],
  status_code=HTTPStatus.OK
)
def listar_clientes(
  db: Session = Depends(get_db)
):
  clientes = db.query(Cliente).all()
  return clientes

@app.put("/clientes/{cliente_id}", response_model=ClientePublic)
def atualizar_cliente(
  cliente_id: int,
  cliente_atualizado: ClienteCreate,
  db: Session = Depends(get_db)
):
  cliente_db = db.query(Cliente).filter(Cliente.id == cliente_id).first()
  if not cliente_db:
    raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Cliente não encontrado")
  
  cliente_db.nome = cliente_atualizado.nome
  cliente_db.email = cliente_atualizado.email
  db.commit()
  db.refresh(cliente_db)
  return cliente_db