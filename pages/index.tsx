import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import HeroSection from '../src/components/HeroSection';
import Navbar from '../src/components/Navbar';
// Removed Button import - using regular HTML buttons for now

interface FeaturedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  brand: string;
}

interface BrandShowcase {
  name: string;
  slug: string;
  description: string;
  color: string;
  gradient: string;
  image: string;
}

const HomePage: React.FC = () => {
  const router = useRouter();

  // Featured products data (mood.com style)
  const featuredProducts: FeaturedProduct[] = [
    {
      id: '1',
      name: 'Premium CBD Gummies',
      price: 29.99,
      image: '/api/placeholder/300/300',
      category: 'Edibles',
      description: 'Delicious fruit-flavored gummies infused with premium CBD',
      brand: 'liquidheaven'
    },
    {
      id: '2',
      name: 'Craft Cannabis Flower',
      price: 45.00,
      image: '/api/placeholder/300/300',
      category: 'Flower',
      description: 'Hand-selected premium cannabis flower',
      brand: 'motaquila'
    },
    {
      id: '3',
      name: 'CBD Wellness Tincture',
      price: 39.99,
      image: '/api/placeholder/300/300',
      category: 'Tinctures',
      description: 'Fast-acting CBD tincture for daily wellness',
      brand: 'lastgenie'
    },
    {
      id: '4',
      name: 'Artisan Pre-Rolls',
      price: 18.00,
      image: '/api/placeholder/300/300',
      category: 'Pre-Rolls',
      description: 'Expertly crafted pre-rolls for convenience',
      brand: 'liquidheaven'
    }
  ];

  // Brand showcase data
  const brands: BrandShowcase[] = [
    {
      name: 'Liquid Heaven',
      slug: 'liquidheaven',
      description: 'Premium wellness products for mind and body harmony',
      color: '#10b981',
      gradient: 'from-emerald-500 to-emerald-600',
      image: '/api/placeholder/400/300'
    },
    {
      name: 'Motaquila',
      slug: 'motaquila',
      description: 'Craft cannabis experiences with artisanal quality',
      color: '#ec4899',
      gradient: 'from-pink-500 to-pink-600',
      image: '/api/placeholder/400/300'
    },
    {
      name: 'Last Genie',
      slug: 'lastgenie',
      description: 'Innovative products for the modern cannabis enthusiast',
      color: '#6366f1',
      gradient: 'from-indigo-500 to-indigo-600',
      image: '/api/placeholder/400/300'
    }
  ];

  const categories = [
    { name: 'Flower', icon: '🌿', count: '120+ products', href: '/products?category=flower', image: '/images/category-flower.jpg' },
    { name: 'Edibles', icon: '🍯', count: '85+ products', href: '/products?category=edibles', image: '/images/category-edibles.jpg' },
    { name: 'Concentrates', icon: '💎', count: '45+ products', href: '/products?category=concentrates', image: '/images/category-concentrates.jpg' },
    { name: 'Topicals', icon: '🧴', count: '30+ products', href: '/products?category=topicals', image: '/images/category-topicals.jpg' },
    { name: 'Accessories', icon: '🔧', count: '60+ products', href: '/products?category=accessories', image: '/images/category-accessories.jpg' },
    { name: 'Wellness', icon: '🧘', count: '25+ products', href: '/products?category=wellness', image: '/images/category-wellness.jpg' }
  ];

  return (
    <>
      <Head>
        <title>GSI Orders - Premium Cannabis & Wellness Products</title>
        <meta 
          name="description" 
          content="Discover premium cannabis and wellness products from Liquid Heaven, Motaquila, and Last Genie. Quality, compliance, and exceptional customer service." 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50" data-testid="homepage">
        {/* Navigation */}
        <Navbar withMegaMenu />

        {/* Hero Section */}
        <section className="pt-16" data-testid="hero-section">
          <HeroSection
            title="Premium Cannabis & Wellness Products"
            subtitle="Discover our curated selection from trusted brands"
            backgroundImage="/images/hero-background.jpg"  // Add actual image path
            className="bg-cover bg-center min-h-[80vh]"
          />
        </section>

        {/* Featured Products Section */}
        <section className="py-16 bg-white" data-testid="featured-products">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Featured Products
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Hand-selected premium products from our curated collection
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div 
                  key={product.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  data-testid={`product-${product.id}`}
                >
                  <div className="relative rounded-xl overflow-hidden shadow-lg group">
                    <img src={product.image} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
                    <div className="p-4">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{product.category}</span>
                      <h3 className="mt-2 font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.description}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="font-bold">${product.price.toFixed(2)}</span>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add to Cart</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/products">
                <button 
                  className="border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  View All Products
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Shop by Category */}
        <section className="py-16 bg-gray-50" data-testid="shop-by-category">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="my-12">
              <h2 className="text-3xl font-bold text-center mb-6">Shop by Category</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((category) => (
                  <Link key={category.name} href={category.href} className="relative rounded-lg overflow-hidden group">
                    <img src={category.image} alt={category.name} className="w-full h-32 object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <span className="text-white font-semibold">{category.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Brand Showcase */}
        <section className="py-16 bg-white" data-testid="brand-showcase">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Our Premium Brands
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Curated collections from trusted partners
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {brands.map((brand) => (
                <Link
                  key={brand.slug}
                  href={`/${brand.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <div 
                      className={`h-48 bg-gradient-to-br ${brand.gradient} relative`}
                      style={{ '--brand-primary': brand.color } as React.CSSProperties}
                    >
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold">{brand.name}</h3>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <p className="text-gray-600 mb-4">{brand.description}</p>
                      <button 
                        className="w-full border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white group-hover:bg-brand-primary group-hover:text-white transition-colors px-6 py-3 rounded-lg font-semibold"
                        style={{ '--brand-primary': brand.color } as React.CSSProperties}
                      >
                        Shop {brand.name}
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Trust & Compliance */}
        <section className="py-16 bg-gray-900 text-white" data-testid="trust-compliance">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold sm:text-4xl">
                Quality You Can Trust
              </h2>
              <p className="mt-4 text-lg text-gray-300">
                100% compliant, lab-tested, and federally legal products
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Lab Tested</h3>
                <p className="text-gray-300">
                  Every product is rigorously tested for potency, purity, and safety
                </p>
              </div>

              <div className="p-6">
                <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure & Discreet</h3>
                <p className="text-gray-300">
                  Safe packaging and secure delivery to your door
                </p>
              </div>

              <div className="p-6">
                <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Customer First</h3>
                <p className="text-gray-300">
                  Dedicated support team and satisfaction guarantee
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-brand-primary" data-testid="newsletter-cta">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Stay in the Know
            </h2>
            <p className="mt-4 text-lg text-white/90">
              Get the latest products, deals, and cannabis education delivered to your inbox
            </p>
            
            <div className="mt-8 max-w-md mx-auto">
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white/30 focus:outline-none"
                />
                <button 
                  className="bg-white text-brand-primary hover:bg-gray-100 font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-white/75 mt-3">
                By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12" data-testid="footer">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              
              {/* Company Info */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">GSI</span>
                  </div>
                  <span className="text-2xl font-bold">GSI Orders</span>
                </div>
                <p className="text-gray-400 mb-4 max-w-md">
                  Your trusted source for premium cannabis and wellness products. 
                  Quality, compliance, and customer satisfaction guaranteed.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <span className="sr-only">Facebook</span>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <span className="sr-only">Instagram</span>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.348-1.051-2.348-2.348c0-1.297 1.051-2.348 2.348-2.348c1.297 0 2.348 1.051 2.348 2.348C10.797 15.937 9.746 16.988 8.449 16.988z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <span className="sr-only">Twitter</span>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors">Shop All</Link></li>
                  <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                  <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                  <li><Link href="/learn" className="text-gray-400 hover:text-white transition-colors">Education</Link></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><Link href="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                  <li><Link href="/shipping" className="text-gray-400 hover:text-white transition-colors">Shipping Info</Link></li>
                  <li><Link href="/returns" className="text-gray-400 hover:text-white transition-colors">Returns</Link></li>
                  <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 mt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 text-sm">
                  © 2025 GSI Orders. All rights reserved.
                </p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <span className="text-sm text-gray-400">🔒 SSL Secured</span>
                  <span className="text-sm text-gray-400">✅ Lab Tested</span>
                  <span className="text-sm text-gray-400">🚚 Free Shipping</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage; 