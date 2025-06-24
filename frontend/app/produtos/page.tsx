'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Product } from '@/types';
import Table from '@/components/Table';
import Button from '@/components/Button';
import ProductForm from '@/components/ProductForm';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Smartphone Samsung Galaxy',
      description: 'Smartphone com 128GB de armazenamento',
      price: 899.99,
      stock: 15
    },
    {
      id: '2',
      name: 'Notebook Dell Inspiron',
      description: 'Notebook para uso profissional',
      price: 2499.99,
      stock: 8
    }
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'description', label: 'Descrição' },
    { 
      key: 'price', 
      label: 'Preço',
      render: (value: number) => `R$ ${value.toFixed(2)}`
    },
    { key: 'stock', label: 'Estoque' }
  ];

  const handleCreateProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString()
    };
    setProducts([...products, newProduct]);
  };

  const handleEditProduct = (productData: Omit<Product, 'id'>) => {
    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...productData, id: editingProduct.id }
          : p
      ));
      setEditingProduct(undefined);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(undefined);
  };

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
      <div className="mb-8">
        <div className="flex justify-between items-center">
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
        initialData={editingProduct}
      />
    </div>
  );
};

export default Products;