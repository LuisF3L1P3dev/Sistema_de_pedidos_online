from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from database import SessionLocal, engine, Base
from models import Pedidos
from schemas import PedidoCreate, PedidoResponse
from grpc_client import ClienteGRPCClient
from grpc_client_produto import ProdutoGRPCClient
from fastapi.middleware.cors import CORSMiddleware

import clientes_pb2, clientes_pb2_grpc, produtos_pb2, produtos_pb2_grpc

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Microserviço de Pedidos")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

cliente_grpc = ClienteGRPCClient()
produto_grpc = ProdutoGRPCClient()

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

    for item in pedido.produtos:
        produto = produto_grpc.get_produto(item.produto_id)
        if not produto:
            raise HTTPException(
                status_code=404,
                detail=f"Produto com ID {item.produto_id} não encontrado via gRPC"
            )
        if item.quantidade <= 0:
            raise HTTPException(
                status_code=400,
                detail=f"Quantidade inválida para produto ID {item.produto_id}"
            )

    total_calculado = sum(
        produto_grpc.get_produto(item.produto_id)['preco'] * item.quantidade
        for item in pedido.produtos
    )

    produtos_para_salvar = [item.dict() for item in pedido.produtos]

    novo_pedido = Pedidos(
        id_cliente=pedido.id_cliente,
        produtos=produtos_para_salvar,
        total=total_calculado,
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

    for produto_id in pedido_atualizado.produtos:
        produto = produto_grpc.get_produto(produto_id)
        if not produto:
            raise HTTPException(
                status_code=404,
                detail=f"Produto com ID {produto_id} não encontrado via gRPC"
            )

    pedido_db.id_cliente = pedido_atualizado.id_cliente
    pedido_db.produtos = [int(pid) for pid in pedido_atualizado.produtos]
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
