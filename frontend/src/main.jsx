import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Produtos from './pages/Produtos';
import Clientes from './pages/Clientes';
import Home from './pages/Home';
import './index.css';

const App = () => (
  <BrowserRouter>
    <div className="p-4">
      <nav className="space-x-4 mb-6">
        <Link to="/" className="text-blue-600 hover:underline">Pedidos</Link>
        <Link to="/produtos" className="text-blue-600 hover:underline">Produtos</Link>
        <Link to="/clientes" className="text-blue-600 hover:underline">Clientes</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/clientes" element={<Clientes />} />
      </Routes>
    </div>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
