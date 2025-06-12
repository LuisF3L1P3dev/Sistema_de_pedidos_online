# listar_produtos.py
from database import SessionLocal
from models import Produto

db = SessionLocal()

produtos = db.query(Produto).all()

for p in produtos:
    print(f"ID: {p.id} | Nome: {p.nome} | Preço: {p.preco}")
