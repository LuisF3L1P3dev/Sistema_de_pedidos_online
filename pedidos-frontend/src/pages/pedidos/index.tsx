import { useState, useEffect } from 'react';
import { Button, Container, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import api from '../../utils/api';
import { Pedido } from '../../types/pedido';

const statusColors = {
  pendente: 'warning',
  processando: 'info',
  entregue: 'success',
  cancelado: 'error',
};

export default function PedidoList() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = async () => {
    const response = await api.get('/pedidos/');
    setPedidos(response.data);
  };

  return (
    <Container>
      <h1>Pedidos</h1>
      <Link href="/pedidos/new" passHref>
        <Button variant="contained" startIcon={<AddIcon />}>Novo Pedido</Button>
      </Link>
      
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Itens</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidos.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell>{pedido.id}</TableCell>
                <TableCell>{pedido.id_cliente}</TableCell>
                <TableCell>{pedido.itens.length} itens</TableCell>
                <TableCell>R$ {pedido.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip 
                    label={pedido.status} 
                    color={statusColors[pedido.status] as any} 
                  />
                </TableCell>
                <TableCell>
                  <Link href={`/pedidos/${pedido.id}`} passHref>
                    <Button size="small">Detalhes</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}