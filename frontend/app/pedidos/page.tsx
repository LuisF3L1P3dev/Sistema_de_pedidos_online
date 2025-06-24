'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Order, Client, Product } from '@/types';
import Table from '@/components/Table';
import Button from '@/components/Button';
import OrderForm from '@/components/OrderForm';

const Orders = () => {
  const [clients] = useState<Client[]>([
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '(11) 99999-1234'
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@email.com',
      phone: '(11) 88888-5678'
    }
  ]);

  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Smartphone Samsung Galaxy',
      description: 'Smartphone com 128GB de armazenamento',
      price: 899.99,
      stock: 15
    },
    {
      id: '2',
      name: 'Notebook Dell Inspiron',
      description: 'Notebook para uso profissional',
      price: 2499.99,
      stock: 8
    }
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      clientId: '1',
      productId: '1',
      quantity: 2,
      totalPrice: 1799.98,
      createdAt: '2024-01-10T10:00:00Z',
      client: clients[0],
      product: products[0]
    }
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | undefined>();

  const columns = [
    { 
      key: 'client', 
      label: 'Cliente',
      render: (value: any, row: Order) => row.client?.name || 'Cliente não encontrado'
    },
    { 
      key: 'product', 
      label: 'Produto',
      render: (value: any, row: Order) => row.product?.name || 'Produto não encontrado'
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

  const handleCreateOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'client' | 'product'>) => {
    const client = clients.find(c => c.id === orderData.clientId);
    const product = products.find(p => p.id === orderData.productId);
    
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      client,
      product
    };
    
    setOrders([...orders, newOrder]);
  };

  const handleEditOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'client' | 'product'>) => {
    if (editingOrder) {
      const client = clients.find(c => c.id === orderData.clientId);
      const product = products.find(p => p.id === orderData.productId);
      
      setOrders(orders.map(o => 
        o.id === editingOrder.id 
          ? { 
              ...orderData, 
              id: editingOrder.id,
              createdAt: editingOrder.createdAt,
              client,
              product
            }
          : o
      ));
      setEditingOrder(undefined);
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders(orders.filter(o => o.id !== orderId));
  };

  const openEditForm = (order: Order) => {
    setEditingOrder(order);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingOrder(undefined);
  };

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
      <div className="mb-8">
        <div className="flex justify-between items-center">
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
      </div>

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