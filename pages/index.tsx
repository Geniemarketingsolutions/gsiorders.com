import React from 'react';
import Head from 'next/head';
import { MainNavbar, Footer, ErrorBoundary } from '../src/components';

const HomePage: React.FC = () => {
  return (
    <ErrorBoundary>
      <Head>
        <title>GSI Orders - Premium CBD & Wellness Products</title>
        <meta name="description" content="Premium CBD and wellness products from trusted brands" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <div className="min-h-screen bg-white">
        <MainNavbar />

        <main className="flex items-center justify-center min-h-screen">
          <div className="text-center p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              GSI Orders
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Ready for your comprehensive UI guide implementation
            </p>
            <div className="text-lg text-green-600 font-semibold">
              ✅ Homepage cleared - Ready for new implementation
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default HomePage; 