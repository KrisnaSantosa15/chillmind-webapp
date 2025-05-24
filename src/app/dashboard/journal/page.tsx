"use client";

import React, { useState, useEffect } from 'react';
import JournalSection, { JournalEntry } from '@/components/dashboard/JournalSection';
import { getJournalEntries } from '@/lib/journalStorage';

export default function JournalPage() {  // Use real journal entries from storage
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  
  // Load journal entries from storage
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const entries = await getJournalEntries();
        setJournalEntries(entries);
      } catch (error) {
        console.error('Error loading journal entries:', error);
      }
    };
    
    fetchEntries();
  }, []);
    const handleSaveEntry = async () => {
    // After saving in the JournalSection component, refresh the entries list
    try {
      const updatedEntries = await getJournalEntries();
      setJournalEntries(updatedEntries);
    } catch (error) {
      console.error('Error refreshing journal entries:', error);
    }
  };
  const getMoodIcon = (mood: string) => {
    switch (mood.toLowerCase()) {
      case 'joy': return <i className="fas fa-smile text-blue-600"></i>;
      case 'neutral': return <i className="fas fa-meh text-gray-600"></i>;
      case 'fear': return <i className="fas fa-frown text-yellow-600"></i>;
      case 'love': return <i className="fas fa-peace text-green-600"></i>;
      case 'surprise': return <i className="fas fa-surprise text-purple-600"></i>;
      case 'anger': return <i className="fas fa-angry text-red-600"></i>;
      case 'sadness': return <i className="fas fa-sad-tear text-indigo-600"></i>;
      default: return <i className="fas fa-meh text-gray-600"></i>;
    }
  };
  const getMoodBackground = (mood: string) => {
    switch (mood.toLowerCase()) {
      case 'joy': return 'bg-blue-100';
      case 'neutral': return 'bg-gray-100';
      case 'fear': return 'bg-yellow-100';
      case 'love': return 'bg-green-100';
      case 'surprise': return 'bg-purple-100';
      case 'anger': return 'bg-red-100';
      case 'sadness': return 'bg-indigo-100';
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
          {journalEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-muted-foreground">
              <i className="fas fa-book-open text-5xl mb-4"></i>
              <h3 className="text-xl font-medium mb-2">No journal entries yet</h3>
              <p className="max-w-md mx-auto mb-6">Start writing in the journal above to record your thoughts, feelings, and experiences.</p>
              <p className="text-sm">Your journal entries will appear here once you save them.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {journalEntries.map((entry) => (
              <div 
                key={entry.id}
                className={`journal-entry p-5 bg-background border-l-4 border-muted rounded-lg hover:shadow-md transition-all ${
                  entry.mood.toLowerCase() === 'joy' ? 'border-l-blue-400' : 
                  entry.mood.toLowerCase() === 'neutral' ? 'border-l-gray-400' : 
                  entry.mood.toLowerCase() === 'fear' ? 'border-l-yellow-400' :
                  entry.mood.toLowerCase() === 'surprise' ? 'border-l-purple-400' :
                  entry.mood.toLowerCase() === 'anger' ? 'border-l-red-400' :
                  entry.mood.toLowerCase() === 'sadness' ? 'border-l-indigo-400' :
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
                ))}              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}