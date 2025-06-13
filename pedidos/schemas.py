from pydantic import BaseModel
from typing import List

class ProdutoPedido(BaseModel):
    produto_id: int
    quantidade: int

class PedidoCreate(BaseModel):
    id_cliente: int
    produtos: List[ProdutoPedido]
    total: float  

class PedidoResponse(BaseModel):
    id: int
    id_cliente: int
    produtos: List[ProdutoPedido]
    total: float
    status: str

    model_config = {
        "from_attributes": True
    }
