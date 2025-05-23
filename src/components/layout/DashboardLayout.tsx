"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ThemeToggle from '../ui/ThemeToggle';
import { useAuth } from '@/lib/authContext';
import Image from 'next/image';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);
  const [profilePanelOpen, setProfilePanelOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();

  const toggleNotifPanel = () => {
    setNotifPanelOpen(!notifPanelOpen);
    setProfilePanelOpen(false);
  };

  const toggleProfilePanel = () => {
    setProfilePanelOpen(!profilePanelOpen);
    setNotifPanelOpen(false);
  };
  
  // Helper function to check if the link is active
  const isActive = (path: string) => {
    if (path === '/dashboard' && pathname === '/dashboard') {
      return true;
    }
    if (path !== '/dashboard' && pathname?.startsWith(path)) {
      return true;
    }
    return false;
  };
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - hidden on mobile */}
      <div className={`fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity md:hidden ${
        mobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`} onClick={() => setMobileSidebarOpen(false)}></div>
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-muted transform transition-transform md:translate-x-0 md:relative ${
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full w-64">
          <div className="flex items-center justify-center h-16 px-4 bg-primary">
            <Link href="/" className="text-xl font-bold text-primary">
            <div className="flex items-center">
          <Image src="/logo.png" alt="ChillMind Logo" width={32} height={32} className="h-10 w-auto" />
          <span className="ml-2 text-xl font-bold text-white">ChillMind</span>
            </div>
            </Link>
          </div>
          <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
            <nav className="space-y-1">
              <Link
                href="/dashboard"
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive('/dashboard') 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 mr-3 ${isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground'}`}>
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Dashboard
              </Link>
              <Link
                href="/dashboard/journal"
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive('/dashboard/journal') 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 mr-3 ${isActive('/dashboard/journal') ? 'text-primary' : 'text-muted-foreground'}`}>
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Journal
              </Link>
              <Link
                href="/dashboard/progress"
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive('/dashboard/progress') 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 mr-3 ${isActive('/dashboard/progress') ? 'text-primary' : 'text-muted-foreground'}`}>
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
                Progress
              </Link>
              <Link
                href="/dashboard/ai-assistant"
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive('/dashboard/ai-assistant') 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <i className={`fas fa-robot h-5 w-5 mr-3 ${isActive('/dashboard/ai-assistant') ? 'text-primary' : 'text-muted-foreground'}`}></i>
                AI Assistant
              </Link>              <Link
                href="/dashboard/resources"
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive('/dashboard/resources') 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 mr-3 ${isActive('/dashboard/resources') ? 'text-primary' : 'text-muted-foreground'}`}>
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>
                Resources
              </Link>
              <Link
                href="/dashboard/find-psychologist"
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive('/dashboard/find-psychologist') 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 mr-3 ${isActive('/dashboard/find-psychologist') ? 'text-primary' : 'text-muted-foreground'}`}>
                  <circle cx="12" cy="8" r="5" />
                  <path d="M20 21a8 8 0 0 0-16 0" />
                </svg>
                Find Psychologist
              </Link>
            </nav>            <div className="mt-auto pt-6">
              <div className="p-4 bg-primary/10 rounded-lg">
                <h3 className="text-sm font-medium text-primary">
                  Need urgent help?
                </h3>
                <p className="mt-1 text-xs text-primary/70">
                  Contact a mental health professional immediately.
                </p>
                <button
                  className="mt-3 w-full px-3 py-2 text-xs font-medium text-center text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
                >
                  Emergency Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <div
          className="flex items-center justify-between h-16 px-4 bg-background border-b border-muted"
        >
          <div className="flex items-center">
            <button 
              className="md:hidden text-foreground focus:outline-none"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <i className="fas fa-bars h-6 w-6"></i>
            </button>
            <h1 className="ml-4 text-lg font-medium text-foreground">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="relative">
              <button
                onClick={toggleNotifPanel}
                className="p-1 text-muted-foreground rounded-full hover:text-foreground focus:outline-none relative"
              >
                <i className="fas fa-bell h-6 w-6"></i>
                <span
                  className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full"
                ></span>
              </button>
              
              {notifPanelOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-background rounded-md shadow-lg py-1 z-10 border border-muted">
                  <div className="px-4 py-2 border-b border-muted">
                    <h3 className="text-sm font-medium text-foreground">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <div
                            className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600"
                          >
                            <i className="fas fa-check text-xs"></i>
                          </div>
                        </div>
                        <div className="ml-2">
                          <p>Your daily check-in is ready</p>
                          <p className="text-xs text-muted-foreground">2 minutes ago</p>
                        </div>
                      </div>
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <div
                            className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"
                          >
                            <i className="fas fa-book text-xs"></i>
                          </div>
                        </div>
                        <div className="ml-2">
                          <p>New mindfulness exercise available</p>
                          <p className="text-xs text-muted-foreground">1 hour ago</p>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="px-4 py-2 border-t border-muted">
                    <a
                      href="#"
                      className="text-xs font-medium text-primary hover:text-primary/80"
                    >
                      View all notifications
                    </a>
                  </div>
                </div>
              )}
            </div>            <div className="relative">
              <button
                onClick={toggleProfilePanel}
                className="flex items-center focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-medium text-sm">
                    {user?.displayName ? user.displayName.split(' ').map(n => n[0]).join('') : user?.email?.charAt(0) || 'U'}
                  </span>
                </div>
                <span className="ml-2 text-sm font-medium text-foreground hidden sm:block">
                  {user?.displayName ? user.displayName.split(' ')[0] : 'User'}
                </span>
              </button>
              
              {profilePanelOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-background rounded-md shadow-lg py-1 z-10 border border-muted">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    Your Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    Settings
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    Achievements
                  </a>
                  <div className="border-t border-muted"></div>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-auto p-4 bg-background">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 