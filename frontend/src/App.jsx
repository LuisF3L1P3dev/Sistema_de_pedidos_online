import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Produtos from './pages/Produtos';
import Clientes from './pages/Clientes';

export default function App() {
  return (
    <Router>
      <nav className="p-4 bg-gray-800 text-white flex gap-4">
        <Link to="/">Pedidos</Link>
        <Link to="/produtos">Produtos</Link>
        <Link to="/clientes">Clientes</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/clientes" element={<Clientes />} />
      </Routes>
    </Router>
  );
}
