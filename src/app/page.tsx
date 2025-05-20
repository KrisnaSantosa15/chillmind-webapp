"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { useAuth } from '@/lib/authContext';

export default function Home() {
  const { user } = useAuth();
  return (
    <>
      <Header />
      <main className="flex flex-col min-h-screen">
        {/* Enhanced Hero Section */}
        <section id="hero" className="relative min-h-[90vh] flex items-center justify-center py-24 md:py-32 px-6 md:px-12 overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary-light/5 -z-20 pointer-events-none"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-[20%] right-[10%] w-64 h-64 rounded-full bg-primary/5 animate-pulse -z-10 pointer-events-none"></div>
          <div className="absolute bottom-[20%] left-[10%] w-48 h-48 rounded-full bg-secondary/5 animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} ></div>
          
          {/* Floating shapes - adding pointer-events-none to prevent blocking clicks */}
          <div className="absolute top-40 left-[20%] w-8 h-8 rounded-md bg-primary/10 animate-float pointer-events-none" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-32 right-[25%] w-12 h-12 rounded-full bg-secondary/10 animate-float pointer-events-none" style={{ animationDelay: '1.2s' }}></div>
          <div className="absolute top-[30%] left-[60%] w-10 h-10 rounded-lg rotate-45 bg-primary-light/10 animate-float pointer-events-none" style={{ animationDelay: '0.8s' }}></div>
          
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16">
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Your Mental Wellness <span className="text-primary">Journey</span> Starts Here
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl">
                ChillMind helps students monitor their mental health with
                personalized tracking, analysis, and recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center relative z-10">
                {user ? (
                  <Link href="/dashboard">
                    <Button variant="primary" size="lg" className="shadow-lg shadow-primary/20">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/onboarding">
                    <Button variant="primary" size="lg" className="shadow-lg shadow-primary/20">
                      Begin Your Journey
                    </Button>
                  </Link>
                )}
                <Link href="#features">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative h-80 md:h-[460px] w-full max-w-lg z-0">
              {/* Container for handling events/interactions */}
              <div className="absolute inset-0 z-10 rounded-2xl">
                {/* This is an empty div that will catch any click events and pass them through */}
              </div>
              {/* Abstract illustration container */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden backdrop-blur-sm border border-primary/10 p-4 pointer-events-none">
                {/* Center meditation image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
        <Image
                      src="/hero-image.jpg"
                      alt="Mental wellness illustration"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover rounded-xl mix-blend-overlay opacity-80"
          priority
        />
                  </div>
                </div>
                {/* Supporting UI elements */}
                <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-primary/10 animate-pulse pointer-events-none"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-secondary/10 animate-pulse pointer-events-none" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute top-1/2 -left-8 w-16 h-16 rounded-lg rotate-45 bg-primary-light/10 animate-float pointer-events-none"></div>
                <div className="absolute bottom-1/2 -right-8 w-20 h-20 rounded-full bg-secondary/10 animate-float pointer-events-none" style={{ animationDelay: '0.8s' }}></div>
                {/* Glowing border effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-primary/20 animate-pulse pointer-events-none"></div>
                {/* Floating particles */}
                <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-primary/30 animate-float pointer-events-none" style={{ animationDelay: '0.2s' }}></div>
                <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-secondary/30 animate-float pointer-events-none" style={{ animationDelay: '0.4s' }}></div>
                <div className="absolute top-1/3 right-1/3 w-2.5 h-2.5 rounded-full bg-primary-light/30 animate-float pointer-events-none" style={{ animationDelay: '0.6s' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-background rounded-xl shadow-sm transition-transform hover:scale-105">
                <h3 className="text-5xl font-bold text-primary mb-3">75%</h3>
                <p className="text-muted-foreground">of students experience mental health challenges</p>
              </div>
              <div className="text-center p-8 bg-background rounded-xl shadow-sm transition-transform hover:scale-105">
                <h3 className="text-5xl font-bold text-primary mb-3">85%</h3>
                <p className="text-muted-foreground">report reduced anxiety with regular tracking</p>
              </div>
              <div className="text-center p-8 bg-background rounded-xl shadow-sm transition-transform hover:scale-105">
                <h3 className="text-5xl font-bold text-primary mb-3">60%</h3>
                <p className="text-muted-foreground">improvement in stress management with personalized activities</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-16 text-center">
            How <span className="text-primary">ChillMind</span> Helps You
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 border border-muted rounded-xl bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-primary-light/30 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Smart Assessment</h3>
              <p className="text-muted-foreground">
                AI-powered analysis of standardized psychological measures to track your mental health.
              </p>
            </div>
            
            <div className="p-8 border border-muted rounded-xl bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-primary-light/30 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Journaling with Insights</h3>
              <p className="text-muted-foreground">
                Express yourself through guided journaling with sentiment analysis that reveals patterns.
              </p>
            </div>
            
            <div className="p-8 border border-muted rounded-xl bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-primary-light/30 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Personalized Activities</h3>
              <p className="text-muted-foreground">
                Get recommendations for activities specifically tailored to your mental health needs.
              </p>
            </div>
            
            <div className="p-8 border border-muted rounded-xl bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-primary-light/30 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Visualize your mental health journey over time with interactive charts and insights.
              </p>
            </div>
            
            <div className="p-8 border border-muted rounded-xl bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-primary-light/30 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M16 12h-6.5"></path>
                  <path d="M11 14.7l-2.7-2.7L11 9.3"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Daily Reminders</h3>
              <p className="text-muted-foreground">
                Get gentle nudges to check in with your mental health and practice self-care.
              </p>
            </div>
            
            <div className="p-8 border border-muted rounded-xl bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-primary-light/30 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Privacy-Focused</h3>
              <p className="text-muted-foreground">
                Your mental health data is private and secure, with full control over what you share.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 px-6 md:px-12 bg-muted/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-16 text-center">
              How It <span className="text-primary">Works</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-primary/80 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-8 shadow-lg shadow-primary/20">1</div>
                <h3 className="text-xl font-bold text-foreground mb-4">Take the Assessment</h3>
                <p className="text-muted-foreground">Complete our scientifically validated mental health questionnaires to establish your baseline.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-primary/80 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-8 shadow-lg shadow-primary/20">2</div>
                <h3 className="text-xl font-bold text-foreground mb-4">Get Personalized Insights</h3>
                <p className="text-muted-foreground">Our AI analyzes your responses to provide tailored recommendations and activities.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-primary/80 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-8 shadow-lg shadow-primary/20">3</div>
                <h3 className="text-xl font-bold text-foreground mb-4">Track Your Progress</h3>
                <p className="text-muted-foreground">Journal regularly and watch your mental wellbeing improve over time with visual progress tracking.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-16 text-center">
              What <span className="text-primary">Students</span> Say
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background p-8 rounded-xl border border-muted hover:shadow-lg transition-all duration-300">
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="mr-1 text-primary">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground mb-8 italic">
                  &ldquo;ChillMind helped me recognize patterns in my anxiety and gave me practical tools to manage it. The daily check-ins keep me accountable to my mental health.&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mr-4">
                    <span className="text-primary font-medium">KS</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Krisna S.</p>
                    <p className="text-sm text-muted-foreground">Software Engineering Student</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-background p-8 rounded-xl border border-muted hover:shadow-lg transition-all duration-300">
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="mr-1 text-primary">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground mb-8 italic">
                  &ldquo;As an engineering student with a heavy workload, I often neglected my mental health. ChillMind&rsquo;s reminders and quick activities fit perfectly into my busy schedule.&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mr-4">
                    <span className="text-primary font-medium">RH</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Rifdah H.</p>
                    <p className="text-sm text-muted-foreground">Engineering Student</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-background p-8 rounded-xl border border-muted hover:shadow-lg transition-all duration-300">
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="mr-1 text-primary">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  ))}
                </div>
                <p className="text-muted-foreground mb-8 italic">
                  &ldquo;The journaling feature with sentiment analysis helped me identify what triggers my stress. The personalized recommendations have been truly life-changing.&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mr-4">
                    <span className="text-primary font-medium">TE</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Tri Eva.</p>
                    <p className="text-sm text-muted-foreground">Medical Student</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Mental Health Tips Section */}
        <section id='tips' className="py-24 px-6 md:px-12 bg-primary/5">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-16 text-center">
              Quick Mental <span className="text-primary">Wellness</span> Tips
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-background p-8 rounded-xl border border-muted hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-6 text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                    <line x1="6" y1="1" x2="6" y2="4"></line>
                    <line x1="10" y1="1" x2="10" y2="4"></line>
                    <line x1="14" y1="1" x2="14" y2="4"></line>
                  </svg>
                </div>
                <h3 className="font-bold text-foreground mb-3">Stay Hydrated</h3>
                <p className="text-muted-foreground">Drinking enough water can significantly impact your mood and cognitive function.</p>
              </div>
              
              <div className="bg-background p-8 rounded-xl border border-muted hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-6 text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </div>
                <h3 className="font-bold text-foreground mb-3">Practice Self-Compassion</h3>
                <p className="text-muted-foreground">Treat yourself with the same kindness you would offer to a good friend.</p>
              </div>
              
              <div className="bg-background p-8 rounded-xl border border-muted hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-6 text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <h3 className="font-bold text-foreground mb-3">Reach Out</h3>
                <p className="text-muted-foreground">Don&rsquo;t hesitate to connect with friends, family, or professionals when you need support.</p>
              </div>
              
              <div className="bg-background p-8 rounded-xl border border-muted hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-6 text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="12" x2="2" y2="12"></line>
                    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                    <line x1="6" y1="16" x2="6.01" y2="16"></line>
                    <line x1="10" y1="16" x2="10.01" y2="16"></line>
                  </svg>
                </div>
                <h3 className="font-bold text-foreground mb-3">Unplug Regularly</h3>
                <p className="text-muted-foreground">Take breaks from technology to reduce stress and improve focus and sleep quality.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section*/}
        <section id="faq" className="py-24 px-6 md:px-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-16 text-center">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
            
            <Accordion className="space-y-4" defaultOpenId="faq-1">
              <AccordionItem title="Is my data private and secure?" id="faq-1">
                Yes! Your privacy is our top priority. All your personal data and journal entries are encrypted and stored securely. You have complete control over what information is shared and can export or delete your data at any time.
              </AccordionItem>
              
              <AccordionItem title="How often should I use ChillMind?" id="faq-2">
                For best results, we recommend using ChillMind daily for journaling and checking in with your mood. The assessments can be retaken every 2-4 weeks to track changes in your mental health over time.
              </AccordionItem>
              
              <AccordionItem title="Is ChillMind a substitute for professional mental health care?" id="faq-3">
                ChillMind is a supportive tool but not a replacement for professional care. If you&apos;re experiencing severe symptoms, please reach out to a mental health professional. We can help you track your progress, but diagnosis and treatment should come from qualified professionals.
              </AccordionItem>
              
              <AccordionItem title="How does the AI provide personalized recommendations?" id="faq-4">
                Our AI analyzes patterns in your assessment results, journal entries, and activity engagement to generate personalized recommendations. The more you use ChillMind, the more tailored these suggestions become to your specific needs and preferences.
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 md:px-12 bg-gradient-to-br from-primary/10 via-secondary/5 to-primary-light/10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Start Your Mental Wellness <span className="text-primary">Journey</span> Today
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
              Join thousands of students who are taking control of their mental health with ChillMind.
            </p>
            <Link href="/onboarding">
              <Button variant="primary" size="lg" className="shadow-lg mx-auto shadow-primary/20 text-lg px-8 py-6">
                Begin Your Journey
              </Button>
            </Link>
        </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
