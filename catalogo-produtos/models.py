from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from datetime import datetime, timezone
from database import Base

class Produto(Base):
    __tablename__ = "produtos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True, nullable=False)
    preco = Column(Float, nullable=False)
    estoque = Column(Integer, default=0)
    descricao = Column(String, nullable=True)
    ativo = Column(Boolean, default=True)
    categoria = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
