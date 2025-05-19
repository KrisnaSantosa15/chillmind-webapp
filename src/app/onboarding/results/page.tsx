"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import * as tf from '@tensorflow/tfjs';
import { 
  loadModel, 
  loadScalerParams, 
  preprocessData, 
  processPredictions, 
  getLabelColor,
  DemographicData,
  AssessmentAnswers,
  PredictionResults
} from '@/lib/model';

export default function ResultsPage() {
  const router = useRouter();
  const [predictionResults, setPredictionResults] = useState<PredictionResults | null>(null);
  const [demographics, setDemographics] = useState<DemographicData | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Moved fallbackToTraditionalScoring inside useEffect to avoid recreating it on every render
    const fallbackToTraditionalScoring = () => {
      const phq9Score = parseInt(localStorage.getItem('phq9_score') || '0', 10);
      const gad7Score = parseInt(localStorage.getItem('gad7_score') || '0', 10);
      const pssScore = parseInt(localStorage.getItem('pss_score') || '0', 10);
      
      // Create a prediction results object from traditional scoring
      setPredictionResults({
        depression: {
          label: getDepressionLabel(phq9Score),
          probability: 1.0, // Certainty since it's rule-based
          probabilities: [{ label: getDepressionLabel(phq9Score), probability: 1.0 }]
        },
        anxiety: {
          label: getAnxietyLabel(gad7Score),
          probability: 1.0,
          probabilities: [{ label: getAnxietyLabel(gad7Score), probability: 1.0 }]
        },
        stress: {
          label: getStressLabel(pssScore),
          probability: 1.0,
          probabilities: [{ label: getStressLabel(pssScore), probability: 1.0 }]
        }
      });
      localStorage.setItem('prediction_results', JSON.stringify({
        depression: {
          label: getDepressionLabel(phq9Score),
          probability: 1.0,
          probabilities: [{ label: getDepressionLabel(phq9Score), probability: 1.0 }]
        },
        anxiety: {
          label: getAnxietyLabel(gad7Score),
          probability: 1.0,
          probabilities: [{ label: getAnxietyLabel(gad7Score), probability: 1.0 }]
        },
        stress: {
          label: getStressLabel(pssScore),
          probability: 1.0,
          probabilities: [{ label: getStressLabel(pssScore), probability: 1.0 }]
        }
      }));
    };
    async function loadAssessmentData() {
      try {
        // Load demographic data
        const demoData = JSON.parse(localStorage.getItem('demographics') || '{}');
        
        // Map stored demographics to model format
        const mappedDemographics: DemographicData = {
          age: demoData.age || '',
          gender: demoData.gender || '',
          academicYear: demoData.academicYear || '',
          gpa: demoData.gpa || '',
          scholarship: demoData.scholarship
        };
        setDemographics(mappedDemographics);
        
        // Load answers from each assessment
        const phq9Answers = JSON.parse(localStorage.getItem('phq9_answers') || '[]');
        const gad7Answers = JSON.parse(localStorage.getItem('gad7_answers') || '[]');
        const pssAnswers = JSON.parse(localStorage.getItem('pss_answers') || '[]');

        // Validate if answers exist
        if (phq9Answers.length === 0 || gad7Answers.length === 0 || pssAnswers.length === 0) {
          throw new Error('Assessment answers are missing');
        }

        // Also calculate and store the traditional scores for backup/comparison
        const phq9Score = phq9Answers.reduce((sum: number, val: number) => sum + val, 0);
        const gad7Score = gad7Answers.reduce((sum: number, val: number) => sum + val, 0);
        
        // Calculate PSS score with reverse scoring for questions 4, 5, 7, and 8 (indexes 3, 4, 6, 7)
        const reverseScored = [3, 4, 6, 7];
        const pssScore = pssAnswers.reduce((sum: number, answer: number, index: number) => {
          if (reverseScored.includes(index)) {
            // Reverse scoring: 0=4, 1=3, 2=2, 3=1, 4=0
            return sum + (4 - answer);
          }
          return sum + answer;
        }, 0);
        
        localStorage.setItem('phq9_score', phq9Score.toString());
        localStorage.setItem('gad7_score', gad7Score.toString());
        localStorage.setItem('pss_score', pssScore.toString());
        
        // Prepare assessment data for model
        const assessmentData: AssessmentAnswers = {
          phq9Answers,
          gad7Answers,
          pssAnswers
        };
        
        // Load ML model and parameters
        await loadModel();
        await loadScalerParams();
        
        // Preprocess the data
        const modelInput = preprocessData(mappedDemographics, assessmentData);
        
        // Get model prediction
        const model = await loadModel();
        const predictOutput = model.predict(modelInput);
        
        // Process the prediction results based on the type of output
        let results;
        if (predictOutput instanceof tf.Tensor) {
          results = await processPredictions(predictOutput);
        } else if (Array.isArray(predictOutput)) {
          results = await processPredictions(predictOutput);
        } else {
          // Handle NamedTensorMap case
          // Extract the tensors from the named map (we might need the first one only)
          const firstTensor = Object.values(predictOutput)[0];
          results = await processPredictions(firstTensor);
        }
        setPredictionResults(results);
        localStorage.setItem('prediction_results', JSON.stringify(results));
      } catch (err) {
        console.error('Error during prediction:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        // Fall back to traditional scoring if ML prediction fails
        fallbackToTraditionalScoring();
      } finally {
        setLoaded(true);
      }
    }
    
    loadAssessmentData();
  }, []); // Empty dependency array since fallbackToTraditionalScoring is defined inside

  // Traditional scoring functions (as fallback)
  const getDepressionLabel = (score: number): string => {
    if (score >= 0 && score <= 4) return "Minimal Depression";
    if (score >= 5 && score <= 9) return "Mild Depression";
    if (score >= 10 && score <= 14) return "Moderate Depression";
    if (score >= 15 && score <= 19) return "Moderately Severe Depression";
    return "Severe Depression";
  };
  
  const getAnxietyLabel = (score: number): string => {
    if (score >= 0 && score <= 4) return "Minimal Anxiety";
    if (score >= 5 && score <= 9) return "Mild Anxiety";
    if (score >= 10 && score <= 14) return "Moderate Anxiety";
    return "Severe Anxiety";
  };
  
  const getStressLabel = (score: number): string => {
    if (score >= 0 && score <= 13) return "Low Stress";
    if (score >= 14 && score <= 26) return "Moderate Stress";
    return "High Perceived Stress";
  };

  const getDemographicLabel = (category: string, value: string | boolean) => {
    if (category === 'age') {
      const ageMap: Record<string, string> = {
        'below18': 'Below 18',
        '18-22': '18-22',
        '23-26': '23-26',
        '27-30': '27-30',
        'above30': 'Above 30'
      };
      return ageMap[value as string] || value;
    }
    
    if (category === 'gender') {
      const genderMap: Record<string, string> = {
        'male': 'Male',
        'female': 'Female',
        'preferNotToSay': 'Prefer not to say'
      };
      return genderMap[value as string] || value;
    }
    
    if (category === 'academicYear') {
      const yearMap: Record<string, string> = {
        'firstYear': 'First year',
        'secondYear': 'Second year',
        'thirdYear': 'Third year',
        'fourthYear': 'Fourth year',
        'other': 'Other'
      };
      return yearMap[value as string] || value;
    }
    
    if (category === 'scholarship') {
      return value ? 'Yes' : 'No';
    }
    
    return value;
  };

  const handleContinue = () => {
    // Redirect to dashboard after all assessments
    // In a real app, this would first check if the user is logged in
    // and redirect to auth/register if they aren't
    router.push('/dashboard');
  };
  
  const handleRetakeAssessment = () => {
    // Clear all assessment-related data from localStorage
    localStorage.removeItem('demographics');
    localStorage.removeItem('phq9_answers');
    localStorage.removeItem('phq9_score');
    localStorage.removeItem('gad7_answers');
    localStorage.removeItem('gad7_score');
    localStorage.removeItem('pss_answers');
    localStorage.removeItem('pss_score');
    localStorage.removeItem('prediction_results');
    
    // Redirect to the beginning of the onboarding process
    router.push('/onboarding');
  };

  if (!loaded) {
    return (
      <>
        <Header />
        <main className="min-h-screen py-24 px-6">
          <div className="max-w-3xl mx-auto">
            {/* Skeleton header */}
            <div className="text-center mb-12">
              <div className="animate-pulse rounded-lg bg-muted h-10 w-2/3 mx-auto mb-4"></div>
              <div className="animate-pulse rounded-lg bg-muted h-5 w-4/5 mx-auto"></div>
            </div>
            
            {/* Skeleton step indicator */}
            <div className="mb-12">
              {/* Desktop steps */}
              <div className="hidden md:flex items-center justify-between">
                {[...Array(6)].map((_, index) => (
                  <React.Fragment key={index}>
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-muted animate-pulse"></div>
                      <div className="mt-2 bg-muted h-4 w-16 rounded animate-pulse"></div>
                    </div>
                    {index < 5 && <div className="flex-1 h-1 mx-2 bg-muted"></div>}
                  </React.Fragment>
                ))}
              </div>
              
              {/* Mobile steps */}
              <div className="md:hidden">
                <div className="flex justify-around items-center mb-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
                      <div className="mt-1 bg-muted h-3 w-8 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between px-2 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-1 bg-muted flex-grow mx-1"></div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Results Summary skeleton */}
            <div className="bg-background border border-muted rounded-lg p-4 md:p-8 shadow-sm mb-8">
              <div className="h-8 w-2/5 bg-muted rounded-lg animate-pulse mb-6"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                {/* Create 3 skeleton cards */}
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-background rounded-lg border border-muted shadow-sm overflow-hidden">
                    <div className="p-3 md:p-4 bg-muted">
                      <div className="h-6 w-3/4 mx-auto bg-muted-foreground/20 rounded-lg animate-pulse"></div>
                    </div>
                    
                    {/* Mobile skeleton layout */}
                    <div className="p-4 md:p-6">
                      <div className="flex md:hidden items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-muted animate-pulse flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="h-5 bg-muted rounded-lg w-3/4 animate-pulse mb-2"></div>
                          <div className="h-3 bg-muted rounded-lg w-1/2 animate-pulse mb-3"></div>
                          <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                            <div className="h-full bg-muted w-3/4 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Desktop skeleton layout */}
                      <div className="hidden md:flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-muted animate-pulse mb-3"></div>
                        <div className="h-6 bg-muted rounded-lg w-3/4 animate-pulse mb-2"></div>
                        <div className="h-3 bg-muted rounded-lg w-1/2 animate-pulse mb-3"></div>
                        <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                          <div className="h-full bg-muted w-3/4 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Demographics skeleton */}
            <div className="bg-background rounded-xl border border-muted p-6 mb-8 hidden">
              <div className="h-6 bg-muted rounded-lg w-1/4 animate-pulse mb-4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="h-4 bg-muted rounded-lg w-1/2 animate-pulse mb-2"></div>
                    <div className="h-5 bg-muted rounded-lg w-3/4 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* What This Means skeleton */}
            <div className="bg-primary/5 rounded-xl border border-primary/20 p-6 mb-8">
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 rounded-full bg-muted animate-pulse mr-2"></div>
                <div className="h-6 bg-muted rounded-lg w-2/5 animate-pulse"></div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-start rounded-lg border border-muted p-3 bg-background flex-1 min-w-[250px]">
                    <div className="w-8 h-8 rounded-full bg-muted animate-pulse mr-3 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded-lg w-1/3 animate-pulse mb-2"></div>
                      <div className="h-3 bg-muted rounded-lg w-full animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Wellness Journey skeleton */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20 shadow-lg p-8 mb-10">
              <div className="h-7 bg-muted rounded-lg w-2/3 mx-auto animate-pulse mb-6"></div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-background rounded-xl border border-muted p-6 text-center shadow-sm">
                    <div className="w-16 h-16 mx-auto rounded-full bg-muted animate-pulse mb-4"></div>
                    <div className="h-5 bg-muted rounded-lg w-3/4 mx-auto animate-pulse mb-3"></div>
                    <div className="h-4 bg-muted rounded-lg w-full animate-pulse"></div>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <div className="h-12 bg-muted rounded-lg w-2/3 mx-auto animate-pulse mb-4"></div>
                <div className="h-4 bg-muted rounded-lg w-4/5 mx-auto animate-pulse"></div>
              </div>
            </div>
            
            {/* Footer Navigation skeleton */}
            <div className="border-t border-muted pt-6 pb-10 mt-6">
              <div className="flex justify-between items-center">
                <div className="h-10 w-28 bg-muted rounded-lg animate-pulse"></div>
                <div className="h-4 w-3/5 bg-muted rounded-lg animate-pulse"></div>
                <div className="h-10 w-28 bg-muted rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Assessment Results
            </h1>
            <p className="text-lg text-muted-foreground">
              Based on your responses, here are your mental health assessment results.
            </p>
            {error && (
              <div className="mt-4 p-3 bg-accent/10 text-accent rounded-lg">
                <p>There was an issue with the machine learning prediction: {error}</p>
                <p className="text-sm">Using traditional scoring instead.</p>
              </div>
            )}
          </div>
          
          {/* Step Indicator - Improved for mobile */}
          <div className="mb-12">
            <div className="hidden md:flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/50 flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <span className="text-sm mt-2 text-primary/50 font-medium">Introduction</span>
              </div>
              <div className="flex-1 h-1 mx-2 bg-primary/50"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/50 flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <span className="text-sm mt-2 text-primary/50 font-medium">Demographics</span>
              </div>
              <div className="flex-1 h-1 mx-2 bg-primary/50"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/50 flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <span className="text-sm mt-2 text-primary/50 font-medium">Depression</span>
              </div>
              <div className="flex-1 h-1 mx-2 bg-primary/50"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/50 flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <span className="text-sm mt-2 text-primary/50 font-medium">Anxiety</span>
              </div>
              <div className="flex-1 h-1 mx-2 bg-primary/50"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/50 flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <span className="text-sm mt-2 text-primary/50 font-medium">Stress</span>
              </div>
              <div className="flex-1 h-1 mx-2 bg-primary/50"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  6
                </div>
                <span className="text-sm mt-2 text-primary font-medium">Results</span>
              </div>
            </div>
            
            {/* Mobile Step Indicator - Redesigned */}
            <div className="md:hidden">
              {/* Progress bar showing completion */}
              <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-gradient-to-r from-primary/70 to-primary" style={{ width: '100%' }}></div>
              </div>
              
              {/* Current step highlight card */}
              <div className="relative mb-2">
                <div className="overflow-x-auto pb-3 scrollbar-hide">
                  <div className="flex gap-2 w-max px-2">
                    {['Introduction', 'Demographics', 'Depression', 'Anxiety', 'Stress', 'Results'].map((step, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center px-4 py-2 rounded-lg border transition-all ${
                          index === 5 
                            ? 'bg-primary text-white border-primary min-w-[90px] scale-105 shadow-md' 
                            : 'bg-primary/10 border-primary/20 text-muted-foreground min-w-[85px]'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full ${
                          index === 5 ? 'bg-white text-primary' : 'bg-primary/30 text-white'
                        } flex items-center justify-center text-xs font-bold mr-2`}>
                          {index + 1}
                        </span>
                        <span className="text-xs whitespace-nowrap">
                          {index === 0 ? 'Intro' : step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Fade effect on edges to indicate scrollability */}
                <div className="absolute top-0 left-0 h-full w-6 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
                <div className="absolute top-0 right-0 h-full w-6 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
              </div>
              
              {/* Helper text */}
              <p className="text-[10px] text-center text-muted-foreground">
                <span className="inline-flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Swipe to see all steps
                </span>
              </p>
            </div>
          </div>
          
          {/* Results Summary - Improved for mobile */}
          <div className="bg-background border border-muted rounded-lg p-4 md:p-8 shadow-sm mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 md:mb-6">
              Summary of Your Results
            </h2>
            
            {predictionResults && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                {/* Anxiety Result */}
                <div className="bg-background rounded-lg border border-muted shadow-sm overflow-hidden transition-all hover:shadow-md">
                  <div className={`p-3 md:p-4 ${getLabelColor('anxiety', predictionResults.anxiety.label).replace('bg-', 'bg-opacity-90 bg-')}`}>
                    <h3 className="font-bold text-white text-center">Anxiety Assessment</h3>
                  </div>
                  <div className="p-4 md:p-6">
                    {/* Mobile layout - horizontal */}
                    <div className="flex md:hidden items-center gap-4">
                      <div className={`w-16 h-16 rounded-full ${getLabelColor('anxiety', predictionResults.anxiety.label)} flex items-center justify-center flex-shrink-0`}>
                        <span className="font-bold text-white text-xl">
                          {getSeverityIcon(predictionResults.anxiety.label)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <span className="text-lg font-bold block">{predictionResults.anxiety.label}</span>
                        <span className="text-xs text-muted-foreground">Confidence: {(predictionResults.anxiety.probability * 100).toFixed(1)}%</span>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-2">
                          <div 
                            className={`h-full ${getLabelColor('anxiety', predictionResults.anxiety.label)}`} 
                            style={{ width: `${(predictionResults.anxiety.probability) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop layout - vertical */}
                    <div className="hidden md:flex flex-col items-center">
                      <div className={`w-20 h-20 rounded-full ${getLabelColor('anxiety', predictionResults.anxiety.label)} flex items-center justify-center mb-3`}>
                        <span className="font-bold text-white text-xl">
                          {getSeverityIcon(predictionResults.anxiety.label)}
                        </span>
                      </div>
                      <span className="text-xl font-bold text-center mb-1">{predictionResults.anxiety.label}</span>
                      <span className="text-xs text-muted-foreground mb-3">Confidence: {(predictionResults.anxiety.probability * 100).toFixed(1)}%</span>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getLabelColor('anxiety', predictionResults.anxiety.label)}`} 
                          style={{ width: `${(predictionResults.anxiety.probability) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {predictionResults.anxiety.probability < 0.95 && (
                      <div className="mt-3 pt-3 border-t border-muted">
                        <p className="text-xs text-muted-foreground mb-1">Alternative assessment:</p>
                        {predictionResults.anxiety.probabilities
                          .filter(item => item.label !== predictionResults.anxiety.label && item.probability > 0.05)
                          .sort((a, b) => b.probability - a.probability)
                          .slice(0, 1)
                          .map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-xs">
                              <span>{item.label}</span>
                              <span>{(item.probability * 100).toFixed(1)}%</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Depression Result */}
                <div className="bg-background rounded-lg border border-muted shadow-sm overflow-hidden transition-all hover:shadow-md">
                  <div className={`p-3 md:p-4 ${getLabelColor('depression', predictionResults.depression.label).replace('bg-', 'bg-opacity-90 bg-')}`}>
                    <h3 className="font-bold text-white text-center">Depression Assessment</h3>
                  </div>
                  <div className="p-4 md:p-6">
                    {/* Mobile layout - horizontal */}
                    <div className="flex md:hidden items-center gap-4">
                      <div className={`w-16 h-16 rounded-full ${getLabelColor('depression', predictionResults.depression.label)} flex items-center justify-center flex-shrink-0`}>
                        <span className="font-bold text-white text-xl">
                          {getSeverityIcon(predictionResults.depression.label)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <span className="text-lg font-bold block">{predictionResults.depression.label}</span>
                        <span className="text-xs text-muted-foreground">Confidence: {(predictionResults.depression.probability * 100).toFixed(1)}%</span>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-2">
                          <div 
                            className={`h-full ${getLabelColor('depression', predictionResults.depression.label)}`} 
                            style={{ width: `${(predictionResults.depression.probability) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop layout - vertical */}
                    <div className="hidden md:flex flex-col items-center">
                      <div className={`w-20 h-20 rounded-full ${getLabelColor('depression', predictionResults.depression.label)} flex items-center justify-center mb-3`}>
                        <span className="font-bold text-white text-xl">
                          {getSeverityIcon(predictionResults.depression.label)}
                        </span>
                      </div>
                      <span className="text-xl font-bold text-center mb-1">{predictionResults.depression.label}</span>
                      <span className="text-xs text-muted-foreground mb-3">Confidence: {(predictionResults.depression.probability * 100).toFixed(1)}%</span>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getLabelColor('depression', predictionResults.depression.label)}`} 
                          style={{ width: `${(predictionResults.depression.probability) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {predictionResults.depression.probability < 0.95 && (
                      <div className="mt-3 pt-3 border-t border-muted">
                        <p className="text-xs text-muted-foreground mb-1">Alternative assessment:</p>
                        {predictionResults.depression.probabilities
                          .filter(item => item.label !== predictionResults.depression.label && item.probability > 0.05)
                          .sort((a, b) => b.probability - a.probability)
                          .slice(0, 1)
                          .map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-xs">
                              <span>{item.label}</span>
                              <span>{(item.probability * 100).toFixed(1)}%</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Stress Result */}
                <div className="bg-background rounded-lg border border-muted shadow-sm overflow-hidden transition-all hover:shadow-md">
                  <div className={`p-3 md:p-4 ${getLabelColor('stress', predictionResults.stress.label).replace('bg-', 'bg-opacity-90 bg-')}`}>
                    <h3 className="font-bold text-white text-center">Stress Assessment</h3>
                  </div>
                  <div className="p-4 md:p-6">
                    {/* Mobile layout - horizontal */}
                    <div className="flex md:hidden items-center gap-4">
                      <div className={`w-16 h-16 rounded-full ${getLabelColor('stress', predictionResults.stress.label)} flex items-center justify-center flex-shrink-0`}>
                        <span className="font-bold text-white text-xl">
                          {getSeverityIcon(predictionResults.stress.label)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <span className="text-lg font-bold block">{predictionResults.stress.label}</span>
                        <span className="text-xs text-muted-foreground">Confidence: {(predictionResults.stress.probability * 100).toFixed(1)}%</span>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-2">
                          <div 
                            className={`h-full ${getLabelColor('stress', predictionResults.stress.label)}`} 
                            style={{ width: `${(predictionResults.stress.probability) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop layout - vertical */}
                    <div className="hidden md:flex flex-col items-center">
                      <div className={`w-20 h-20 rounded-full ${getLabelColor('stress', predictionResults.stress.label)} flex items-center justify-center mb-3`}>
                        <span className="font-bold text-white text-xl">
                          {getSeverityIcon(predictionResults.stress.label)}
                        </span>
                      </div>
                      <span className="text-xl font-bold text-center mb-1">{predictionResults.stress.label}</span>
                      <span className="text-xs text-muted-foreground mb-3">Confidence: {(predictionResults.stress.probability * 100).toFixed(1)}%</span>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getLabelColor('stress', predictionResults.stress.label)}`} 
                          style={{ width: `${(predictionResults.stress.probability) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {predictionResults.stress.probability < 0.95 && (
                      <div className="mt-3 pt-3 border-t border-muted">
                        <p className="text-xs text-muted-foreground mb-1">Alternative assessment:</p>
                        {predictionResults.stress.probabilities
                          .filter(item => item.label !== predictionResults.stress.label && item.probability > 0.05)
                          .sort((a, b) => b.probability - a.probability)
                          .slice(0, 1)
                          .map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-xs">
                              <span>{item.label}</span>
                              <span>{(item.probability * 100).toFixed(1)}%</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Demographics */}
          <div className="bg-background rounded-lg border border-muted p-6 mb-8">
            <h3 className="font-bold text-foreground mb-4">Your Demographics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {demographics && Object.entries(demographics).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-medium">{getDemographicLabel(key, value as string | boolean)}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Interpretation */}
          <div className="bg-primary/10 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-foreground mb-4">What These Results Mean for You</h3>
            <p className="text-muted-foreground mb-6">
              These assessments provide a snapshot of your current mental wellbeing. While they aren&apos;t diagnostic tools, 
              they can help identify areas where additional support might benefit you.
            </p>
            
            {predictionResults && (
              <div className="space-y-6">
                <div className="bg-background rounded-lg border border-muted p-5">
                  <h4 className="font-medium mb-3">Personalized Insights</h4>
                  {(predictionResults.depression.label === "Moderate Depression" || 
                    predictionResults.depression.label === "Moderately Severe Depression" ||
                    predictionResults.depression.label === "Severe Depression") && (
                    <div className="flex items-start mb-4">
                      <div className="bg-red-500 text-white p-2 rounded-full mr-4 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Depression Support</p>
                        <p className="text-sm">Your depression assessment results suggest you may benefit from professional support. Consider talking with a mental health provider who can offer personalized guidance.</p>
                      </div>
                    </div>
                  )}
                  
                  {(predictionResults.anxiety.label === "Moderate Anxiety" || 
                    predictionResults.anxiety.label === "Severe Anxiety") && (
                    <div className="flex items-start mb-4">
                      <div className="bg-red-500 text-white p-2 rounded-full mr-4 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Anxiety Management</p>
                        <p className="text-sm">Your anxiety assessment suggests significant anxiety symptoms. Breathing exercises, mindfulness, and professional support can help manage these feelings.</p>
                      </div>
                    </div>
                  )}
                  
                  {predictionResults.stress.label === "High Perceived Stress" && (
                    <div className="flex items-start mb-4">
                      <div className="bg-red-500 text-white p-2 rounded-full mr-4 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Stress Reduction</p>
                        <p className="text-sm">Your stress levels appear high, which can affect both physical and mental health. Regular exercise, adequate sleep, and relaxation techniques can help reduce stress.</p>
                      </div>
                    </div>
                  )}
                  
                  {(predictionResults.depression.label === "Minimal Depression" || 
                    predictionResults.depression.label === "Mild Depression" || 
                    predictionResults.depression.label === "No Depression") && 
                   (predictionResults.anxiety.label === "Minimal Anxiety" || 
                    predictionResults.anxiety.label === "Mild Anxiety") && 
                   (predictionResults.stress.label === "Low Stress" || 
                    predictionResults.stress.label === "Moderate Stress") && (
                    <div className="flex items-start">
                      <div className="bg-green-500 text-white p-2 rounded-full mr-4 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Maintaining Wellbeing</p>
                        <p className="text-sm">Your assessment suggests mild to minimal symptoms. Continue practicing healthy coping strategies and self-care routines to maintain your mental wellbeing.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Tips and Call to Action */}
          <div className="bg-primary/5 rounded-xl border border-primary/20 shadow-lg p-8 mb-10">
            <h3 className="font-bold text-foreground text-xl mb-6 text-center">Continue Your Wellness Journey</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <div className="bg-background rounded-xl border border-muted p-6 text-center shadow-sm hover:shadow-md transition-all">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                </div>
                <h4 className="font-medium mb-2 text-lg">Browse Resources</h4>
                <p className="text-sm text-muted-foreground">Access articles and guides on managing mental health effectively.</p>
              </div>
              
              <div className="bg-background rounded-xl border border-muted p-6 text-center shadow-sm hover:shadow-md transition-all">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <line x1="12" y1="20" x2="12" y2="10"></line>
                    <line x1="18" y1="20" x2="18" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="16"></line>
                  </svg>
                </div>
                <h4 className="font-medium mb-2 text-lg">Track Your Progress</h4>
                <p className="text-sm text-muted-foreground">Monitor your journey with mood tracking and regular check-ins.</p>
              </div>
              
              <div className="bg-background rounded-xl border border-muted p-6 text-center shadow-sm hover:shadow-md transition-all">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                  </svg>
                </div>
                <h4 className="font-medium mb-2 text-lg">Practice Mindfulness</h4>
                <p className="text-sm text-muted-foreground">Reduce stress and anxiety with guided meditations.</p>
              </div>
            </div>
            
            <div className="text-center">
              <button onClick={handleContinue} className="bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-10 rounded-lg transition-colors text-lg shadow-md">
                Go to Dashboard to Continue
              </button>
              <p className="text-sm text-muted-foreground mt-4">Your personal dashboard has been set up with tools and resources based on your assessment results.</p>
            </div>
          </div>
          
          {/* Footer Navigation - Styled better */}
          <div className="border-t border-muted pt-6 pb-10 mt-6">
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={handleRetakeAssessment} className="px-6 py-2 text-sm">
                ← Retake Assessment
              </Button>
              <div className="flex flex-col items-center mx-4 flex-grow">
                <p className="text-xs text-muted-foreground mb-2 text-center max-w-sm">
                  <strong>Note:</strong> These assessments are not a substitute for professional medical advice or treatment.
                </p>
              </div>
              <Button variant="primary" onClick={handleContinue} className="px-6 py-2 text-sm">
                Go to Dashboard →
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground text-center mt-6">
              If you&apos;re experiencing severe distress, please reach out to a mental health professional or call a crisis hotline.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// Add helper functions before the return statement
// Add these helper functions right before the return statement and after all existing functions

// Helper function to get an appropriate icon based on severity
const getSeverityIcon = (label: string): string => {
  if (label.includes('Severe') || label.includes('High')) {
    return '!';
  } else if (label.includes('Moderate') || label.includes('Moderately')) {
    return '~';
  } else if (label.includes('Mild')) {
    return '○';
  } else {
    return '✓';
  }
};