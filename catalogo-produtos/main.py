from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

models.Base.metadata.create_all(bind=engine)
app = FastAPI()

class ProdutoCreate(BaseModel):
    nome: str
    descricao: Optional[str] = None
    preco: float
    estoque: Optional[int] = 0
    ativo: Optional[bool] = True
    categoria: Optional[str] = None

class ProdutoOut(ProdutoCreate):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/produtos", response_model=List[ProdutoOut])
def listar_produtos(db: Session = Depends(get_db)):
    return db.query(models.Produto).all()

@app.post("/produtos", response_model=ProdutoOut)
def criar_produto(produto: ProdutoCreate, db: Session = Depends(get_db)):
    novo_produto = models.Produto(**produto.dict())
    db.add(novo_produto)
    db.commit()
    db.refresh(novo_produto)
    return novo_produto

@app.put("/produtos/{produto_id}", response_model=ProdutoOut)
def atualizar_produto(produto_id: int, produto: ProdutoCreate, db: Session = Depends(get_db)):
    produto_db = db.query(models.Produto).filter(models.Produto.id == produto_id).first()
    if not produto_db:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    for chave, valor in produto.dict().items():
        setattr(produto_db, chave, valor)
    db.commit()
    db.refresh(produto_db)
    return produto_db

@app.delete("/produtos/{produto_id}")
def deletar_produto(produto_id: int, db: Session = Depends(get_db)):
    produto_db = db.query(models.Produto).filter(models.Produto.id == produto_id).first()
    if not produto_db:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    db.delete(produto_db)
    db.commit()
    return {"detail": "Produto deletado com sucesso"}