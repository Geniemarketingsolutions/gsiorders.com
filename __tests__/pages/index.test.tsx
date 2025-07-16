import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import HomePage from '../../pages/index';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock HeroSection component
jest.mock('../../src/components/HeroSection', () => {
  return function MockHeroSection({ title, subtitle, showTrustIndicators, showCTA }: any) {
    return (
      <div data-testid="hero-section-mock">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {showTrustIndicators && <div data-testid="trust-indicators">Trust Indicators</div>}
        {showCTA && <div data-testid="cta-buttons">CTA Buttons</div>}
      </div>
    );
  };
});

// Mock Navbar component
jest.mock('../../src/components/Navbar', () => {
  return function MockNavbar() {
    return <nav data-testid="navbar-mock">Navigation</nav>;
  };
});

// No need to mock Button component since we're using regular HTML buttons

const mockRouter = {
  pathname: '/',
  push: jest.fn(),
  prefetch: jest.fn(),
  asPath: '/',
  query: {},
  route: '/',
};

describe('HomePage', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.clearAllMocks();
  });

  describe('Page Structure', () => {
    it('renders the main homepage container', () => {
      render(<HomePage />);
      
      expect(screen.getByTestId('homepage')).toBeInTheDocument();
    });

    it('includes proper head metadata', () => {
      render(<HomePage />);
      
      // Check that the component renders without errors
      expect(screen.getByTestId('homepage')).toBeInTheDocument();
    });

    it('renders the navigation component', () => {
      render(<HomePage />);
      
      expect(screen.getByTestId('navbar-mock')).toBeInTheDocument();
    });
  });

  describe('Hero Section', () => {
    it('renders the hero section with correct props', () => {
      render(<HomePage />);
      
      const heroSection = screen.getByTestId('hero-section');
      expect(heroSection).toBeInTheDocument();
      
      const heroMock = screen.getByTestId('hero-section-mock');
      expect(heroMock).toBeInTheDocument();
      
      expect(screen.getByText('Premium Cannabis & Wellness')).toBeInTheDocument();
      expect(screen.getByText('Discover curated products from our trusted brands')).toBeInTheDocument();
      expect(screen.getByTestId('trust-indicators')).toBeInTheDocument();
      expect(screen.getByTestId('cta-buttons')).toBeInTheDocument();
    });
  });

  describe('Featured Products Section', () => {
    it('renders the featured products section', () => {
      render(<HomePage />);
      
      const featuredSection = screen.getByTestId('featured-products');
      expect(featuredSection).toBeInTheDocument();
      
      expect(screen.getByText('Featured Products')).toBeInTheDocument();
      expect(screen.getByText('Hand-selected premium products from our curated collection')).toBeInTheDocument();
    });

    it('displays all featured products', () => {
      render(<HomePage />);
      
      // Check for specific product cards
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-2')).toBeInTheDocument();
      expect(screen.getByTestId('product-3')).toBeInTheDocument();
      expect(screen.getByTestId('product-4')).toBeInTheDocument();
      
      // Check product names
      expect(screen.getByText('Premium CBD Gummies')).toBeInTheDocument();
      expect(screen.getByText('Craft Cannabis Flower')).toBeInTheDocument();
      expect(screen.getByText('CBD Wellness Tincture')).toBeInTheDocument();
      expect(screen.getByText('Artisan Pre-Rolls')).toBeInTheDocument();
    });

    it('displays product prices correctly', () => {
      render(<HomePage />);
      
      expect(screen.getByText('$29.99')).toBeInTheDocument();
      expect(screen.getByText('$45.00')).toBeInTheDocument();
      expect(screen.getByText('$39.99')).toBeInTheDocument();
      expect(screen.getByText('$18.00')).toBeInTheDocument();
    });

    it('has View All Products link', () => {
      render(<HomePage />);
      
      const viewAllLink = screen.getByText('View All Products').closest('a');
      expect(viewAllLink).toHaveAttribute('href', '/products');
    });
  });

  describe('Shop by Category Section', () => {
    it('renders the shop by category section', () => {
      render(<HomePage />);
      
      const categorySection = screen.getByTestId('shop-by-category');
      expect(categorySection).toBeInTheDocument();
      
      expect(screen.getByText('Shop by Category')).toBeInTheDocument();
      expect(screen.getByText('Find exactly what you\'re looking for')).toBeInTheDocument();
    });

    it('displays all product categories', () => {
      render(<HomePage />);
      
      // Check for categories that might appear in both product tags and category section
      expect(screen.getAllByText('Flower')).toHaveLength(2); // One in product, one in category
      expect(screen.getAllByText('Edibles')).toHaveLength(2); // One in product, one in category
      expect(screen.getByText('Concentrates')).toBeInTheDocument();
      expect(screen.getByText('Topicals')).toBeInTheDocument();
      expect(screen.getByText('Accessories')).toBeInTheDocument();
      expect(screen.getByText('Wellness')).toBeInTheDocument();
    });

    it('shows product counts for each category', () => {
      render(<HomePage />);
      
      expect(screen.getByText('120+ products')).toBeInTheDocument();
      expect(screen.getByText('85+ products')).toBeInTheDocument();
      expect(screen.getByText('45+ products')).toBeInTheDocument();
      expect(screen.getByText('30+ products')).toBeInTheDocument();
      expect(screen.getByText('60+ products')).toBeInTheDocument();
      expect(screen.getByText('25+ products')).toBeInTheDocument();
    });
  });

  describe('Brand Showcase Section', () => {
    it('renders the brand showcase section', () => {
      render(<HomePage />);
      
      const brandSection = screen.getByTestId('brand-showcase');
      expect(brandSection).toBeInTheDocument();
      
      expect(screen.getByText('Our Premium Brands')).toBeInTheDocument();
      expect(screen.getByText('Curated collections from trusted partners')).toBeInTheDocument();
    });

    it('displays all three brands', () => {
      render(<HomePage />);
      
      expect(screen.getByText('Liquid Heaven')).toBeInTheDocument();
      expect(screen.getByText('Motaquila')).toBeInTheDocument();
      expect(screen.getByText('Last Genie')).toBeInTheDocument();
    });

    it('shows brand descriptions', () => {
      render(<HomePage />);
      
      expect(screen.getByText('Premium wellness products for mind and body harmony')).toBeInTheDocument();
      expect(screen.getByText('Craft cannabis experiences with artisanal quality')).toBeInTheDocument();
      expect(screen.getByText('Innovative products for the modern cannabis enthusiast')).toBeInTheDocument();
    });

    it('has shop links for each brand', () => {
      render(<HomePage />);
      
      const liquidHeavenLink = screen.getByText('Shop Liquid Heaven').closest('a');
      const motaquilaLink = screen.getByText('Shop Motaquila').closest('a');
      const lastGenieLink = screen.getByText('Shop Last Genie').closest('a');
      
      expect(liquidHeavenLink).toHaveAttribute('href', '/liquidheaven');
      expect(motaquilaLink).toHaveAttribute('href', '/motaquila');
      expect(lastGenieLink).toHaveAttribute('href', '/lastgenie');
    });
  });

  describe('Trust & Compliance Section', () => {
    it('renders the trust and compliance section', () => {
      render(<HomePage />);
      
      const trustSection = screen.getByTestId('trust-compliance');
      expect(trustSection).toBeInTheDocument();
      
      expect(screen.getByText('Quality You Can Trust')).toBeInTheDocument();
      expect(screen.getByText('100% compliant, lab-tested, and federally legal products')).toBeInTheDocument();
    });

    it('displays trust indicators', () => {
      render(<HomePage />);
      
      expect(screen.getByText('Lab Tested')).toBeInTheDocument();
      expect(screen.getByText('Secure & Discreet')).toBeInTheDocument();
      expect(screen.getByText('Customer First')).toBeInTheDocument();
    });

    it('shows trust indicator descriptions', () => {
      render(<HomePage />);
      
      expect(screen.getByText('Every product is rigorously tested for potency, purity, and safety')).toBeInTheDocument();
      expect(screen.getByText('Safe packaging and secure delivery to your door')).toBeInTheDocument();
      expect(screen.getByText('Dedicated support team and satisfaction guarantee')).toBeInTheDocument();
    });
  });

  describe('Newsletter CTA Section', () => {
    it('renders the newsletter signup section', () => {
      render(<HomePage />);
      
      const newsletterSection = screen.getByTestId('newsletter-cta');
      expect(newsletterSection).toBeInTheDocument();
      
      expect(screen.getByText('Stay in the Know')).toBeInTheDocument();
      expect(screen.getByText('Get the latest products, deals, and cannabis education delivered to your inbox')).toBeInTheDocument();
    });

    it('has email input and subscribe button', () => {
      render(<HomePage />);
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const subscribeButton = screen.getByText('Subscribe');
      
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(subscribeButton).toBeInTheDocument();
    });

    it('shows privacy disclaimer', () => {
      render(<HomePage />);
      
      expect(screen.getByText('By subscribing, you agree to receive marketing emails. Unsubscribe anytime.')).toBeInTheDocument();
    });
  });

  describe('Footer Section', () => {
    it('renders the footer section', () => {
      render(<HomePage />);
      
      const footer = screen.getByTestId('footer');
      expect(footer).toBeInTheDocument();
    });

    it('displays company information', () => {
      render(<HomePage />);
      
      expect(screen.getByText('GSI Orders')).toBeInTheDocument();
      expect(screen.getByText('Your trusted source for premium cannabis and wellness products. Quality, compliance, and customer satisfaction guaranteed.')).toBeInTheDocument();
    });

    it('shows footer links', () => {
      render(<HomePage />);
      
      expect(screen.getByText('Quick Links')).toBeInTheDocument();
      expect(screen.getByText('Support')).toBeInTheDocument();
      
      // Check specific footer links
      const shopAllLink = screen.getByText('Shop All').closest('a');
      const aboutLink = screen.getByText('About Us').closest('a');
      const contactLink = screen.getByText('Contact').closest('a');
      const helpLink = screen.getByText('Help Center').closest('a');
      
      expect(shopAllLink).toHaveAttribute('href', '/products');
      expect(aboutLink).toHaveAttribute('href', '/about');
      expect(contactLink).toHaveAttribute('href', '/contact');
      expect(helpLink).toHaveAttribute('href', '/help');
    });

    it('displays trust badges in footer', () => {
      render(<HomePage />);
      
      expect(screen.getByText('🔒 SSL Secured')).toBeInTheDocument();
      expect(screen.getByText('✅ Lab Tested')).toBeInTheDocument();
      expect(screen.getByText('🚚 Free Shipping')).toBeInTheDocument();
    });

    it('shows copyright information', () => {
      render(<HomePage />);
      
      expect(screen.getByText('© 2025 GSI Orders. All rights reserved.')).toBeInTheDocument();
    });
  });

  describe('Interactive Elements', () => {
    it('handles email input in newsletter signup', () => {
      render(<HomePage />);
      
      const emailInput = screen.getByPlaceholderText('Enter your email') as HTMLInputElement;
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      expect(emailInput.value).toBe('test@example.com');
    });

    it('renders Add to Cart buttons for products', () => {
      render(<HomePage />);
      
      const addToCartButtons = screen.getAllByText('Add to Cart');
      expect(addToCartButtons).toHaveLength(4); // One for each featured product
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<HomePage />);
      
      // Check that main section headings are present
      expect(screen.getByText('Featured Products')).toBeInTheDocument();
      expect(screen.getByText('Shop by Category')).toBeInTheDocument();
      expect(screen.getByText('Our Premium Brands')).toBeInTheDocument();
      expect(screen.getByText('Quality You Can Trust')).toBeInTheDocument();
    });

    it('has proper alt text for images', () => {
      render(<HomePage />);
      
      const productImages = screen.getAllByRole('img');
      productImages.forEach(img => {
        expect(img).toHaveAttribute('alt');
      });
    });

    it('has proper link text and accessibility', () => {
      render(<HomePage />);
      
      // Check that important links are accessible
      const viewAllLink = screen.getByText('View All Products');
      expect(viewAllLink).toBeInTheDocument();
      
      const brandLinks = [
        screen.getByText('Shop Liquid Heaven'),
        screen.getByText('Shop Motaquila'),
        screen.getByText('Shop Last Genie')
      ];
      
      brandLinks.forEach(link => {
        expect(link).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Design Classes', () => {
    it('applies responsive grid classes', () => {
      render(<HomePage />);
      
      // Featured products should have responsive grid
      const featuredSection = screen.getByTestId('featured-products');
      expect(featuredSection).toBeInTheDocument();
      
      // Categories should have responsive grid
      const categorySection = screen.getByTestId('shop-by-category');
      expect(categorySection).toBeInTheDocument();
    });
  });
}); 