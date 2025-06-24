export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  id: string;
  clientId: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
  client?: Client;
  product?: Product;
}

export interface FormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  title: string;
}