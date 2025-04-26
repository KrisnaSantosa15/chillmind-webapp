"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';

interface AssessmentResult {
  score: number;
  interpretation: string;
  level: 'minimal' | 'mild' | 'moderate' | 'severe' | 'low' | 'medium' | 'high';
  color: string;
}

interface DemographicsData {
  age?: string;
  gender?: string;
  academicYear?: string;
  gpa?: string;
  scholarship?: boolean;
  [key: string]: string | boolean | undefined;
}

export default function ResultsPage() {
  const router = useRouter();
  const [phq9Result, setPHQ9Result] = useState<AssessmentResult | null>(null);
  const [gad7Result, setGAD7Result] = useState<AssessmentResult | null>(null);
  const [pssResult, setPSSResult] = useState<AssessmentResult | null>(null);
  const [demographics, setDemographics] = useState<DemographicsData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load assessment results from localStorage
    const phq9Score = parseInt(localStorage.getItem('phq9_score') || '0', 10);
    const gad7Score = parseInt(localStorage.getItem('gad7_score') || '0', 10);
    const pssScore = parseInt(localStorage.getItem('pss_score') || '0', 10);
    
    try {
      const demoData = JSON.parse(localStorage.getItem('demographics') || '{}');
      setDemographics(demoData);
    } catch (e) {
      console.error("Could not parse demographics data", e);
    }

    // Interpret PHQ-9 (Depression) score
    setPHQ9Result(interpretPHQ9Score(phq9Score));
    
    // Interpret GAD-7 (Anxiety) score
    setGAD7Result(interpretGAD7Score(gad7Score));
    
    // Interpret PSS (Stress) score
    setPSSResult(interpretPSSScore(pssScore));
    
    setLoaded(true);
  }, []);

  // Function to interpret PHQ-9
  const interpretPHQ9Score = (score: number): AssessmentResult => {
    if (score >= 0 && score <= 4) {
      return {
        score,
        interpretation: "Minimal or no depression",
        level: "minimal",
        color: "bg-green-500"
      };
    } else if (score >= 5 && score <= 9) {
      return {
        score,
        interpretation: "Mild depression",
        level: "mild",
        color: "bg-yellow-500"
      };
    } else if (score >= 10 && score <= 14) {
      return {
        score,
        interpretation: "Moderate depression",
        level: "moderate",
        color: "bg-orange-500"
      };
    } else if (score >= 15 && score <= 19) {
      return {
        score,
        interpretation: "Moderately severe depression",
        level: "moderate",
        color: "bg-red-500"
      };
    } else {
      return {
        score,
        interpretation: "Severe depression",
        level: "severe",
        color: "bg-red-700"
      };
    }
  };

  // Function to interpret GAD-7
  const interpretGAD7Score = (score: number): AssessmentResult => {
    if (score >= 0 && score <= 4) {
      return {
        score,
        interpretation: "Minimal anxiety",
        level: "minimal",
        color: "bg-green-500"
      };
    } else if (score >= 5 && score <= 9) {
      return {
        score,
        interpretation: "Mild anxiety",
        level: "mild",
        color: "bg-yellow-500"
      };
    } else if (score >= 10 && score <= 14) {
      return {
        score,
        interpretation: "Moderate anxiety",
        level: "moderate",
        color: "bg-orange-500"
      };
    } else {
      return {
        score,
        interpretation: "Severe anxiety",
        level: "severe",
        color: "bg-red-600"
      };
    }
  };

  // Function to interpret PSS
  const interpretPSSScore = (score: number): AssessmentResult => {
    if (score >= 0 && score <= 13) {
      return {
        score,
        interpretation: "Low perceived stress",
        level: "low",
        color: "bg-green-500"
      };
    } else if (score >= 14 && score <= 26) {
      return {
        score,
        interpretation: "Moderate perceived stress",
        level: "medium",
        color: "bg-yellow-500"
      };
    } else {
      return {
        score,
        interpretation: "High perceived stress",
        level: "high",
        color: "bg-red-500"
      };
    }
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

  if (!loaded) {
    return (
      <>
        <Header />
        <main className="min-h-screen py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center">
              <div className="animate-pulse rounded-lg bg-muted h-12 w-48 mx-auto mb-4"></div>
              <div className="animate-pulse rounded-lg bg-muted h-6 w-96 mx-auto"></div>
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
          </div>
          
          {/* Step Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
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
          </div>
          
          {/* Results Summary */}
          <div className="bg-background border border-muted rounded-lg p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Summary of Your Results
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* PHQ-9 Result */}
              <div className="bg-background rounded-lg border border-muted shadow-sm overflow-hidden">
                <div className="p-4 bg-primary/10">
                  <h3 className="font-bold text-foreground">Depression (PHQ-9)</h3>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Score:</span>
                    <span className="text-xl font-bold">{phq9Result?.score}</span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-2">
                    <div 
                      className={`h-full ${phq9Result?.color}`} 
                      style={{ width: `${(phq9Result?.score || 0) / 27 * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm">{phq9Result?.interpretation}</p>
                </div>
              </div>
              
              {/* GAD-7 Result */}
              <div className="bg-background rounded-lg border border-muted shadow-sm overflow-hidden">
                <div className="p-4 bg-primary/10">
                  <h3 className="font-bold text-foreground">Anxiety (GAD-7)</h3>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Score:</span>
                    <span className="text-xl font-bold">{gad7Result?.score}</span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-2">
                    <div 
                      className={`h-full ${gad7Result?.color}`} 
                      style={{ width: `${(gad7Result?.score || 0) / 21 * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm">{gad7Result?.interpretation}</p>
                </div>
              </div>
              
              {/* PSS Result */}
              <div className="bg-background rounded-lg border border-muted shadow-sm overflow-hidden">
                <div className="p-4 bg-primary/10">
                  <h3 className="font-bold text-foreground">Stress (PSS)</h3>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Score:</span>
                    <span className="text-xl font-bold">{pssResult?.score}</span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-2">
                    <div 
                      className={`h-full ${pssResult?.color}`} 
                      style={{ width: `${(pssResult?.score || 0) / 40 * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm">{pssResult?.interpretation}</p>
                </div>
              </div>
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
              <h3 className="font-bold text-foreground mb-4">What Do These Results Mean?</h3>
              <p className="text-muted-foreground mb-4">
                These assessments provide a snapshot of your current mental health status. They are not diagnostic tools, 
                but can help identify areas where you might benefit from additional support.
              </p>
              
              <div className="space-y-4">
                {phq9Result && phq9Result.score >= 10 && (
                  <div className="flex items-start">
                    <div className="bg-red-500 text-white p-2 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                    </div>
                    <p>Your depression score indicates moderate to severe symptoms. We recommend discussing these results with a mental health professional.</p>
                  </div>
                )}
                
                {gad7Result && gad7Result.score >= 10 && (
                  <div className="flex items-start">
                    <div className="bg-red-500 text-white p-2 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                    </div>
                    <p>Your anxiety score suggests significant anxiety symptoms. Consider reaching out to a healthcare provider for support.</p>
                  </div>
                )}
                
                {pssResult && pssResult.level === 'high' && (
                  <div className="flex items-start">
                    <div className="bg-red-500 text-white p-2 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                    </div>
                    <p>Your stress levels are high. This could be impacting your overall wellbeing and academic performance. Stress reduction strategies may be helpful.</p>
                  </div>
                )}
                
                {((phq9Result && phq9Result.score < 10) && (gad7Result && gad7Result.score < 10) && (pssResult && pssResult.level !== 'high')) && (
                  <div className="flex items-start">
                    <div className="bg-green-500 text-white p-2 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <p>Your scores suggest mild to minimal symptoms across these areas. Continue practicing healthy coping strategies and self-care.</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Next Steps */}
            <div className="mt-8 p-6 rounded-lg shadow-md bg-primary/10">
              <h3 className="text-xl font-semibold mb-4">Next Steps</h3>
              <p className="mb-4">
                Based on your assessment results, here are some recommendations:
              </p>
              <ul className="list-disc pl-5 mb-6 space-y-2">
                <li>Consider exploring the resources in our app&apos;s library section.</li>
                <li>Try the guided meditation exercises to help manage stress and anxiety.</li>
                <li>Set up regular check-ins to track your progress over time.</li>
                <li>Connect with our community support features if you&apos;d like to share experiences.</li>
              </ul>
              
              <div className="flex justify-between">
                <Link href="/onboarding/pss">
                  <Button variant="outline">
                    Previous
                  </Button>
                </Link>
                <Button variant="primary" onClick={handleContinue}>
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>Note:</strong> These assessments are not a substitute for professional medical advice, diagnosis, or treatment.
            </p>
            <p>
              If you&apos;re experiencing severe distress or have thoughts of harming yourself, please reach out to a mental health professional 
              or call a crisis hotline immediately.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 