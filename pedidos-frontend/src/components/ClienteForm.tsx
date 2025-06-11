import { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import api from '../utils/api';
import { ClienteCreate } from '../types/cliente';

interface ClienteFormProps {
  initialData?: ClienteCreate;
  clienteId?: number;
}

export default function ClienteForm({ initialData, clienteId }: ClienteFormProps) {
  const [formData, setFormData] = useState<ClienteCreate>(initialData || { nome: '', email: '' });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (clienteId) {
        await api.put(`/clientes/${clienteId}`, formData);
      } else {
        await api.post('/cliente/', formData);
      }
      router.push('/clientes');
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h6">{clienteId ? 'Editar' : 'Novo'} Cliente</Typography>
      
      <TextField
        label="Nome"
        fullWidth
        margin="normal"
        value={formData.nome}
        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
        required
      />
      
      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Salvar
      </Button>
    </Box>
  );
}