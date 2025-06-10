"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { getAllUserAssessments, AssessmentResults } from "@/lib/firestore";

interface AssessmentWithId {
  id: string;
  demographics: AssessmentResults["demographics"];
  predictionResults: AssessmentResults["predictionResults"];
  scores: AssessmentResults["scores"];
  answers?: AssessmentResults["answers"];
  timestamp: Date;
}

export default function AssessmentsPage() {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<AssessmentWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<"timeline" | "insights">(
    "timeline"
  );

  useEffect(() => {
    const fetchAssessments = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const data = await getAllUserAssessments(user);
        setAssessments(data);
      } catch (err) {
        console.error("Error fetching assessments:", err);
        setError("Failed to load assessment history");
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [user]);
  const getSeverityScore = (label: string): number => {
    if (
      label.includes("Minimal") ||
      label.includes("Normal") ||
      label.includes("Low")
    ) {
      return 1; // Normal/Minimal/Low severity
    } else if (label.includes("Mild")) {
      return 2; // Mild severity
    } else if (
      label.includes("Moderate") &&
      !label.includes("Moderately Severe")
    ) {
      return 3; // Moderate severity
    } else if (label.includes("Moderately Severe")) {
      return 4; // Moderately Severe
    } else if (label.includes("Severe") || label.includes("High")) {
      return 5; // Severe/High severity
    }

    return 0; // Unknown
  };
  const generateInsights = () => {
    if (assessments.length < 2) return null;

    const latest = assessments[0];
    const previous = assessments[1];

    const insights = [];

    // Anxiety comparison
    const anxietyLatest = getSeverityScore(
      latest.predictionResults.anxiety.label
    );
    const anxietyPrevious = getSeverityScore(
      previous.predictionResults.anxiety.label
    );

    // Lower score means improvement (less severe)
    if (anxietyLatest < anxietyPrevious) {
      insights.push({
        type: "improvement",
        category: "Anxiety",
        message: `Your anxiety level improved from ${previous.predictionResults.anxiety.label} to ${latest.predictionResults.anxiety.label}`,
        icon: "📈",
        color: "text-green-600",
      });
    } else if (anxietyLatest > anxietyPrevious) {
      insights.push({
        type: "concern",
        category: "Anxiety",
        message: `Your anxiety level increased from ${previous.predictionResults.anxiety.label} to ${latest.predictionResults.anxiety.label}`,
        icon: "⚠️",
        color: "text-orange-600",
      });
    } else {
      insights.push({
        type: "stable",
        category: "Anxiety",
        message: `Your anxiety level remained ${latest.predictionResults.anxiety.label}`,
        icon: "📊",
        color: "text-blue-600",
      });
    }

    // Depression comparison
    const depressionLatest = getSeverityScore(
      latest.predictionResults.depression.label
    );
    const depressionPrevious = getSeverityScore(
      previous.predictionResults.depression.label
    );

    // Lower score means improvement (less severe)
    if (depressionLatest < depressionPrevious) {
      insights.push({
        type: "improvement",
        category: "Depression",
        message: `Your depression level improved from ${previous.predictionResults.depression.label} to ${latest.predictionResults.depression.label}`,
        icon: "🌟",
        color: "text-green-600",
      });
    } else if (depressionLatest > depressionPrevious) {
      insights.push({
        type: "concern",
        category: "Depression",
        message: `Your depression level increased from ${previous.predictionResults.depression.label} to ${latest.predictionResults.depression.label}`,
        icon: "⚠️",
        color: "text-orange-600",
      });
    } else {
      insights.push({
        type: "stable",
        category: "Depression",
        message: `Your depression level remained ${latest.predictionResults.depression.label}`,
        icon: "📊",
        color: "text-blue-600",
      });
    }

    // Stress comparison
    const stressLatest = getSeverityScore(
      latest.predictionResults.stress.label
    );
    const stressPrevious = getSeverityScore(
      previous.predictionResults.stress.label
    );

    // Lower score means improvement (less severe)
    if (stressLatest < stressPrevious) {
      insights.push({
        type: "improvement",
        category: "Stress",
        message: `Your stress level decreased from ${previous.predictionResults.stress.label} to ${latest.predictionResults.stress.label}`,
        icon: "🧘",
        color: "text-green-600",
      });
    } else if (stressLatest > stressPrevious) {
      insights.push({
        type: "concern",
        category: "Stress",
        message: `Your stress level increased from ${previous.predictionResults.stress.label} to ${latest.predictionResults.stress.label}`,
        icon: "⚠️",
        color: "text-orange-600",
      });
    } else {
      insights.push({
        type: "stable",
        category: "Stress",
        message: `Your stress level remained ${latest.predictionResults.stress.label}`,
        icon: "📊",
        color: "text-blue-600",
      });
    }

    return insights;
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">
            Error Loading Assessments
          </h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (assessments.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No Assessments Yet
          </h3>{" "}
          <p className="text-muted-foreground mb-4">
            You haven&apos;t taken any mental health assessments yet. Take your
            first assessment to start tracking your mental health journey.
          </p>
          <button
            onClick={() => (window.location.href = "/onboarding")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Take Assessment
          </button>
        </div>
      </div>
    );
  }

  const insights = generateInsights();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Assessment History
        </h1>{" "}
        <p className="text-muted-foreground">
          Track your mental health journey over time and see how you&apos;re
          progressing.
        </p>
      </div>

      {/* View Toggle */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          <button
            onClick={() => setSelectedView("timeline")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedView === "timeline"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Timeline View
          </button>
          <button
            onClick={() => setSelectedView("insights")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedView === "insights"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Insights & Trends
          </button>
        </div>
      </div>

      {selectedView === "insights" && insights && (
        <div className="mb-8">
          {/* Progress Insights */}
          <div className="bg-primary/10 rounded-xl border border-muted  p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Progress Insights
              </h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Comparing your latest assessment with your previous one:
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {/* Anxiety Card */}
              <div className="bg-white dark:bg-background rounded-lg border border-muted p-4">
                <div className="flex items-start">
                  <div className="mr-3">
                    <svg
                      className="h-5 w-5 text-blue-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">
                      Anxiety
                    </h3>
                    <p
                      className={`text-sm ${
                        insights.find((i) => i.category === "Anxiety")?.color ||
                        "text-blue-600"
                      }`}
                    >
                      {insights.find((i) => i.category === "Anxiety")
                        ?.message || "Your anxiety level remained the same"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Depression Card */}
              <div className="bg-white dark:bg-background rounded-lg border border-muted p-4">
                <div className="flex items-start">
                  <div className="mr-3">
                    <svg
                      className="h-5 w-5 text-indigo-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">
                      Depression
                    </h3>
                    <p
                      className={`text-sm ${
                        insights.find((i) => i.category === "Depression")
                          ?.color || "text-blue-600"
                      }`}
                    >
                      {insights.find((i) => i.category === "Depression")
                        ?.message || "Your depression level remained the same"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stress Card */}
              <div className="bg-white dark:bg-background rounded-lg border border-muted p-4">
                <div className="flex items-start">
                  <div className="mr-3">
                    <svg
                      className="h-5 w-5 text-amber-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 8v4"></path>
                      <path d="M12 16h.01"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Stress</h3>
                    <p
                      className={`text-sm ${
                        insights.find((i) => i.category === "Stress")?.color ||
                        "text-blue-600"
                      }`}
                    >
                      {insights.find((i) => i.category === "Stress")?.message ||
                        "Your stress level remained the same"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mental Health Trends Chart */}
          <div className="bg-white dark:bg-background rounded-xl border border-muted p-6 mb-6">
            <h3 className="text-lg font-bold text-foreground mb-4">
              Mental Health Trends
            </h3>
            <div className="space-y-6">
              {/* Anxiety Trend */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Anxiety
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {assessments.length} assessment
                    {assessments.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex h-8 rounded-lg overflow-hidden">
                  {" "}
                  {assessments
                    .slice()
                    .reverse()
                    .map((assessment, index) => {
                      const label = assessment.predictionResults.anxiety.label;
                      const color =
                        label === "Severe Anxiety"
                          ? "bg-red-500"
                          : label === "Moderate Anxiety"
                          ? "bg-orange-500"
                          : label === "Mild Anxiety"
                          ? "bg-yellow-500"
                          : "bg-green-500";
                      const width = `${100 / assessments.length}%`;
                      return (
                        <div
                          key={index}
                          className={`${color} relative group`}
                          style={{ width }}
                          title={`${label} - ${formatDate(
                            assessment.timestamp
                          )}`}
                        >
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Depression Trend */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Depression
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {assessments.length} assessment
                    {assessments.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex h-8 rounded-lg overflow-hidden">
                  {" "}
                  {assessments
                    .slice()
                    .reverse()
                    .map((assessment, index) => {
                      const label =
                        assessment.predictionResults.depression.label;
                      const color =
                        label === "Severe Depression"
                          ? "bg-red-600"
                          : label === "Moderately Severe Depression"
                          ? "bg-red-400"
                          : label === "Moderate Depression"
                          ? "bg-orange-500"
                          : label === "Mild Depression"
                          ? "bg-yellow-500"
                          : "bg-green-500";
                      const width = `${100 / assessments.length}%`;
                      return (
                        <div
                          key={index}
                          className={`${color} relative group`}
                          style={{ width }}
                          title={`${label} - ${formatDate(
                            assessment.timestamp
                          )}`}
                        >
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Stress Trend */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Stress
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {assessments.length} assessment
                    {assessments.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex h-8 rounded-lg overflow-hidden">
                  {" "}
                  {assessments
                    .slice()
                    .reverse()
                    .map((assessment, index) => {
                      const label = assessment.predictionResults.stress.label;
                      const color =
                        label === "High Perceived Stress"
                          ? "bg-red-500"
                          : label === "Moderate Stress"
                          ? "bg-orange-500"
                          : label === "Low Stress"
                          ? "bg-green-500"
                          : "bg-green-500";
                      const width = `${100 / assessments.length}%`;
                      return (
                        <div
                          key={index}
                          className={`${color} relative group`}
                          style={{ width }}
                          title={`${label} - ${formatDate(
                            assessment.timestamp
                          )}`}
                        >
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span className="text-muted-foreground">Normal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-500"></div>
                <span className="text-muted-foreground">Mild</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-orange-500"></div>
                <span className="text-muted-foreground">Moderate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500"></div>
                <span className="text-muted-foreground">Severe</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedView === "timeline" && (
        <div className="space-y-6">
          {assessments.map((assessment, index) => (
            <div key={assessment.id} className="relative">
              {/* Timeline connector */}
              {index < assessments.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-full bg-muted -z-10"></div>
              )}

              <div className="bg-background rounded-xl border border-muted shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Assessment Header */}
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">
                          Assessment #{assessments.length - index}
                        </h3>
                        <span className="text-sm text-muted-foreground">
                          {getRelativeTime(assessment.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(assessment.timestamp)}
                      </p>
                    </div>
                  </div>

                  {/* Results Grid */}
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Anxiety */}
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-foreground">
                          Anxiety
                        </h4>{" "}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                            assessment.predictionResults.anxiety.label ===
                            "Severe Anxiety"
                              ? "bg-red-500"
                              : assessment.predictionResults.anxiety.label ===
                                "Moderate Anxiety"
                              ? "bg-orange-500"
                              : assessment.predictionResults.anxiety.label ===
                                "Mild Anxiety"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        >
                          {assessment.predictionResults.anxiety.label}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Confidence:{" "}
                        {(
                          assessment.predictionResults.anxiety.probability * 100
                        ).toFixed(1)}
                        %
                      </div>{" "}
                      <div className="mt-2 w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            assessment.predictionResults.anxiety.label ===
                            "Severe Anxiety"
                              ? "bg-red-500"
                              : assessment.predictionResults.anxiety.label ===
                                "Moderate Anxiety"
                              ? "bg-orange-500"
                              : assessment.predictionResults.anxiety.label ===
                                "Mild Anxiety"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${
                              assessment.predictionResults.anxiety.probability *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Depression */}
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-foreground">
                          Depression
                        </h4>{" "}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                            assessment.predictionResults.depression.label ===
                            "Severe Depression"
                              ? "bg-red-600"
                              : assessment.predictionResults.depression
                                  .label === "Moderately Severe Depression"
                              ? "bg-red-400"
                              : assessment.predictionResults.depression
                                  .label === "Moderate Depression"
                              ? "bg-orange-500"
                              : assessment.predictionResults.depression
                                  .label === "Mild Depression"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        >
                          {assessment.predictionResults.depression.label}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Confidence:{" "}
                        {(
                          assessment.predictionResults.depression.probability *
                          100
                        ).toFixed(1)}
                        %
                      </div>{" "}
                      <div className="mt-2 w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            assessment.predictionResults.depression.label ===
                            "Severe Depression"
                              ? "bg-red-600"
                              : assessment.predictionResults.depression
                                  .label === "Moderately Severe Depression"
                              ? "bg-red-400"
                              : assessment.predictionResults.depression
                                  .label === "Moderate Depression"
                              ? "bg-orange-500"
                              : assessment.predictionResults.depression
                                  .label === "Mild Depression"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${
                              assessment.predictionResults.depression
                                .probability * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Stress */}
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-foreground">
                          Stress
                        </h4>{" "}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                            assessment.predictionResults.stress.label ===
                            "High Perceived Stress"
                              ? "bg-red-500"
                              : assessment.predictionResults.stress.label ===
                                "Moderate Stress"
                              ? "bg-orange-500"
                              : assessment.predictionResults.stress.label ===
                                "Low Stress"
                              ? "bg-green-500"
                              : "bg-green-500"
                          }`}
                        >
                          {assessment.predictionResults.stress.label}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Confidence:{" "}
                        {(
                          assessment.predictionResults.stress.probability * 100
                        ).toFixed(1)}
                        %
                      </div>{" "}
                      <div className="mt-2 w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            assessment.predictionResults.stress.label ===
                            "High Perceived Stress"
                              ? "bg-red-500"
                              : assessment.predictionResults.stress.label ===
                                "Moderate Stress"
                              ? "bg-orange-500"
                              : assessment.predictionResults.stress.label ===
                                "Low Stress"
                              ? "bg-green-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${
                              assessment.predictionResults.stress.probability *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {index < assessments.length - 1 && (
                    <div className="mt-4 pt-4 border-t border-muted">
                      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                        <span className="text-muted-foreground text-sm">
                          Compared to previous:
                        </span>
                        <div className="flex flex-wrap gap-3">
                          {/* Anxiety comparison */}
                          {(() => {
                            const currentAnxiety = getSeverityScore(
                              assessment.predictionResults.anxiety.label
                            );
                            const previousAnxiety = getSeverityScore(
                              assessments[index + 1].predictionResults.anxiety
                                .label
                            );

                            if (currentAnxiety < previousAnxiety) {
                              return (
                                <span className="flex items-center text-green-600 text-xs bg-green-50 px-2 py-1 rounded-md">
                                  <svg
                                    className="w-3 h-3 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Anxiety improved
                                </span>
                              );
                            } else if (currentAnxiety > previousAnxiety) {
                              return (
                                <span className="flex items-center text-orange-600 text-xs bg-orange-50 px-2 py-1 rounded-md">
                                  <svg
                                    className="w-3 h-3 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Anxiety increased
                                </span>
                              );
                            } else {
                              return (
                                <span className="flex items-center text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded-md">
                                  <svg
                                    className="w-3 h-3 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Anxiety stable
                                </span>
                              );
                            }
                          })()}

                          {/* Depression comparison */}
                          {(() => {
                            const currentDepression = getSeverityScore(
                              assessment.predictionResults.depression.label
                            );
                            const previousDepression = getSeverityScore(
                              assessments[index + 1].predictionResults
                                .depression.label
                            );

                            if (currentDepression < previousDepression) {
                              return (
                                <span className="flex items-center text-green-600 text-xs bg-green-50 px-2 py-1 rounded-md">
                                  <svg
                                    className="w-3 h-3 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Depression improved
                                </span>
                              );
                            } else if (currentDepression > previousDepression) {
                              return (
                                <span className="flex items-center text-orange-600 text-xs bg-orange-50 px-2 py-1 rounded-md">
                                  <svg
                                    className="w-3 h-3 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Depression increased
                                </span>
                              );
                            } else {
                              return (
                                <span className="flex items-center text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded-md">
                                  <svg
                                    className="w-3 h-3 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Depression stable
                                </span>
                              );
                            }
                          })()}

                          {/* Stress comparison */}
                          {(() => {
                            const currentStress = getSeverityScore(
                              assessment.predictionResults.stress.label
                            );
                            const previousStress = getSeverityScore(
                              assessments[index + 1].predictionResults.stress
                                .label
                            );

                            if (currentStress < previousStress) {
                              return (
                                <span className="flex items-center text-green-600 text-xs bg-green-50 px-2 py-1 rounded-md">
                                  <svg
                                    className="w-3 h-3 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Stress improved
                                </span>
                              );
                            } else if (currentStress > previousStress) {
                              return (
                                <span className="flex items-center text-orange-600 text-xs bg-orange-50 px-2 py-1 rounded-md">
                                  <svg
                                    className="w-3 h-3 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Stress increased
                                </span>
                              );
                            } else {
                              return (
                                <span className="flex items-center text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded-md">
                                  <svg
                                    className="w-3 h-3 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Stress stable
                                </span>
                              );
                            }
                          })()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <div className="bg-primary/10 rounded-xl border border-muted p-6 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Ready for Your Next Assessment?
          </h3>
          <p className="text-muted-foreground mb-4">
            Regular assessments help track your mental health progress and
            provide better insights.
          </p>
          <button
            onClick={() => (window.location.href = "/onboarding")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Take New Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
