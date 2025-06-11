export interface ItemPedido {
  id_produto: number;
  quantidade: number;
  preco_unitario: number;
}

export interface Pedido {
  id: number;
  id_cliente: number;
  itens: ItemPedido[];
  total: number;
  status: 'pendente' | 'processando' | 'entregue' | 'cancelado';
}