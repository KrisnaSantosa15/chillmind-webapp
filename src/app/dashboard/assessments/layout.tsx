import React from 'react';

interface AssessmentsLayoutProps {
  children: React.ReactNode;
}

export default function AssessmentsLayout({ children }: AssessmentsLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto">
        {children}
      </main>
    </div>
  );
}