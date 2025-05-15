"use client";

import React, { useState, useEffect } from 'react';
import { RecommendationItem, getSampleRecommendations } from '@/data/recommendationsData';

const Recommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch sample recommendations when component mounts
  useEffect(() => {
    // Simulate API delay for demo purposes
    const timer = setTimeout(() => {
      const sampleRecs = getSampleRecommendations(3);
      setRecommendations(sampleRecs);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const renderIcon = (icon: string, color: string) => {
    let colorClass = '';
      switch (color) {
      case 'indigo':
        colorClass = 'bg-indigo-100 text-indigo-600';
        break;
      case 'green':
        colorClass = 'bg-green-100 text-green-600';
        break;
      case 'blue':
        colorClass = 'bg-blue-100 text-blue-600';
        break;
      case 'amber':
        colorClass = 'bg-amber-100 text-amber-600';
        break;
      case 'purple':
        colorClass = 'bg-purple-100 text-purple-600';
        break;
      case 'teal':
        colorClass = 'bg-teal-100 text-teal-600';
        break;
      case 'red':
        colorClass = 'bg-red-100 text-red-600';
        break;
      case 'orange':
        colorClass = 'bg-orange-100 text-orange-600';
        break;
      default:
        colorClass = 'bg-primary-light/20 text-primary';
    }

   switch (icon) {
    case 'lungs':
      return (
        <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center`}>
          <i className="fas fa-lungs text-sm"></i>
        </div>
      );
    case 'person-walking':
      return (
        <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center`}>
          <i className="fas fa-walking text-sm"></i>
        </div>
      );
    case 'cloud':
      return (
        <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center`}>
          <i className="fas fa-cloud text-sm"></i>
        </div>
      );
    case 'book':
      return (
        <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center`}>
          <i className="fas fa-book text-sm"></i>
        </div>
      );
    case 'document':
      return (
        <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center`}>
          <i className="fas fa-file-alt text-sm"></i>
        </div>
      );
    case 'anchor':
      return (
        <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center`}>
          <i className="fas fa-anchor text-sm"></i>
        </div>
      );
    case 'phone':
      return (
        <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center`}>
          <i className="fas fa-phone text-sm"></i>
        </div>
      );
    case 'shield':
      return (
        <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center`}>
          <i className="fas fa-shield-alt text-sm"></i>
        </div>
      );
    case 'sun':
      return (
        <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center`}>
          <i className="fas fa-sun text-sm"></i>
        </div>
      );
    case 'heart':
      return (
        <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center`}>
          <i className="fas fa-heart text-sm"></i>
        </div>
      );
    case 'people-arrows':
      return (
        <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center`}>
          <i className="fas fa-arrows-alt-h text-sm"></i>
        </div>
      );
    case 'check':
      return (
        <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center`}>
          <i className="fas fa-check text-sm"></i>
        </div>
      );
    case 'user-doctor':
      return (
        <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center`}>
          <i className="fas fa-user-md text-sm"></i>
        </div>
      );
    case 'calendar':
      return (
        <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center`}>
          <i className="fas fa-calendar-alt text-sm"></i>
        </div>
      );
    case 'dumbbell':
      return (
        <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center`}>
          <i className="fas fa-dumbbell text-sm"></i>
        </div>
      );
    case 'home':
      return (
        <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center`}>
          <i className="fas fa-home text-sm"></i>
        </div>
      );
    case 'brain':
      return (
        <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center`}>
          <i className="fas fa-brain text-sm"></i>
        </div>
      );
    case 'fire':
      return (
        <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center`}>
          <i className="fas fa-fire text-sm"></i>
        </div>
      );
    default:
      return (
        <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center`}>
          <i className="fas fa-question text-sm"></i>
        </div>
      );
  };
  }
  return (
    <div className="bg-background rounded-xl shadow-sm border border-muted overflow-hidden">      <div className="p-4 border-b border-muted flex justify-between items-center">
        <h3 className="text-sm font-medium text-foreground">Recommendations</h3>
        <a href="/dashboard/resources" className="text-xs font-medium text-primary hover:text-primary/80">
          See all
        </a>
      </div>
      
      <div className="divide-y divide-muted">
        {isLoading ? (
          // Loading state
          Array.from({ length: 3 }).map((_, index) => (
            <div key={`loading-${index}`} className="p-4 animate-pulse">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-muted"></div>
                <div className="ml-3 flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          recommendations.map(rec => (
            <div key={rec.id} className="p-4 hover:bg-muted/40 transition-colors">
              <a href={rec.link} className="flex items-center">
                {renderIcon(rec.icon, rec.color)}
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-foreground">{rec.title}</h4>
                  <p className="text-xs text-muted-foreground">{rec.description}</p>
                </div>
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Recommendations;