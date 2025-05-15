"use client";

import React, { useState } from 'react';

const JournalSection: React.FC = () => {
  const [activePrompt, setActivePrompt] = useState('highlights');
  const [journalEntry, setJournalEntry] = useState('');

  const handlePromptChange = (prompt: string) => {
    setActivePrompt(prompt);
    
    // Set different placeholder text based on prompt
    setJournalEntry('');
  };

  return (
    <div className="bg-background rounded-xl shadow-sm p-6 border border-muted">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Today&apos;s Journal
        </h2>
        <div className="flex items-center space-x-2">
          <button
            className="text-sm font-medium text-primary hover:text-primary/80"
          >
            Prompts
          </button>
          <button
            className="text-sm font-medium text-primary hover:text-primary/80"
          >
            View all
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex space-x-2 mb-2 overflow-x-auto pb-2">
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
          <button
            className={`flex-shrink-0 px-3 py-1 text-xs font-medium rounded-full ${
              activePrompt === 'reflection' 
                ? 'bg-primary/10 text-primary' 
                : 'bg-muted text-muted-foreground'
            }`}
            onClick={() => handlePromptChange('reflection')}
          >
            Self-reflection
          </button>
        </div>
        <textarea
          className="w-full px-4 py-3 border border-muted rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground placeholder:text-muted-foreground"
          rows={4}
          placeholder={
            activePrompt === 'highlights'
              ? "What were the best moments of your day?"
              : activePrompt === 'gratitude'
              ? "What are you grateful for today?"
              : activePrompt === 'challenges'
              ? "What challenges did you face today and how did you handle them?"
              : "Reflect on your emotions and thoughts today. What did you learn about yourself?"
          }
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
        ></textarea>
        <div className="flex justify-between mt-3">
            <button className="ml-auto px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center">
              <i className="fas fa-save mr-2"></i>
              Save Entry
            </button>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Recent Entries
        </h3>
        <div className="mt-3 space-y-3">
          <div className="journal-entry p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-600">
                  <i className="fas fa-smile text-lg"></i>
                </div>
                <span className="ml-2 text-sm font-medium text-foreground">Happy</span>
              </div>
              <span className="text-xs text-muted-foreground">Yesterday</span>
            </div>
            <p className="mt-2 text-sm text-foreground line-clamp-2">
              Had a great day at work today! Finished my project ahead
              of schedule and got positive feedback from my manager.
              Also went for a walk in the park which was very
              refreshing.
            </p>
            <div className="mt-2 flex space-x-2">
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">#work</span>
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">#nature</span>
            </div>
          </div>
          
          <div className="journal-entry p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                  <i className="fas fa-meh text-lg"></i>
                </div>
                <span className="ml-2 text-sm font-medium text-foreground">Neutral</span>
              </div>
              <span className="text-xs text-muted-foreground">2 days ago</span>
            </div>
            <p className="mt-2 text-sm text-foreground line-clamp-2">
              Not much happened today. Felt a bit tired but managed to
              complete all my tasks. Need to work on getting better
              sleep.
            </p>
            <div className="mt-2 flex space-x-2">
              <span className="px-2 py-1 text-xs bg-purple-200 text-purple-700 rounded-full">#sleep</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalSection; 