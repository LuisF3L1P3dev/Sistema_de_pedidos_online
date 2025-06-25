'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Table from '@/components/Table';
import Button from '@/components/Button';
import OrderForm from '@/components/OrderForm';
import { Order, Client, Product } from '@/types';

const Orders = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | undefined>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Agora fetchAllData é uma função do componente
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [clientsRes, productsRes] = await Promise.all([
        axios.get<Client[]>('http://localhost:8001/cliente/'),
        axios.get<Product[]>('http://localhost:8000/produtos'),
      ]);

      setClients(clientsRes.data);
      setProducts(productsRes.data);

      const ordersRes = await axios.get<Order[]>('http://localhost:8002/pedidos/');
      const pedidosComDetalhes = ordersRes.data.map((pedido: any) => ({
        ...pedido,
        client: clientsRes.data.find(c => c.id === pedido.id_cliente),
        product: pedido.produtos?.[0]
          ? productsRes.data.find(p => p.id === pedido.produtos[0].produto_id)
          : undefined,
        quantity: pedido.produtos?.[0].quantidade || 0,
      }));

      setOrders(pedidosComDetalhes);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Falha ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Criar novo pedido
  const handleCreateOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'client' | 'product'>) => {
    console.log('Criando pedido com dados:', orderData)
    try {
      const payload = {
        id_cliente: orderData.clientId,
        produtos: [
          {
            produto_id: orderData.productId,
            quantidade: orderData.quantity,
          }
        ],
      };

      await axios.post('http://localhost:8002/pedidos/', payload);
      await fetchAllData();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      alert('Erro ao criar pedido.');
    }
  };

  // Editar pedido existente
  const handleEditOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'client' | 'product'>) => {
    if (!editingOrder) return;

    try {
      const payload = {
        id_cliente: orderData.clientId,
        produtos: [
          {
            produto_id: orderData.productId,
            quantidade: orderData.quantity,
          }
        ],
      };

      await axios.put(`http://localhost:8002/pedidos/${editingOrder.id}`, payload);
      await fetchAllData();
      setEditingOrder(undefined);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Erro ao editar pedido:', error);
      alert('Erro ao editar pedido.');
    }
  };

  // Deletar pedido
  const handleDeleteOrder = async (orderId: string) => {
    try {
      await axios.delete(`http://localhost:8002/pedidos/${orderId}`);
      await fetchAllData();
    } catch (error) {
      console.error('Erro ao deletar pedido:', error);
      alert('Erro ao deletar pedido.');
    }
  };

  const openEditForm = (order: Order) => {
    setEditingOrder(order);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingOrder(undefined);
  };

  const columns = [
    { 
      key: 'client', 
      label: 'Cliente',
      render: (value: any, row: Order) => row.client?.name || 'Cliente não encontrado'
    },
    { 
      key: 'product', 
      label: 'Produto',
      render: (value: any, row: Order) => row.product?.nome || 'Produto não encontrado'
    },
    { key: 'quantity', label: 'Quantidade' },
    { 
      key: 'totalPrice', 
      label: 'Total',
      render: (value: number) => `R$ ${value.toFixed(2)}`
    },
    { 
      key: 'createdAt', 
      label: 'Data',
      render: (value: string) => new Date(value).toLocaleDateString('pt-BR')
    }
  ];

  const renderActions = (order: Order) => (
    <div className="flex space-x-2">
      <Button
        size="sm"
        variant="secondary"
        onClick={() => openEditForm(order)}
      >
        <Edit className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="danger"
        onClick={() => handleDeleteOrder(order.id)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-600 mt-2">
            Gerencie todos os pedidos da sua loja
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Pedido
        </Button>
      </div>

      {loading && <p>Carregando dados...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          data={orders}
          actions={renderActions}
        />
      </div>

      <OrderForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingOrder ? handleEditOrder : handleCreateOrder}
        clients={clients}
        products={products}
        initialData={editingOrder}
      />
    </div>
  );
};

export default Orders;
