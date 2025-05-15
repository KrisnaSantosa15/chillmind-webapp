"use client";

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MoodChart from '@/components/dashboard/MoodChart';
import MoodTracker from '@/components/dashboard/MoodTracker';
import JournalSection from '@/components/dashboard/JournalSection';
import MentalHealthStatus from '@/components/dashboard/MentalHealthStatus';
import HabitTracker from '@/components/dashboard/HabitTracker';
import AIAssistant from '@/components/dashboard/AIAssistant';
import Recommendations from '@/components/dashboard/Recommendations';

export default function DashboardPage() {
  const [username, setUsername] = useState('Krisna');
  const [dayStreak, setDayStreak] = useState(14);

  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  const handleTimeRangeChange = (range: 'week' | 'month' | 'year') => {
    setTimeRange(range);
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Welcome card */}
          <div className="bg-background rounded-xl shadow-sm p-6 border border-muted">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Good morning, {username}!
                </h2>
                <p className="text-muted-foreground mt-1">How are you feeling today?</p>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground mr-2">Day {dayStreak}</span>
                <div
                  className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Daily mood tracker */}
            <MoodTracker />
          </div>

          {/* Journal section */}
          <JournalSection />
          
          {/* AI Mental Health Assistant */}
          <div className="h-[400px]">
            <AIAssistant />
          </div>
        </div>

        {/* Right column - Mood chart and health status */}
        <div className="space-y-6">
          {/* Mood graph */}
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

          {/* Recommendations */}
          <Recommendations />

          {/* Mental health status */}
          <MentalHealthStatus />

          {/* Habit Tracker */}
          <HabitTracker />

        </div>
      </div>
    </DashboardLayout>
  );
} 