'use client';

import { useState, useEffect } from 'react';
import { Order, Client, Product } from '@/types';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: Omit<Order, 'id' | 'createdAt' | 'client' | 'product'>) => void;
  clients: Client[];
  products: Product[];
  initialData?: Order;
}

const OrderForm = ({ isOpen, onClose, onSubmit, clients, products, initialData }: OrderFormProps) => {
  const [formData, setFormData] = useState({
    clientId: '',
    productId: '',
    quantity: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        clientId: initialData.clientId,
        productId: initialData.productId,
        quantity: initialData.quantity.toString()
      });
    } else {
      setFormData({
        clientId: '',
        productId: '',
        quantity: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  useEffect(() => {
    if (formData.productId) {
      const product = products.find(p => p.id === formData.productId);
      setSelectedProduct(product || null);
    } else {
      setSelectedProduct(null);
    }
  }, [formData.productId, products]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientId) newErrors.clientId = 'Cliente é obrigatório';
    if (!formData.productId) newErrors.productId = 'Produto é obrigatório';
    if (!formData.quantity || parseInt(formData.quantity) <= 0) newErrors.quantity = 'Quantidade deve ser maior que zero';
    
    if (selectedProduct && parseInt(formData.quantity) > selectedProduct.estoque) {
      newErrors.quantity = `Quantidade não pode ser maior que o estoque disponível (${selectedProduct.estoque})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate() && selectedProduct) {
      const quantity = parseInt(formData.quantity);
      const totalPrice = quantity * selectedProduct.preco;
      
      onSubmit({
        clientId: formData.clientId,
        productId: formData.productId,
        quantity,
        totalPrice
      });
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const totalPrice = selectedProduct && formData.quantity 
    ? parseInt(formData.quantity) * selectedProduct.preco
    : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Pedido' : 'Novo Pedido'}
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cliente
          </label>
          <select
            value={formData.clientId}
            onChange={(e) => handleInputChange('clientId', e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.clientId ? 'border-red-500' : ''
            }`}
          >
            <option value="">Selecione um cliente</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} - {client.email}
              </option>
            ))}
          </select>
          {errors.clientId && <p className="mt-1 text-sm text-red-600">{errors.clientId}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Produto
          </label>
          <select
            value={formData.productId}
            onChange={(e) => handleInputChange('productId', e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.productId ? 'border-red-500' : ''
            }`}
          >
            <option value="">Selecione um produto</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.nome} - R$ {product.preco.toFixed(2)} (Estoque: {product.estoque})
              </option>
            ))}
          </select>
          {errors.productId && <p className="mt-1 text-sm text-red-600">{errors.productId}</p>}
        </div>
        
        <Input
          label="Quantidade"
          type="number"
          value={formData.quantity}
          onChange={(e) => handleInputChange('quantity', e.target.value)}
          error={errors.quantity}
          placeholder="1"
        />

        {selectedProduct && formData.quantity && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-gray-700">
              <strong>Produto:</strong> {selectedProduct.nome}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Preço unitário:</strong> R$ {selectedProduct.preco.toFixed(2)}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Quantidade:</strong> {formData.quantity}
            </p>
            <p className="text-sm font-semibold text-blue-700">
              <strong>Total:</strong> R$ {totalPrice.toFixed(2)}
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            {initialData ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default OrderForm;