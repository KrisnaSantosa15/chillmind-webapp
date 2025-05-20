"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { recommendationsData, RecommendationItem } from '@/data/recommendationsData';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';

// Helper function to find a recommendation by slug from the data
const findRecommendationBySlug = (slug: string): RecommendationItem | null => {
  // Flatten all recommendations into a single array to search
  const allRecommendations = Object.values(recommendationsData).flatMap(
    severityLevels => Object.values(severityLevels).flat()
  );
  
  // Find the recommendation with a matching slug from the link
  const recommendation = allRecommendations.find(rec => {
    // Extract the slug from the link (e.g., "/dashboard/resources/mindful-breathing" -> "mindful-breathing")
    const linkSlug = rec.link.split('/').pop();
    return linkSlug === slug;
  });
  
  return recommendation || null;
};

export default function ResourcePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [recommendation, setRecommendation] = useState<RecommendationItem | null>(null);
  const [relatedResources, setRelatedResources] = useState<RecommendationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
    // Find related resources based on tags
  const findRelatedResources = (currentRec: RecommendationItem): RecommendationItem[] => {
    if (!currentRec.tags || currentRec.tags.length === 0) return [];
    
    // Flatten all recommendations into a single array
    const allRecommendations = Object.values(recommendationsData).flatMap(
      severityLevels => Object.values(severityLevels).flat()
    );
    
    // Filter out the current recommendation and find recommendations with matching tags
    return allRecommendations
      .filter(rec => rec.id !== currentRec.id) // Exclude current recommendation
      .filter(rec => rec.tags?.some((tag: string) => currentRec.tags?.includes(tag))) // Match at least one tag
      .sort((a, b) => {
        // Sort by number of matching tags (descending)
        const aMatchCount = a.tags?.filter((tag: string) => currentRec.tags?.includes(tag)).length || 0;
        const bMatchCount = b.tags?.filter((tag: string) => currentRec.tags?.includes(tag)).length || 0;
        return bMatchCount - aMatchCount;
      })
      .slice(0, 2); // Get top 2 related resources
  };
  
  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      const foundRecommendation = findRecommendationBySlug(slug);
      setRecommendation(foundRecommendation);
      
      if (foundRecommendation) {
        const relatedRecs = findRelatedResources(foundRecommendation);
        setRelatedResources(relatedRecs);
      }
      
      setIsLoading(false);
    }, 500);
  }, [slug]);
  // For rendering the icon at the top of the page
  const renderIcon = (icon: string, color: string) => {
    let colorClass = '';
    switch (color) {
      case 'indigo': colorClass = 'bg-indigo-100 text-indigo-600'; break;
      case 'blue': colorClass = 'bg-blue-100 text-blue-600'; break;
      case 'teal': colorClass = 'bg-teal-100 text-teal-600'; break;
      case 'amber': colorClass = 'bg-amber-100 text-amber-600'; break;
      case 'green': colorClass = 'bg-green-100 text-green-600'; break;
      case 'pink': colorClass = 'bg-pink-100 text-pink-600'; break;
      case 'purple': colorClass = 'bg-purple-100 text-purple-600'; break;
      case 'orange': colorClass = 'bg-orange-100 text-orange-600'; break;
      case 'red': colorClass = 'bg-red-100 text-red-600'; break;
      default: colorClass = 'bg-primary-light/20 text-primary';
    }

    // A comprehensive icon rendering function
    let iconClass = '';
    switch (icon) {
      // Anxiety icons
      case 'lungs': iconClass = 'fas fa-lungs'; break;
      case 'person-walking': iconClass = 'fas fa-person-walking'; break;
      case 'cloud': iconClass = 'fas fa-cloud'; break;
      case 'book': iconClass = 'fas fa-book'; break;
      case 'document': iconClass = 'fas fa-file-alt'; break;
      case 'anchor': iconClass = 'fas fa-anchor'; break;
      case 'phone': iconClass = 'fas fa-phone'; break;
      case 'shield': iconClass = 'fas fa-shield-alt'; break;
      
      // Depression icons
      case 'sun': iconClass = 'fas fa-sun'; break;
      case 'heart': iconClass = 'fas fa-heart'; break;
      case 'people-arrows': iconClass = 'fas fa-people-arrows'; break;
      case 'check': iconClass = 'fas fa-check'; break;
      case 'user-doctor': iconClass = 'fas fa-user-md'; break;
      case 'calendar': iconClass = 'fas fa-calendar'; break;
      
      // Stress icons
      case 'dumbbell': iconClass = 'fas fa-dumbbell'; break;
      case 'home': iconClass = 'fas fa-home'; break;
      case 'fire': iconClass = 'fas fa-fire'; break;
      
      // General icons
      case 'walking': iconClass = 'fas fa-walking'; break;
      case 'sound': iconClass = 'fas fa-volume-up'; break;
      case 'moon': iconClass = 'fas fa-moon'; break;
      case 'people': iconClass = 'fas fa-users'; break;
      default: iconClass = 'fas fa-question';
    }

    return (
      <div className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center`}>
        <i className={`${iconClass} text-lg`}></i>
      </div>
    );
  };

  return (
      <div className="max-w-3xl mx-auto">
        {isLoading ? (
          // Loading skeleton
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-5/6 mb-6"></div>
            <div className="h-32 bg-muted rounded w-full mb-6"></div>
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-4/6 mb-2"></div>
            <div className="h-4 bg-muted rounded w-5/6 mb-6"></div>
          </div>
        ) : recommendation ? (
          <>            {/* Header with condition badge */}            <div className="mb-2">
              <Link 
                href="/dashboard/resources" 
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
              >
                <i className="fas fa-arrow-left mr-2 text-xs"></i>
                Back to resources
              </Link>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                  recommendation.id.startsWith('anx') ? 'bg-indigo-600 text-white' :
                  recommendation.id.startsWith('dep') ? 'bg-blue-600 text-white' :
                  'bg-teal-600 text-white'
                }`}>
                  {recommendation.id.startsWith('anx') ? 'Anxiety' : 
                   recommendation.id.startsWith('dep') ? 'Depression' : 'Stress'}
                </span>
                
                <h1 className="text-3xl font-bold text-foreground">{recommendation.title}</h1>
              </div>
              
              <div className={`mt-4 md:mt-0 w-16 h-16 rounded-full flex items-center justify-center ${
                recommendation.id.startsWith('anx') ? 'bg-indigo-100 text-indigo-600' :
                recommendation.id.startsWith('dep') ? 'bg-blue-100 text-blue-600' :
                'bg-teal-100 text-teal-600'
              }`}>
                {renderIcon(recommendation.icon, 
                          recommendation.id.startsWith('anx') ? 'indigo' :
                          recommendation.id.startsWith('dep') ? 'blue' : 'teal')}
              </div>
            </div>
            
            <p className="text-lg text-muted-foreground mb-6">
              {recommendation.description}
            </p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {recommendation.tags?.map((tag: string) => (
                <span key={tag} className={`px-3 py-1 rounded-full text-sm ${
                  recommendation.id.startsWith('anx') ? 'bg-indigo-100 text-indigo-600' :
                  recommendation.id.startsWith('dep') ? 'bg-blue-100 text-blue-600' :
                  'bg-teal-100 text-teal-600'
                }`}>
                  #{tag}
                </span>
              ))}
            </div>
              {/* Content area - dynamic based on recommendation type and content */}
            <div className="prose prose-sm dark:prose-invert max-w-none">              <div className={`p-6 rounded-lg border mb-8 ${
                recommendation.id.startsWith('anx') ? 'border-indigo-300  dark:border-indigo-900' :
                recommendation.id.startsWith('dep') ? 'border-blue-300  dark:border-blue-900' :
                'border-teal-300  dark:border-teal-900'
              }`}>                <h2 className={`${
                  recommendation.id.startsWith('anx') ? 'text-indigo-800 dark:text-indigo-300' :
                  recommendation.id.startsWith('dep') ? 'text-blue-800 dark:text-blue-300' :
                  'text-teal-800 dark:text-teal-300'
                } font-medium mb-2`}>About this resource</h2>
                <p>This resource is designed specifically for {
                  recommendation.id.startsWith('anx') ? 'anxiety management' :
                  recommendation.id.startsWith('dep') ? 'improving mood and managing depression symptoms' :
                  'stress reduction'
                }.</p>
                
                {recommendation.content?.type && (
                  <div className="mt-2 flex items-center">
                    <span className="text-sm font-medium mr-2">Type:</span>                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      recommendation.id.startsWith('anx') ? 'bg-indigo-600 text-white dark:bg-indigo-900 dark:text-indigo-100' :
                      recommendation.id.startsWith('dep') ? 'bg-blue-600 text-white dark:bg-blue-900 dark:text-blue-100' :
                      'bg-teal-600 text-white dark:bg-teal-900 dark:text-teal-100'
                    }`}>
                      {recommendation.content.type.charAt(0).toUpperCase() + recommendation.content.type.slice(1)}
                    </span>
                    
                    {recommendation.content.duration && (
                      <span className="ml-3 text-sm text-muted-foreground">
                        <i className="fas fa-clock mr-1 text-xs"></i>
                        {recommendation.content.duration}
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              {/* Display dynamic content based on the content data */}
              {recommendation.content ? (
                <>
                  {/* Instructions */}
                  {recommendation.content.instructions && (
                    <div className="mb-6">
                      <h3>Instructions</h3>
                      <p>{recommendation.content.instructions}</p>
                    </div>
                  )}
                  
                  {/* Materials needed */}
                  {recommendation.content.materials && recommendation.content.materials.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium">Materials Needed:</h4>
                      <ul className="list-disc pl-5 mt-2">
                        {recommendation.content.materials.map((material, index) => (
                          <li key={index}>{material}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Steps */}
                  {recommendation.content.steps && recommendation.content.steps.length > 0 && (
                    <div className="mb-6">
                      <h3>Steps to Follow</h3>
                      <ol className="mt-3 space-y-4">
                        {recommendation.content.steps.map((step, index) => (
                          <li key={index} className="pl-2">
                            <h4 className="font-medium text-base">{index + 1}. {step.title}</h4>
                            <p className="mt-1 text-muted-foreground">{step.description}</p>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}                  {/* Article text - in an accordion */}
                  {recommendation.content.articleText && (
                    <div className="mb-6">
                      <Accordion>
                        <AccordionItem 
                          id="article-text" 
                          title={`More Information: Understanding ${
                            recommendation.id.startsWith('anx') ? 'Anxiety Management' :
                            recommendation.id.startsWith('dep') ? 'Depression Relief' : 
                            'Stress Reduction'
                          }`}
                        >
                          <div className="whitespace-pre-line">
                            {recommendation.content.articleText}
                          </div>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  )}
                  
                  {/* Media content */}
                  {recommendation.content.mediaUrl && (
                    <div className="mb-6">
                      {recommendation.content.type === "video" ? (
                        <div className="aspect-w-16 aspect-h-9 mt-4 rounded-lg overflow-hidden">
                          <video 
                            controls
                            className="w-full h-auto rounded-lg"
                            src={recommendation.content.mediaUrl}
                          >
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      ) : recommendation.content.type === "audio" ? (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Audio Guide</h4>
                          <audio 
                            controls
                            className="w-full"
                            src={recommendation.content.mediaUrl}
                          >
                            Your browser does not support the audio tag.
                          </audio>
                        </div>
                      ) : null}
                    </div>
                  )}                    {/* Tool URL */}
                  {recommendation.content.toolUrl && (
                    <div className="mb-6">
                      <h4 className="font-medium mb-2">Interactive Tool</h4>                      <Link 
                        href={`/dashboard/coming-soon?tool=${encodeURIComponent(recommendation.title + " Interactive Tool")}&return=${encodeURIComponent("/dashboard/resources/" + slug)}`}
                        className={`inline-block px-4 py-2 rounded-md ${
                          recommendation.id.startsWith('anx') ? 'bg-indigo-600 hover:bg-indigo-700' :
                          recommendation.id.startsWith('dep') ? 'bg-blue-600 hover:bg-blue-700' :
                          'bg-teal-600 hover:bg-teal-700'
                        } text-white font-medium`}
                      >
                        Open Interactive Tool
                      </Link>
                    </div>
                  )}
                  
                  {/* User tracking and progress                  
                  <div className={`my-8 p-6 rounded-lg ${
                    recommendation.id.startsWith('anx') ? ' dark:border-indigo-800' :
                    recommendation.id.startsWith('dep') ? ' dark:border-blue-800' :
                    'bg-teal-50 border-teal-200 dark:bg-teal-900/20 dark:border-teal-800'
                  } border`}>
                    <h4 className={`text-lg font-semibold mb-2 ${
                      recommendation.id.startsWith('anx') ? 'text-indigo-800 dark:text-indigo-300' :
                      recommendation.id.startsWith('dep') ? 'text-blue-800 dark:text-blue-300' :
                      'text-teal-800 dark:text-teal-300'
                    }`}>Track Your Progress</h4>
                    <p className="mb-4 text-gray-500 ">Record how this resource helped you and track your improvement over time</p><div className="flex flex-wrap gap-3">
                      <button className={`px-4 py-2 rounded-md ${
                        recommendation.id.startsWith('anx') ? 'bg-indigo-600 hover:bg-indigo-700' :
                        recommendation.id.startsWith('dep') ? 'bg-blue-600 hover:bg-blue-700' :
                        'bg-teal-600 hover:bg-teal-700'
                      } text-white`}>
                        Mark as Completed
                      </button>
                      <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
                        Save for Later
                      </button>
                      {recommendation.content.type === "exercise" && (
                        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md">
                          Start Exercise
                        </button>
                      )}
                    </div>
                  </div> */}
                  
                  {/* Additional resources
                  {recommendation.content.additionalResources && recommendation.content.additionalResources.length > 0 && (
                    <div className="mb-6">
                      <h3 className="mb-3">Additional Resources</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendation.content.additionalResources.map((resource, index) => (                          <Link 
                            key={index} 
                            href={resource.url}
                            className={`p-4 border rounded-lg hover:bg-muted/20 block ${
                              resource.title.toLowerCase().includes('anxiety') ? 'border-indigo-300 hover:bg-indigo-50 dark:border-indigo-700 dark:hover:bg-indigo-900/30' :
                              resource.title.toLowerCase().includes('depression') ? 'border-blue-300 hover:bg-blue-50 dark:border-blue-700 dark:hover:bg-blue-900/30' :
                              'border-teal-300 hover:bg-teal-50 dark:border-teal-700 dark:hover:bg-teal-900/30'
                            }`}
                          >
                            <h4 className="font-semibold">{resource.title}</h4>
                            <p className="text-sm text-muted-foreground">{resource.description}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )} */}
                </>
              ) : (
                // Fallback content if no structured content is available
                <>
                  <h3>How to use this resource</h3>
                  <p>This resource is designed to help you manage your mental health. Follow the guidelines below to get the most benefit:</p>
                  <ul>
                    <li>Set aside dedicated time to engage with this material</li>
                    <li>Practice regularly for best results</li>
                    <li>Track your progress in the journal section</li>
                    <li>Combine with other techniques for a holistic approach</li>
                  </ul>
                  
                  <div className="my-8 p-6 border border-muted rounded-lg bg-muted/20">
                    <h4 className="text-lg font-semibold mb-2">Ready to start?</h4>
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
                      Begin activity
                    </button>
                  </div>
                </>
              )}
                {/* Related resources */}
              {relatedResources.length > 0 && (
                <>
                  <h3 className="mt-8">Related Resources</h3>
                  <p>Check out these other resources that might help:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {relatedResources.map(resource => (
                      <Link 
                        key={resource.id}
                        href={resource.link}
                        className={`p-4 border rounded-lg block ${
                          resource.id.startsWith('anx') ? 'border-indigo-300 hover:bg-indigo-50 dark:border-indigo-700 dark:hover:bg-indigo-900/30' :
                          resource.id.startsWith('dep') ? 'border-blue-300 hover:bg-blue-50 dark:border-blue-700 dark:hover:bg-blue-900/30' :
                          'border-teal-300 hover:bg-teal-50 dark:border-teal-700 dark:hover:bg-teal-900/30'
                        }`}
                      >
                        <div className="flex items-start">                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            resource.id.startsWith('anx') ? 'bg-indigo-600 text-white dark:bg-indigo-900 dark:text-indigo-300' :
                            resource.id.startsWith('dep') ? 'bg-blue-600 text-white dark:bg-blue-900 dark:text-blue-300' :
                            'bg-teal-600 text-white dark:bg-teal-900 dark:text-teal-300'
                          }`}>
                            <i className={`fas fa-${resource.icon} text-sm`}></i>
                          </div>
                          <div>
                            <h4 className={`font-semibold ${
                              resource.id.startsWith('anx') ? 'text-indigo-800 dark:text-indigo-300' :
                              resource.id.startsWith('dep') ? 'text-blue-800 dark:text-blue-300' :
                              'text-teal-800 dark:text-teal-300'
                            }`}>{resource.title}</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-400">{resource.description}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>        ) : (
          // Resource not found
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Resource not found</h1>
            <p className="text-muted-foreground mb-6">Sorry, we couldn&apos;t find the resource you&apos;re looking for.</p>            <Link href="/dashboard/resources" className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
              Browse all resources
            </Link>
          </div>
        )}
      </div>
  );
}
