import React from 'react';
import Head from 'next/head';

const CleanHomePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>GSI Orders - Clean Homepage</title>
        <meta name="description" content="Clean homepage without CSS conflicts" />
      </Head>

      <div style={{ minHeight: '100vh', backgroundColor: 'white', padding: '2rem' }}>
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            GSI Orders
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#666' }}>
            Premium CBD & Wellness Products
          </p>
        </header>

        {/* Brand Section */}
        <section style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
            Shop by Brand
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {/* Liquid Heaven */}
            <div style={{ 
              border: '1px solid #e5e5e5', 
              borderRadius: '8px', 
              padding: '2rem',
              textAlign: 'center',
              backgroundColor: '#f9f9f9'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#10b981',
                borderRadius: '8px',
                margin: '0 auto 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                🌿
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Liquid Heaven
              </h3>
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                Premium CBD wellness products
              </p>
              <button style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.5rem 1.5rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem'
              }}>
                Shop Now
              </button>
            </div>

            {/* Motaquila */}
            <div style={{ 
              border: '1px solid #e5e5e5', 
              borderRadius: '8px', 
              padding: '2rem',
              textAlign: 'center',
              backgroundColor: '#f9f9f9'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#ec4899',
                borderRadius: '8px',
                margin: '0 auto 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                🍹
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Motaquila
              </h3>
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                Craft beverages and premium products
              </p>
              <button style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.5rem 1.5rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem'
              }}>
                Shop Now
              </button>
            </div>

            {/* Last Genie */}
            <div style={{ 
              border: '1px solid #e5e5e5', 
              borderRadius: '8px', 
              padding: '2rem',
              textAlign: 'center',
              backgroundColor: '#f9f9f9'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#8b5cf6',
                borderRadius: '8px',
                margin: '0 auto 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                ✨
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Last Genie
              </h3>
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                Specialty wellness products
              </p>
              <button style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.5rem 1.5rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem'
              }}>
                Shop Now
              </button>
            </div>
          </div>
        </section>

        {/* Info Box */}
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '1.5rem',
          backgroundColor: '#e5e7eb',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0 }}>
            This is a clean homepage using inline styles to avoid any CSS conflicts. 
            The brand boxes should be normal sized cards with 80x80px icons.
          </p>
        </div>
      </div>
    </>
  );
};

export default CleanHomePage; 