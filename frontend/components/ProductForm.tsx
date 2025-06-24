'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<Product, 'id'>) => void;
  initialData?: Product;
}

const ProductForm = ({ isOpen, onClose, onSubmit, initialData }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price.toString(),
        stock: initialData.stock.toString()
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.description.trim()) newErrors.description = 'Descrição é obrigatória';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Preço deve ser maior que zero';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Estoque deve ser maior ou igual a zero';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Produto' : 'Novo Produto'}
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Nome"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={errors.name}
          placeholder="Digite o nome do produto"
        />
        
        <Input
          label="Descrição"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          error={errors.description}
          placeholder="Digite a descrição do produto"
        />
        
        <Input
          label="Preço"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => handleInputChange('price', e.target.value)}
          error={errors.price}
          placeholder="0.00"
        />
        
        <Input
          label="Estoque"
          type="number"
          value={formData.stock}
          onChange={(e) => handleInputChange('stock', e.target.value)}
          error={errors.stock}
          placeholder="0"
        />

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

export default ProductForm;