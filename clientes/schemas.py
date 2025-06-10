from pydantic import BaseModel, EmailStr

class ClientePublic(BaseModel):
  id: id
  nome_cliente = str
  email: EmailStr