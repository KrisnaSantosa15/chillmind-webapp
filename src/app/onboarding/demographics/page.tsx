"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';

// Demographic options
const ageOptions = [
  { value: "below18", label: "Below 18" },
  { value: "18-22", label: "18-22" },
  { value: "23-26", label: "23-26" },
  { value: "27-30", label: "27-30" },
  { value: "above30", label: "Above 30" }
];

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "preferNotToSay", label: "Prefer not to say" }
];

const academicYearOptions = [
  { value: "firstYear", label: "First year or equivalent" },
  { value: "secondYear", label: "Second year or equivalent" },
  { value: "thirdYear", label: "Third year or equivalent" },
  { value: "fourthYear", label: "Fourth year or equivalent" },
  { value: "other", label: "Other" }
];

const gpaOptions = [
  { value: "2.50-2.99", label: "2.50-2.99" },
  { value: "3.00-3.39", label: "3.00-3.39" },
  { value: "3.40-3.79", label: "3.40-3.79" },
  { value: "3.80-4.00", label: "3.80-4.00" },
  { value: "other", label: "Other" }
];

const scholarshipOptions = [
  { value: true, label: "Yes" },
  { value: false, label: "No" }
];

interface DemographicsData {
  age: string;
  gender: string;
  academicYear: string;
  gpa: string;
  scholarship: boolean | null;
}

interface ErrorState {
  age?: string;
  gender?: string;
  academicYear?: string;
  gpa?: string;
  scholarship?: string;
}

