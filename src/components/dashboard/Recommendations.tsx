"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { RecommendationItem, recommendationsData, getSampleRecommendations } from '@/data/recommendationsData';

const Recommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) {
        setRecommendations(getSampleRecommendations(3));
        setIsLoading(false);
        return;
      }
      
      try {
        const userRef = doc(db, "users", user.uid);
        const assessmentsRef = collection(userRef, "assessments");
        
        const assessmentQuery = query(assessmentsRef, orderBy("timestamp", "desc"), limit(1));
        const assessmentSnapshot = await getDocs(assessmentQuery);
        
        if (assessmentSnapshot.empty) {
          setRecommendations(getSampleRecommendations(3));
          setIsLoading(false);
          return;
        }
        
        const assessmentData = assessmentSnapshot.docs[0].data();
        const { predictionResults } = assessmentData;
        
        if (!predictionResults) {
          throw new Error("Assessment data is incomplete");
        }
        
        const anxietyLevel = predictionResults.anxiety?.label as string;
        const depressionLevel = predictionResults.depression?.label as string;
        const stressLevel = predictionResults.stress?.label as string;
        
        const recommendationsArray: RecommendationItem[] = [];
        
        const getRecommendation = (
          condition: 'anxiety' | 'depression' | 'stress', 
          level: string
        ): RecommendationItem | null => {
          try {
            const conditionData = recommendationsData[condition] as Record<string, RecommendationItem[]>;
            if (level && conditionData[level]?.length > 0) {
              return conditionData[level][0];
            }
          } catch (error) {
            console.error(`Error getting ${condition} recommendation for level ${level}:`, error);
          }
          return null;
        };
        
        const anxRec = getRecommendation('anxiety', anxietyLevel);
        if (anxRec) recommendationsArray.push(anxRec);
        
        const depRec = getRecommendation('depression', depressionLevel);
        if (depRec) recommendationsArray.push(depRec);
        let stressKey = stressLevel;
        const stressData = recommendationsData.stress as Record<string, RecommendationItem[]>;
        if (stressLevel === "High Stress" && !stressData["High Stress"]) {
          stressKey = "Moderate Stress";
        }
        
        const stressRec = getRecommendation('stress', stressKey);
        if (stressRec) recommendationsArray.push(stressRec);
        
        if (recommendationsArray.length === 0) {
          setRecommendations(getSampleRecommendations(3));
        } else {
          setRecommendations(recommendationsArray.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to load recommendations');
        setRecommendations(getSampleRecommendations(3));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [user]);
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
    <div>      
      <div className="mb-2 flex justify-end">
        <Link href="/dashboard/resources" className="text-xs font-medium text-primary hover:text-primary/80">
          See all resources
        </Link>
      </div>
      
      <div className="divide-y divide-muted">
        {error && (
          <div className="p-4 text-sm text-red-500">
            {error}
          </div>
        )}
        
        {isLoading ? (
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
        ) : (          recommendations.length > 0 ? (
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
          ) : (
            <div className="p-4 flex flex-col items-center justify-center py-8 text-center">
              <div className={`w-16 h-16 rounded-full bg-primary-light/20 text-primary flex items-center justify-center mb-4`}>
                <i className="fas fa-lightbulb text-lg"></i>
              </div>
              <h4 className="text-sm font-medium text-foreground mb-2">No personalized recommendations yet</h4>
              <p className="text-xs text-muted-foreground mb-3 max-w-xs">
                Complete a mental health assessment to get personalized recommendations based on your needs.
              </p>
              <Link href="/dashboard/resources" className="text-xs font-medium text-primary hover:text-primary/80 inline-flex items-center">
                <span>Browse all resources</span>
                <i className="fas fa-arrow-right ml-1 text-xs"></i>
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Recommendations;