"use client";

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MoodChart from '@/components/dashboard/MoodChart';

export default function ProgressPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  const handleTimeRangeChange = (range: 'week' | 'month' | 'year') => {
    setTimeRange(range);
  };

  return (
    <DashboardLayout>
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
            
            <div className="space-y-6">
              {/* Anxiety Level */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <i className="fas fa-bolt text-amber-500 mr-2"></i>
                    <span className="text-sm text-foreground">Anxiety</span>
                  </div>
                  <span className="text-sm font-medium text-amber-500">Low</span>
                </div>
                <div className="w-full bg-muted/50 h-3 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-3 rounded-full relative" style={{ width: '25%' }}>
                    <div className="absolute inset-0 bg-white opacity-20 overflow-hidden flex">
                      <div className="h-full w-full bg-stripes"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Depression Level */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <i className="fas fa-cloud-rain text-indigo-500 mr-2"></i>
                    <span className="text-sm text-foreground">Depression</span>
                  </div>
                  <span className="text-sm font-medium text-indigo-500">Moderate</span>
                </div>
                <div className="w-full bg-muted/50 h-3 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-3 rounded-full relative" style={{ width: '50%' }}>
                    <div className="absolute inset-0 bg-white opacity-20 overflow-hidden flex">
                      <div className="h-full w-full bg-stripes"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Stress Level */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <i className="fas fa-fire text-red-500 mr-2"></i>
                    <span className="text-sm text-foreground">Stress</span>
                  </div>
                  <span className="text-sm font-medium text-red-500">Moderate</span>
                </div>
                <div className="w-full bg-muted/50 h-3 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-3 rounded-full relative" style={{ width: '50%' }}>
                    <div className="absolute inset-0 bg-white opacity-20 overflow-hidden flex">
                      <div className="h-full w-full bg-stripes"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Insights card */}
          <div className="bg-background rounded-xl shadow-sm p-6 border border-muted">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
              <i className="fas fa-brain text-primary mr-2"></i>
              Insights & Recommendations
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 border border-muted rounded-lg transition-all hover:shadow-md">
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3`}>
                      <i className={`fas fa-lightbulb text-primary-500`}></i>
                    </div>
                    <div>
                      <p className="text-sm text-foreground">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
                      <div className="mt-2">
                        <a href="#" className="text-xs text-primary hover:text-primary/80 transition-colors">
                          <i className="fas fa-arrow-right mr-1"></i> Learn more
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-muted rounded-lg transition-all hover:shadow-md">
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3`}>
                      <i className={`fas fa-lightbulb text-primary-500`}></i>
                    </div>
                    <div>
                      <p className="text-sm text-foreground">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
                      <div className="mt-2">
                        <a href="#" className="text-xs text-primary hover:text-primary/80 transition-colors">
                          <i className="fas fa-arrow-right mr-1"></i> Learn more
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 