import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useCart } from '../../src/hooks/useCart';
import Navbar from '../../src/components/Navbar';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock useCart hook
jest.mock('../../src/hooks/useCart', () => ({
  useCart: jest.fn(),
}));

// Mock scrollTo and window.scrollY
Object.defineProperty(window, 'scrollY', {
  value: 0,
  writable: true,
});

const mockRouter = {
  pathname: '/',
  push: jest.fn(),
  prefetch: jest.fn(),
  asPath: '/',
};

const mockCart = {
  items: [],
  total: 0,
  itemCount: 0,
};

describe('Navbar', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useCart as jest.Mock).mockReturnValue({
      cart: mockCart,
    });
    
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
    });
    
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders the navbar with all main elements', () => {
      render(<Navbar />);
      
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByTestId('navbar-logo')).toBeInTheDocument();
      expect(screen.getByTestId('desktop-nav')).toBeInTheDocument();
      expect(screen.getByTestId('cart-icon')).toBeInTheDocument();
      expect(screen.getByTestId('user-menu')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-menu-toggle')).toBeInTheDocument();
    });

    it('displays the GSI Orders logo correctly', () => {
      render(<Navbar />);
      
      const logo = screen.getByLabelText('GSI Orders home');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('href', '/');
      
      expect(screen.getByText('GSI')).toBeInTheDocument();
      expect(screen.getByText('GSI Orders')).toBeInTheDocument();
    });

    it('renders all navigation items in desktop view', () => {
      render(<Navbar />);
      
      expect(screen.getByTestId('nav-shop')).toBeInTheDocument();
      expect(screen.getByTestId('nav-learn')).toBeInTheDocument();
      expect(screen.getByTestId('nav-about')).toBeInTheDocument();
      expect(screen.getByTestId('nav-contact')).toBeInTheDocument();
    });
  });

  describe('Cart Integration', () => {
    it('displays cart icon with no count when cart is empty', () => {
      render(<Navbar />);
      
      const cartIcon = screen.getByTestId('cart-icon');
      expect(cartIcon).toBeInTheDocument();
      expect(cartIcon).toHaveAttribute('href', '/cart');
      expect(cartIcon).toHaveAttribute('aria-label', 'Shopping cart with 0 items');
      
      expect(screen.queryByTestId('cart-count')).not.toBeInTheDocument();
    });

    it('displays cart count when items are present', () => {
      const cartWithItems = {
        items: [{ id: '1' }, { id: '2' }],
        total: 50,
        itemCount: 2,
      };
      
      (useCart as jest.Mock).mockReturnValue({
        cart: cartWithItems,
      });
      
      render(<Navbar />);
      
      const cartIcon = screen.getByTestId('cart-icon');
      expect(cartIcon).toHaveAttribute('aria-label', 'Shopping cart with 2 items');
      
      const cartCount = screen.getByTestId('cart-count');
      expect(cartCount).toBeInTheDocument();
      expect(cartCount).toHaveTextContent('2');
      expect(cartCount).toHaveAttribute('aria-label', '2 items in cart');
    });
  });

  describe('Mobile Menu Functionality', () => {
    it('toggles mobile menu when hamburger button is clicked', () => {
      render(<Navbar />);
      
      const toggleButton = screen.getByTestId('mobile-menu-toggle');
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
      
      fireEvent.click(toggleButton);
      
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
    });

    it('displays all navigation items in mobile menu', () => {
      render(<Navbar />);
      
      const toggleButton = screen.getByTestId('mobile-menu-toggle');
      fireEvent.click(toggleButton);
      
      expect(screen.getByTestId('mobile-nav-shop')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-nav-learn')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-nav-about')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-nav-contact')).toBeInTheDocument();
    });

    it('displays user menu options in mobile menu', () => {
      render(<Navbar />);
      
      const toggleButton = screen.getByTestId('mobile-menu-toggle');
      fireEvent.click(toggleButton);
      
      expect(screen.getByTestId('mobile-user-sign-in')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-user-create-account')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-user-my-orders')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-user-account-settings')).toBeInTheDocument();
    });

    it('closes mobile menu when clicking on a navigation item', () => {
      render(<Navbar />);
      
      const toggleButton = screen.getByTestId('mobile-menu-toggle');
      fireEvent.click(toggleButton);
      
      expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
      
      const shopLink = screen.getByTestId('mobile-nav-shop');
      fireEvent.click(shopLink);
      
      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
    });
  });

  describe('User Menu Functionality', () => {
    it('toggles user dropdown menu when user button is clicked', () => {
      render(<Navbar />);
      
      const userMenuTrigger = screen.getByTestId('user-menu-trigger');
      expect(userMenuTrigger).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByTestId('user-dropdown')).not.toBeInTheDocument();
      
      fireEvent.click(userMenuTrigger);
      
      expect(userMenuTrigger).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByTestId('user-dropdown')).toBeInTheDocument();
    });

    it('displays all user menu options in dropdown', () => {
      render(<Navbar />);
      
      const userMenuTrigger = screen.getByTestId('user-menu-trigger');
      fireEvent.click(userMenuTrigger);
      
      expect(screen.getByTestId('user-menu-sign-in')).toBeInTheDocument();
      expect(screen.getByTestId('user-menu-create-account')).toBeInTheDocument();
      expect(screen.getByTestId('user-menu-my-orders')).toBeInTheDocument();
      expect(screen.getByTestId('user-menu-account-settings')).toBeInTheDocument();
    });

    it('closes user dropdown when clicking on a menu item', () => {
      render(<Navbar />);
      
      const userMenuTrigger = screen.getByTestId('user-menu-trigger');
      fireEvent.click(userMenuTrigger);
      
      expect(screen.getByTestId('user-dropdown')).toBeInTheDocument();
      
      const signInLink = screen.getByTestId('user-menu-sign-in');
      fireEvent.click(signInLink);
      
      expect(screen.queryByTestId('user-dropdown')).not.toBeInTheDocument();
    });
  });

  describe('Active Route Highlighting', () => {
    it('highlights the home route when on homepage', () => {
      (useRouter as jest.Mock).mockReturnValue({
        ...mockRouter,
        pathname: '/',
      });
      
      render(<Navbar />);
      
      const shopLink = screen.getByTestId('nav-shop');
      expect(shopLink).not.toHaveClass('text-brand-primary');
    });

    it('highlights the products route when on products page', () => {
      (useRouter as jest.Mock).mockReturnValue({
        ...mockRouter,
        pathname: '/products',
      });
      
      render(<Navbar />);
      
      const shopLink = screen.getByTestId('nav-shop');
      expect(shopLink).toHaveClass('text-brand-primary');
    });

    it('highlights the learn route when on learn page', () => {
      (useRouter as jest.Mock).mockReturnValue({
        ...mockRouter,
        pathname: '/learn',
      });
      
      render(<Navbar />);
      
      const learnLink = screen.getByTestId('nav-learn');
      expect(learnLink).toHaveClass('text-brand-primary');
    });
  });

  describe('Scroll Effects', () => {
    it('applies scroll effect when page is scrolled', async () => {
      render(<Navbar />);
      
      const navbar = screen.getByTestId('navbar');
      expect(navbar).not.toHaveClass('bg-white/95');
      
      // Mock scroll event
      Object.defineProperty(window, 'scrollY', {
        value: 100,
        writable: true,
      });
      
      fireEvent.scroll(window);
      
      await waitFor(() => {
        expect(navbar).toHaveClass('bg-white/95');
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('closes mobile menu when Escape key is pressed', async () => {
      render(<Navbar />);
      
      const toggleButton = screen.getByTestId('mobile-menu-toggle');
      fireEvent.click(toggleButton);
      
      expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      await waitFor(() => {
        expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
      });
    });

    it('closes user dropdown when Escape key is pressed', async () => {
      render(<Navbar />);
      
      const userMenuTrigger = screen.getByTestId('user-menu-trigger');
      fireEvent.click(userMenuTrigger);
      
      expect(screen.getByTestId('user-dropdown')).toBeInTheDocument();
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      await waitFor(() => {
        expect(screen.queryByTestId('user-dropdown')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes for navigation', () => {
      render(<Navbar />);
      
      const navbar = screen.getByTestId('navbar');
      expect(navbar).toHaveAttribute('role', 'navigation');
      expect(navbar).toHaveAttribute('aria-label', 'Main navigation');
    });

    it('has proper ARIA attributes for mobile menu toggle', () => {
      render(<Navbar />);
      
      const toggleButton = screen.getByTestId('mobile-menu-toggle');
      expect(toggleButton).toHaveAttribute('aria-label', 'Toggle mobile menu');
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      expect(toggleButton).toHaveAttribute('aria-controls', 'mobile-menu');
    });

    it('has proper ARIA attributes for user menu', () => {
      render(<Navbar />);
      
      const userMenuTrigger = screen.getByTestId('user-menu-trigger');
      expect(userMenuTrigger).toHaveAttribute('aria-label', 'User account menu');
      expect(userMenuTrigger).toHaveAttribute('aria-expanded', 'false');
      expect(userMenuTrigger).toHaveAttribute('aria-haspopup', 'true');
    });

    it('has proper role attributes for dropdown menu', () => {
      render(<Navbar />);
      
      const userMenuTrigger = screen.getByTestId('user-menu-trigger');
      fireEvent.click(userMenuTrigger);
      
      const dropdown = screen.getByTestId('user-dropdown');
      expect(dropdown).toHaveAttribute('role', 'menu');
      expect(dropdown).toHaveAttribute('aria-orientation', 'vertical');
      
      const menuItems = dropdown.querySelectorAll('[role="menuitem"]');
      expect(menuItems).toHaveLength(4);
    });
  });

  describe('Responsive Design', () => {
    it('hides desktop navigation on mobile screens', () => {
      render(<Navbar />);
      
      const desktopNav = screen.getByTestId('desktop-nav');
      expect(desktopNav).toHaveClass('hidden', 'md:flex');
    });

    it('hides mobile menu toggle on desktop screens', () => {
      render(<Navbar />);
      
      const mobileToggle = screen.getByTestId('mobile-menu-toggle');
      expect(mobileToggle).toHaveClass('md:hidden');
    });

    it('shows mobile menu only when toggled', () => {
      render(<Navbar />);
      
      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
      
      const toggleButton = screen.getByTestId('mobile-menu-toggle');
      fireEvent.click(toggleButton);
      
      const mobileMenu = screen.getByTestId('mobile-menu');
      expect(mobileMenu).toBeInTheDocument();
      expect(mobileMenu).toHaveClass('md:hidden');
    });
  });

  describe('Custom Props', () => {
    it('applies custom className when provided', () => {
      render(<Navbar className="custom-navbar-class" />);
      
      const navbar = screen.getByTestId('navbar');
      expect(navbar).toHaveClass('custom-navbar-class');
    });

    it('works without custom className', () => {
      render(<Navbar />);
      
      const navbar = screen.getByTestId('navbar');
      expect(navbar).toBeInTheDocument();
    });
  });

  describe('Menu Interaction Behaviors', () => {
    it('closes user menu when mobile menu is opened', () => {
      render(<Navbar />);
      
      // Open user menu first
      const userMenuTrigger = screen.getByTestId('user-menu-trigger');
      fireEvent.click(userMenuTrigger);
      expect(screen.getByTestId('user-dropdown')).toBeInTheDocument();
      
      // Open mobile menu
      const mobileToggle = screen.getByTestId('mobile-menu-toggle');
      fireEvent.click(mobileToggle);
      
      // User menu should be closed
      expect(screen.queryByTestId('user-dropdown')).not.toBeInTheDocument();
      expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
    });

    it('closes mobile menu when user menu is opened', () => {
      render(<Navbar />);
      
      // Open mobile menu first
      const mobileToggle = screen.getByTestId('mobile-menu-toggle');
      fireEvent.click(mobileToggle);
      expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
      
      // Open user menu
      const userMenuTrigger = screen.getByTestId('user-menu-trigger');
      fireEvent.click(userMenuTrigger);
      
      // Mobile menu should be closed
      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
      expect(screen.getByTestId('user-dropdown')).toBeInTheDocument();
    });
  });
}); 