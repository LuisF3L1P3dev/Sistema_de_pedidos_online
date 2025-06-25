export interface Product {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
}

export interface Order {
  id: number;
  id_cliente: number;
  produtos: {
    produto_id: number;
    quantidade: number;
  }[];
  total: number;
  status: string;
  created_at: string;
  updated_at: string;

  client?: Client;
  product?: Product;
  quantity?: number; 
}

export interface FormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  title: string;
}