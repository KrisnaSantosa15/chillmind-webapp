"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import * as tf from "@tensorflow/tfjs";
import {
  loadModel,
  loadScalerParams,
  preprocessData,
  processPredictions,
  getLabelColor,
  DemographicData,
  AssessmentAnswers,
  PredictionResults,
} from "@/lib/model";
import { useAuth } from "@/lib/authContext";
import { saveAssessmentResults } from "@/lib/firestore";
import Link from "next/link";

export default function ResultsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [predictionResults, setPredictionResults] =
    useState<PredictionResults | null>(null);
  const [demographics, setDemographics] = useState<DemographicData | null>(
    null
  );
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dataSaved, setDataSaved] = useState(false);
  const [isReturnFromAuth, setIsReturnFromAuth] = useState(false);

  useEffect(() => {
    if (user && dataSaved && !localStorage.getItem("staying_on_results")) {
      router.push("/dashboard");
    }

    return () => {
      localStorage.removeItem("staying_on_results");
    };
  }, [user, dataSaved, router]);

  useEffect(() => {
    const checkPendingAssessmentData = async () => {
      const hasPendingAssessment =
        localStorage.getItem("assessment_pending") === "true";

      if (
        user &&
        hasPendingAssessment &&
        predictionResults &&
        demographics &&
        !dataSaved
      ) {
        setIsReturnFromAuth(true);

        try {
          const phq9Score = parseInt(
            localStorage.getItem("phq9_score") || "0",
            10
          );
          const gad7Score = parseInt(
            localStorage.getItem("gad7_score") || "0",
            10
          );
          const pssScore = parseInt(
            localStorage.getItem("pss_score") || "0",
            10
          );

          const phq9Answers = JSON.parse(
            localStorage.getItem("phq9_answers") || "[]"
          );
          const gad7Answers = JSON.parse(
            localStorage.getItem("gad7_answers") || "[]"
          );
          const pssAnswers = JSON.parse(
            localStorage.getItem("pss_answers") || "[]"
          );

          await saveAssessmentResults(
            user,
            demographics,
            predictionResults,
            {
              phq9: phq9Score,
              gad7: gad7Score,
              pss: pssScore,
            },
            {
              phq9Answers,
              gad7Answers,
              pssAnswers,
            }
          );

          cleanupAssessmentData();

          setDataSaved(true);
        } catch (error) {
          console.error("Error saving assessment data after login:", error);
        }
      }
    };

    if (loaded) {
      checkPendingAssessmentData();
    }
  }, [user, loaded, demographics, predictionResults, dataSaved]);

  useEffect(() => {
    const scrollToCurrentStep = () => {
      const scrollContainer = document.getElementById("stepsScrollContainer");
      const currentStep = document.getElementById("currentStep");

      if (scrollContainer && currentStep) {
        const containerWidth = scrollContainer.clientWidth;
        const currentStepLeft = currentStep.offsetLeft;
        const currentStepWidth = currentStep.clientWidth;
        const scrollPosition =
          currentStepLeft - containerWidth / 2 + currentStepWidth / 2;

        scrollContainer.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }
    };

    const timeoutId = setTimeout(() => {
      scrollToCurrentStep();
    }, 100);

    // Clean up timeout
    return () => clearTimeout(timeoutId);
  }, [loaded]);

  useEffect(() => {
    const fallbackToTraditionalScoring = () => {
      const phq9Score = parseInt(localStorage.getItem("phq9_score") || "0", 10);
      const gad7Score = parseInt(localStorage.getItem("gad7_score") || "0", 10);
      const pssScore = parseInt(localStorage.getItem("pss_score") || "0", 10);

      setPredictionResults({
        depression: {
          label: getDepressionLabel(phq9Score),
          probability: 1.0,
          probabilities: [
            { label: getDepressionLabel(phq9Score), probability: 1.0 },
          ],
        },
        anxiety: {
          label: getAnxietyLabel(gad7Score),
          probability: 1.0,
          probabilities: [
            { label: getAnxietyLabel(gad7Score), probability: 1.0 },
          ],
        },
        stress: {
          label: getStressLabel(pssScore),
          probability: 1.0,
          probabilities: [
            { label: getStressLabel(pssScore), probability: 1.0 },
          ],
        },
      });
      localStorage.setItem(
        "prediction_results",
        JSON.stringify({
          depression: {
            label: getDepressionLabel(phq9Score),
            probability: 1.0,
            probabilities: [
              { label: getDepressionLabel(phq9Score), probability: 1.0 },
            ],
          },
          anxiety: {
            label: getAnxietyLabel(gad7Score),
            probability: 1.0,
            probabilities: [
              { label: getAnxietyLabel(gad7Score), probability: 1.0 },
            ],
          },
          stress: {
            label: getStressLabel(pssScore),
            probability: 1.0,
            probabilities: [
              { label: getStressLabel(pssScore), probability: 1.0 },
            ],
          },
        })
      );
    };
    async function loadAssessmentData() {
      try {
        const demoData = JSON.parse(
          localStorage.getItem("demographics") || "{}"
        );

        const mappedDemographics: DemographicData = {
          age: demoData.age || "",
          gender: demoData.gender || "",
          academicYear: demoData.academicYear || "",
          gpa: demoData.gpa || "",
          scholarship: demoData.scholarship,
        };
        setDemographics(mappedDemographics);

        const phq9Answers = JSON.parse(
          localStorage.getItem("phq9_answers") || "[]"
        );
        const gad7Answers = JSON.parse(
          localStorage.getItem("gad7_answers") || "[]"
        );
        const pssAnswers = JSON.parse(
          localStorage.getItem("pss_answers") || "[]"
        );

        if (
          phq9Answers.length === 0 ||
          gad7Answers.length === 0 ||
          pssAnswers.length === 0
        ) {
          throw new Error("Assessment answers are missing");
        }

        const phq9Score = phq9Answers.reduce(
          (sum: number, val: number) => sum + val,
          0
        );
        const gad7Score = gad7Answers.reduce(
          (sum: number, val: number) => sum + val,
          0
        );

        const reverseScored = [3, 4, 6, 7];
        const pssScore = pssAnswers.reduce(
          (sum: number, answer: number, index: number) => {
            if (reverseScored.includes(index)) {
              return sum + (4 - answer);
            }
            return sum + answer;
          },
          0
        );

        localStorage.setItem("phq9_score", phq9Score.toString());
        localStorage.setItem("gad7_score", gad7Score.toString());
        localStorage.setItem("pss_score", pssScore.toString());

        const assessmentData: AssessmentAnswers = {
          phq9Answers,
          gad7Answers,
          pssAnswers,
        };

        await loadModel();
        await loadScalerParams();

        const modelInput = preprocessData(mappedDemographics, assessmentData);

        const model = await loadModel();
        const predictOutput = model.predict(modelInput);

        let results;
        if (predictOutput instanceof tf.Tensor) {
          results = await processPredictions(predictOutput);
        } else if (Array.isArray(predictOutput)) {
          results = await processPredictions(predictOutput);
        } else {
          const firstTensor = Object.values(predictOutput)[0];
          results = await processPredictions(firstTensor);
        }
        setPredictionResults(results);
        localStorage.setItem("prediction_results", JSON.stringify(results));
      } catch (err) {
        console.error("Error during prediction:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        fallbackToTraditionalScoring();
      } finally {
        setLoaded(true);
      }
    }

    loadAssessmentData();
  }, []);

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
    if (category === "age") {
      const ageMap: Record<string, string> = {
        below18: "Below 18",
        "18-22": "18-22",
        "23-26": "23-26",
        "27-30": "27-30",
        above30: "Above 30",
      };
      return ageMap[value as string] || value;
    }

    if (category === "gender") {
      const genderMap: Record<string, string> = {
        male: "Male",
        female: "Female",
        preferNotToSay: "Prefer not to say",
      };
      return genderMap[value as string] || value;
    }

    if (category === "academicYear") {
      const yearMap: Record<string, string> = {
        firstYear: "First year",
        secondYear: "Second year",
        thirdYear: "Third year",
        fourthYear: "Fourth year",
        other: "Other",
      };
      return yearMap[value as string] || value;
    }

    if (category === "scholarship") {
      return value ? "Yes" : "No";
    }

    return value;
  };

  const handleContinue = async () => {
    setLoading(true);

    try {
      if (!user) {
        localStorage.setItem("assessment_pending", "true");

        router.push("/auth/register");
        return;
      }

      if (!dataSaved && predictionResults && demographics) {
        const phq9Score = parseInt(
          localStorage.getItem("phq9_score") || "0",
          10
        );
        const gad7Score = parseInt(
          localStorage.getItem("gad7_score") || "0",
          10
        );
        const pssScore = parseInt(localStorage.getItem("pss_score") || "0", 10);

        const phq9Answers = JSON.parse(
          localStorage.getItem("phq9_answers") || "[]"
        );
        const gad7Answers = JSON.parse(
          localStorage.getItem("gad7_answers") || "[]"
        );
        const pssAnswers = JSON.parse(
          localStorage.getItem("pss_answers") || "[]"
        );

        await saveAssessmentResults(
          user,
          demographics,
          predictionResults,
          {
            phq9: phq9Score,
            gad7: gad7Score,
            pss: pssScore,
          },
          {
            phq9Answers,
            gad7Answers,
            pssAnswers,
          }
        );

        cleanupAssessmentData();

        setDataSaved(true);
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Error saving assessment data:", err);
      setError(
        "Failed to save your assessment data, but you can still view your results."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRetakeAssessment = () => {
    cleanupAssessmentData();

    router.push("/onboarding");
  };

  useEffect(() => {
    if (user && isReturnFromAuth && dataSaved) {
      const redirectTimer = setTimeout(() => {
        router.push("/dashboard");
      }, 3000);

      return () => clearTimeout(redirectTimer);
    }
  }, [user, isReturnFromAuth, dataSaved, router]);

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
                    {index < 5 && (
                      <div className="flex-1 h-1 mx-2 bg-muted"></div>
                    )}
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
                  <div
                    key={index}
                    className="bg-background rounded-lg border border-muted shadow-sm overflow-hidden"
                  >
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
                  <div
                    key={index}
                    className="flex items-start rounded-lg border border-muted p-3 bg-background flex-1 min-w-[250px]"
                  >
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
                  <div
                    key={index}
                    className="bg-background rounded-xl border border-muted p-6 text-center shadow-sm"
                  >
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
              Based on your responses, here are your mental health assessment
              results.
            </p>

            {/* Authentication status */}
            {!authLoading && !user && (
              <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="font-medium text-foreground mb-2">
                  To save your results and access personalized recommendations:
                </p>
                <div className="flex justify-center gap-4 mt-3">
                  <Link
                    href="/auth/register"
                    className="text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-sm"
                  >
                    Register
                  </Link>
                  <Link
                    href="/auth/login"
                    className="text-primary bg-transparent border border-primary hover:bg-primary/10 px-4 py-2 rounded-md font-medium text-sm"
                  >
                    Log In
                  </Link>
                </div>
              </div>
            )}

            {!authLoading && user && isReturnFromAuth && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <div className="mr-3 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-green-800">
                      Authentication successful!{" "}
                      {dataSaved
                        ? "Your assessment data has been saved."
                        : "Your assessment data is being saved."}
                    </p>
                    <p className="text-sm text-green-600">
                      {dataSaved
                        ? "You will be redirected to your personalized dashboard shortly..."
                        : "Please wait while we prepare your personalized dashboard."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-accent/10 text-accent rounded-lg">
                <p>
                  There was an issue with the machine learning prediction:{" "}
                  {error}
                </p>
                <p className="text-sm">Using traditional scoring instead.</p>
              </div>
            )}
          </div>

          <div className="mb-12">
            <div className="hidden md:flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/50 flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <span className="text-sm mt-2 text-primary/50 font-medium">
                  Introduction
                </span>
              </div>
              <div className="flex-1 h-1 mx-2 bg-primary/50"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/50 flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <span className="text-sm mt-2 text-primary/50 font-medium">
                  Demographics
                </span>
              </div>
              <div className="flex-1 h-1 mx-2 bg-primary/50"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/50 flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <span className="text-sm mt-2 text-primary/50 font-medium">
                  Depression
                </span>
              </div>
              <div className="flex-1 h-1 mx-2 bg-primary/50"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/50 flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <span className="text-sm mt-2 text-primary/50 font-medium">
                  Anxiety
                </span>
              </div>
              <div className="flex-1 h-1 mx-2 bg-primary/50"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/50 flex items-center justify-center text-white font-bold">
                  ✓
                </div>
                <span className="text-sm mt-2 text-primary/50 font-medium">
                  Stress
                </span>
              </div>
              <div className="flex-1 h-1 mx-2 bg-primary/50"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  6
                </div>
                <span className="text-sm mt-2 text-primary font-medium">
                  Results
                </span>
              </div>
            </div>

            <div className="md:hidden">
              <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-primary/70 to-primary"
                  style={{ width: "100%" }}
                ></div>
              </div>

              <div className="relative mb-2">
                <div
                  className="overflow-x-auto pb-3 scrollbar-hide"
                  id="stepsScrollContainer"
                >
                  <div className="flex gap-2 w-max px-2">
                    {[
                      "Introduction",
                      "Demographics",
                      "Depression",
                      "Anxiety",
                      "Stress",
                      "Results",
                    ].map((step, index) => (
                      <div
                        key={index}
                        id={index === 5 ? "currentStep" : `step-${index}`}
                        className={`flex items-center px-4 py-2 rounded-lg border transition-all ${
                          index === 5
                            ? "bg-primary text-white border-primary min-w-[90px] scale-105 shadow-md"
                            : "bg-primary/10 border-primary/20 text-muted-foreground min-w-[85px]"
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full ${
                            index === 5
                              ? "bg-white text-primary"
                              : "bg-primary/30 text-white"
                          } flex items-center justify-center text-xs font-bold mr-2`}
                        >
                          {index + 1}
                        </span>
                        <span className="text-xs whitespace-nowrap">
                          {index === 0 ? "Intro" : step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute top-0 left-0 h-full w-6 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
                <div className="absolute top-0 right-0 h-full w-6 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
              </div>

              {/* Helper text */}
              <p className="text-[10px] text-center text-muted-foreground">
                <span className="inline-flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  Swipe to see all steps
                </span>
              </p>
            </div>
          </div>

          <div className="bg-background border border-muted rounded-lg p-4 md:p-8 shadow-sm mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 md:mb-6">
              Summary of Your Results
            </h2>

            {predictionResults && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                {/* Anxiety Result */}
                <div className="bg-background rounded-lg border border-muted shadow-sm overflow-hidden transition-all hover:shadow-md">
                  <div
                    className={`p-3 md:p-4 ${getLabelColor(
                      "anxiety",
                      predictionResults.anxiety.label
                    ).replace("bg-", "bg-opacity-90 bg-")}`}
                  >
                    <h3 className="font-bold text-white text-center">
                      Anxiety Assessment
                    </h3>
                  </div>
                  <div className="p-4 md:p-6">
                    <div className="flex md:hidden items-center gap-4">
                      <div
                        className={`w-16 h-16 rounded-full ${getLabelColor(
                          "anxiety",
                          predictionResults.anxiety.label
                        )} flex items-center justify-center flex-shrink-0`}
                      >
                        <span className="font-bold text-white text-xl">
                          {getSeverityIcon(predictionResults.anxiety.label)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <span className="text-lg font-bold block">
                          {predictionResults.anxiety.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Confidence:{" "}
                          {(
                            predictionResults.anxiety.probability * 100
                          ).toFixed(1)}
                          %
                        </span>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-2">
                          <div
                            className={`h-full ${getLabelColor(
                              "anxiety",
                              predictionResults.anxiety.label
                            )}`}
                            style={{
                              width: `${
                                predictionResults.anxiety.probability * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:flex flex-col items-center">
                      <div
                        className={`w-20 h-20 rounded-full ${getLabelColor(
                          "anxiety",
                          predictionResults.anxiety.label
                        )} flex items-center justify-center mb-3`}
                      >
                        <span className="font-bold text-white text-xl">
                          {getSeverityIcon(predictionResults.anxiety.label)}
                        </span>
                      </div>
                      <span className="text-xl font-bold text-center mb-1">
                        {predictionResults.anxiety.label}
                      </span>
                      <span className="text-xs text-muted-foreground mb-3">
                        Confidence:{" "}
                        {(predictionResults.anxiety.probability * 100).toFixed(
                          1
                        )}
                        %
                      </span>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getLabelColor(
                            "anxiety",
                            predictionResults.anxiety.label
                          )}`}
                          style={{
                            width: `${
                              predictionResults.anxiety.probability * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {predictionResults.anxiety.probability < 0.95 && (
                      <div className="mt-3 pt-3 border-t border-muted">
                        <p className="text-xs text-muted-foreground mb-1">
                          Alternative assessment:
                        </p>
                        {predictionResults.anxiety.probabilities
                          .filter(
                            (item) =>
                              item.label !== predictionResults.anxiety.label &&
                              item.probability > 0.05
                          )
                          .sort((a, b) => b.probability - a.probability)
                          .slice(0, 1)
                          .map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between text-xs"
                            >
                              <span>{item.label}</span>
                              <span>
                                {(item.probability * 100).toFixed(1)}%
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Depression Result */}
                <div className="bg-background rounded-lg border border-muted shadow-sm overflow-hidden transition-all hover:shadow-md">
                  <div
                    className={`p-3 md:p-4 ${getLabelColor(
                      "depression",
                      predictionResults.depression.label
                    ).replace("bg-", "bg-opacity-90 bg-")}`}
                  >
                    <h3 className="font-bold text-white text-center">
                      Depression Assessment
                    </h3>
                  </div>
                  <div className="p-4 md:p-6">
                    <div className="flex md:hidden items-center gap-4">
                      <div
                        className={`w-16 h-16 rounded-full ${getLabelColor(
                          "depression",
                          predictionResults.depression.label
                        )} flex items-center justify-center flex-shrink-0`}
                      >
                        <span className="font-bold text-white text-xl">
                          {getSeverityIcon(predictionResults.depression.label)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <span className="text-lg font-bold block">
                          {predictionResults.depression.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Confidence:{" "}
                          {(
                            predictionResults.depression.probability * 100
                          ).toFixed(1)}
                          %
                        </span>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-2">
                          <div
                            className={`h-full ${getLabelColor(
                              "depression",
                              predictionResults.depression.label
                            )}`}
                            style={{
                              width: `${
                                predictionResults.depression.probability * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:flex flex-col items-center">
                      <div
                        className={`w-20 h-20 rounded-full ${getLabelColor(
                          "depression",
                          predictionResults.depression.label
                        )} flex items-center justify-center mb-3`}
                      >
                        <span className="font-bold text-white text-xl">
                          {getSeverityIcon(predictionResults.depression.label)}
                        </span>
                      </div>
                      <span className="text-xl font-bold text-center mb-1">
                        {predictionResults.depression.label}
                      </span>
                      <span className="text-xs text-muted-foreground mb-3">
                        Confidence:{" "}
                        {(
                          predictionResults.depression.probability * 100
                        ).toFixed(1)}
                        %
                      </span>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getLabelColor(
                            "depression",
                            predictionResults.depression.label
                          )}`}
                          style={{
                            width: `${
                              predictionResults.depression.probability * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {predictionResults.depression.probability < 0.95 && (
                      <div className="mt-3 pt-3 border-t border-muted">
                        <p className="text-xs text-muted-foreground mb-1">
                          Alternative assessment:
                        </p>
                        {predictionResults.depression.probabilities
                          .filter(
                            (item) =>
                              item.label !==
                                predictionResults.depression.label &&
                              item.probability > 0.05
                          )
                          .sort((a, b) => b.probability - a.probability)
                          .slice(0, 1)
                          .map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between text-xs"
                            >
                              <span>{item.label}</span>
                              <span>
                                {(item.probability * 100).toFixed(1)}%
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Stress Result */}
                <div className="bg-background rounded-lg border border-muted shadow-sm overflow-hidden transition-all hover:shadow-md">
                  <div
                    className={`p-3 md:p-4 ${getLabelColor(
                      "stress",
                      predictionResults.stress.label
                    ).replace("bg-", "bg-opacity-90 bg-")}`}
                  >
                    <h3 className="font-bold text-white text-center">
                      Stress Assessment
                    </h3>
                  </div>
                  <div className="p-4 md:p-6">
                    <div className="flex md:hidden items-center gap-4">
                      <div
                        className={`w-16 h-16 rounded-full ${getLabelColor(
                          "stress",
                          predictionResults.stress.label
                        )} flex items-center justify-center flex-shrink-0`}
                      >
                        <span className="font-bold text-white text-xl">
                          {getSeverityIcon(predictionResults.stress.label)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <span className="text-lg font-bold block">
                          {predictionResults.stress.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Confidence:{" "}
                          {(predictionResults.stress.probability * 100).toFixed(
                            1
                          )}
                          %
                        </span>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-2">
                          <div
                            className={`h-full ${getLabelColor(
                              "stress",
                              predictionResults.stress.label
                            )}`}
                            style={{
                              width: `${
                                predictionResults.stress.probability * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:flex flex-col items-center">
                      <div
                        className={`w-20 h-20 rounded-full ${getLabelColor(
                          "stress",
                          predictionResults.stress.label
                        )} flex items-center justify-center mb-3`}
                      >
                        <span className="font-bold text-white text-xl">
                          {getSeverityIcon(predictionResults.stress.label)}
                        </span>
                      </div>
                      <span className="text-xl font-bold text-center mb-1">
                        {predictionResults.stress.label}
                      </span>
                      <span className="text-xs text-muted-foreground mb-3">
                        Confidence:{" "}
                        {(predictionResults.stress.probability * 100).toFixed(
                          1
                        )}
                        %
                      </span>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getLabelColor(
                            "stress",
                            predictionResults.stress.label
                          )}`}
                          style={{
                            width: `${
                              predictionResults.stress.probability * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {predictionResults.stress.probability < 0.95 && (
                      <div className="mt-3 pt-3 border-t border-muted">
                        <p className="text-xs text-muted-foreground mb-1">
                          Alternative assessment:
                        </p>
                        {predictionResults.stress.probabilities
                          .filter(
                            (item) =>
                              item.label !== predictionResults.stress.label &&
                              item.probability > 0.05
                          )
                          .sort((a, b) => b.probability - a.probability)
                          .slice(0, 1)
                          .map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between text-xs"
                            >
                              <span>{item.label}</span>
                              <span>
                                {(item.probability * 100).toFixed(1)}%
                              </span>
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
            <h3 className="font-bold text-foreground mb-4">
              Your Demographics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {demographics &&
                Object.entries(demographics).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-sm text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="font-medium">
                      {getDemographicLabel(key, value as string | boolean)}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Interpretation */}
          <div className="bg-primary/10 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-foreground mb-4">
              What These Results Mean for You
            </h3>
            <p className="text-muted-foreground mb-6">
              These assessments provide a snapshot of your current mental
              wellbeing. While they aren&apos;t diagnostic tools, they can help
              identify areas where additional support might benefit you.
            </p>

            {predictionResults && (
              <div className="space-y-6">
                <div className="bg-background rounded-lg border border-muted p-5">
                  <h4 className="font-medium mb-3">Personalized Insights</h4>
                  {(predictionResults.depression.label ===
                    "Moderate Depression" ||
                    predictionResults.depression.label ===
                      "Moderately Severe Depression" ||
                    predictionResults.depression.label ===
                      "Severe Depression") && (
                    <div className="flex items-start mb-4">
                      <div className="bg-red-500 text-white p-2 rounded-full mr-4 flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Depression Support</p>
                        <p className="text-sm">
                          Your depression assessment results suggest you may
                          benefit from professional support. Consider talking
                          with a mental health provider who can offer
                          personalized guidance.
                        </p>
                      </div>
                    </div>
                  )}

                  {(predictionResults.anxiety.label === "Moderate Anxiety" ||
                    predictionResults.anxiety.label === "Severe Anxiety") && (
                    <div className="flex items-start mb-4">
                      <div className="bg-red-500 text-white p-2 rounded-full mr-4 flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Anxiety Management</p>
                        <p className="text-sm">
                          Your anxiety assessment suggests significant anxiety
                          symptoms. Breathing exercises, mindfulness, and
                          professional support can help manage these feelings.
                        </p>
                      </div>
                    </div>
                  )}

                  {predictionResults.stress.label ===
                    "High Perceived Stress" && (
                    <div className="flex items-start mb-4">
                      <div className="bg-red-500 text-white p-2 rounded-full mr-4 flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Stress Reduction</p>
                        <p className="text-sm">
                          Your stress levels appear high, which can affect both
                          physical and mental health. Regular exercise, adequate
                          sleep, and relaxation techniques can help reduce
                          stress.
                        </p>
                      </div>
                    </div>
                  )}

                  {(predictionResults.depression.label ===
                    "Minimal Depression" ||
                    predictionResults.depression.label === "Mild Depression" ||
                    predictionResults.depression.label === "No Depression") &&
                    (predictionResults.anxiety.label === "Minimal Anxiety" ||
                      predictionResults.anxiety.label === "Mild Anxiety") &&
                    (predictionResults.stress.label === "Low Stress" ||
                      predictionResults.stress.label === "Moderate Stress") && (
                      <div className="flex items-start">
                        <div className="bg-green-500 text-white p-2 rounded-full mr-4 flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium mb-1">
                            Maintaining Wellbeing
                          </p>
                          <p className="text-sm">
                            Your assessment suggests mild to minimal symptoms.
                            Continue practicing healthy coping strategies and
                            self-care routines to maintain your mental
                            wellbeing.
                          </p>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>

          {/* Tips and Call to Action */}
          <div className="bg-primary/5 rounded-xl border border-primary/20 shadow-lg p-8 mb-10">
            <h3 className="font-bold text-foreground text-xl mb-6 text-center">
              Continue Your Wellness Journey
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <div className="bg-background rounded-xl border border-muted p-6 text-center shadow-sm hover:shadow-md transition-all">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                </div>
                <h4 className="font-medium mb-2 text-lg">Browse Resources</h4>
                <p className="text-sm text-muted-foreground">
                  Access articles and guides on managing mental health
                  effectively.
                </p>
              </div>

              <div className="bg-background rounded-xl border border-muted p-6 text-center shadow-sm hover:shadow-md transition-all">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <line x1="12" y1="20" x2="12" y2="10"></line>
                    <line x1="18" y1="20" x2="18" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="16"></line>
                  </svg>
                </div>
                <h4 className="font-medium mb-2 text-lg">
                  Track Your Progress
                </h4>
                <p className="text-sm text-muted-foreground">
                  Monitor your journey with mood tracking and regular check-ins.
                </p>
              </div>

              <div className="bg-background rounded-xl border border-muted p-6 text-center shadow-sm hover:shadow-md transition-all">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                  </svg>
                </div>
                <h4 className="font-medium mb-2 text-lg">
                  Practice Mindfulness
                </h4>
                <p className="text-sm text-muted-foreground">
                  Reduce stress and anxiety with guided meditations.
                </p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleContinue}
                className="bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-10 rounded-lg transition-colors text-lg shadow-md flex items-center mx-auto"
              >
                {!user
                  ? "Register to Save & Continue"
                  : dataSaved
                  ? "Go to Dashboard"
                  : "Save Results & Continue"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-2"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </button>
              <p className="text-sm text-muted-foreground mt-4">
                Your personal dashboard has been set up with tools and resources
                based on your assessment results.
              </p>
            </div>
          </div>

          <div className="border-t border-muted pt-6 pb-10 mt-6">
            <div className="bg-primary/5  rounded-lg p-4 mb-6 shadow-md">
              <p className="text-center text-sm  font-medium">
                <span className="inline-flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </span>
                <strong>Note:</strong> These assessments are not a substitute
                for professional medical advice or treatment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={handleRetakeAssessment}
                className="flex items-center justify-center py-3 px-4 text-sm order-2 md:order-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M3 2v6h6"></path>
                  <path d="M3 13a9 9 0 1 0 3-7.7L3 8"></path>
                </svg>
                Retake Assessment
              </Button>

              <Button
                variant="primary"
                onClick={handleContinue}
                disabled={loading}
                isLoading={loading}
                className="flex items-center justify-center py-3 px-4 text-sm order-1 md:order-2"
              >
                {!user
                  ? "Register to Save Results"
                  : dataSaved
                  ? "Go to Dashboard"
                  : "Save Results"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-2"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-6">
              If you&apos;re experiencing severe distress, please reach out to a
              mental health professional or call a crisis hotline.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

const getSeverityIcon = (label: string): string => {
  if (label.includes("Severe") || label.includes("High")) {
    return "!";
  } else if (label.includes("Moderate") || label.includes("Moderately")) {
    return "~";
  } else if (label.includes("Mild")) {
    return "○";
  } else {
    return "✓";
  }
};

const cleanupAssessmentData = () => {
  localStorage.removeItem("assessment_pending");
  localStorage.removeItem("demographics");
  localStorage.removeItem("phq9_answers");
  localStorage.removeItem("phq9_score");
  localStorage.removeItem("gad7_answers");
  localStorage.removeItem("gad7_score");
  localStorage.removeItem("pss_answers");
  localStorage.removeItem("pss_score");
  localStorage.removeItem("prediction_results");
};
