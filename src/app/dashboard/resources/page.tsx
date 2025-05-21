"use client";

import React, { useState, useEffect } from 'react';
import { RecommendationItem, recommendationsData } from '@/data/recommendationsData';

type Resource = {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'podcast' | 'exercise' | 'tool';
  tags: string[];
  url: string;
  imageUrl?: string;
  duration?: string;
};

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCondition, setActiveCondition] = useState<string | null>(null);
  // Get all recommendations as a flat array
  const getAllRecommendations = (): RecommendationItem[] => {
    const allRecs: RecommendationItem[] = [];
    
    // Loop through each condition (anxiety, depression, stress)
    Object.entries(recommendationsData).forEach(([condition, severityLevels]) => {
      // Loop through each severity level
      Object.values(severityLevels).forEach(recommendations => {
        // Add all recommendations for this severity level
        allRecs.push(...(recommendations as RecommendationItem[]));
      });
    });
    
    return allRecs;
  };
  
  const allRecommendations = getAllRecommendations();
    // Convert recommendations to resources format  // Helper function to get a condition-specific styling
  const getConditionStyling = (resourceId: string) => {
    if (resourceId.startsWith('anx')) {
      return {
        bgColor: 'bg-indigo-100',
        textColor: 'text-indigo-600',
        darkBgColor: 'bg-indigo-600',
        darkTextColor: 'text-white',
        hoverColor: 'hover:bg-indigo-200',
        borderColor: 'border-indigo-200',
      };
    } else if (resourceId.startsWith('dep')) {
      return {
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-600',
        darkBgColor: 'bg-blue-600',
        darkTextColor: 'text-white',
        hoverColor: 'hover:bg-blue-200',
        borderColor: 'border-blue-200',
      };
    } else {
      return {
        bgColor: 'bg-teal-100',
        textColor: 'text-teal-600',
        darkBgColor: 'bg-teal-600',
        darkTextColor: 'text-white',
        hoverColor: 'hover:bg-teal-200',
        borderColor: 'border-teal-200',
      };
    }
  };

  const mapRecommendationsToResources = (): Resource[] => {
    return allRecommendations.map(rec => {
      // Determine resource type based on tags or description
      let type: 'article' | 'video' | 'podcast' | 'exercise' | 'tool' = 'article';
      
      if (rec.tags?.some(tag => ['guided', 'meditation', 'breathing', 'stretches', 'relaxation'].includes(tag))) {
        type = 'exercise';
      } else if (rec.tags?.some(tag => ['cbt', 'worksheet', 'therapy', 'technique'].includes(tag))) {
        type = 'tool';
      } else if (rec.title.toLowerCase().includes('journal') || 
                rec.title.toLowerCase().includes('plan') ||
                rec.description.toLowerCase().includes('plan')) {
        type = 'tool';
      }
      
      // Create placeholder images based on mental health condition
      let imageUrl: string | undefined = undefined;
      
      if (rec.id.startsWith('anx')) {
        imageUrl = 'https://images.unsplash.com/photo-1633526543814-9718c8922b7a';
      } else if (rec.id.startsWith('dep')) {
        imageUrl = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2';
      } else if (rec.id.startsWith('str')) {
        imageUrl = 'https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1';
      }
      
      // Generate duration based on resource type
      let duration: string | undefined = undefined;
      if (type === 'exercise') {
        duration = '5-15 min';
      } else if (type === 'article') {
        duration = '10 min read';
      }
      
      return {
        id: rec.id,
        title: rec.title,
        description: rec.description,
        type,
        tags: rec.tags || [],
        url: rec.link,
        imageUrl,
        duration
      };
    });
  };
  
  const resources = mapRecommendationsToResources();
  // Get currently active condition count
  const getActiveConditionCount = () => {
    if (!activeCondition) return filteredResources.length;
    
    return filteredResources.filter(resource => 
      (activeCondition === 'anxiety' && resource.id.startsWith('anx')) ||
      (activeCondition === 'depression' && resource.id.startsWith('dep')) ||
      (activeCondition === 'stress' && resource.id.startsWith('str'))
    ).length;
  };  // Get condition information
  const getConditionInfo = (condition: string | null) => {
    switch (condition) {
      case 'anxiety':
        return {
          title: "Anxiety Resources",
          description: "Tools and exercises to help manage anxiety symptoms",
          color: "indigo"
        };
      case 'depression':
        return {
          title: "Depression Resources",
          description: "Support for improving mood and managing depression",
          color: "blue"
        };
      case 'stress':
        return {
          title: "Stress Management",
          description: "Techniques to reduce stress and prevent burnout",
          color: "teal"
        };
      default:
        return {
          title: "Mental Health Resources",
          description: "Personalized tools for your mental wellbeing journey",
          color: "primary"
        };
    }
  };
    

  // Filter resources based on active condition, category and search query
  const filteredResources = resources.filter(resource => {
    // Filter by condition
    const matchesCondition = !activeCondition || 
      (activeCondition === 'anxiety' && resource.id.startsWith('anx')) ||
      (activeCondition === 'depression' && resource.id.startsWith('dep')) ||
      (activeCondition === 'stress' && resource.id.startsWith('str'));
    
    // Filter by resource type/category
    const matchesCategory = activeCategory === 'all' || resource.type === activeCategory;
    
    // Filter by search query
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCondition && matchesCategory && matchesSearch;
  });

  return (
      <div className="max-w-8xl mx-auto">
        <div className="bg-background rounded-xl shadow-sm p-6 border border-muted mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {getConditionInfo(activeCondition).title}
            </h2>
            <p className="text-muted-foreground mt-1">
              {getConditionInfo(activeCondition).description}
            </p>
            <div className="mt-2 text-sm">
              <span className="font-medium">{getActiveConditionCount()}</span> resources available
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">          <div className="flex flex-col gap-4 mb-4">
            {/* Condition filters */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              <button
                className={`flex-shrink-0 px-3 py-1.5 text-sm font-medium rounded-md ${
                  activeCondition === null 
                    ? 'bg-primary text-white' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
                onClick={() => setActiveCondition(null)}
              >
                All Conditions
              </button>
              <button
                className={`flex-shrink-0 px-3 py-1.5 text-sm font-medium rounded-md ${
                  activeCondition === 'anxiety' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                }`}
                onClick={() => setActiveCondition('anxiety')}
              >
                Anxiety
              </button>
              <button
                className={`flex-shrink-0 px-3 py-1.5 text-sm font-medium rounded-md ${
                  activeCondition === 'depression' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
                onClick={() => setActiveCondition('depression')}
              >
                Depression
              </button>
              <button
                className={`flex-shrink-0 px-3 py-1.5 text-sm font-medium rounded-md ${
                  activeCondition === 'stress' 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-teal-100 text-teal-600 hover:bg-teal-200'
                }`}
                onClick={() => setActiveCondition('stress')}
              >
                Stress
              </button>
            </div>
            
            {/* Resource type filters */}
            <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0">
              <button
                className={`flex-shrink-0 px-3 py-1.5 text-sm font-medium rounded-md ${
                  activeCategory === 'all' 
                    ? 'bg-primary text-white' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
                onClick={() => setActiveCategory('all')}
              >
                All Types
              </button>
              <button
                className={`flex-shrink-0 px-3 py-1.5 text-sm font-medium rounded-md ${
                  activeCategory === 'exercise' 
                    ? 'bg-primary text-white' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
                onClick={() => setActiveCategory('exercise')}
              >
                Exercises
              </button>
              <button
                className={`flex-shrink-0 px-3 py-1.5 text-sm font-medium rounded-md ${
                  activeCategory === 'tool' 
                    ? 'bg-primary text-white' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
                onClick={() => setActiveCategory('tool')}
              >
                Tools
              </button>
              <button
                className={`flex-shrink-0 px-3 py-1.5 text-sm font-medium rounded-md ${
                  activeCategory === 'article' 
                    ? 'bg-primary text-white' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
                onClick={() => setActiveCategory('article')}
              >
                Resources
              </button>
            </div>
          </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full md:w-64 px-4 py-2 pl-10 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <i className="fas fa-search text-muted-foreground"></i>
              </div>
            </div>
          </div>
          
          {filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-muted">
                <i className="fas fa-search text-muted-foreground text-2xl"></i>
              </div>
              <h3 className="mt-4 text-lg font-medium text-foreground">No resources found</h3>
              <p className="mt-2 text-muted-foreground">Try adjusting your filters or search query</p>
            </div>
          ) : (            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map(resource => (                <div key={resource.id} className="flex flex-col border border-muted rounded-lg overflow-hidden transition-all hover:shadow-md hover:border-primary/30 h-full bg-gradient-to-b from-background to-background/50">
                  {/* Image area with condition-based styling */}
                  <div className="h-40 relative bg-muted/30">
                    {resource.imageUrl ? (
                      <>
                        <div 
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${resource.imageUrl})` }}
                        ></div>
                        <div className={`absolute inset-0 ${
                          resource.id.startsWith('anx') ? 'bg-indigo-950/40' : 
                          resource.id.startsWith('dep') ? 'bg-blue-950/40' : 
                          'bg-teal-950/40'
                        } flex items-center justify-center`}>
                          <div className={`w-14 h-14 rounded-full ${
                            resource.id.startsWith('anx') ? 'bg-indigo-100 text-indigo-600' : 
                            resource.id.startsWith('dep') ? 'bg-blue-100 text-blue-600' : 
                            'bg-teal-100 text-teal-600'
                          } flex items-center justify-center`}>                            {(() => {
                              // Find the original recommendation to get the icon
                              const origRec = allRecommendations.find(r => r.id === resource.id);
                              const iconName = origRec?.icon || 'lightbulb';
                              
                              let iconClass = '';
                              switch (iconName) {
                                case 'lungs': iconClass = 'fas fa-lungs'; break;
                                case 'person-walking': iconClass = 'fas fa-walking'; break;
                                case 'cloud': iconClass = 'fas fa-cloud'; break;
                                case 'book': iconClass = 'fas fa-book'; break;
                                case 'document': iconClass = 'fas fa-file-alt'; break;
                                case 'anchor': iconClass = 'fas fa-anchor'; break;
                                case 'phone': iconClass = 'fas fa-phone'; break;
                                case 'shield': iconClass = 'fas fa-shield-alt'; break;
                                case 'sun': iconClass = 'fas fa-sun'; break;
                                case 'heart': iconClass = 'fas fa-heart'; break;
                                case 'people-arrows': iconClass = 'fas fa-people-arrows'; break;
                                case 'check': iconClass = 'fas fa-check'; break;
                                case 'user-doctor': iconClass = 'fas fa-user-md'; break;
                                case 'calendar': iconClass = 'fas fa-calendar-alt'; break;
                                case 'dumbbell': iconClass = 'fas fa-dumbbell'; break;
                                case 'home': iconClass = 'fas fa-home'; break;
                                case 'brain': iconClass = 'fas fa-brain'; break;
                                case 'fire': iconClass = 'fas fa-fire'; break;
                                default: iconClass = 'fas fa-lightbulb';
                              }
                              
                              return <i className={`${iconClass} text-lg`}></i>;
                            })()}
                          </div>
                        </div>
                      </>
                    ) : (
                      // Gradient background with condition-based colors
                      <div className={`absolute inset-0 ${
                        resource.id.startsWith('anx') ? 'bg-gradient-to-br from-indigo-50 to-indigo-200' : 
                        resource.id.startsWith('dep') ? 'bg-gradient-to-br from-blue-50 to-blue-200' : 
                        'bg-gradient-to-br from-teal-50 to-teal-200'
                      } flex items-center justify-center`}>
                        <div className={`w-14 h-14 rounded-full ${
                          resource.id.startsWith('anx') ? 'bg-indigo-100 text-indigo-600' : 
                          resource.id.startsWith('dep') ? 'bg-blue-100 text-blue-600' : 
                          'bg-teal-100 text-teal-600'
                        } flex items-center justify-center`}>                          {(() => {
                            // Find the original recommendation to get the icon
                            const origRec = allRecommendations.find(r => r.id === resource.id);
                            const iconName = origRec?.icon || 'lightbulb';
                            
                            let iconClass = '';
                            switch (iconName) {
                              case 'lungs': iconClass = 'fas fa-lungs'; break;
                              case 'person-walking': iconClass = 'fas fa-walking'; break;
                              case 'cloud': iconClass = 'fas fa-cloud'; break;
                              case 'book': iconClass = 'fas fa-book'; break;
                              case 'document': iconClass = 'fas fa-file-alt'; break;
                              case 'anchor': iconClass = 'fas fa-anchor'; break;
                              case 'phone': iconClass = 'fas fa-phone'; break;
                              case 'shield': iconClass = 'fas fa-shield-alt'; break;
                              case 'sun': iconClass = 'fas fa-sun'; break;
                              case 'heart': iconClass = 'fas fa-heart'; break;
                              case 'people-arrows': iconClass = 'fas fa-people-arrows'; break;
                              case 'check': iconClass = 'fas fa-check'; break;
                              case 'user-doctor': iconClass = 'fas fa-user-md'; break;
                              case 'calendar': iconClass = 'fas fa-calendar-alt'; break;
                              case 'dumbbell': iconClass = 'fas fa-dumbbell'; break;
                              case 'home': iconClass = 'fas fa-home'; break;
                              case 'brain': iconClass = 'fas fa-brain'; break;
                              case 'fire': iconClass = 'fas fa-fire'; break;
                              default: iconClass = 'fas fa-lightbulb';
                            }
                            
                            return <i className={`${iconClass} text-lg`}></i>;
                          })()}
                        </div>
                      </div>
                    )}
                    
                    {/* Condition and severity badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm ${
                        resource.id.startsWith('anx') ? 'bg-indigo-600 text-white' : 
                        resource.id.startsWith('dep') ? 'bg-blue-600 text-white' : 
                        'bg-teal-600 text-white'
                      }`}>
                        {resource.id.startsWith('anx') ? 'Anxiety' : 
                         resource.id.startsWith('dep') ? 'Depression' : 'Stress'}
                        {resource.id.includes('min') ? ' - Minimal' : 
                         resource.id.includes('mild') ? ' - Mild' : 
                         resource.id.includes('mod') && !resource.id.includes('modsev') ? ' - Moderate' :
                         resource.id.includes('modsev') ? ' - Moderately Severe' :
                         resource.id.includes('sev') ? ' - Severe' :
                         resource.id.includes('low') ? ' - Low' :
                         resource.id.includes('high') ? ' - High' : ''}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content area - with flex layout for consistent spacing */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-wrap gap-1">
                        {resource.tags.slice(0, 2).map((tag, idx) => (
                          <span key={idx} className={`text-xs px-2 py-1 rounded-full ${
                            resource.id.startsWith('anx') ? 'bg-indigo-100 text-indigo-600' : 
                            resource.id.startsWith('dep') ? 'bg-blue-100 text-blue-600' : 
                            'bg-teal-100 text-teal-600'
                          }`}>
                            #{tag}
                          </span>
                        ))}
                        {resource.tags.length > 2 && (
                          <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                            +{resource.tags.length - 2}
                          </span>
                        )}
                      </div>
                      {resource.duration && (
                        <span className="text-xs text-muted-foreground">
                          <i className="fas fa-clock mr-1"></i> {resource.duration}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 min-h-[3.5rem]">
                      {resource.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-grow">
                      {resource.description}
                    </p>
                    
                    <a
                      href={resource.url}
                      className={`block w-full py-2 text-center text-sm font-medium text-white rounded-md transition-colors mt-auto ${
                        resource.id.startsWith('anx') ? 'bg-indigo-600 hover:bg-indigo-700' : 
                        resource.id.startsWith('dep') ? 'bg-blue-600 hover:bg-blue-700' : 
                        'bg-teal-600 hover:bg-teal-700'
                      }`}
                    >
                      {resource.type === 'article' ? 'View Resource' : 
                       resource.type === 'exercise' ? 'Start Exercise' : 
                       'Open Tool'}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
  );
} 