import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeroSection from '../../src/components/HeroSection';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock Heroicons
jest.mock('@heroicons/react/24/solid', () => ({
  CheckIcon: (props: any) => <svg data-testid="check-icon" {...props} />,
  ShieldCheckIcon: (props: any) => <svg data-testid="shield-check-icon" {...props} />,
  BeakerIcon: (props: any) => <svg data-testid="beaker-icon" {...props} />,
}));

// Mock scrollIntoView
const mockScrollIntoView = jest.fn();
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: mockScrollIntoView,
  writable: true,
});

describe('HeroSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<HeroSection />);
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    });

    it('renders with default props', () => {
      render(<HeroSection />);
      
      expect(screen.getByTestId('hero-heading')).toBeInTheDocument();
      expect(screen.getByText('Premium CBD &')).toBeInTheDocument();
      expect(screen.getByText('Wellness Products')).toBeInTheDocument();
      expect(screen.getByText('100% Federally Legal')).toBeInTheDocument();
      expect(screen.getByText('Shop Now')).toBeInTheDocument();
      expect(screen.getByText('Learn More')).toBeInTheDocument();
    });

    it('renders custom legal text when provided', () => {
      render(<HeroSection legalText="Custom Legal Message" />);
      expect(screen.getByText('Custom Legal Message')).toBeInTheDocument();
    });

    it('renders custom CTA button text when provided', () => {
      render(
        <HeroSection 
          primaryCtaText="Buy Now" 
          secondaryCtaText="Discover More" 
        />
      );
      
      expect(screen.getByText('Buy Now')).toBeInTheDocument();
      expect(screen.getByText('Discover More')).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
      render(<HeroSection className="custom-class" />);
      expect(screen.getByTestId('hero-section')).toHaveClass('custom-class');
    });
  });

  describe('Trust Indicators', () => {
    it('renders trust indicators by default', () => {
      render(<HeroSection />);
      
      expect(screen.getByText('Lab Tested')).toBeInTheDocument();
      expect(screen.getByText('FDA Compliant')).toBeInTheDocument();
      expect(screen.getByText('Premium Quality')).toBeInTheDocument();
      expect(screen.getByTestId('trust-indicators')).toBeInTheDocument();
    });

    it('hides trust indicators when showTrustIndicators is false', () => {
      render(<HeroSection showTrustIndicators={false} />);
      expect(screen.queryByTestId('trust-indicators')).not.toBeInTheDocument();
    });

    it('renders trust indicator icons', () => {
      render(<HeroSection />);
      
      expect(screen.getByTestId('beaker-icon')).toBeInTheDocument();
      expect(screen.getByTestId('shield-check-icon')).toBeInTheDocument();
      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    });
  });

  describe('Call-to-Action Buttons', () => {
    it('renders both CTA buttons', () => {
      render(<HeroSection />);
      
      expect(screen.getByTestId('primary-cta')).toBeInTheDocument();
      expect(screen.getByTestId('secondary-cta')).toBeInTheDocument();
    });

    it('calls onPrimaryClick when primary button is clicked', () => {
      const mockPrimaryClick = jest.fn();
      render(<HeroSection onPrimaryClick={mockPrimaryClick} />);
      
      fireEvent.click(screen.getByTestId('primary-cta'));
      expect(mockPrimaryClick).toHaveBeenCalledTimes(1);
    });

    it('calls onSecondaryClick when secondary button is clicked', () => {
      const mockSecondaryClick = jest.fn();
      render(<HeroSection onSecondaryClick={mockSecondaryClick} />);
      
      fireEvent.click(screen.getByTestId('secondary-cta'));
      expect(mockSecondaryClick).toHaveBeenCalledTimes(1);
    });

    it('scrolls to products section when primary button clicked without custom handler', () => {
      // Mock getElementById to return a mock element
      const mockElement = { scrollIntoView: mockScrollIntoView };
      jest.spyOn(document, 'getElementById').mockReturnValue(mockElement as any);
      
      render(<HeroSection />);
      fireEvent.click(screen.getByTestId('primary-cta'));
      
      expect(document.getElementById).toHaveBeenCalledWith('products-section');
      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    it('scrolls to education section when secondary button clicked without custom handler', () => {
      // Mock getElementById to return a mock element
      const mockElement = { scrollIntoView: mockScrollIntoView };
      jest.spyOn(document, 'getElementById').mockReturnValue(mockElement as any);
      
      render(<HeroSection />);
      fireEvent.click(screen.getByTestId('secondary-cta'));
      
      expect(document.getElementById).toHaveBeenCalledWith('education-section');
      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });
  });

  describe('Content Structure', () => {
    it('renders legal compliance badge', () => {
      render(<HeroSection />);
      expect(screen.getByTestId('legal-badge')).toBeInTheDocument();
    });

    it('renders hero heading with proper structure', () => {
      render(<HeroSection />);
      const heading = screen.getByTestId('hero-heading');
      expect(heading).toHaveProperty('tagName', 'H1');
      expect(heading).toHaveAttribute('id', 'hero-heading');
    });

    it('renders hero subtitle', () => {
      render(<HeroSection />);
      expect(screen.getByTestId('hero-subtitle')).toBeInTheDocument();
      expect(screen.getByText(/Amrit water-soluble technology/)).toBeInTheDocument();
    });

    it('renders trust statistics', () => {
      render(<HeroSection />);
      expect(screen.getByTestId('trust-stats')).toBeInTheDocument();
      expect(screen.getByText('825K+')).toBeInTheDocument();
      expect(screen.getByText('Happy Customers')).toBeInTheDocument();
    });

    it('renders scroll indicator', () => {
      render(<HeroSection />);
      expect(screen.getByTestId('scroll-indicator')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper banner role', () => {
      render(<HeroSection />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('has proper aria-labelledby for main heading', () => {
      render(<HeroSection />);
      const section = screen.getByTestId('hero-section');
      expect(section).toHaveAttribute('aria-labelledby', 'hero-heading');
    });

    it('has proper aria-labels for buttons', () => {
      render(<HeroSection />);
      
      const primaryButton = screen.getByTestId('primary-cta');
      const secondaryButton = screen.getByTestId('secondary-cta');
      
      expect(primaryButton).toHaveAttribute('aria-label', 'Shop Now - Shop our premium CBD products');
      expect(secondaryButton).toHaveAttribute('aria-label', 'Learn More - Learn about our products and technology');
    });

    it('has proper aria-hidden attributes for decorative icons', () => {
      render(<HeroSection />);
      
      const icons = screen.getAllByRole('img', { hidden: true });
      icons.forEach(icon => {
        expect(icon).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('has proper list structure for trust indicators', () => {
      render(<HeroSection />);
      
      const trustIndicators = screen.getByTestId('trust-indicators');
      expect(trustIndicators).toHaveAttribute('role', 'list');
      expect(trustIndicators).toHaveAttribute('aria-label', 'Trust indicators');
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3);
    });

    it('has proper scroll indicator aria-label', () => {
      render(<HeroSection />);
      
      const scrollIndicator = screen.getByTestId('scroll-indicator');
      expect(scrollIndicator).toHaveAttribute('aria-label', 'Scroll down for more content');
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive typography classes', () => {
      render(<HeroSection />);
      
      const heading = screen.getByTestId('hero-heading');
      expect(heading).toHaveClass('text-5xl', 'sm:text-6xl', 'lg:text-7xl');
    });

    it('applies responsive button layout classes', () => {
      render(<HeroSection />);
      
      const ctaButtons = screen.getByTestId('cta-buttons');
      expect(ctaButtons).toHaveClass('flex-col', 'sm:flex-row');
    });

    it('applies responsive padding classes', () => {
      render(<HeroSection />);
      
      const section = screen.getByTestId('hero-section');
      // Check that the inner container has responsive padding
      const container = section.querySelector('.max-w-7xl');
      expect(container).toHaveClass('px-4', 'sm:px-6', 'lg:px-8');
    });
  });

  describe('TypeScript Interface', () => {
    it('accepts all optional props without errors', () => {
      const props = {
        className: 'test-class',
        primaryCtaText: 'Custom Primary',
        secondaryCtaText: 'Custom Secondary',
        onPrimaryClick: jest.fn(),
        onSecondaryClick: jest.fn(),
        legalText: 'Custom Legal',
        showTrustIndicators: false
      };
      
      expect(() => render(<HeroSection {...props} />)).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('handles missing DOM elements gracefully in scroll functions', () => {
      jest.spyOn(document, 'getElementById').mockReturnValue(null);
      
      render(<HeroSection />);
      
      // Should not throw error when elements don't exist
      expect(() => {
        fireEvent.click(screen.getByTestId('primary-cta'));
        fireEvent.click(screen.getByTestId('secondary-cta'));
      }).not.toThrow();
    });
  });

  describe('Component Integration', () => {
    it('integrates with shadcn/ui Button component', () => {
      render(<HeroSection />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
      
      // Verify buttons have proper size attributes
      buttons.forEach(button => {
        expect(button).toHaveClass('min-w-[160px]');
      });
    });

    it('uses brand theming CSS classes', () => {
      render(<HeroSection />);
      
      // Check for brand-primary usage
      const elements = screen.getByTestId('hero-section');
      const htmlContent = elements.innerHTML;
      
      expect(htmlContent).toContain('bg-brand-primary');
      expect(htmlContent).toContain('text-brand-primary');
      expect(htmlContent).toContain('from-brand-primary');
    });
  });
});

describe('HeroSection Snapshot', () => {
  it('matches snapshot', () => {
    const { container } = render(<HeroSection />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with custom props', () => {
    const { container } = render(
      <HeroSection 
        className="custom-hero"
        primaryCtaText="Custom Primary"
        secondaryCtaText="Custom Secondary"
        legalText="Custom Legal Text"
        showTrustIndicators={false}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
}); 