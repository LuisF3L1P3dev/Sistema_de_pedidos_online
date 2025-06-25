from pydantic import BaseModel
from typing import List
from datetime import datetime

class ItemPedido(BaseModel):
    produto_id: int
    quantidade: int

class PedidoCreate(BaseModel):
    id_cliente: int
    produtos: List[ItemPedido]   

class PedidoResponse(BaseModel):
    id: int
    id_cliente: int
    produtos: List[ItemPedido]
    total: float
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {
        "arbitrary_types_allowed": True,
        "from_attributes": True
    }
