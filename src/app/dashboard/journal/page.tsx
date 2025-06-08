"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import JournalSection, { JournalEntry } from '@/components/dashboard/JournalSection';
import { getJournalEntries, deleteJournalEntry } from '@/lib/journalStorage';
import { toast } from 'sonner';

declare global {
  interface Window {
    searchTimeout: number;
  }
}

const DEBOUNCE_DELAY = 300; // ms
const BATCH_SIZE = 20; // entries per batch for lazy loading
const SCROLL_THRESHOLD = 100; 


export default function JournalPage() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);  
  const [displayedEntries, setDisplayedEntries] = useState<JournalEntry[]>([]);
  const [hasMoreEntries, setHasMoreEntries] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [viewMode, setViewMode] = useState<'card' | 'list' | 'compact'>('card');
  
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'mood-asc' | 'mood-desc'>('newest');
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true);
      try {
        const entries = await getJournalEntries();
        setJournalEntries(entries);
        setFilteredEntries(entries);
      } catch (error) {
        console.error('Error loading journal entries:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEntries();
  }, []);
    const handleSaveEntry = async () => {
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
    }  };
  
  const sortEntries = useCallback((entries: JournalEntry[], order: string) => {
    const entriesCopy = [...entries];
    
    switch (order) {
      case 'newest':
        return entriesCopy.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'oldest':
        return entriesCopy.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case 'mood-asc':
        return entriesCopy.sort((a, b) => getMoodValue(a.mood) - getMoodValue(b.mood));
      case 'mood-desc':
        return entriesCopy.sort((a, b) => getMoodValue(b.mood) - getMoodValue(a.mood));
      default:
        return entriesCopy;
    }
  }, []);
  const getMoodValue = (mood: string): number => {
    const moodMap: Record<string, number> = {
      joy: 7,
      love: 6,
      surprise: 5,
      neutral: 4,
      fear: 3,
      anger: 2,
      sadness: 1
    };
    return moodMap[mood.toLowerCase()] || 4;
  };
  
  const filteredAndSortedEntries = useMemo(() => {
    if (!journalEntries.length) return [];
    
    let results = [...journalEntries];
    
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      results = results.filter(entry => 
        entry.content.toLowerCase().includes(lowerSearchTerm) || 
        entry.mood.toLowerCase().includes(lowerSearchTerm) ||
        entry.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    // Apply mood filter
    if (selectedMoods.length > 0) {
      results = results.filter(entry => selectedMoods.includes(entry.mood.toLowerCase()));
    }
    
    // Apply tag filter
    if (selectedTags.length > 0) {
      results = results.filter(entry => 
        entry.tags.some(tag => selectedTags.includes(tag))
      );
    }
    
    // Apply date range filter
    if (selectedDateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const weekAgo = today - 7 * 24 * 60 * 60 * 1000;
      const monthAgo = today - 30 * 24 * 60 * 60 * 1000;
      
      results = results.filter(entry => {
        const entryDate = new Date(entry.date).getTime();
        if (selectedDateRange === 'today') {
          return entryDate >= today;
        } else if (selectedDateRange === 'week') {
          return entryDate >= weekAgo;
        } else if (selectedDateRange === 'month') {
          return entryDate >= monthAgo;
        }
        return true;
      });
    }
    
    // Apply sorting
    results = sortEntries(results, sortOrder);
    
    return results;
  }, [searchTerm, selectedMoods, selectedTags, selectedDateRange, journalEntries, sortOrder, sortEntries]);
  useEffect(() => {
    setFilteredEntries(filteredAndSortedEntries);
  }, [filteredAndSortedEntries]);

  const openDeleteModal = (entryId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setEntryToDelete(entryId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setEntryToDelete(null);
  };

  const handleDeleteEntry = async () => {
    if (!entryToDelete) return;
    setIsLoading(true);
    try {
      await deleteJournalEntry(entryToDelete);
      
      const updatedEntries = journalEntries.filter(entry => entry.id !== entryToDelete);
      setJournalEntries(updatedEntries);
      setFilteredEntries(
        filteredEntries.filter(entry => entry.id !== entryToDelete)
      );
      
      closeDeleteModal();
      
      toast.success('Journal entry deleted successfully');
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      
      toast.error('Failed to delete journal entry. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }; 
  const loadMoreEntries = useCallback(() => {
    if (isLoadingMore || !hasMoreEntries) return;
    setIsLoadingMore(true);
    
    const startIndex = displayedEntries.length;
    const endIndex = startIndex + BATCH_SIZE;
    const nextEntries = filteredEntries.slice(startIndex, endIndex);
    
    requestAnimationFrame(() => {
      setDisplayedEntries(prev => [...prev, ...nextEntries]);
      
      if (endIndex >= filteredEntries.length) {
        setHasMoreEntries(false);
      }
      
      setIsLoadingMore(false);
    });
  }, [isLoadingMore, hasMoreEntries, displayedEntries.length, filteredEntries]);
  useEffect(() => {
    setHasMoreEntries(true);
    
    const initialBatch = filteredEntries.slice(0, BATCH_SIZE);
    setDisplayedEntries(initialBatch);
    setHasMoreEntries(filteredEntries.length > BATCH_SIZE);
  }, [filteredEntries]);
  const throttleRef = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (throttleRef.current) return;
    
    const container = e.currentTarget;
    if (!container) return;
      throttleRef.current = window.requestAnimationFrame(() => {
      const scrollContainer = scrollContainerRef.current || container;
      
      if (scrollContainer) {
        const { scrollTop, clientHeight, scrollHeight } = scrollContainer;
        
        if (scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD && hasMoreEntries && !isLoadingMore) {
          loadMoreEntries();
        }
      }
      
      throttleRef.current = null;
    });
  }, [hasMoreEntries, isLoadingMore, loadMoreEntries]); 
  function JournalEntryItemComponent({ entry, viewMode, onDelete }: {
    entry: JournalEntry;
    viewMode: 'card' | 'list' | 'compact';
    onDelete: (id: string, e?: React.MouseEvent) => void;
  }) {
    return (
      <div 
        className={`
          journal-entry 
          ${viewMode === 'card' ? 'p-5 bg-background border-l-4 rounded-lg hover:shadow-md transition-all mb-5' : ''} 
          ${viewMode === 'list' ? 'p-4 hover:bg-muted/20 transition-colors' : ''}
          ${viewMode === 'compact' ? 'px-4 py-3 hover:bg-muted/20 transition-colors border-b border-muted last:border-b-0' : ''}
          ${
            entry.mood.toLowerCase() === 'joy' ? 'border-l-blue-400' : 
            entry.mood.toLowerCase() === 'neutral' ? 'border-l-gray-400' : 
            entry.mood.toLowerCase() === 'fear' ? 'border-l-yellow-400' :
            entry.mood.toLowerCase() === 'surprise' ? 'border-l-purple-400' :
            entry.mood.toLowerCase() === 'anger' ? 'border-l-red-400' :
            entry.mood.toLowerCase() === 'sadness' ? 'border-l-indigo-400' :
            'border-l-green-400'
          }`}
    >
      <div className="flex items-center justify-between">        <div className="flex items-center">
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
          <button 
            className="p-1.5 text-muted-foreground hover:text-accent rounded-full transition-colors"
            onClick={(e) => onDelete(entry.id, e)}
          >
            <i className="fas fa-trash-alt text-sm"></i>
          </button>
        </div>
      </div>
      
      <p className={`
          ${viewMode === 'card' ? 'mt-3 text-sm line-clamp-3' : ''}
          ${viewMode === 'list' ? 'mt-2 text-sm line-clamp-2' : ''}
          ${viewMode === 'compact' ? 'mt-1 text-xs line-clamp-1' : ''}
          text-foreground
        `}>
        {entry.content}
      </p>
      
      <div className={`
        ${viewMode === 'card' ? 'mt-3' : ''}
        ${viewMode === 'list' ? 'mt-2' : ''}
        ${viewMode === 'compact' ? 'mt-1' : ''}
        flex flex-wrap gap-2
      `}>
        {entry.tags.map((tag, i) => (
          <span 
            key={i} 
            className={`
              ${viewMode === 'compact' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'}
              bg-muted text-primary rounded-full
            `}
          >
            #{tag}
          </span>
        ))}      </div>    </div>
    );
  }
  
  const JournalEntryItem = memo(JournalEntryItemComponent);
  JournalEntryItem.displayName = 'JournalEntryItem';

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (throttleRef.current) {
        cancelAnimationFrame(throttleRef.current);
      }
    };
  }, []);

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
      
      <div className="bg-background rounded-xl shadow-sm p-6 border border-muted mt-6">        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center">
            <i className="fas fa-book text-primary mr-2"></i>
            Your Journal
          </h2>
          
          <div className="flex flex-wrap gap-2">            {/* Search button */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-200 min-h-[2.5rem] ${
                isSearchOpen ? 'bg-primary text-white shadow-sm' : 'bg-muted text-primary hover:bg-primary/10 active:scale-95'
              }`}
            >
              <i className={`fas fa-search mr-1.5 text-sm ${isSearchOpen ? 'text-white' : 'text-primary'}`}></i>
              <span className="hidden sm:inline">Search</span>
            </button>
            
            {/* Filter button */}
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-200 min-h-[2.5rem] ${
                isFilterOpen ? 'bg-primary text-white shadow-sm' : 'bg-muted text-primary hover:bg-primary/10 active:scale-95'
              }`}
            >
              <i className={`fas fa-filter mr-1.5 text-sm ${isFilterOpen ? 'text-white' : 'text-primary'}`}></i>
              <span className="hidden sm:inline">Filter</span>
            </button>
              {/* View mode toggle */}
            <div className="px-2 py-1 sm:px-3 sm:py-2 rounded-lg bg-muted flex items-center gap-1 sm:gap-2">
              <button 
                onClick={() => setViewMode('card')}
                className={`text-sm p-1.5 sm:p-2 rounded-md transition-all duration-200 min-h-[2rem] min-w-[2rem] ${viewMode === 'card' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted/80 active:scale-95'}`}
                title="Card view"
                aria-label="Switch to card view"
              >
                <i className="fas fa-th-large"></i>
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`text-sm p-1.5 sm:p-2 rounded-md transition-all duration-200 min-h-[2rem] min-w-[2rem] ${viewMode === 'list' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted/80 active:scale-95'}`}
                title="List view"
                aria-label="Switch to list view"
              >
                <i className="fas fa-list"></i>
              </button>
              <button 
                onClick={() => setViewMode('compact')}
                className={`text-sm p-1.5 sm:p-2 rounded-md transition-all duration-200 min-h-[2rem] min-w-[2rem] ${viewMode === 'compact' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted/80 active:scale-95'}`}
                title="Compact view"
                aria-label="Switch to compact view"
              >
                <i className="fas fa-bars"></i>
              </button>
            </div>
          </div>
        </div>          {/* Search bar */}
        {isSearchOpen && (
          <div className="mb-4 transition-all duration-300 ease-in-out">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <i className="fas fa-search text-muted-foreground text-sm"></i>
              </div>
              <input
                id="journal-search"
                type="text"
                placeholder="Search journal entries..."
                className="block w-full pl-10 sm:pl-12 pr-12 py-3 sm:py-2 border border-muted rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-sm transition-all duration-200"                onChange={(e) => {
                 
                  if (searchTimeoutRef.current) {
                    clearTimeout(searchTimeoutRef.current);
                  }
                  
                  const value = e.target.value;
                  
                  if (!value) {
                    setSearchTerm('');
                    return;
                  }
                  
                  searchTimeoutRef.current = setTimeout(() => {
                    setSearchTerm(value);
                  }, DEBOUNCE_DELAY);
                }}
                defaultValue={searchTerm}
              />
              {searchTerm && (
                <button 
                  className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => {
                    setSearchTerm('');
                    const searchInput = document.getElementById('journal-search') as HTMLInputElement;
                    if (searchInput) {
                      searchInput.value = '';
                    }
                  }}
                >
                  <i className="fas fa-times text-sm"></i>
                </button>
              )}
            </div>
          </div>
        )}
          {/* Filter options */}
        {isFilterOpen && (
          <div className="mb-6 p-4 sm:p-6 bg-muted/30 rounded-lg border border-muted transition-all">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
              <h3 className="font-medium text-sm">Filter & Sort Options</h3>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedMoods([]);
                  setSelectedTags([]);
                  setSelectedDateRange('all');
                  setSortOrder('newest');
                  
                  // Also reset the search input field
                  const searchInput = document.getElementById('journal-search') as HTMLInputElement;
                  if (searchInput) {
                    searchInput.value = '';
                  }
                }}
                className="text-xs px-3 py-2 bg-muted rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200 active:scale-95 flex items-center gap-2 self-start sm:self-auto"
              >
                <i className="fas fa-undo text-xs"></i>
                <span>Reset all filters</span>
              </button>
            </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Mood filter */}
              <div>
                <h4 className="text-xs font-medium mb-3 text-muted-foreground">Mood</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                  {['joy', 'love', 'surprise', 'neutral', 'fear', 'anger', 'sadness'].map((mood) => (
                    <button
                      key={mood}
                      onClick={() => {
                        setSelectedMoods(prev => {
                          if (prev.includes(mood)) {
                            return prev.filter(m => m !== mood);
                          } else {
                            return [...prev, mood];
                          }
                        });
                      }}                      className={`px-3 py-2 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 min-h-[2.5rem] transition-all duration-200 ${
                        selectedMoods.includes(mood) 
                          ? 'bg-primary text-white shadow-sm' 
                          : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:scale-105 active:scale-95'
                      }`}                    >
                      {selectedMoods.includes(mood) ? (
                        <i className={`fas ${
                          mood === 'joy' ? 'fa-smile' : 
                          mood === 'neutral' ? 'fa-meh' : 
                          mood === 'fear' ? 'fa-frown' : 
                          mood === 'love' ? 'fa-peace' : 
                          mood === 'surprise' ? 'fa-surprise' : 
                          mood === 'anger' ? 'fa-angry' : 
                          mood === 'sadness' ? 'fa-sad-tear' : 'fa-meh'
                        } text-white`}></i>
                      ) : (
                        getMoodIcon(mood)
                      )}
                      <span className="hidden sm:inline md:hidden lg:inline">{mood.charAt(0).toUpperCase() + mood.slice(1)}</span>
                      <span className="sm:hidden md:inline lg:hidden">{mood.charAt(0).toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Tag filter */}
              <div>
                <h4 className="text-xs font-medium mb-3 text-muted-foreground">Common Tags</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-hidden">
                  {journalEntries.reduce((tags, entry) => {
                    entry.tags.forEach(tag => {
                      if (!tags.includes(tag)) {
                        tags.push(tag);
                      }
                    });
                    return tags;
                  }, [] as string[]).slice(0, 12).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSelectedTags(prev => {
                          if (prev.includes(tag)) {
                            return prev.filter(t => t !== tag);
                          } else {
                            return [...prev, tag];
                          }
                        });
                      }}                      className={`px-3 py-2 rounded-md text-xs font-medium flex items-center justify-center gap-1 min-h-[2.5rem] transition-all duration-200 ${
                        selectedTags.includes(tag) 
                          ? 'bg-primary text-white shadow-sm' 
                          : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:scale-105 active:scale-95'
                      }`}
                    >
                      <span className="truncate">#{tag}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Date filter and sort options */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-medium mb-3 text-muted-foreground">Date Range</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'all', label: 'All time' },
                      { value: 'today', label: 'Today' },
                      { value: 'week', label: 'This week' },
                      { value: 'month', label: 'This month' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSelectedDateRange(option.value as 'all' | 'today' | 'week' | 'month')}
                        className={`px-3 py-2 rounded-md text-xs font-medium min-h-[2.5rem] transition-all duration-200 ${
                          selectedDateRange === option.value 
                            ? 'bg-primary text-white shadow-sm' 
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:scale-105 active:scale-95'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium mb-3 text-muted-foreground">Sort By</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { value: 'newest', label: 'Newest first', icon: 'fa-arrow-down' },
                      { value: 'oldest', label: 'Oldest first', icon: 'fa-arrow-up' },
                      { value: 'mood-desc', label: 'Mood ↓', icon: 'fa-sort-amount-down' },
                      { value: 'mood-asc', label: 'Mood ↑', icon: 'fa-sort-amount-up' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortOrder(option.value as 'newest' | 'oldest' | 'mood-asc' | 'mood-desc')}
                        className={`px-3 py-2 rounded-md text-xs font-medium flex items-center justify-center gap-2 min-h-[2.5rem] transition-all duration-200 ${
                          sortOrder === option.value 
                            ? 'bg-primary text-white shadow-sm' 
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:scale-105 active:scale-95'
                        }`}
                      >
                        <i className={`fas ${option.icon} text-xs`}></i>
                        <span className="truncate">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}          {journalEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-muted-foreground">
              <i className="fas fa-book-open text-5xl mb-4"></i>
              <h3 className="text-xl font-medium mb-2">No journal entries yet</h3>
              <p className="max-w-md mx-auto mb-6">Start writing in the journal above to record your thoughts, feelings, and experiences.</p>
              <p className="text-sm">Your journal entries will appear here once you save them.</p>
            </div>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="text-muted-foreground">
              <i className="fas fa-filter text-3xl mb-3"></i>
              <h3 className="text-lg font-medium mb-2">No matching entries found</h3>
              <p className="max-w-md mx-auto mb-4">Try adjusting your search or filter criteria.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedMoods([]);
                  setSelectedTags([]);
                  setSelectedDateRange('all');
                  setSortOrder('newest');
                  
                  const searchInput = document.getElementById('journal-search') as HTMLInputElement;
                  if (searchInput) {
                    searchInput.value = '';
                  }
                }}
                className="text-primary hover:underline"
              >
                Reset all filters
              </button>
            </div>
          </div>        ) : (
          <div className={`
            ${viewMode === 'card' ? 'space-y-5' : ''}
            ${viewMode === 'list' ? 'divide-y divide-muted' : ''}
            ${viewMode === 'compact' ? 'border border-muted rounded-lg overflow-hidden' : ''}
          `}>   
            <div 
              ref={scrollContainerRef}
              className="max-h-[600px] overflow-y-auto scroll-smooth"
              onScroll={handleScroll}
            >{displayedEntries.map((entry) => (
                <JournalEntryItem
                  key={entry.id}
                  entry={entry}
                  viewMode={viewMode}
                  onDelete={openDeleteModal}
                />
              ))}
              
              {isLoadingMore && (
                <div className="flex justify-center py-4">
                  <div className="flex items-center text-muted-foreground">
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Loading more entries...
                  </div>
                </div>
              )}
              
              {!hasMoreEntries && displayedEntries.length > 0 && (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  <i className="fas fa-check-circle mr-2"></i>
                  All entries loaded
                </div>
              )}
            </div>
          </div>
        )}
      </div>      
      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-200 ease-in-out">
          <div className="delete-modal-content bg-background rounded-lg shadow-lg p-6 max-w-md w-full mx-4 transition-transform duration-200 ease-in-out">
            <h3 className="text-lg font-semibold mb-2">Delete Journal Entry?</h3>
            <p className="text-muted-foreground mb-4">This action cannot be undone. This journal entry will be permanently deleted.</p>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={closeDeleteModal}
                className="px-4 py-2 rounded-md text-sm font-medium bg-muted hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteEntry}
                className="px-4 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Deleting...
                  </span>
                ) : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}