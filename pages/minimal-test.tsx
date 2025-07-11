import React from 'react';

const MinimalTestPage: React.FC = () => {
  return (
    <html>
      <head>
        <title>Minimal Test</title>
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: 'white' }}>
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
          <h1>Minimal Test Page</h1>
          <p>This page has no external dependencies or imports.</p>
          
          <div style={{ marginTop: '20px' }}>
            <h2>Test Elements:</h2>
            
            {/* Test small squares */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                backgroundColor: '#10b981', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '24px' }}>🌿</span>
              </div>
              
              <div style={{ 
                width: '80px', 
                height: '80px', 
                backgroundColor: '#ec4899', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '24px' }}>🍹</span>
              </div>
              
              <div style={{ 
                width: '80px', 
                height: '80px', 
                backgroundColor: '#6366f1', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '24px' }}>✨</span>
              </div>
            </div>
            
            <p style={{ marginTop: '20px' }}>
              Above should be three 80x80px squares with rounded corners (not circles).
            </p>
          </div>
        </div>
      </body>
    </html>
  );
};

export default MinimalTestPage; 