import { useState, useEffect } from 'react';

export default function Clientes() {
  const [idEditando, setIdEditando] = useState(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [clientes, setClientes] = useState([]);

  const carregarClientes = async () => {
    try {
      const response = await fetch('http://localhost:8001/cliente/');
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const limparFormulario = () => {
    setIdEditando(null);
    setNome('');
    setEmail('');
    setTelefone('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clienteData = {
      nome,
      email,
      telefone,
    };

    try {
      let response;
      if (idEditando) {
        response = await fetch(`http://localhost:8001/clientes/${idEditando}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clienteData),
        });
      } else {
        response = await fetch('http://localhost:8001/cliente/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clienteData),
        });
      }

      if (response.ok) {
        alert(idEditando ? 'Cliente atualizado!' : 'Cliente cadastrado!');
        limparFormulario();
        carregarClientes();
      } else {
        const erro = await response.json();
        alert('Erro: ' + erro.detail);
      }
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  };

  const handleEditar = (cliente) => {
    setIdEditando(cliente.id);
    setNome(cliente.nome);
    setEmail(cliente.email);
    setTelefone(cliente.telefone || '');
  };

  const handleDeletar = async (id) => {
    if (!window.confirm('Tem certeza que quer deletar este cliente?')) return;

    try {
      const response = await fetch(`http://localhost:8001/cliente/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Cliente deletado com sucesso!');
        if (idEditando === id) limparFormulario();
        carregarClientes();
      } else {
        const erro = await response.json();
        alert('Erro ao deletar: ' + erro.detail);
      }
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
    }
  };

  return (
    <div>
      <h2>{idEditando ? 'Editar Cliente' : 'Cadastrar Cliente'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Telefone"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
        />
        <button type="submit">{idEditando ? 'Atualizar' : 'Cadastrar'}</button>
        {idEditando && (
          <button type="button" onClick={limparFormulario} style={{ marginLeft: 8 }}>
            Cancelar
          </button>
        )}
      </form>

      <h3>Clientes Cadastrados</h3>
      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.id}>
            {cliente.nome} - {cliente.email}{' '}
            <button onClick={() => handleEditar(cliente)} style={{ marginLeft: 8 }}>
              Editar
            </button>
            <button
              onClick={() => handleDeletar(cliente.id)}
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
