import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [pedidos, setPedidos] = useState([]);
  const [novoPedido, setNovoPedido] = useState({
    id_cliente: '',
    produtos: '',
    total: ''
  });

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const response = await axios.get('http://localhost:8002/pedidos/');
      setPedidos(response.data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };

  const handleChange = (e) => {
    setNovoPedido({ ...novoPedido, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...novoPedido,
        produtos: novoPedido.produtos.split(',').map(id => parseInt(id.trim())),
        total: parseFloat(novoPedido.total)
      };
      await axios.post('http://localhost:8002/pedidos/', payload);
      setNovoPedido({ id_cliente: '', produtos: '', total: '' });
      fetchPedidos();
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      alert('Erro ao criar pedido.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Pedidos</h1>
      <ul className="mb-8">
        {pedidos.map((pedido) => (
          <li key={pedido.id} className="mb-2 p-2 border rounded">
            <strong>ID:</strong> {pedido.id} | <strong>Cliente:</strong> {pedido.id_cliente} | 
            <strong> Produtos:</strong> {pedido.produtos.join(', ')} | <strong>Total:</strong> R$ {pedido.total.toFixed(2)}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Novo Pedido</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          type="number"
          name="id_cliente"
          value={novoPedido.id_cliente}
          onChange={handleChange}
          placeholder="ID do Cliente"
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="produtos"
          value={novoPedido.produtos}
          onChange={handleChange}
          placeholder="IDs dos Produtos (separados por vírgula)"
          className="p-2 border rounded"
          required
        />
        <input
          type="number"
          step="0.01"
          name="total"
          value={novoPedido.total}
          onChange={handleChange}
          placeholder="Valor Total"
          className="p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Cadastrar Pedido
        </button>
      </form>
    </div>
  );
}
