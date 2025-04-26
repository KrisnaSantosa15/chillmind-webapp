import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';

export default function OnboardingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Begin Your Wellness Journey
            </h1>
            <p className="text-lg text-muted-foreground">
              Let&apos;s start with a quick assessment to understand your current mental state.
              This will help us personalize your experience.
            </p>
          </div>
          
          {/* Step Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  1
                </div>
                <span className="text-sm mt-2 text-primary font-medium">Introduction</span>
              </div>
              <div className="flex-1 h-1 mx-2 bg-muted">
                <div className="h-full bg-primary w-0"></div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">
                  2
                </div>
                <span className="text-sm mt-2 text-muted-foreground">Demographics</span>
              </div>
              <div className="flex-1 h-1 mx-2 bg-muted"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">
                  3
                </div>
                <span className="text-sm mt-2 text-muted-foreground">Depression</span>
              </div>
              <div className="flex-1 h-1 mx-2 bg-muted"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">
                  4
                </div>
                <span className="text-sm mt-2 text-muted-foreground">Anxiety</span>
              </div>
              <div className="flex-1 h-1 mx-2 bg-muted"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">
                  5
                </div>
                <span className="text-sm mt-2 text-muted-foreground">Stress</span>
              </div>
              <div className="flex-1 h-1 mx-2 bg-muted"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">
                  6
                </div>
                <span className="text-sm mt-2 text-muted-foreground">Results</span>
              </div>
            </div>
          </div>
          
          {/* Introduction Step */}
          <div className="bg-background border border-muted rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Welcome to ChillMind
            </h2>
            
            <p className="text-muted-foreground mb-8">
              We&apos;ll ask you questions based on clinically validated assessments:
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="p-4 bg-primary/10 rounded-lg">
                <h3 className="font-bold text-foreground mb-2">PHQ-9 Assessment</h3>
                <p className="text-sm text-muted-foreground">
                  Evaluates symptoms of depression over the past two weeks.
                </p>
              </div>
              
              <div className="p-4 bg-primary/10 rounded-lg">
                <h3 className="font-bold text-foreground mb-2">GAD-7 Assessment</h3>
                <p className="text-sm text-muted-foreground">
                  Measures anxiety symptoms and their impact on daily life.
                </p>
              </div>
              
              <div className="p-4 bg-primary/10 rounded-lg">
                <h3 className="font-bold text-foreground mb-2">PSS Assessment</h3>
                <p className="text-sm text-muted-foreground">
                  Evaluates your perceived stress levels over the past month.
                </p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-8">
              Your responses are private and secure. They help us provide personalized
              insights and recommendations. This assessment takes about 5-10 minutes to complete.
            </p>
            
            <div className="flex justify-between">
              <Link href="/">
                <Button variant="outline">
                  Go Back
                </Button>
              </Link>
              <Link href="/onboarding/demographics">
                <Button variant="primary">
                  Begin Assessment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}