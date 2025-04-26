"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Get header height to offset scroll position
      const headerHeight = document.querySelector('header')?.offsetHeight || 0;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setMobileMenuOpen(false);
    }
  };

  // Create navigation link with proper handling for home page sections
  const NavLink = ({ href, id, children }: { href: string, id?: string, children: React.ReactNode }) => {
    if (isHomePage && id) {
      return (
        <a 
          href={href} 
          onClick={(e) => scrollToSection(e, id)}
          className="text-foreground hover:text-primary transition-colors"
        >
          {children}
        </a>
      );
    }
    
    return (
      <Link 
        href={`/${id ? '#' + id : href}`}
        className="text-foreground hover:text-primary transition-colors"
      >
        {children}
      </Link>
    );
  };

  return (
    <header className={`w-full py-4 px-6 md:px-12 flex items-center justify-between bg-background/80 backdrop-blur-sm fixed top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-md py-3' : ''}`}>
      <div className="flex items-center">
        <Link href="/" className="text-xl font-bold text-primary">
          ChillMind
        </Link>
      </div>
      
      <nav className={`hidden md:flex items-center space-x-8`}>
        <NavLink href="#features" id="features">Features</NavLink>
        <NavLink href="#how-it-works" id="how-it-works">How It Works</NavLink>
        <NavLink href="#testimonials" id="testimonials">Testimonials</NavLink>
        <NavLink href="#faq" id="faq">FAQ</NavLink>
      </nav>
      
      {/* Desktop navigation buttons/controls */}
      <div className="hidden md:flex items-center space-x-4">
        <ThemeToggle />
        <Link href="/auth/login">
          <Button variant="outline" size="sm">
            Login
          </Button>
        </Link>
        <Link href="/onboarding">
          <Button variant="primary" size="sm">
            Get Started
          </Button>
        </Link>
      </div>
      
      {/* Mobile navigation */}
      <div className="flex md:hidden items-center space-x-3">
        <ThemeToggle />
        
        {/* Mobile menu button */}
        <button 
          className="text-foreground p-1"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {mobileMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </>
            )}
          </svg>
        </button>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md shadow-lg p-6 md:hidden flex flex-col space-y-4 border-t border-muted">
          {isHomePage ? (
            <>
              <a 
                href="#features" 
                onClick={(e) => scrollToSection(e, 'features')}
                className="text-foreground hover:text-primary transition-colors py-2"
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                onClick={(e) => scrollToSection(e, 'how-it-works')}
                className="text-foreground hover:text-primary transition-colors py-2"
              >
                How It Works
              </a>
              <a 
                href="#testimonials" 
                onClick={(e) => scrollToSection(e, 'testimonials')}
                className="text-foreground hover:text-primary transition-colors py-2"
              >
                Testimonials
              </a>
              <a 
                href="#faq" 
                onClick={(e) => scrollToSection(e, 'faq')}
                className="text-foreground hover:text-primary transition-colors py-2"
              >
                FAQ
              </a>
            </>
          ) : (
            <>
              <Link 
                href="/#features"
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="/#how-it-works"
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link 
                href="/#testimonials"
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link 
                href="/#faq"
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
            </>
          )}
          
          {/* Login Button*/}
          <Link href="/auth/login" className="py-2" onClick={() => setMobileMenuOpen(false)}>
            <Button variant="outline" size="sm" className="w-full">
              Login
            </Button>
          </Link>
          
          {/* Get Started Button*/}
          <Link href="/onboarding" className="py-2" onClick={() => setMobileMenuOpen(false)}>
            <Button variant="primary" size="sm" className="w-full">
              Get Started
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header; 