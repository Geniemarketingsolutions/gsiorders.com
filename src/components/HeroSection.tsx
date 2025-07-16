'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { CheckIcon, ShieldCheckIcon, BeakerIcon } from '@heroicons/react/24/solid';

interface HeroSectionProps {
  /** Custom CSS classes */
  className?: string;
  /** Primary call-to-action button text */
  primaryCtaText?: string;
  /** Secondary call-to-action button text */  
  secondaryCtaText?: string;
  /** Primary CTA click handler */
  onPrimaryClick?: () => void;
  /** Secondary CTA click handler */
  onSecondaryClick?: () => void;
  /** Override legal compliance text */
  legalText?: string;
  /** Show trust indicators */
  showTrustIndicators?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  className = '',
  primaryCtaText = 'Shop Now',
  secondaryCtaText = 'Learn More',
  onPrimaryClick,
  onSecondaryClick,
  legalText = '100% Federally Legal',
  showTrustIndicators = true
}) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const trustIndicators = [
    {
      icon: BeakerIcon,
      text: 'Lab Tested',
      description: 'Third-party verified'
    },
    {
      icon: ShieldCheckIcon,
      text: 'FDA Compliant',
      description: 'Meets federal standards'
    },
    {
      icon: CheckIcon,
      text: 'Premium Quality',
      description: 'American-grown hemp'
    }
  ];

  const handlePrimaryClick = () => {
    if (onPrimaryClick) {
      onPrimaryClick();
    } else {
      // Default behavior - scroll to products
      const productsSection = document.getElementById('products-section');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSecondaryClick = () => {
    if (onSecondaryClick) {
      onSecondaryClick();
    } else {
      // Default behavior - scroll to education section
      const learnSection = document.getElementById('education-section');
      if (learnSection) {
        learnSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section 
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}
      data-testid="hero-section"
      role="banner"
      aria-labelledby="hero-heading"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-brand-primary/10 rounded-full blur-3xl"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-accent/10 rounded-full blur-3xl"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Legal Compliance Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium"
            data-testid="legal-badge"
          >
            <CheckIcon className="w-4 h-4 mr-2" aria-hidden="true" />
            <span>{legalText}</span>
          </motion.div>

          {/* Main Heading */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 
              id="hero-heading"
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight"
              data-testid="hero-heading"
            >
              <span className="block bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent bg-clip-text text-transparent">
                Premium CBD &
              </span>
              <span className="block text-gray-900 mt-2">
                Wellness Products
              </span>
            </h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              data-testid="hero-subtitle"
            >
              Experience the power of <strong>Amrit water-soluble technology</strong> for 
              enhanced bioavailability and faster absorption
            </motion.p>
          </motion.div>

          {/* Trust Indicators */}
          {showTrustIndicators && (
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-6 sm:gap-8 py-8"
              data-testid="trust-indicators"
              role="list"
              aria-label="Trust indicators"
            >
              {trustIndicators.map((indicator, index) => (
                <motion.div
                  key={indicator.text}
                  variants={itemVariants}
                  className="flex flex-col items-center space-y-2 min-w-[120px]"
                  role="listitem"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <indicator.icon 
                      className="w-8 h-8 text-brand-primary" 
                      aria-hidden="true"
                    />
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 text-sm">
                      {indicator.text}
                    </div>
                    <div className="text-xs text-gray-500">
                      {indicator.description}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Call to Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
            data-testid="cta-buttons"
          >
            <Button
              size="lg"
              onClick={handlePrimaryClick}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 min-w-[160px]"
              data-testid="primary-cta"
              aria-label={`${primaryCtaText} - Shop our premium CBD products`}
            >
              {primaryCtaText}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={handleSecondaryClick}
              className="border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 min-w-[160px]"
              data-testid="secondary-cta"
              aria-label={`${secondaryCtaText} - Learn about our products and technology`}
            >
              {secondaryCtaText}
            </Button>
          </motion.div>

          {/* Customer Trust Stats */}
          <motion.div
            variants={itemVariants}
            className="pt-12 border-t border-gray-200"
            data-testid="trust-stats"
          >
            <p className="text-sm text-gray-500 mb-4">
              Trusted by thousands of customers nationwide
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-brand-primary">825K+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-brand-primary">100%</div>
                <div className="text-sm text-gray-600">Lab Tested</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-brand-primary">24/7</div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        data-testid="scroll-indicator"
        aria-label="Scroll down for more content"
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection; 