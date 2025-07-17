import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Shop', href: '/products' },
    { label: 'Learn', href: '/learn' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100"
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">GSI</span>
            </div>
            <span className="text-xl font-bold text-gray-900">GSI Orders</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-brand-primary transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
            {/* Add mega-menu dropdown */}
            <div className="group relative">
              <button className="flex items-center">Shop <ChevronDown size={16} /></button>
              <div className="absolute left-0 mt-2 hidden group-hover:block bg-white shadow-lg rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-bold">Categories</h4>
                    <ul>
                      <li><Link href="/products?category=flower">Flower</Link></li>
                      <li><Link href="/products?category=edibles">Edibles</Link></li>
                      {/* Add more categories */}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold">Brands</h4>
                    <ul>
                      <li><Link href="/liquidheaven">Liquid Heaven</Link></li>
                      <li><Link href="/motaquila">Motaquila</Link></li>
                      <li><Link href="/lastgenie">Last Genie</Link></li>
                    </ul>
                  </div>
                  <div>
                    <img src="/images/shop-promo.jpg" alt="Featured Promo" className="rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="p-2 text-gray-600 hover:text-brand-primary transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m4.5 0h6m-6 0a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 100 2 1 1 0 000-2z" />
              </svg>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-brand-primary"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 text-gray-600 hover:text-brand-primary hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 