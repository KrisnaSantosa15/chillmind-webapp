"use client";

import React, { useState } from 'react';
import MoodChart from '@/components/dashboard/MoodChart';
import MentalHealthStatus from '@/components/dashboard/MentalHealthStatus';
import Recommendations from '@/components/dashboard/Recommendations';

export default function ProgressPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  const handleTimeRangeChange = (range: 'week' | 'month' | 'year') => {
    setTimeRange(range);
  };

  return (
      <div className="max-w-8xl mx-auto">
        {/* Current emotional state card */}
        <div className="bg-gradient-to-r from-background to-muted/20 rounded-xl shadow-sm p-6 border border-muted mb-6">
          <div className="flex flex-col md:flex-row items-center">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Your Mood Tracker</h2>
              <p className="text-muted-foreground">
                This chart shows your mood over the last 7 days.
              </p>
            </div>
          </div>
        </div>

        {/* Mood graph */}
        <div className="bg-background rounded-xl shadow-sm p-6 border border-muted mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Mood This Week
              </h2>
              <div className="flex space-x-2">
                <button
                  className={`text-sm font-medium ${timeRange === 'week' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => handleTimeRangeChange('week')}
                >
                  Week
                </button>
                <button
                  className={`text-sm font-medium ${timeRange === 'month' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => handleTimeRangeChange('month')}
                >
                  Month
                </button>
                <button
                  className={`text-sm font-medium ${timeRange === 'year' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => handleTimeRangeChange('year')}
                >
                  Year
                </button>
              </div>
            </div>
            <div className="mt-4">
              <MoodChart 
                timeRange={timeRange} 
                height={280} 
                darkMode={true}
              />
            </div>
          </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Health Summary card */}
          <div className="bg-background rounded-xl shadow-sm p-6 border border-muted">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
              <i className="fas fa-heartbeat text-primary mr-2"></i>
              Health Summary
            </h3>
            
            <MentalHealthStatus />
          </div>
          
          {/* Insights & Recommendations card */}
          <div className="bg-background rounded-xl shadow-sm p-6 border border-muted">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
              <i className="fas fa-brain text-primary mr-2"></i>
              Personalized Recommendations
            </h3>
            
            <Recommendations />
          </div>
        </div>
      </div>
  );
} 