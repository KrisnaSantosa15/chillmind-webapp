"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { saveJournalEntry, getJournalEntries } from '@/lib/journalStorage';

export type JournalEntry = {
  id: string;
  date: string;
  content: string;
  mood: string;
  tags: string[];
};

type PromptType = 'free' | 'highlights' | 'gratitude' | 'challenges' | 'reflection';

interface JournalSectionProps {
  compact?: boolean;
  showRecentEntries?: boolean;
  showHeader?: boolean;
  defaultPrompt?: PromptType;
  customEntries?: JournalEntry[];
  minHeight?: string;
  onSave?: (entry: { prompt: PromptType; content: string }) => void;
  entriesLimit?: number;
}

const JournalSection: React.FC<JournalSectionProps> = ({
  compact = true,
  showRecentEntries = true,
  showHeader = true,
  defaultPrompt = 'highlights',
  customEntries,
  minHeight,
  onSave,
  entriesLimit
}) => {
  const [activePrompt, setActivePrompt] = useState<PromptType>(defaultPrompt);
  const [journalEntry, setJournalEntry] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [saving, setSaving] = useState(false);  // Load entries from local storage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && showRecentEntries && !customEntries) {
      const fetchEntries = async () => {
        try {
          const storedEntries = await getJournalEntries();
          setEntries(storedEntries);
        } catch (error) {
          console.error('Error loading journal entries:', error);
          setEntries([]);
        }
      };
      fetchEntries();
    }
  }, [showRecentEntries, customEntries]);

  const handlePromptChange = (prompt: PromptType) => {
    setActivePrompt(prompt);
    
    // Set different placeholder text based on prompt
    setJournalEntry('');
  };

  const handleSaveEntry = async () => {
    if (!journalEntry.trim()) return;
    
    setSaving(true);
    
    try {
      // Extract tags from content (words with # prefix)
      const tagRegex = /#(\w+)/g;
      const tags: string[] = [];
      let match;
      
      while ((match = tagRegex.exec(journalEntry)) !== null) {
        tags.push(match[1].toLowerCase());
      }
      
      // If no tags were found, add default ones based on the prompt type
      if (tags.length === 0) {
        switch (activePrompt) {
          case 'highlights':
            tags.push('highlights');
            break;
          case 'gratitude':
            tags.push('gratitude');
            break;
          case 'challenges':
            tags.push('challenge');
            break;
          case 'reflection':
            tags.push('reflection');
            break;
          case 'free':
          default:
            tags.push('journal');
            break;
        }
      }      // Save to local storage - the text is passed to predict emotion in saveJournalEntry
      const newEntry = await saveJournalEntry({
        content: journalEntry,
        tags
      });
      
      // Update state
      if (showRecentEntries && !customEntries) {
        setEntries(prev => [newEntry, ...prev]);
      }
      
      // Call onSave callback if provided
      if (onSave) {
        onSave({
          prompt: activePrompt,
          content: journalEntry
        });
      }
      
      // Reset the journal entry input
      setJournalEntry('');

    } catch (error) {
      console.error('Error saving journal entry:', error);
    } finally {
      setSaving(false);
    }
  };

  // Get entries to display (either from props or from state)
  const recentEntries = customEntries || entries;

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'joy': return <i className="fas fa-smile text-lg"></i>;
      case 'love': return <i className="fas fa-peace text-lg"></i>;
      case 'surprise': return <i className="fas fa-surprise text-lg"></i>;
      case 'fear': return <i className="fas fa-frown text-lg"></i>;
      case 'anger': return <i className="fas fa-angry text-lg"></i>;
      case 'sadness': return <i className="fas fa-sad-tear text-lg"></i>;
      case 'neutral': return <i className="fas fa-meh text-lg"></i>;
      default: return <i className="fas fa-meh text-lg"></i>;
    }
  };

  const getMoodBackground = (mood: string) => {
    switch (mood) {
      case 'joy': return 'bg-blue-200';
      case 'love': return 'bg-green-200';
      case 'surprise': return 'bg-purple-200';
      case 'fear': return 'bg-yellow-200';
      case 'anger': return 'bg-red-200';
      case 'sadness': return 'bg-indigo-200';
      case 'neutral': return 'bg-gray-200';
      default: return 'bg-gray-200';
    }
  };

  const getMoodTextColor = (mood: string) => {
    switch (mood) {
      case 'joy': return 'text-blue-600';
      case 'love': return 'text-green-600';
      case 'surprise': return 'text-purple-600';
      case 'fear': return 'text-yellow-600';
      case 'anger': return 'text-red-600';
      case 'sadness': return 'text-indigo-600';
      case 'neutral': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getTagStyle = (tag: string) => {
    switch (tag) {
      case 'work':
        return 'bg-blue-100 text-blue-800';
      case 'nature':
        return 'bg-green-100 text-green-800';
      case 'sleep':
        return 'bg-purple-200 text-purple-700';
      case 'highlights':
        return 'bg-amber-100 text-amber-800';
      case 'gratitude':
        return 'bg-emerald-100 text-emerald-800';
      case 'challenge':
        return 'bg-rose-100 text-rose-800';
      case 'reflection':
        return 'bg-cyan-100 text-cyan-800';
      case 'journal':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-background rounded-xl shadow-sm p-6 border border-muted">
      {showHeader && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Today&apos;s Journal
          </h2>
        </div>
      )}

      <div className={showHeader ? "mt-4" : ""}>
        <div className="flex space-x-2 mb-2 overflow-x-auto pb-2">
          {!compact && (
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
          )}
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
          rows={compact ? 4 : 8}
          style={minHeight ? { minHeight } : {}}
          placeholder={
            activePrompt === 'free'
              ? "Write freely about whatever is on your mind..."
              : activePrompt === 'highlights'
              ? "What were the best moments of your day?"
              : activePrompt === 'gratitude'
              ? "What are you grateful for today?"
              : activePrompt === 'challenges'
              ? "What challenges did you face today and how did you handle them?"
              : "Reflect on your emotions and thoughts today. What did you learn about yourself?"
          }
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          disabled={saving}
        ></textarea>
        <div className="flex justify-between mt-3">
            <button 
              onClick={handleSaveEntry}
              className={`ml-auto px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition-colors flex items-center ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={saving || !journalEntry.trim()}
            >
              {saving ? (
                <>
                  <i className="fas fa-circle-notch fa-spin mr-2"></i>
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>
                  Save Entry
                </>
              )}
            </button>
        </div>
      </div>      {showRecentEntries && recentEntries.length > 0 && (
        <div className="mt-6">          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Recent Entries
            </h3>            {entriesLimit && recentEntries.length > entriesLimit && (              <Link href="/dashboard/journal" className="text-sm text-primary hover:underline flex items-center">
                View All <i className="fas fa-chevron-right text-xs ml-1"></i>
              </Link>
            )}
          </div>
          <div className="mt-3 space-y-3">
            {recentEntries.slice(0, entriesLimit || recentEntries.length).map((entry) => (
              <div key={entry.id} className="journal-entry p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full ${getMoodBackground(entry.mood)} flex items-center justify-center ${getMoodTextColor(entry.mood)}`}>
                      {getMoodIcon(entry.mood)}
                    </div>
                    <span className="ml-2 text-sm font-medium text-foreground">{entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <p className="mt-2 text-sm text-foreground line-clamp-2">
                  {entry.content}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {entry.tags.map((tag, index) => (
                    <span key={index} className={`px-2 py-1 text-xs ${getTagStyle(tag)} rounded-full`}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {showRecentEntries && recentEntries.length === 0 && (
        <div className="mt-6 text-center py-6">
          <div className="text-muted-foreground">
            <i className="fas fa-book-open text-3xl mb-2"></i>
            <p>No journal entries yet. Start writing today!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalSection;