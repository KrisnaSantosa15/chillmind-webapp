"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';
import { useAuth } from '@/lib/authContext';
import Image from 'next/image';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const isHomePage = pathname === '/';

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="ChillMind Logo" width={32} height={32} className="h-10 w-auto" />
          <span className="ml-2 text-xl font-bold text-primary">ChillMind</span>
        </Link>
      </div>
      <nav className={`hidden md:flex items-center space-x-8`}>
        <NavLink href="#hero" id="hero">Home</NavLink>
        <NavLink href="#features" id="features">Features</NavLink>
        <NavLink href="#how-it-works" id="how-it-works">How It Works</NavLink>
        <NavLink href="#testimonials" id="testimonials">Testimonials</NavLink>
        <NavLink href="#tips" id="tips">Tips</NavLink>
        <NavLink href="#faq" id="faq">FAQ</NavLink>
      </nav>
        {/* Desktop navigation buttons/controls */}
      <div className="hidden md:flex items-center space-x-4">
        <ThemeToggle />
        
        {user ? (
          <div className="relative">
            <button 
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-medium text-sm">
                  {user.displayName ? user.displayName.split(' ').map(n => n[0]).join('') : user.email?.charAt(0) || 'U'}
                </span>
              </div>
              <span className="font-medium">
                {user.displayName ? user.displayName.split(' ')[0] : 'User'}
              </span>
            </button>
            
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-background rounded-md shadow-lg py-1 z-10 border border-muted">
                <Link href="/dashboard" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">
                  Dashboard
                </Link>
                <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">
                  Profile
                </Link>
                <div className="border-t border-muted my-1"></div>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
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
          </>
        )}
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
        <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md shadow-lg p-6 md:hidden flex flex-col space-y-4 border-t border-muted">          {isHomePage ? (
            <>
              <a 
                href="#hero" 
                onClick={(e) => scrollToSection(e, 'hero')}
                className="text-foreground hover:text-primary transition-colors py-2"
              >
                Home
              </a>
              <a 
                href="#features" 
                onClick={(e) => scrollToSection(e, 'features')}
                className="text-foreground hover:text-primary transition-colors py-2"
              >
                Features
              </a>              <a 
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
                href="#tips" 
                onClick={(e) => scrollToSection(e, 'tips')}
                className="text-foreground hover:text-primary transition-colors py-2"
              >
                Tips
              </a>
              <a 
                href="#faq" 
                onClick={(e) => scrollToSection(e, 'faq')}
                className="text-foreground hover:text-primary transition-colors py-2"
              >
                FAQ
              </a>
            </>          ) : (
            <>
              <Link 
                href="/#hero"
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/#features"
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>              <Link 
                href="/#how-it-works"
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link 
                href="/#tips"
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tips
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
          {user ? (
            <>              <Link href="/dashboard" className="py-2" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">
                  Dashboard
                </Button>
              </Link>
              <div className="py-2 w-full">
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign Out
                </Button>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header; 