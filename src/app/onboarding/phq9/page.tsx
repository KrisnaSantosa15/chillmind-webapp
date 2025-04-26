"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';

// PHQ-9 Questions
const questions = [
  "Little interest or pleasure in doing things?",
  "Feeling down, depressed, or hopeless?",
  "Trouble falling or staying asleep, or sleeping too much?",
  "Feeling tired or having little energy?",
  "Poor appetite or overeating?",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down?",
  "Trouble concentrating on things, such as reading, watching TV, or attending a lecture?",
  "Moving or speaking so slowly that other people could have noticed? Or so fidgety or restless that you have been moving around a lot more than usual?",
  "Thoughts that you would be better off dead, or of hurting yourself in some way?"
];

// PHQ-9 Response Options
const responseOptions = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" }
];

export default function PHQ9Page() {
  const router = useRouter();
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [validated, setValidated] = useState(false);

  // Load any saved answers from localStorage
  useEffect(() => {
    const savedAnswers = localStorage.getItem('phq9_answers');
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
      setValidated(JSON.parse(savedAnswers).every((answer: number) => answer !== -1));
    }
  }, []);

  const handleOptionSelect = (questionIndex: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);
    localStorage.setItem('phq9_answers', JSON.stringify(newAnswers));
    setValidated(newAnswers.every(answer => answer !== -1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validated) {
      // Calculate score
      const score = answers.reduce((sum, answer) => sum + answer, 0);
      localStorage.setItem('phq9_score', score.toString());
      
      // Proceed to next assessment
      router.push('/onboarding/gad7');
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
              Depression Assessment (PHQ-9)
            </h1>
            <p className="text-lg text-muted-foreground">
              Over the past 2 weeks, how often have you been bothered by any of the following problems?
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
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  3
                </div>
                <span className="text-sm mt-2 text-primary font-medium">Depression</span>
              </div>
              <div className="flex-1 h-1 mx-2 bg-muted"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">
                  4
                </div>
                <span className="text-sm mt-2 text-muted-foreground">Anxiety</span>
              </div>
              <div className="flex-1 h-1 mx-2 bg-muted"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">
                  5
                </div>
                <span className="text-sm mt-2 text-muted-foreground">Stress</span>
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
          
          {/* PHQ-9 Questionnaire */}
          <div className="bg-background border border-muted rounded-lg p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              {questions.map((question, index) => (
                <div key={index} id={`question-${index}`} className="border-b border-muted pb-6 last:border-0">
                  <h3 className="text-lg font-medium text-foreground mb-4">
                    {index + 1}. {question}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
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
                <Link href="/onboarding/demographics">
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
                  Continue to Anxiety Assessment
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