export default function DemographicsPage() {
  const router = useRouter();
  const [demographics, setDemographics] = useState<DemographicsData>({
    age: "",
    gender: "",
    academicYear: "",
    gpa: "",
    scholarship: null
  });

  const [errors, setErrors] = useState<ErrorState>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof DemographicsData, value: string | boolean) => {
    setDemographics(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when field is changed
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors: ErrorState = {};
    // Check all required fields
    Object.keys(demographics).forEach((key) => {
      const typedKey = key as keyof DemographicsData;
      if (demographics[typedKey] === "" || demographics[typedKey] === null) {
        newErrors[typedKey] = "This field is required";
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      localStorage.setItem('demographics', JSON.stringify(demographics));
      router.push('/onboarding/phq9');
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tell Us About Yourself
            </h1>
            <p className="text-lg text-muted-foreground">
              This information helps us understand your context and provide more relevant insights.
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
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  2
                </div>
                <span className="text-sm mt-2 text-primary font-medium">Demographics</span>
              </div>
              <div className="flex-1 h-1 mx-2 bg-muted"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">
                  3
                </div>
                <span className="text-sm mt-2 text-muted-foreground">Depression</span>
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
            
            {/* Mobile Step Indicator - Redesigned */}
            <div className="md:hidden">
              {/* Progress bar showing completion */}
              <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-gradient-to-r from-primary/70 to-primary" style={{ width: '33.3%' }}></div>
              </div>
              
              {/* Current step highlight card */}
              <div className="relative mb-2">
                <div className="overflow-x-auto pb-3 scrollbar-hide">
                  <div className="flex gap-2 w-max px-2">
                    {['Introduction', 'Demographics', 'Depression', 'Anxiety', 'Stress', 'Results'].map((step, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center px-4 py-2 rounded-lg border transition-all ${
                          index === 1 
                            ? 'bg-primary text-white border-primary min-w-[90px] scale-105 shadow-md' 
                            : (index < 1 
                              ? 'bg-primary/20 border-primary/30 text-primary/70 min-w-[85px]'
                              : 'bg-primary/10 border-primary/20 text-muted-foreground min-w-[85px]')
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full ${
                          index === 1 
                            ? 'bg-white text-primary' 
                            : (index < 1 
                              ? 'bg-primary/50 text-white' 
                              : 'bg-primary/30 text-white')
                        } flex items-center justify-center text-xs font-bold mr-2`}>
                          {index < 1 ? '✓' : index + 1}
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
          
          {/* Demographics Form */}
          <div className="bg-background border border-muted rounded-lg p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Age Group */}
              <div className="space-y-4">
                <label className="block text-lg font-medium text-foreground">
                  Age Group
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {ageOptions.map((option) => (
                    <div key={option.value} className="relative">
                      <input
                        type="radio"
                        id={`age-${option.value}`}
                        name="age"
                        value={option.value}
                        checked={demographics.age === option.value}
                        onChange={() => handleChange('age', option.value)}
                        className="sr-only peer"
                      />
                      <label
                        htmlFor={`age-${option.value}`}
                        className="flex p-3 bg-background border border-muted rounded-lg text-sm cursor-pointer peer-checked:border-primary peer-checked:bg-primary/10 hover:bg-muted/50 transition-colors"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.age && <p className="text-accent text-sm mt-1">{errors.age}</p>}
              </div>
              
              {/* Gender */}
              <div className="space-y-4">
                <label className="block text-lg font-medium text-foreground">
                  Gender
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {genderOptions.map((option) => (
                    <div key={option.value} className="relative">
                      <input
                        type="radio"
                        id={`gender-${option.value}`}
                        name="gender"
                        value={option.value}
                        checked={demographics.gender === option.value}
                        onChange={() => handleChange('gender', option.value)}
                        className="sr-only peer"
                      />
                      <label
                        htmlFor={`gender-${option.value}`}
                        className="flex p-3 bg-background border border-muted rounded-lg text-sm cursor-pointer peer-checked:border-primary peer-checked:bg-primary/10 hover:bg-muted/50 transition-colors"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.gender && <p className="text-accent text-sm mt-1">{errors.gender}</p>}
              </div>
              
              {/* Academic Year */}
              <div className="space-y-4">
                <label className="block text-lg font-medium text-foreground">
                  Academic Year
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {academicYearOptions.map((option) => (
                    <div key={option.value} className="relative">
                      <input
                        type="radio"
                        id={`academicYear-${option.value}`}
                        name="academicYear"
                        value={option.value}
                        checked={demographics.academicYear === option.value}
                        onChange={() => handleChange('academicYear', option.value)}
                        className="sr-only peer"
                      />
                      <label
                        htmlFor={`academicYear-${option.value}`}
                        className="flex p-3 bg-background border border-muted rounded-lg text-sm cursor-pointer peer-checked:border-primary peer-checked:bg-primary/10 hover:bg-muted/50 transition-colors"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.academicYear && <p className="text-accent text-sm mt-1">{errors.academicYear}</p>}
              </div>
              
              {/* GPA */}
              <div className="space-y-4">
                <label className="block text-lg font-medium text-foreground">
                  Current GPA
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {gpaOptions.map((option) => (
                    <div key={option.value} className="relative">
                      <input
                        type="radio"
                        id={`gpa-${option.value}`}
                        name="gpa"
                        value={option.value}
                        checked={demographics.gpa === option.value}
                        onChange={() => handleChange('gpa', option.value)}
                        className="sr-only peer"
                      />
                      <label
                        htmlFor={`gpa-${option.value}`}
                        className="flex p-3 bg-background border border-muted rounded-lg text-sm cursor-pointer peer-checked:border-primary peer-checked:bg-primary/10 hover:bg-muted/50 transition-colors"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.gpa && <p className="text-accent text-sm mt-1">{errors.gpa}</p>}
              </div>
              
              {/* Scholarship */}
              <div className="space-y-4">
                <label className="block text-lg font-medium text-foreground">
                  Did you receive a waiver or scholarship?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xs">
                  {scholarshipOptions.map((option) => (
                    <div key={String(option.value)} className="relative">
                      <input
                        type="radio"
                        id={`scholarship-${String(option.value)}`}
                        name="scholarship"
                        value={String(option.value)}
                        checked={demographics.scholarship === option.value}
                        onChange={() => handleChange('scholarship', option.value)}
                        className="sr-only peer"
                      />
                      <label
                        htmlFor={`scholarship-${String(option.value)}`}
                        className="flex p-3 bg-background border border-muted rounded-lg text-sm cursor-pointer peer-checked:border-primary peer-checked:bg-primary/10 hover:bg-muted/50 transition-colors"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.scholarship && <p className="text-accent text-sm mt-1">{errors.scholarship}</p>}
              </div>
              
              <div className="flex justify-between pt-6">
                <Link href="/onboarding">
                  <Button variant="outline" type="button">
                    Previous
                  </Button>
                </Link>
                <Button variant="primary" type="submit" disabled={loading} isLoading={loading}>
                  Continue to Depression Assessment
                </Button>
              </div>
            </form>
          </div>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Your information is private and will only be used to personalize your mental health insights.
              We do not share this data with third parties.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}