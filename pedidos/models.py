from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from datetime import datetime, timezone
from sqlalchemy.types import JSON
from database import Base

class Pedidos(Base):
    __tablename__ = "pedidos"

    id = Column(Integer, primary_key=True, index=True)
    id_cliente = Column(Integer, nullable=False)
    produtos = Column(JSON, nullable=False)  
    total = Column(Float, nullable=False)
    status = Column(String, default="pendente") 
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))