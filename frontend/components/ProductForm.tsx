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
    nome: '',
    descricao: '',
    preco: '',
    estoque: '',
    ativo: true,
    categoria: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome,
        descricao: initialData.descricao || '',
        preco: initialData.preco.toString(),
        estoque: initialData.estoque?.toString() || '',
        ativo: true, 
        categoria: ''
      });
    } else {
      setFormData({
        nome: '',
        descricao: '',
        preco: '',
        estoque: '',
        ativo: true,
        categoria: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.preco || parseFloat(formData.preco) <= 0) newErrors.preco = 'Preço inválido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        nome: formData.nome,
        descricao: formData.descricao,
        preco: parseFloat(formData.preco),
        estoque: formData.estoque ? parseInt(formData.estoque) : 0,
      });
      onClose();
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
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
          value={formData.nome}
          onChange={(e) => handleChange('nome', e.target.value)}
          error={errors.nome}
        />
        <Input
          label="Descrição"
          value={formData.descricao}
          onChange={(e) => handleChange('descricao', e.target.value)}
        />
        <Input
          label="Preço"
          type="number"
          step="0.01"
          value={formData.preco}
          onChange={(e) => handleChange('preco', e.target.value)}
          error={errors.preco}
        />
        <Input
          label="Estoque"
          type="number"
          value={formData.estoque}
          onChange={(e) => handleChange('estoque', e.target.value)}
        />
        <Input
          label="Categoria"
          value={formData.categoria}
          onChange={(e) => handleChange('categoria', e.target.value)}
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
