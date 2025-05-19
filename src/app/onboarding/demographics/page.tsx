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
            <div className="flex items-center justify-between">
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