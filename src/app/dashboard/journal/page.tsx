"use client";

import React, { useState, useEffect } from 'react';
import JournalSection, { JournalEntry } from '@/components/dashboard/JournalSection';
import { getJournalEntries, saveJournalEntry } from '@/lib/journalStorage';

export default function JournalPage() {
  // Use real journal entries from storage
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  
  // Load journal entries from storage
  useEffect(() => {
    const entries = getJournalEntries();
    setJournalEntries(entries);
    
    // Listen for storage events (when entries are updated in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'chillmind_journal_entries') {
        const updatedEntries = getJournalEntries();
        setJournalEntries(updatedEntries);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  const handleSaveEntry = (entry: { prompt: string; content: string }) => {
    // After saving in the JournalSection component, refresh the entries list
    const updatedEntries = getJournalEntries();
    setJournalEntries(updatedEntries);
  };
  const getMoodIcon = (mood: string) => {
    switch (mood.toLowerCase()) {
      case 'happy': return <i className="fas fa-smile text-blue-600"></i>;
      case 'neutral': return <i className="fas fa-meh text-gray-600"></i>;
      case 'anxious': return <i className="fas fa-frown text-yellow-600"></i>;
      case 'relaxed': return <i className="fas fa-peace text-green-600"></i>;
      case 'surprised': return <i className="fas fa-surprise text-purple-600"></i>;
      case 'angry': return <i className="fas fa-angry text-red-600"></i>;
      case 'sad': return <i className="fas fa-sad-tear text-indigo-600"></i>;
      default: return <i className="fas fa-meh text-gray-600"></i>;
    }
  };
  const getMoodBackground = (mood: string) => {
    switch (mood.toLowerCase()) {
      case 'happy': return 'bg-blue-100';
      case 'neutral': return 'bg-gray-100';
      case 'anxious': return 'bg-yellow-100';
      case 'relaxed': return 'bg-green-100';
      case 'surprised': return 'bg-purple-100';
      case 'angry': return 'bg-red-100';
      case 'sad': return 'bg-indigo-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="max-w-8xl mx-auto">
      <JournalSection
        compact={false}
        showRecentEntries={false}
        showHeader={false}
        defaultPrompt="free"
        minHeight="200px"
        onSave={handleSaveEntry}
      />
      
      <div className="bg-background rounded-xl shadow-sm p-6 border border-muted mt-6">
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
              key={entry.id}              className={`journal-entry p-5 bg-background border-l-4 border-muted rounded-lg hover:shadow-md transition-all ${
                entry.mood.toLowerCase() === 'happy' ? 'border-l-blue-400' : 
                entry.mood.toLowerCase() === 'neutral' ? 'border-l-gray-400' : 
                entry.mood.toLowerCase() === 'anxious' ? 'border-l-yellow-400' :
                entry.mood.toLowerCase() === 'surprised' ? 'border-l-purple-400' :
                entry.mood.toLowerCase() === 'angry' ? 'border-l-red-400' :
                entry.mood.toLowerCase() === 'sad' ? 'border-l-indigo-400' :
                'border-l-green-400'
              }`}
            >              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full ${getMoodBackground(entry.mood)} flex items-center justify-center shadow-sm`}>
                    {getMoodIcon(entry.mood)}
                  </div>
                  <div className="ml-3">
                    <div className="flex items-center mb-1">
                      <span className="text-sm font-medium">{entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}</span>
                    </div>
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
  );
}