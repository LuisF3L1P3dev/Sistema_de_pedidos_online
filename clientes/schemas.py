from pydantic import BaseModel, EmailStr

class ClienteBase(BaseModel):
  nome: str
  email: EmailStr

class ClienteCreate(ClienteBase):
  pass

class ClientePublic(ClienteBase):
  id: int

  class Config:
    orm_mode = True