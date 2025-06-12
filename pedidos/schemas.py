from pydantic import BaseModel, Field
from typing import List

class PedidoCreate(BaseModel):
    id_cliente: int
    produtos: List[int]  
    total: float

class PedidoResponse(BaseModel):
    id: int
    status: str

    model_config = {
        "from_attributes": True
    }
