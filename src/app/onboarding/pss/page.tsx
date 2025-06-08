"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';

// PSS Questions
const questions = [
  "Been upset because of something that happened unexpectedly?",
  "Felt that you were unable to control the important things in your life?",
  "Felt nervous and stressed?",
  "Felt confident about your ability to handle your personal problems?",
  "Felt that things were going your way?",
  "Found that you could not cope with all the things that you had to do?",
  "Been able to control irritations in your life?",
  "Felt that you were on top of things?",
  "Been angered because of things that happened that were outside of your control?",
  "Felt difficulties were piling up so high that you could not overcome them?"
];

// PSS Response Options
const responseOptions = [
  { value: 0, label: "Never" },
  { value: 1, label: "Almost Never" },
  { value: 2, label: "Sometimes" },
  { value: 3, label: "Fairly Often" },
  { value: 4, label: "Very Often" }
];

const reverseScored = [3, 4, 6, 7];

export default function PSSPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedAnswers = localStorage.getItem('pss_answers');
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
      setValidated(JSON.parse(savedAnswers).every((answer: number) => answer !== -1));
    }
  }, []);

  const handleOptionSelect = (questionIndex: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);
    localStorage.setItem('pss_answers', JSON.stringify(newAnswers));
    setValidated(newAnswers.every(answer => answer !== -1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validated) {
      const score = answers.reduce((sum, answer, index) => {
        if (reverseScored.includes(index)) {
          return sum + (4 - answer);
        }
        return sum + answer;
      }, 0);
      
      localStorage.setItem('pss_score', score.toString());
      
      setLoading(true);
      router.push('/onboarding/results');
    } else {
      const firstUnansweredIndex = answers.findIndex(answer => answer === -1);
      if (firstUnansweredIndex !== -1) {
        const element = document.getElementById(`question-${firstUnansweredIndex}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Stress Assessment (PSS)
            </h1>
            <p className="text-lg text-muted-foreground">
              In the last month, how often have you...
            </p>
          </div>
          
          {/* Step Indicator */}
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
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  5
                </div>
                <span className="text-sm mt-2 text-primary font-medium">Stress</span>
              </div>
              <div className="flex-1 h-1 mx-2 bg-muted"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">
                  6
                </div>
                <span className="text-sm mt-2 text-muted-foreground">Results</span>
              </div>
            </div>
            
            <div className="md:hidden">
              <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-gradient-to-r from-primary/70 to-primary" style={{ width: '83.3%' }}></div>
              </div>
              
              <div className="relative mb-2">
                <div className="overflow-x-auto pb-3 scrollbar-hide">
                  <div className="flex gap-2 w-max px-2">
                    {['Introduction', 'Demographics', 'Depression', 'Anxiety', 'Stress', 'Results'].map((step, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center px-4 py-2 rounded-lg border transition-all ${
                          index === 4 
                            ? 'bg-primary text-white border-primary min-w-[90px] scale-105 shadow-md' 
                            : (index < 4 
                              ? 'bg-primary/20 border-primary/30 text-primary/70 min-w-[85px]'
                              : 'bg-primary/10 border-primary/20 text-muted-foreground min-w-[85px]')
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full ${
                          index === 4 
                            ? 'bg-white text-primary' 
                            : (index < 4 
                              ? 'bg-primary/50 text-white' 
                              : 'bg-primary/30 text-white')
                        } flex items-center justify-center text-xs font-bold mr-2`}>
                          {index < 4 ? '✓' : index + 1}
                        </span>
                        <span className="text-xs whitespace-nowrap">
                          {index === 0 ? 'Intro' : step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="absolute top-0 left-0 h-full w-6 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
                <div className="absolute top-0 right-0 h-full w-6 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
              </div>
              
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
          
          {/* PSS Questionnaire */}
          <div className="bg-background border border-muted rounded-lg p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              {questions.map((question, index) => (
                <div key={index} id={`question-${index}`} className="border-b border-muted pb-6 last:border-0">
                  <h3 className="text-lg font-medium text-foreground mb-4">
                    {index + 1}. {question}
                    {reverseScored.includes(index) && (
                      <span className="text-sm text-muted-foreground ml-2">(Positively worded)</span>
                    )}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    {responseOptions.map((option) => (
                      <div key={option.value} className="relative">
                        <input
                          type="radio"
                          id={`q${index}-o${option.value}`}
                          name={`question-${index}`}
                          value={option.value}
                          checked={answers[index] === option.value}
                          onChange={() => handleOptionSelect(index, option.value)}
                          className="sr-only peer"
                        />
                        <label
                          htmlFor={`q${index}-o${option.value}`}
                          className="flex p-3 bg-background border border-muted rounded-lg text-sm cursor-pointer peer-checked:border-primary peer-checked:bg-primary/10 hover:bg-muted/50 transition-colors"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  {!validated && answers[index] === -1 && (
                    <p className="text-accent text-sm mt-2">Please select an option</p>
                  )}
                </div>
              ))}
              
              <div className="flex justify-between pt-4">
                <Link href="/onboarding/gad7">
                  <Button variant="outline" type="button">
                    Previous
                  </Button>
                </Link>
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={!validated || loading}
                  className={!validated || loading ? "opacity-70 cursor-not-allowed" : ""}
                  isLoading={loading}
                >
                  View Results
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}