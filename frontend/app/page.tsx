import Link from 'next/link';
import { Package, Users, ShoppingCart, TrendingUp } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Package,
      title: 'Gerenciar Produtos',
      description: 'Cadastre e gerencie seus produtos com controle de estoque',
      href: '/produtos',
      color: 'bg-blue-500'
    },
    {
      icon: Users,
      title: 'Gerenciar Clientes',
      description: 'Mantenha seus clientes organizados com informações completas',
      href: '/clientes',
      color: 'bg-green-500'
    },
    {
      icon: ShoppingCart,
      title: 'Criar Pedidos',
      description: 'Processe pedidos de forma rápida e eficiente',
      href: '/pedidos',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Sistema de Pedidos Online
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Gerencie seus produtos, clientes e pedidos de forma simples e eficiente.
          Uma solução completa para seu negócio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Link
              key={index}
              href={feature.href}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 block"
            >
              <div className={`${feature.color} rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <TrendingUp className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Pronto para começar?
        </h2>
        <p className="text-gray-600 mb-6">
          Comece cadastrando seus produtos e clientes para processar seus primeiros pedidos.
        </p>
        <div className="space-x-4">
          <Link
            href="/produtos"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Cadastrar Produtos
          </Link>
          <Link
            href="/clientes"
            className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-900 font-medium rounded-md hover:bg-gray-300 transition-colors"
          >
            Cadastrar Clientes
          </Link>
        </div>
      </div>
    </div>
  );
}