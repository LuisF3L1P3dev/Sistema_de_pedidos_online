export interface Cliente {
  id: number;
  nome: string;
  email: string;
}

export interface ClienteCreate {
  nome: string;
  email: string;
}