"use client";

import React, { useState } from 'react';
import MoodChart from '@/components/dashboard/MoodChart';
import JournalSection from '@/components/dashboard/JournalSection';
import MentalHealthStatus from '@/components/dashboard/MentalHealthStatus';
import AIAssistantWidget from '@/components/dashboard/AIAssistantWidget';
import Recommendations from '@/components/dashboard/Recommendations';
import WellbeingStats from '@/components/dashboard/WellbeingStats';
import { useAuth } from '@/lib/authContext';
import { Flame } from 'lucide-react';
import '@/styles/ai-markdown.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  
  const handleTimeRangeChange = (range: 'week' | 'month' | 'year') => {
    setTimeRange(range);
  };
  const handleJournalSave = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  const handleStreakUpdate = (days: number) => {
    setStreakDays(days);
  };

  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'User';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="lg:col-span-2 space-y-6">
        
        <div className="bg-background rounded-xl shadow-sm p-6 border border-muted">          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Good morning, {firstName}!
              </h2>
              <p className="text-muted-foreground mt-1">How are you feeling today?</p>
            </div>            <div className="flex items-center">
              <div className="flex items-center bg-muted/30 px-3 py-1.5 rounded-lg">
                <Flame className="h-4 w-4 text-orange-500 mr-1.5" />
                <span className="text-sm font-medium">{streakDays}</span>
                <span className="text-xs text-muted-foreground ml-1">day streak</span>
              </div>
            </div>
          </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Your Wellness Snapshot
              </h3>              <div className="mt-4">
                <WellbeingStats className="border-0 shadow-none" onStreakUpdate={handleStreakUpdate} />
              </div>
            </div>
          </div>
          <JournalSection 
            compact={true}
            showRecentEntries={true}
            showHeader={true}
            defaultPrompt="highlights"
            onSave={handleJournalSave}
            entriesLimit={2}
          />
          
        </div>        
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

          <div className="h-[400px]">
            <AIAssistantWidget height="400px" compactMode={true} />
          </div>

        </div>
      </div>
  );
}