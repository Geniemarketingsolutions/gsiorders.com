import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  MainNavbar,
  Footer,
  ErrorBoundary,
  ProductCard
} from '../src/components';

// Featured products data
const featuredProducts = [
  {
    id: '1',
    name: 'CBD Relief Gummies',
    price: 29.99,
    images: ['/images/placeholder-product.svg'],
    inventory_count: 45,
    brands: { name: 'Liquid Heaven', slug: 'liquidheaven' },
    rating: 4.8,
    isNew: false,
    isBestSeller: true,
    isLimitedEdition: false,
    category: 'wellness'
  },
  {
    id: '2', 
    name: 'Sleep Support Drops',
    price: 34.99,
    images: ['/images/placeholder-product.svg'],
    inventory_count: 32,
    brands: { name: 'Liquid Heaven', slug: 'liquidheaven' },
    rating: 4.7,
    isNew: true,
    isBestSeller: false,
    isLimitedEdition: false,
    category: 'wellness'
  },
  {
    id: '3',
    name: 'Energy Wellness Drink',
    price: 19.99,
    images: ['/images/placeholder-product.svg'],
    inventory_count: 28,
    brands: { name: 'Motaquila', slug: 'motaquila' },
    rating: 4.6,
    isNew: false,
    isBestSeller: false,
    isLimitedEdition: true,
    category: 'beverages'
  },
  {
    id: '4',
    name: 'Focus Capsules',
    price: 39.99,
    images: ['/images/placeholder-product.svg'],
    inventory_count: 18,
    brands: { name: 'Last Genie', slug: 'lastgenie' },
    rating: 4.9,
    isNew: true,
    isBestSeller: false,
    isLimitedEdition: false,
    category: 'wellness'
  }
];

// Mood-based categories inspired by mood.com
const moodCategories = [
  {
    name: 'Relief & Recovery',
    description: 'For pain relief and muscle recovery',
    icon: '🩹',
    gradient: 'from-emerald-500 to-teal-600',
    products: ['CBD Relief Gummies', 'Recovery Balm']
  },
  {
    name: 'Sleep & Relaxation', 
    description: 'For better rest and stress relief',
    icon: '😴',
    gradient: 'from-purple-500 to-indigo-600',
    products: ['Sleep Support Drops', 'Calm Capsules']
  },
  {
    name: 'Energy & Focus',
    description: 'For productivity and mental clarity',
    icon: '⚡',
    gradient: 'from-yellow-500 to-orange-600',
    products: ['Energy Drink', 'Focus Capsules']
  },
  {
    name: 'Mood & Wellness',
    description: 'For overall well-being and balance',
    icon: '🌟',
    gradient: 'from-pink-500 to-rose-600',
    products: ['Mood Gummies', 'Wellness Blend']
  }
];

