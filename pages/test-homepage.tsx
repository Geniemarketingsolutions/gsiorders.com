import React from 'react';

const TestHomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Test Homepage</h1>
      
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Brand Cards Test</h2>
        
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="border-2 border-gray-300 p-6 rounded-lg">
            <div className="w-16 h-16 bg-green-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🌿</span>
            </div>
            <h3 className="text-center font-semibold">Liquid Heaven</h3>
            <p className="text-center text-sm text-gray-600">Test brand 1</p>
          </div>
          
          <div className="border-2 border-gray-300 p-6 rounded-lg">
            <div className="w-16 h-16 bg-pink-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🍹</span>
            </div>
            <h3 className="text-center font-semibold">Motaquila</h3>
            <p className="text-center text-sm text-gray-600">Test brand 2</p>
          </div>
          
          <div className="border-2 border-gray-300 p-6 rounded-lg">
            <div className="w-16 h-16 bg-purple-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-center font-semibold">Last Genie</h3>
            <p className="text-center text-sm text-gray-600">Test brand 3</p>
          </div>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <p className="text-sm">This is a test page to verify layout. The brand icons should be 64x64px (w-16 h-16) squares, not giant circles.</p>
        </div>
      </div>
    </div>
  );
};

export default TestHomePage; 