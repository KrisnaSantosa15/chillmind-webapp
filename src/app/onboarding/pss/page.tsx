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

// Reverse-scored questions (questions 4, 5, 7, and 8 in zero-indexed array)
const reverseScored = [3, 4, 6, 7];

export default function PSSPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [validated, setValidated] = useState(false);

  // Load any saved answers from localStorage
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
      // Calculate score (reverse scoring for questions 4, 5, 7, and 8)
      const score = answers.reduce((sum, answer, index) => {
        if (reverseScored.includes(index)) {
          // Reverse scoring: 0=4, 1=3, 2=2, 3=1, 4=0
          return sum + (4 - answer);
        }
        return sum + answer;
      }, 0);
      
      localStorage.setItem('pss_score', score.toString());
      
      // Proceed to results
      router.push('/onboarding/results');
    } else {
      // Scroll to the first unanswered question
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
                  disabled={!validated}
                  className={!validated ? "opacity-70 cursor-not-allowed" : ""}
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