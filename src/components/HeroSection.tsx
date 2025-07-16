import React from 'react';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  showTrustIndicators?: boolean;
  showCTA?: boolean;
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  showTrustIndicators = false,
  showCTA = false,
  className = ''
}) => {
  const trustIndicators = [
    { icon: '🧪', text: 'Lab Tested' },
    { icon: '🛡️', text: 'FDA Compliant' },
    { icon: '✅', text: 'Premium Quality' }
  ];

  return (
    <section 
      className={`relative bg-gradient-to-br from-brand-primary to-brand-secondary text-white py-20 lg:py-28 ${className}`}
      data-testid="hero-section"
    >
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {title}
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>

          {showTrustIndicators && (
            <div className="flex flex-wrap justify-center gap-6 mb-8" data-testid="trust-indicators">
              {trustIndicators.map((indicator, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
                >
                  <span className="text-2xl">{indicator.icon}</span>
                  <span className="font-medium">{indicator.text}</span>
                </div>
              ))}
            </div>
          )}

          {showCTA && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center" data-testid="cta-buttons">
              <button 
                className="bg-white text-brand-primary hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Shop Now
              </button>
              <button 
                className="border-2 border-white text-white hover:bg-white hover:text-brand-primary font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Learn More
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 