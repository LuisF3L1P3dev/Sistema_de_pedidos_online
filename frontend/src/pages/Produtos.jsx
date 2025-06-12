import { useState, useEffect } from 'react';

export default function Produtos() {
  const [idEditando, setIdEditando] = useState(null);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [produtos, setProdutos] = useState([]);

  const carregarProdutos = async () => {
    try {
      const response = await fetch('http://localhost:8000/produtos');
      const data = await response.json();
      setProdutos(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const limparFormulario = () => {
    setIdEditando(null);
    setNome('');
    setDescricao('');
    setPreco('');
    setEstoque('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const produtoData = {
      nome,
      descricao,
      preco: parseFloat(preco),
      estoque: estoque ? parseInt(estoque) : 0,
    };

    try {
      let response;
      if (idEditando) {
        response = await fetch(`http://localhost:8000/produtos/${idEditando}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(produtoData),
        });
      } else {
        response = await fetch('http://localhost:8000/produtos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(produtoData),
        });
      }

      if (response.ok) {
        alert(idEditando ? 'Produto atualizado!' : 'Produto cadastrado!');
        limparFormulario();
        carregarProdutos();
      } else {
        const erro = await response.json();
        alert('Erro: ' + erro.detail);
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  const handleEditar = (produto) => {
    setIdEditando(produto.id);
    setNome(produto.nome);
    setDescricao(produto.descricao || '');
    setPreco(produto.preco.toString());
    setEstoque(produto.estoque?.toString() || '');
  };

  const handleDeletar = async (id) => {
    if (!window.confirm('Tem certeza que quer deletar este produto?')) return;

    try {
      const response = await fetch(`http://localhost:8000/produtos/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Produto deletado com sucesso!');
        if (idEditando === id) limparFormulario();
        carregarProdutos();
      } else {
        const erro = await response.json();
        alert('Erro ao deletar: ' + erro.detail);
      }
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
    }
  };

  return (
    <div>
      <h2>{idEditando ? 'Editar Produto' : 'Cadastrar Produto'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome do produto"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Preço"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Estoque"
          value={estoque}
          onChange={(e) => setEstoque(e.target.value)}
        />
        <button type="submit">{idEditando ? 'Atualizar' : 'Cadastrar'}</button>
        {idEditando && (
          <button type="button" onClick={limparFormulario} style={{ marginLeft: 8 }}>
            Cancelar
          </button>
        )}
      </form>

      <h3>Produtos Cadastrados</h3>
      <ul>
        {produtos.map((produto) => (
          <li key={produto.id}>
            {produto.nome} - R$ {produto.preco.toFixed(2)}{' '}
            <button onClick={() => handleEditar(produto)} style={{ marginLeft: 8 }}>
              Editar
            </button>
            <button
              onClick={() => handleDeletar(produto.id)}
              style={{ marginLeft: 8, color: 'red' }}
            >
              Deletar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
