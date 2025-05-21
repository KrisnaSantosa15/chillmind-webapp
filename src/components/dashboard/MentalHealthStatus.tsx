"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { getLatestAssessment } from '@/lib/firestore';
import Link from 'next/link';

// Type for the metrics we'll display
interface MentalHealthMetric {
  name: string;
  value: number;     // Calculated percentage for progress bar display (severityLevel/maxLevel * 100)
  status: string;    // The clinical status (Minimal, Mild, Moderate, etc.)
  colorClass: string;
  severityLevel?: number; // The numeric severity level (e.g., 1, 2, 3)
  maxLevel?: number;      // The maximum possible severity level
}

const MentalHealthStatus: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  const [mentalHealthMetrics, setMentalHealthMetrics] = useState<MentalHealthMetric[]>([
    { name: 'Depression Level', value: 0, status: 'Loading...', colorClass: 'bg-blue-500', severityLevel: 0, maxLevel: 5 },
    { name: 'Anxiety', value: 0, status: 'Loading...', colorClass: 'bg-green-500', severityLevel: 0, maxLevel: 4 },
    { name: 'Stress Level', value: 0, status: 'Loading...', colorClass: 'bg-yellow-500', severityLevel: 0, maxLevel: 3 },
  ]);
  
  // Helper functions to determine status, colors, and severity level based on ML prediction labels
  const getDepressionMetrics = (label: string): { status: string, colorClass: string, severityLevel: number, maxLevel: number } => {
    const maxLevel = 5;
    
    if (label === "No Depression") {
      return { status: 'No Depression', colorClass: 'bg-green-500', severityLevel: 0, maxLevel };
    } else if (label === "Minimal Depression") {
      return { status: 'Minimal', colorClass: 'bg-green-500', severityLevel: 1, maxLevel };
    } else if (label === "Mild Depression") {
      return { status: 'Mild', colorClass: 'bg-blue-400', severityLevel: 2, maxLevel };
    } else if (label === "Moderate Depression") {
      return { status: 'Moderate', colorClass: 'bg-blue-500', severityLevel: 3, maxLevel };
    } else if (label === "Moderately Severe Depression") {
      return { status: 'Moderately Severe', colorClass: 'bg-orange-500', severityLevel: 4, maxLevel };
    } else {
      return { status: 'Severe', colorClass: 'bg-red-500', severityLevel: 5, maxLevel };
    }
  };
  
  const getAnxietyMetrics = (label: string): { status: string, colorClass: string, severityLevel: number, maxLevel: number } => {
    const maxLevel = 4;
    
    if (label === "Minimal Anxiety") {
      return { status: 'Minimal', colorClass: 'bg-green-500', severityLevel: 1, maxLevel };
    } else if (label === "Mild Anxiety") {
      return { status: 'Mild', colorClass: 'bg-blue-400', severityLevel: 2, maxLevel };
    } else if (label === "Moderate Anxiety") {
      return { status: 'Moderate', colorClass: 'bg-orange-500', severityLevel: 3, maxLevel };
    } else {
      return { status: 'Severe', colorClass: 'bg-red-500', severityLevel: 4, maxLevel };
    }
  };
  
  const getStressMetrics = (label: string): { status: string, colorClass: string, severityLevel: number, maxLevel: number } => {
    const maxLevel = 3;
    
    if (label === "Low Stress") {
      return { status: 'Low', colorClass: 'bg-green-500', severityLevel: 1, maxLevel };
    } else if (label === "Moderate Stress") {
      return { status: 'Moderate', colorClass: 'bg-yellow-500', severityLevel: 2, maxLevel };
    } else {
      return { status: 'High', colorClass: 'bg-red-500', severityLevel: 3, maxLevel };
    }
  };  useEffect(() => {
    const fetchAssessmentData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const assessment = await getLatestAssessment(user);
        // Process assessment data if available
        
        if (assessment) {
          
          if (!assessment.predictionResults) {
            setError('Missing prediction results in assessment data');
            setLoading(false);
            return;
          }
          
          const { predictionResults } = assessment;
          
          // Get metrics from ML prediction labels
          const depressionResult = getDepressionMetrics(predictionResults.depression.label);
          const anxietyResult = getAnxietyMetrics(predictionResults.anxiety.label);
          const stressResult = getStressMetrics(predictionResults.stress.label);
          
          // Order metrics by severity (from highest to lowest)
          const orderedMetrics = [            
            { 
              name: 'Depression Level', 
              value: (depressionResult.severityLevel / depressionResult.maxLevel) * 100,
              status: depressionResult.status, 
              colorClass: depressionResult.colorClass,
              severityLevel: depressionResult.severityLevel,
              maxLevel: depressionResult.maxLevel
            },
            { 
              name: 'Anxiety Level', 
              value: (anxietyResult.severityLevel / anxietyResult.maxLevel) * 100,
              status: anxietyResult.status, 
              colorClass: anxietyResult.colorClass,
              severityLevel: anxietyResult.severityLevel,
              maxLevel: anxietyResult.maxLevel
            },
            { 
              name: 'Stress Level', 
              value: (stressResult.severityLevel / stressResult.maxLevel) * 100,
              status: stressResult.status, 
              colorClass: stressResult.colorClass,
              severityLevel: stressResult.severityLevel,
              maxLevel: stressResult.maxLevel
            }
          ];
          
          // Sort by severity percentage (highest first)
          orderedMetrics.sort((a, b) => b.value - a.value);
          
          setMentalHealthMetrics(orderedMetrics);
        } else {          // No assessment data found
          setMentalHealthMetrics([
            { name: 'Depression Level', value: 0, status: 'No data', colorClass: 'bg-gray-300', severityLevel: 0, maxLevel: 5 },
            { name: 'Anxiety', value: 0, status: 'No data', colorClass: 'bg-gray-300', severityLevel: 0, maxLevel: 4 },
            { name: 'Stress Level', value: 0, status: 'No data', colorClass: 'bg-gray-300', severityLevel: 0, maxLevel: 3 },
          ]);
        }
      } catch (err) {
        console.error('Error fetching assessment data:', err);
        setError('Failed to load mental health data');        setMentalHealthMetrics([
          { name: 'Depression Level', value: 0, status: 'Error', colorClass: 'bg-gray-300', severityLevel: 0, maxLevel: 5 },
          { name: 'Anxiety', value: 0, status: 'Error', colorClass: 'bg-gray-300', severityLevel: 0, maxLevel: 4 },
          { name: 'Stress Level', value: 0, status: 'Error', colorClass: 'bg-gray-300', severityLevel: 0, maxLevel: 3 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssessmentData();
  }, [user]);
  return (
    <div>
      {error && (
        <div className="mt-2 p-2 text-sm text-red-600 bg-red-50 rounded">
          {error}
        </div>
      )}
        <div className="mt-4 space-y-4">
        {loading ? (
          // Loading skeleton 
          <>
            {[
              { name: 'Depression Level', maxLevel: 5 },
              { name: 'Anxiety Level', maxLevel: 4 },
              { name: 'Stress Level', maxLevel: 3 }
            ].map((item) => (
              <div key={item.name} className="animate-pulse mb-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                  <div className="flex items-center">
                    <div className="h-4 bg-gray-200 rounded w-10 mr-2"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-16 px-2"></div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="h-2 rounded-full bg-gray-300" style={{ width: '10%' }}></div>
                </div>
              </div>
            ))}
          </>
        ) : (// Actual data
          mentalHealthMetrics.map((metric) => (
            <div key={metric.name} className="mb-4">              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground">{metric.name}</span>
                <div className="flex items-center">
                  {metric.severityLevel !== undefined && metric.maxLevel !== undefined && (
                    <span className="text-xs text-muted-foreground mr-2">
                      {metric.severityLevel}/{metric.maxLevel}
                    </span>
                  )}
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${metric.colorClass.replace('bg-', 'bg-opacity-20 text-')}`}>
                    {metric.status}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${metric.colorClass} transition-all duration-500 ease-in-out`}
                  style={{ width: `${metric.value}%` }}
                ></div>
              </div>
            </div>
          ))
        )}      </div>
      
      {loading ? (
        // Loading skeleton for button
        <div className="mt-4 animate-pulse">
          <div className="w-full h-10 bg-gray-200 rounded-md"></div>
        </div>
      ) : (
        <Link href="/onboarding" className="mt-4 w-full px-4 py-2 text-sm font-medium text-center text-white bg-primary rounded-md hover:bg-primary/90 inline-block">
          Take Assessment Again
        </Link>
      )}
    </div>
  );
};

export default MentalHealthStatus; 