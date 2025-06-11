import { useState, useEffect } from 'react';
import { Button, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import api from '../../utils/api';
import { Cliente } from '../../types/cliente';

export default function ClienteList() {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    const response = await api.get('/clientes/');
    setClientes(response.data);
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/cliente/${id}`);
    loadClientes();
  };

  return (
    <Container>
      <h1>Clientes</h1>
      <Link href="/clientes/new" passHref>
        <Button variant="contained" startIcon={<AddIcon />}>Novo Cliente</Button>
      </Link>
      
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell>{cliente.id}</TableCell>
                <TableCell>{cliente.nome}</TableCell>
                <TableCell>{cliente.email}</TableCell>
                <TableCell>
                  <Link href={`/clientes/${cliente.id}`} passHref>
                    <Button size="small">Editar</Button>
                  </Link>
                  <Button size="small" color="error" onClick={() => handleDelete(cliente.id)}>
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}