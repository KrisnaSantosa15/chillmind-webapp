'use client';

import React from 'react';
import Image from 'next/image';
import { List } from 'lucide-react';

interface MapComingSoonProps {
  onSwitchView: () => void;
}

export default function MapComingSoon({ onSwitchView }: MapComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="relative w-40 h-40 mb-6">
        <Image 
          src="/globe.svg" 
          alt="Map View Coming Soon" 
          width={160}
          height={160}
          className="object-contain"
        />
        {/* Animated elements */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary/70 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-primary/70 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-primary/70 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
      </div>
      
      <h2 className="text-2xl font-bold text-foreground mb-4">Interactive Map Coming Soon!</h2>
      
      <p className="text-muted-foreground mb-6 max-w-md">
        We&apos;re working on adding precise location data for all psychologists to provide you with an immersive map experience. You&apos;ll soon be able to find the perfect mental health professional near you!
      </p>
      
      <div className="text-sm p-4 bg-muted/50 rounded-lg max-w-md mb-6">
        <h3 className="font-medium mb-2 text-foreground">Features to look forward to:</h3>
        <ul className="text-muted-foreground text-left space-y-2">
          <li className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="m8 12 3 3 6-6"/>
            </svg>
            Find psychologists closest to your location
          </li>
          <li className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="m8 12 3 3 6-6"/>
            </svg>
            Filter by distance and travel time
          </li>
          <li className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="m8 12 3 3 6-6"/>
            </svg>
            Get directions to in-person consultations
          </li>
        </ul>
      </div>
      
      <button
        onClick={onSwitchView}
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
      >
        <List className="w-4 h-4" />
        Switch to List View
      </button>
    </div>
  );
}
