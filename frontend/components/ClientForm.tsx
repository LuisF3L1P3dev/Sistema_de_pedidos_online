'use client';

import { useState, useEffect } from 'react';
import { Client } from '@/types';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (client: Omit<Client, 'id'>) => void;
  initialData?: Client;
}

const ClientForm = ({ isOpen, onClose, onSubmit, initialData }: ClientFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        name: formData.name,
        email: formData.email,
        phone: formData.phone
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
      title={initialData ? 'Editar Cliente' : 'Novo Cliente'}
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Nome"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={errors.name}
          placeholder="Digite o nome do cliente"
        />
        
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={errors.email}
          placeholder="cliente@email.com"
        />
        
        <Input
          label="Telefone"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          error={errors.phone}
          placeholder="(11) 99999-9999"
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

export default ClientForm;