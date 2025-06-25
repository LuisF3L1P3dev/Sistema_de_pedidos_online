'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Table from '@/components/Table';
import Button from '@/components/Button';
import ProductForm from '@/components/ProductForm';
import axios from 'axios';

interface Product {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  estoque?: number;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  // Carrega produtos da API real
  const fetchProducts = async () => {
    try {
      const res = await axios.get<Product[]>('http://localhost:8000/produtos');
      setProducts(res.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Criar produto via API
  const handleCreateProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      await axios.post('http://localhost:8000/produtos', productData);
      await fetchProducts();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      alert('Erro ao criar produto');
    }
  };

  // Editar produto via API
  const handleEditProduct = async (productData: Omit<Product, 'id'>) => {
    if (!editingProduct) return;
    try {
      await axios.put(`http://localhost:8000/produtos/${editingProduct.id}`, productData);
      await fetchProducts();
      setEditingProduct(undefined);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Erro ao editar produto:', error);
      alert('Erro ao editar produto');
    }
  };

  // Deletar produto via API
  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Tem certeza que quer deletar este produto?')) return;
    try {
      await axios.delete(`http://localhost:8000/produtos/${productId}`);
      await fetchProducts();
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      alert('Erro ao deletar produto');
    }
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(undefined);
  };

  const columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'descricao', label: 'Descrição' },
    {
      key: 'preco',
      label: 'Preço',
      render: (value: number) => `R$ ${value.toFixed(2)}`
    },
    { key: 'estoque', label: 'Estoque' }
  ];

  const renderActions = (product: Product) => (
    <div className="flex space-x-2">
      <Button
        size="sm"
        variant="secondary"
        onClick={() => openEditForm(product)}
      >
        <Edit className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="danger"
        onClick={() => handleDeleteProduct(product.id)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-600 mt-2">
            Gerencie o catálogo de produtos da sua loja
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          data={products}
          actions={renderActions}
        />
      </div>

      <ProductForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingProduct ? handleEditProduct : handleCreateProduct}
        // initialData={editingProduct}
      />
    </div>
  );
};

export default Products;
