from pydantic import BaseModel, EmailStr

class ClienteBase(BaseModel):
  nome_cliente = str
  email: EmailStr

class ClienteCreate(ClienteBase):
  pass

class ClientePublic(ClienteBase):
  id: id

  class Config:
    orm_mode = True