"use client";

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

type JournalEntry = {
  id: string;
  date: string;
  content: string;
  mood: string;
  tags: string[];
};

export default function JournalPage() {
  // Dummy journal entries
  const [journalEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: '2024-06-10',
      content: 'Had a great day at work today! Finished my project ahead of schedule and got positive feedback from my manager. Also went for a walk in the park which was very refreshing.',
      mood: 'happy',
      tags: ['work', 'nature']
    },
    {
      id: '2',
      date: '2024-06-09',
      content: 'Not much happened today. Felt a bit tired but managed to complete all my tasks. Need to work on getting better sleep.',
      mood: 'neutral',
      tags: ['sleep']
    },
    {
      id: '3',
      date: '2024-06-08',
      content: 'Exam is coming up and I feel unprepared. I need to plan my study schedule better and perhaps reach out to classmates for help.',
      mood: 'anxious',
      tags: ['study', 'exam']
    },
    {
      id: '4',
      date: '2024-06-07',
      content: 'Started a new meditation practice today. It was challenging to keep my mind from wandering, but I feel more centered afterwards.',
      mood: 'relaxed',
      tags: ['meditation', 'mindfulness']
    }
  ]);

  const [activePrompt, setActivePrompt] = useState('free');
  const [newEntry, setNewEntry] = useState('');

  const handlePromptChange = (prompt: string) => {
    setActivePrompt(prompt);
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy': return <i className="fas fa-smile text-blue-600"></i>;
      case 'neutral': return <i className="fas fa-meh text-gray-600"></i>;
      case 'anxious': return <i className="fas fa-frown text-yellow-600"></i>;
      case 'relaxed': return <i className="fas fa-peace text-green-600"></i>;
      default: return <i className="fas fa-meh text-gray-600"></i>;
    }
  };

  const getMoodBackground = (mood: string) => {
    switch (mood) {
      case 'happy': return 'bg-blue-100';
      case 'neutral': return 'bg-gray-100';
      case 'anxious': return 'bg-yellow-100';
      case 'relaxed': return 'bg-green-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-8xl mx-auto">
        <div className="bg-gradient-to-br from-background to-muted/30 rounded-xl shadow-sm p-6 border border-muted mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
            <i className="fas fa-feather-alt text-primary mr-2"></i>
            Journal Entry
          </h2>
          
          <div className="flex space-x-2 mb-2 overflow-x-auto pb-2">
            <button
              className={`flex-shrink-0 px-3 py-1 text-xs font-medium rounded-full ${
                activePrompt === 'free' 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-muted text-muted-foreground'
              }`}
              onClick={() => handlePromptChange('free')}
            >
              Free writing
            </button>
            <button
              className={`flex-shrink-0 px-3 py-1 text-xs font-medium rounded-full ${
                activePrompt === 'highlights' 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-muted text-muted-foreground'
              }`}
              onClick={() => handlePromptChange('highlights')}
            >
              Today&apos;s Highlights
            </button>
            <button
              className={`flex-shrink-0 px-3 py-1 text-xs font-medium rounded-full ${
                activePrompt === 'gratitude' 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-muted text-muted-foreground'
              }`}
              onClick={() => handlePromptChange('gratitude')}
            >
              Gratitude
            </button>
            <button
              className={`flex-shrink-0 px-3 py-1 text-xs font-medium rounded-full ${
                activePrompt === 'challenges' 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-muted text-muted-foreground'
              }`}
              onClick={() => handlePromptChange('challenges')}
            >
              Challenges
            </button>
          </div>
          
          <textarea
            className="w-full px-4 py-3 border border-muted rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground placeholder:text-muted-foreground min-h-[200px]"
            placeholder={
              activePrompt === 'free'
                ? "Write freely about whatever is on your mind..."
                : activePrompt === 'highlights'
                ? "What were the best moments of your day?"
                : activePrompt === 'gratitude'
                ? "What are you grateful for today?"
                : "What challenges did you face today and how did you handle them?"
            }
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
          ></textarea>
          
          <div className="flex items-center justify-between mt-4">
            <button className="ml-auto px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center">
              <i className="fas fa-save mr-2"></i>
              Save Entry
            </button>
          </div>
        </div>
        
        <div className="bg-background rounded-xl shadow-sm p-6 border border-muted">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground flex items-center">
              <i className="fas fa-book text-primary mr-2"></i>
              Your Journal
            </h2>
            <div className="flex space-x-2">
              <button className="text-sm font-medium text-primary hover:text-primary/80 flex items-center transition-colors">
                <i className="fas fa-filter mr-1"></i>
                Filter
              </button>
              <button className="text-sm font-medium text-primary hover:text-primary/80 flex items-center transition-colors">
                <i className="fas fa-search mr-1"></i>
                Search
              </button>
            </div>
          </div>
          
          <div className="space-y-5">
            {journalEntries.map((entry) => (
              <div 
                key={entry.id} 
                className={`journal-entry p-5 bg-background border-l-4 border-muted rounded-lg hover:shadow-md transition-all ${
                  entry.mood === 'happy' ? 'border-l-blue-400' : 
                  entry.mood === 'neutral' ? 'border-l-gray-400' : 
                  entry.mood === 'anxious' ? 'border-l-yellow-400' : 
                  'border-l-green-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full ${getMoodBackground(entry.mood)} flex items-center justify-center shadow-sm`}>
                      {getMoodIcon(entry.mood)}
                    </div>
                    <div className="ml-3">
                      <span className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-1.5 text-muted-foreground hover:text-foreground rounded-full transition-colors">
                      <i className="fas fa-edit text-sm"></i>
                    </button>
                    <button className="p-1.5 text-muted-foreground hover:text-accent rounded-full transition-colors">
                      <i className="fas fa-trash-alt text-sm"></i>
                    </button>
                  </div>
                </div>
                
                <p className="mt-3 text-sm text-foreground line-clamp-3">
                  {entry.content}
                </p>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {entry.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-1 text-xs bg-muted text-primary rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 