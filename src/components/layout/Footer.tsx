import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-muted py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <h3 className="text-lg font-bold text-primary mb-4">ChillMind</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Personalized mental health monitoring platform for students.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-muted-foreground hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-bold uppercase text-foreground mb-4">Navigation</h4>
          <ul className="space-y-2">
            <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary">Home</Link></li>
            <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About</Link></li>
            <li><Link href="/features" className="text-sm text-muted-foreground hover:text-primary">Features</Link></li>
            <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-sm font-bold uppercase text-foreground mb-4">Legal</h4>
          <ul className="space-y-2">
            <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link></li>
            <li><Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary">Cookie Policy</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-sm font-bold uppercase text-foreground mb-4">Contact</h4>
          <ul className="space-y-2">
            <li className="text-sm text-muted-foreground">Email: info@chillmind.app</li>
            <li className="text-sm text-muted-foreground">Support: support@chillmind.app</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-12 pt-6 border-t border-muted-foreground/20">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CC25-CF133 Capstone Team. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer; 