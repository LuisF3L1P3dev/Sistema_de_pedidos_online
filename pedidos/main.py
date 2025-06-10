from fastapi import FastAPI, HTTPException, Depends, Path
from sqlalchemy.orm import Session
from typing import List
from database import SessionLocal, engine, Base
from models import Pedidos
from schemas import PedidoCreate, PedidoResponse
from grpc_client import ClienteGRPCClient

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Microserviço de Pedidos")

cliente_grpc = ClienteGRPCClient()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/pedidos/", response_model=PedidoResponse)
def criar_pedido(pedido: PedidoCreate, db: Session = Depends(get_db)):

    cliente = cliente_grpc.get_cliente(pedido.id_cliente)
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado via gRPC")
    
    novo_pedido = Pedidos(
        id_cliente=pedido.id_cliente,
        produtos=pedido.produtos,
        total=pedido.total,
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

    pedido_db.id_cliente = pedido_atualizado.id_cliente
    pedido_db.produtos = pedido_atualizado.produtos
    pedido_db.total = pedido_atualizado.total
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
    return