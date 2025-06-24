'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Client } from '@/types';
import Table from '@/components/Table';
import Button from '@/components/Button';
import ClientForm from '@/components/ClientForm';

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([
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

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>();

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Telefone' }
  ];

  const handleCreateClient = (clientData: Omit<Client, 'id'>) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString()
    };
    setClients([...clients, newClient]);
  };

  const handleEditClient = (clientData: Omit<Client, 'id'>) => {
    if (editingClient) {
      setClients(clients.map(c => 
        c.id === editingClient.id 
          ? { ...clientData, id: editingClient.id }
          : c
      ));
      setEditingClient(undefined);
    }
  };

  const handleDeleteClient = (clientId: string) => {
    setClients(clients.filter(c => c.id !== clientId));
  };

  const openEditForm = (client: Client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingClient(undefined);
  };

  const renderActions = (client: Client) => (
    <div className="flex space-x-2">
      <Button
        size="sm"
        variant="secondary"
        onClick={() => openEditForm(client)}
      >
        <Edit className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="danger"
        onClick={() => handleDeleteClient(client.id)}
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
            <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
            <p className="text-gray-600 mt-2">
              Gerencie sua base de clientes
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          data={clients}
          actions={renderActions}
        />
      </div>

      <ClientForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingClient ? handleEditClient : handleCreateClient}
        initialData={editingClient}
      />
    </div>
  );
};

export default Clients;