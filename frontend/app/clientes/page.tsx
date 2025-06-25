'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Client } from '@/types';
import Table from '@/components/Table';
import Button from '@/components/Button';
import ClientForm from '@/components/ClientForm';

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>();

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'email', label: 'Email' },
  ];

  // Buscar clientes da API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('http://localhost:8001/cliente/');
        const data = await response.json();
        const formatted = data.map((c: any) => ({
          id: c.id,
          name: c.nome,
          email: c.email,
        }));
        setClients(formatted);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    fetchClients();
  }, []);

  const handleCreateClient = async (clientData: Omit<Client, 'id'>) => {
    try {
      const response = await fetch('http://localhost:8001/cliente/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: clientData.name,
          email: clientData.email,
        }),
      });

      if (!response.ok) throw new Error('Erro ao criar cliente');

      const novoCliente = await response.json();
      setClients((prev) => [
        ...prev,
        {
          id: novoCliente.id,
          name: novoCliente.nome,
          email: novoCliente.email,
        },
      ]);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
    }
  };

  const handleEditClient = async (clientData: Omit<Client, 'id'>) => {
    if (!editingClient) return;

    try {
      const response = await fetch(`http://localhost:8001/clientes/${editingClient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: clientData.name,
          email: clientData.email,
        }),
      });

      if (!response.ok) throw new Error('Erro ao editar cliente');

      const clienteAtualizado = await response.json();

      setClients((prev) =>
        prev.map((c) =>
          c.id === editingClient.id
            ? {
                id: clienteAtualizado.id,
                name: clienteAtualizado.nome,
                email: clienteAtualizado.email,
              }
            : c
        )
      );

      setEditingClient(undefined);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Erro ao editar cliente:', error);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Tem certeza que deseja deletar este cliente?')) return;

    try {
      const response = await fetch(`http://localhost:8001/cliente/${clientId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao deletar cliente');

      setClients((prev) => prev.filter((c) => c.id !== clientId));
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
    }
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
      <Button size="sm" variant="secondary" onClick={() => openEditForm(client)}>
        <Edit className="w-4 h-4" />
      </Button>
      <Button size="sm" variant="danger" onClick={() => handleDeleteClient(client.id)}>
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
            <p className="text-gray-600 mt-2">Gerencie sua base de clientes</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table columns={columns} data={clients} actions={renderActions} />
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
