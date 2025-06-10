from pydantic import BaseModel
from typing import List, Any

class PedidoCreate(BaseModel):
    id_cliente: int
    produtos: List[Any]  
    total: float

class PedidoResponse(BaseModel):
    id: int
    id_cliente: int
    produtos: List[Any]
    total: float
    status: str

    class Config:
        orm_mode = True