const HomePage: React.FC = () => {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleShopByMood = (moodName: string) => {
    setSelectedMood(moodName);
    router.push(`/products?mood=${moodName.toLowerCase().replace(' & ', '-').replace(' ', '-')}`);
  };

  return (
    <ErrorBoundary>
      <Head>
        <title>GSI Orders - Premium CBD & Wellness Products | 100% Legal THC</title>
        <meta name="description" content="Shop premium CBD, Delta-8, and wellness products from trusted brands. Federally legal THC delivered discreetly to your door. Lab tested and farmer direct." />
        <meta name="keywords" content="CBD, Delta-8, THC, wellness, gummies, drops, cannabis, legal, lab tested" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <div className="min-h-screen bg-white">
        <MainNavbar />

        <main>
          {/* Hero Section - Inspired by mood.com */}
          <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="text-center space-y-8">
                <div className="space-y-4">
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold">
                    <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                      100% Federally Legal
                    </span>
                  </h1>
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
                    CBD & Wellness Products
                  </h2>
                </div>
                
                <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Premium quality from small U.S. farms. Discreet delivery ✦ No med card required ✦ Trusted by thousands
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                  <Button 
                    size="lg" 
                    className="text-xl px-12 py-6 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
                    onClick={() => router.push('/products')}
                  >
                    Shop Now
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="text-xl px-12 py-6 border-2 hover:bg-gray-50"
                    onClick={() => router.push('/liquidheaven')}
                  >
                    Learn More
                  </Button>
                </div>

                {/* Trust indicators */}
                <div className="grid grid-cols-3 gap-8 pt-12 text-center">
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">825K+</div>
                    <div className="text-sm text-gray-600">Happy Customers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">100%</div>
                    <div className="text-sm text-gray-600">Lab Tested</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">Legal</div>
                    <div className="text-sm text-gray-600">Federally Compliant</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Shop by Mood Section - Core mood.com feature */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                  Wellness for every need
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Find the perfect products for your specific wellness goals and lifestyle
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {moodCategories.map((mood, index) => (
                  <Card 
                    key={index}
                    className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-0 overflow-hidden"
                    onClick={() => handleShopByMood(mood.name)}
                  >
                    <CardContent className="p-0">
                      <div className={`h-32 bg-gradient-to-br ${mood.gradient} flex items-center justify-center relative overflow-hidden`}>
                        <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                          {mood.icon}
                        </span>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                          {mood.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {mood.description}
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full group-hover:bg-emerald-50 group-hover:border-emerald-200"
                        >
                          Shop {mood.name}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Products */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                  Customer Favorites
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Discover our most popular wellness products trusted by thousands
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    className="hover:shadow-2xl transition-all duration-300"
                  />
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-lg px-12 py-6 border-2 hover:bg-gray-50"
                  onClick={() => router.push('/products')}
                >
                  View All Products
                </Button>
              </div>
            </div>
          </section>

          {/* Brand Showcase */}
          <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                  Premium Partner Brands
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Carefully curated brands from trusted farmers and manufacturers
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Liquid Heaven */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 bg-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-4xl">🌿</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Liquid Heaven</h3>
                    <p className="text-gray-300 mb-6">Premium CBD wellness products with advanced Amrit water-soluble technology</p>
                    <Button 
                      variant="outline" 
                      className="border-white text-white hover:bg-white hover:text-gray-900"
                      onClick={() => router.push('/liquidheaven')}
                    >
                      Explore Liquid Heaven
                    </Button>
                  </CardContent>
                </Card>

                {/* Motaquila */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 bg-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-4xl">🍹</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Motaquila</h3>
                    <p className="text-gray-300 mb-6">Craft beverages and premium wellness drinks for the modern lifestyle</p>
                    <Button 
                      variant="outline" 
                      className="border-white text-white hover:bg-white hover:text-gray-900"
                      onClick={() => router.push('/motaquila')}
                    >
                      Explore Motaquila
                    </Button>
                  </CardContent>
                </Card>

                {/* Last Genie */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 bg-indigo-500 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-4xl">✨</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Last Genie</h3>
                    <p className="text-gray-300 mb-6">Innovative wellness solutions and specialty products for unique needs</p>
                    <Button 
                      variant="outline" 
                      className="border-white text-white hover:bg-white hover:text-gray-900"
                      onClick={() => router.push('/lastgenie')}
                    >
                      Explore Last Genie
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Why Choose GSI Orders - Trust Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                  Why Choose GSI Orders?
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Quality, compliance, and customer satisfaction in every order
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">🔬</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Lab Tested</h3>
                  <p className="text-gray-600">Third-party tested for purity, potency, and safety</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">⚖️</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">100% Legal</h3>
                  <p className="text-gray-600">Federally compliant and legally shipped nationwide</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">📦</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Discreet Delivery</h3>
                  <p className="text-gray-600">Private packaging delivered safely to your door</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Support</h3>
                  <p className="text-gray-600">Knowledgeable team ready to help with your wellness journey</p>
                </div>
              </div>

              {/* Legal compliance notice */}
              <div className="mt-16 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    100% Federally Legal - How is this possible?
                  </h3>
                  <p className="text-gray-600 max-w-4xl mx-auto">
                    Thanks to the 2018 Farm Bill, hemp-derived CBD and Delta-8 THC products containing less than 0.3% Delta-9 THC are federally legal. 
                    All GSI Orders products are meticulously produced to meet these strict legal standards and undergo third-party testing for compliance.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default HomePage; 