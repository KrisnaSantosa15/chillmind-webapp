"use client";

import React, { useState, useEffect } from 'react';
import MoodChart from '@/components/dashboard/MoodChart';
import MoodTracker from '@/components/dashboard/MoodTracker';
import JournalSection from '@/components/dashboard/JournalSection';
import MentalHealthStatus from '@/components/dashboard/MentalHealthStatus';
import HabitTracker from '@/components/dashboard/HabitTracker';
import AIAssistantWidget from '@/components/dashboard/AIAssistantWidget';
import Recommendations from '@/components/dashboard/Recommendations';
import { useAuth } from '@/lib/authContext';
import { getDayStreak } from '@/lib/journalStorage';
import '@/styles/ai-markdown.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const [dayStreak, setDayStreak] = useState(0);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [updateTrigger, setUpdateTrigger] = useState(0);
  // Load day streak from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const streak = getDayStreak();
      setDayStreak(streak);
    }
  }, []);
  const handleTimeRangeChange = (range: 'week' | 'month' | 'year') => {
    setTimeRange(range);
  };
  
  // Handle journal entry save
  const handleJournalSave = () => {
    // Trigger update of the mood chart when a new journal entry is saved
    console.log('Journal entry saved, updating chart with new updateTrigger value');
    // This will cause the MoodChart to re-render with a new key
    setUpdateTrigger(prev => prev + 1);
    
    // Update streak counter in UI when a journal entry is saved
    const streak = getDayStreak();
    setDayStreak(streak);
  };

  // Get first name from display name if available
  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'User';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column - Main content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Welcome card */}
        <div className="bg-background rounded-xl shadow-sm p-6 border border-muted">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Good morning, {firstName}!
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
          </div>          {/* Journal section */}
          <JournalSection 
            compact={true}
            showRecentEntries={true}
            showHeader={true}
            defaultPrompt="highlights"
            onSave={handleJournalSave}
            entriesLimit={2}
          />
          
            {/* AI Mental Health Assistant */}
          <div className="h-[400px]">
            <AIAssistantWidget height="400px" compactMode={true} />
          </div>
        </div>

        {/* Right column - Mood chart and health status */}
        <div className="space-y-6">
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
                key={`mood-chart-${timeRange}-${updateTrigger}`}
              />
            </div>
          </div>

          {/* Recommendations */}
                    <div className="bg-background rounded-xl shadow-sm p-6 border border-muted">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
              Recommendations
            </h3>
            
            <Recommendations />
          </div>

          {/* Mental health status */}
                    <div className="bg-background rounded-xl shadow-sm p-6 border border-muted">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
              Health Summary
            </h3>
            
            <MentalHealthStatus />
          </div>

          {/* Habit Tracker */}
          <HabitTracker />

        </div>
      </div>
  );
}