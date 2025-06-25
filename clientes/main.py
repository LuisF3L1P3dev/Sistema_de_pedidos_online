from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from http import HTTPStatus
from sqlalchemy.orm import Session
from models import Cliente
from schemas import ClienteBase, ClienteCreate, ClientePublic
from database import Base, SessionLocal, engine

# Criação das tabelas
Base.metadata.create_all(bind=engine)

# Instância do app FastAPI
app = FastAPI(title='Microsserviço de Clientes')

# Middleware de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Você pode trocar por ["http://localhost:3000"] se quiser limitar ao front
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependência para injetar a sessão com o banco
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Rota raiz
@app.get("/")
async def root():
    return {"message": "Hello World"}

# Criar Cliente
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

# Listar Clientes
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

# Atualizar Cliente
@app.put("/clientes/{cliente_id}", response_model=ClientePublic)
def atualizar_cliente(
    cliente_id: int,
    cliente_atualizado: ClienteCreate,
    db: Session = Depends(get_db)
):
    cliente_db = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if not cliente_db:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Cliente não encontrado")

    # Verifica se outro cliente já usa o mesmo e-mail
    email_em_uso = (
        db.query(Cliente)
        .filter(Cliente.email == cliente_atualizado.email, Cliente.id != cliente_id)
        .first()
    )
    if email_em_uso:
        raise HTTPException(
            status_code=HTTPStatus.CONFLICT,
            detail="Este e-mail já está sendo usado por outro cliente.",
        )

    cliente_db.nome = cliente_atualizado.nome
    cliente_db.email = cliente_atualizado.email
    db.commit()
    db.refresh(cliente_db)
    return cliente_db

# Deletar Cliente
@app.delete(
    '/cliente/{cliente_id}',
    status_code=HTTPStatus.OK,
)
def deletar_cliente(
    cliente_id: int,
    db: Session = Depends(get_db)
):
    cliente_db = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if not cliente_db:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Cliente não encontrado"
        )

    db.delete(cliente_db)
    db.commit()
    return
