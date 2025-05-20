"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import { useAuth } from '@/lib/authContext';
import { FirebaseError } from 'firebase/app';
import LoggedInRedirect from '@/components/auth/LoggedInRedirect';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (error: unknown) {
      console.error('Login error:', error);
      // Handle specific Firebase error codes
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
          setError('Invalid email or password. Please try again.');
        } else if (errorCode === 'auth/user-disabled') {
          setError('This account has been disabled. Please contact support.');
        } else if (errorCode === 'auth/too-many-requests') {
          setError('Too many failed login attempts. Please try again later or reset your password.');
        } else if (errorCode === 'auth/network-request-failed') {
          setError('Network error. Please check your internet connection and try again.');
        } else {
          setError(`Authentication error: ${errorCode}`);
        }
      } else {
        setError('Failed to sign in. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);

    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (error: unknown) {
      console.error('Google login error:', error);
      // Handle specific Firebase error codes for Google sign-in
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        if (errorCode === 'auth/popup-closed-by-user') {
          setError('Sign in was cancelled. Please try again.');
        } else if (errorCode === 'auth/popup-blocked') {
          setError('Sign in popup was blocked by your browser. Please allow popups for this site.');
        } else if (errorCode === 'auth/cancelled-popup-request') {
          setError('Sign in was cancelled. Please try again.');
        } else if (errorCode === 'auth/network-request-failed') {
          setError('Network error. Please check your internet connection and try again.');
        } else {
          setError(`Authentication error: ${errorCode}`);
        }
      } else {
        setError('Failed to sign in with Google. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };  return (
    <LoggedInRedirect>
      <Header />
      <main className="flex min-h-screen items-center justify-center px-6 py-24">
        <div className="w-full max-w-md rounded-lg border border-muted p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="mt-2 text-muted-foreground">
              Sign in to continue your mental wellness journey
            </p>
          </div><form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 text-red-500 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-foreground mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded border border-muted bg-background px-3 py-2 text-foreground"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full rounded border border-muted bg-background px-3 py-2 text-foreground"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <Button 
                variant="primary" 
                className="w-full"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="flex w-full items-center justify-center gap-3 rounded-md border border-muted bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted/50"
                disabled={isLoading}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {isLoading ? 'Signing in...' : 'Sign in with Google'}
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/onboarding"
              className="text-primary hover:underline"
            >
              Sign up
            </Link>          </p>
        </div>
      </main>
      <Footer />
    </LoggedInRedirect>
  );
}