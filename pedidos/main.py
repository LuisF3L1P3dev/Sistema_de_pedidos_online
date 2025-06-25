from fastapi import FastAPI, HTTPException, Depends, Path
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from database import SessionLocal, engine, Base
from models import Pedidos
from schemas import PedidoCreate, PedidoResponse
import requests

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Microserviço de Pedidos")

# Middleware CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ou ["http://localhost:3000"] para restringir
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/pedidos/", response_model=PedidoResponse)
def criar_pedido(pedido: PedidoCreate, db: Session = Depends(get_db)):
    total = 0.0

    for item in pedido.produtos:
        produto_id = item['produto_id']
        quantidade = item['quantidade']
        resp = requests.get(f"http://localhost:8000/produtos/{produto_id}")
        if resp.status_code != 200:
            raise HTTPException(status_code=404, detail=f"Produto {produto_id} não encontrado")
        produto_data = resp.json()
        preco = produto_data.get('preco', 0)
        total += preco * quantidade

    novo_pedido = Pedidos(
        id_cliente=pedido.id_cliente,
        produtos=pedido.produtos,
        total=total,
        status="pendente"
    )
    db.add(novo_pedido)
    db.commit()
    db.refresh(novo_pedido)
    
    return novo_pedido

@app.get("/pedidos/", response_model=List[PedidoResponse])
def listar_pedidos(db: Session = Depends(get_db)):
    pedidos = db.query(Pedidos).all()
    return pedidos

@app.put("/pedidos/{pedido_id}", response_model=PedidoResponse)
def atualizar_pedido(pedido_id: int, pedido_atualizado: PedidoCreate, db: Session = Depends(get_db)):
    pedido_db = db.query(Pedidos).filter(Pedidos.id == pedido_id).first()
    if not pedido_db:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")

    total = 0.0
    for item in pedido_atualizado.produtos:
        resp = requests.get(f"http://localhost:8000/produtos/{item.produto_id}")
        if resp.status_code != 200:
            raise HTTPException(status_code=404, detail=f"Produto {item.produto_id} não encontrado")
        preco = resp.json().get("preco", 0)
        total += preco * item.quantidade

    pedido_db.id_cliente = pedido_atualizado.id_cliente
    pedido_db.produtos = [item.dict() for item in pedido_atualizado.produtos]
    pedido_db.total = total
    pedido_db.status = "pendente"
    db.commit()
    db.refresh(pedido_db)
    return pedido_db

@app.delete("/pedidos/{pedido_id}", status_code=204)
def deletar_pedido(pedido_id: int, db: Session = Depends(get_db)):
    pedido_db = db.query(Pedidos).filter(Pedidos.id == pedido_id).first()
    if not pedido_db:
        raise HTTPException(status_code=404, detail="Pedido não encontrado")

    db.delete(pedido_db)
    db.commit()
