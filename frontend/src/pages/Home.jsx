import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [novoPedido, setNovoPedido] = useState({
    id_cliente: '',
    produtos: [{ produto_id: '', quantidade: 1 }],
  });

  useEffect(() => {
    fetchPedidos();
    fetchClientes();
    fetchProdutos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const response = await axios.get('http://localhost:8002/pedidos/');
      setPedidos(response.data);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await axios.get('http://localhost:8001/cliente/');
      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  const fetchProdutos = async () => {
    try {
      const response = await axios.get('http://localhost:8000/produtos');
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const handleProdutoChange = (index, field, value) => {
    const updatedProdutos = [...novoPedido.produtos];
    updatedProdutos[index][field] = field === 'quantidade' ? parseInt(value) || 1 : value;
    setNovoPedido({ ...novoPedido, produtos: updatedProdutos });
  };

  const addProduto = () => {
    setNovoPedido({
      ...novoPedido,
      produtos: [...novoPedido.produtos, { produto_id: '', quantidade: 1 }],
    });
  };

  const removerProduto = (index) => {
    if (novoPedido.produtos.length <= 1) {
      alert('O pedido precisa ter pelo menos 1 produto.');
      return;
    }
    const produtosAtualizados = [...novoPedido.produtos];
    produtosAtualizados.splice(index, 1);
    setNovoPedido({ ...novoPedido, produtos: produtosAtualizados });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let total = 0;
      novoPedido.produtos.forEach(({ produto_id, quantidade }) => {
        const produto = produtos.find(p => p.id === parseInt(produto_id));
        if (produto && quantidade > 0) {
          total += produto.preco * quantidade;
        }
      });

      const payload = {
        id_cliente: parseInt(novoPedido.id_cliente),
        produtos: novoPedido.produtos.map(p => ({
          produto_id: parseInt(p.produto_id),
          quantidade: p.quantidade,
        })),
        total: total,
      };

      if (editandoId) {
        await axios.put(`http://localhost:8002/pedidos/${editandoId}`, payload);
      } else {
        await axios.post('http://localhost:8002/pedidos/', payload);
      }

      setNovoPedido({ id_cliente: '', produtos: [{ produto_id: '', quantidade: 1 }] });
      setEditandoId(null);
      fetchPedidos();
    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
      alert('Erro ao salvar pedido.');
    }
  };

  const handleEditar = (pedido) => {
    setEditandoId(pedido.id);
    setNovoPedido({
      id_cliente: pedido.id_cliente,
      produtos: pedido.produtos.map(p => ({
        produto_id: String(p.produto_id),
        quantidade: p.quantidade,
      })),
    });
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setNovoPedido({ id_cliente: '', produtos: [{ produto_id: '', quantidade: 1 }] });
  };

  const handleDeletar = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este pedido?')) {
      try {
        await axios.delete(`http://localhost:8002/pedidos/${id}`);
        fetchPedidos();
      } catch (error) {
        console.error('Erro ao deletar pedido:', error);
        alert('Erro ao deletar pedido.');
      }
    }
  };

  const getClienteNome = (id) => {
    const cliente = clientes.find(c => c.id === id);
    return cliente ? cliente.nome : `ID ${id}`;
  };

  const getProdutoNome = (id) => {
    const produto = produtos.find(p => p.id === id);
    return produto ? produto.nome : `ID ${id}`;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Pedidos</h1>

      {pedidos.length === 0 ? (
        <p className="text-gray-500">Nenhum pedido encontrado.</p>
      ) : (
        <ul className="mb-8">
          {pedidos.map((pedido) => (
            <li key={pedido.id} className="mb-2 p-2 border rounded flex justify-between items-center">
              <div>
                <strong>Cliente:</strong> {getClienteNome(pedido.id_cliente)} |{' '}
                <strong>Produtos:</strong>{' '}
                {Array.isArray(pedido.produtos)
                  ? pedido.produtos
                      .map(p => {
                        const nome = getProdutoNome(p.produto_id);
                        return `${nome} (x${p.quantidade})`;
                      })
                      .join(', ')
                  : 'Produtos inválidos'} |{' '}
                <strong>Total:</strong> R$ {pedido.total ? pedido.total.toFixed(2) : '0.00'}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditar(pedido)}
                  className="bg-yellow-400 text-black p-1 px-3 rounded hover:bg-yellow-500"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeletar(pedido.id)}
                  className="bg-red-500 text-white p-1 px-3 rounded hover:bg-red-600"
                >
                  Deletar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-xl font-semibold mb-2">
        {editandoId ? 'Editar Pedido' : 'Novo Pedido'}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <select
          name="id_cliente"
          value={novoPedido.id_cliente}
          onChange={(e) => setNovoPedido({ ...novoPedido, id_cliente: e.target.value })}
          className="p-2 border rounded"
          required
        >
          <option value="">Selecione o Cliente</option>
          {clientes.map(cliente => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nome}
            </option>
          ))}
        </select>

        {novoPedido.produtos.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <select
              value={item.produto_id}
              onChange={(e) => handleProdutoChange(index, 'produto_id', e.target.value)}
              className="p-2 border rounded flex-1"
              required
            >
              <option value="">Selecione o Produto</option>
              {produtos.map(produto => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={item.quantidade}
              onChange={(e) => handleProdutoChange(index, 'quantidade', e.target.value)}
              className="p-2 border rounded w-24"
              required
            />
            {editandoId !== null && novoPedido.produtos.length > 1 && (
              <button
                type="button"
                onClick={() => removerProduto(index)}
                className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                title="Remover Produto"
              >
                X
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addProduto}
          className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
        >
          Adicionar Produto
        </button>

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {editandoId ? 'Atualizar Pedido' : 'Cadastrar Pedido'}
        </button>

        {editandoId && (
          <button
            type="button"
            onClick={cancelarEdicao}
            className="bg-gray-300 text-black p-2 rounded hover:bg-gray-400"
          >
            Cancelar Edição
          </button>
        )}
      </form>
    </div>
  );
}
