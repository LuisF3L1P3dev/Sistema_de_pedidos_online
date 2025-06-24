'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Users, Package, Home } from 'lucide-react';

const Header = () => {
  const pathname = usePathname();

  const navigationItems = [
    { href: '/', label: 'Início', icon: Home },
    { href: '/produtos', label: 'Produtos', icon: Package },
    { href: '/clientes', label: 'Clientes', icon: Users },
    { href: '/pedidos', label: 'Pedidos', icon: ShoppingCart },
  ];

  return (
    <header className="bg-white shadow-md border-b-2 border-blue-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">Sistema de Pedidos</h1>
            </div>
            <nav className="hidden sm:flex space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;