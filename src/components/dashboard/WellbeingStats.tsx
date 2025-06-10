"use client";

import React, { useState, useEffect } from "react";
import { getJournalEntries } from "@/lib/journalStorage";
import { getCurrentUser } from "@/lib/firebaseUtils";
import { getUserStreak } from "@/lib/journalFirestore";
import { Flame } from "lucide-react";

interface WellbeingStatsProps {
  className?: string;
  onStreakUpdate?: (days: number) => void;
}

interface MoodCounts {
  joy: number;
  love: number;
  surprise: number;
  neutral: number;
  fear: number;
  anger: number;
  sadness: number;
  [key: string]: number;
}

const WellbeingStats: React.FC<WellbeingStatsProps> = ({
  className,
  onStreakUpdate,
}) => {
  const [stats, setStats] = useState({
    journalCount: 0,
    weeklyEntries: 0,
    dominantMood: "neutral",
    commonTags: ["loading"],
    streakDays: 0,
    latestEntry: "No entries yet",
    journalProgress: 0,
    wellnessScore: 0,
    moodDistribution: {
      joy: 0,
      love: 0,
      surprise: 0,
      neutral: 0,
      fear: 0,
      anger: 0,
      sadness: 0,
    },
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const entries = await getJournalEntries();

        if (!entries || entries.length === 0) {
          setStats({
            journalCount: 0,
            weeklyEntries: 0,
            dominantMood: "neutral",
            commonTags: ["No entries yet"],
            streakDays: 0,
            latestEntry: "No entries yet",
            journalProgress: 0,
            wellnessScore: 0,
            moodDistribution: {
              joy: 0,
              love: 0,
              surprise: 0,
              neutral: 0,
              fear: 0,
              anger: 0,
              sadness: 0,
            },
          });
          return;
        }

        const sortedEntries = [...entries].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        const journalCount = entries.length;

        const now = new Date();
        const currentWeekDay = now.getDay();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(
          now.getDate() - (currentWeekDay === 0 ? 6 : currentWeekDay - 1)
        );
        startOfWeek.setHours(0, 0, 0, 0);

        const entriesThisWeek = sortedEntries.filter(
          (entry) => new Date(entry.date) >= startOfWeek
        );
        const weeklyEntries = entriesThisWeek.length;

        const journalProgress = Math.round((weeklyEntries / 7) * 100);

        const moodCounts: MoodCounts = {
          joy: 0,
          love: 0,
          surprise: 0,
          neutral: 0,
          fear: 0,
          anger: 0,
          sadness: 0,
        };

        const recentEntriesForMood = sortedEntries.slice(
          0,
          Math.min(10, sortedEntries.length)
        );

        recentEntriesForMood.forEach((entry) => {
          const mood = entry.mood.toLowerCase();
          if (moodCounts[mood] !== undefined) {
            moodCounts[mood] += 1;
          }
        });

        let dominantMood = "neutral";
        let maxCount = 0;

        Object.entries(moodCounts).forEach(([mood, count]) => {
          if (count > maxCount) {
            dominantMood = mood;
            maxCount = count;
          }
        });

        const totalMoods = Object.values(moodCounts).reduce(
          (sum, count) => sum + count,
          0
        );
        const moodDistribution: MoodCounts = {
          joy: 0,
          love: 0,
          surprise: 0,
          neutral: 0,
          fear: 0,
          anger: 0,
          sadness: 0,
        };

        Object.entries(moodCounts).forEach(([mood, count]) => {
          moodDistribution[mood] =
            totalMoods > 0 ? Math.round((count / totalMoods) * 100) : 0;
        });
        let streakDays = 0;
        try {
          const user = getCurrentUser();
          if (user) {
            streakDays = await getUserStreak(user);
            console.log("Retrieved streak from Firebase:", streakDays);
          } else {
            console.log("No user found, using default streak value of 0");
          }
        } catch (error) {
          console.error("Error getting streak from Firebase:", error);
          let currentStreak = 0;
          const currentDate = new Date();

          for (let i = 0; i < 30; i++) {
            const checkDate = new Date(currentDate);
            checkDate.setDate(checkDate.getDate() - i);

            const checkDateStr = checkDate.toISOString().split("T")[0];

            const hasEntryOnDate = sortedEntries.some((entry) => {
              const entryDate = new Date(entry.date);
              return entryDate.toISOString().split("T")[0] === checkDateStr;
            });

            if (hasEntryOnDate) {
              currentStreak++;
            } else if (i > 0) {
              break;
            }
          }

          streakDays = currentStreak;
        }

        const tagCounts: Record<string, number> = {};
        entries.forEach((entry) => {
          entry.tags.forEach((tag) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        });

        const sortedTags = Object.entries(tagCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([tag]) => tag)
          .slice(0, 3);

        const frequencyScore = Math.min(100, (weeklyEntries / 7) * 100);
        const positiveEmotions =
          (moodDistribution.joy || 0) +
          (moodDistribution.love || 0) +
          (moodDistribution.surprise || 0);
        const moodScore = Math.min(100, positiveEmotions * 1.5);
        const streakScore = Math.min(100, streakDays * 14.3);

        const wellnessScore = Math.round(
          frequencyScore * 0.4 + moodScore * 0.4 + streakScore * 0.2
        );

        const latestEntry =
          sortedEntries.length > 0
            ? new Date(sortedEntries[0].date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : "No entries yet";
        setStats({
          journalCount,
          weeklyEntries,
          dominantMood,
          commonTags: sortedTags.length ? sortedTags : ["No tags yet"],
          streakDays,
          latestEntry,
          journalProgress,
          wellnessScore,
          moodDistribution,
        });

        if (onStreakUpdate) {
          onStreakUpdate(streakDays);
        }
      } catch (error) {
        console.error("Error loading wellbeing stats:", error);
        setStats({
          journalCount: 0,
          weeklyEntries: 0,
          dominantMood: "neutral",
          commonTags: ["Error loading data"],
          streakDays: 0,
          latestEntry: "Error loading data",
          journalProgress: 0,
          wellnessScore: 0,
          moodDistribution: {
            joy: 0,
            love: 0,
            surprise: 0,
            neutral: 0,
            fear: 0,
            anger: 0,
            sadness: 0,
          },
        });
      }
    };

    loadStats();

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadStats();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [onStreakUpdate]);
  const getMoodIcon = (mood: string) => {
    const lowerMood = mood.toLowerCase();
    switch (lowerMood) {
      case "joy":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-blue-500 dark:text-blue-400"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" />
            <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" />
          </svg>
        );
      case "love":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
            className="text-green-500 dark:text-green-400"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        );
      case "surprise":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-purple-500 dark:text-purple-400"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="15" r="2" />
            <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" />
            <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" />
          </svg>
        );
      case "neutral":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-500 dark:text-gray-400"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="8" y1="15" x2="16" y2="15" />
            <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" />
            <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" />
          </svg>
        );
      case "fear":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-yellow-500 dark:text-yellow-400"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 15h8M8.5 9l.5-1M15.5 9l-.5-1M9 10.5c.5 1 1.5 1 2 0M13 10.5c.5 1 1.5 1 2 0" />
          </svg>
        );
      case "anger":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-red-500 dark:text-red-400"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16s-1.5-2-4-2-4 2-4 2M7.5 8l2 2M14.5 8l2 2" />
          </svg>
        );
      case "sadness":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-indigo-500 dark:text-indigo-400"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
            <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" />
            <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-500"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="8" y1="15" x2="16" y2="15" />
            <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" />
            <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" />
          </svg>
        );
    }
  };
  const getMoodColor = (mood: string) => {
    const lowerMood = mood.toLowerCase();
    switch (lowerMood) {
      case "joy":
        return "bg-blue-500 dark:bg-blue-400";
      case "love":
        return "bg-green-500 dark:bg-green-400";
      case "surprise":
        return "bg-purple-500 dark:bg-purple-400";
      case "neutral":
        return "bg-gray-400 dark:bg-gray-500";
      case "fear":
        return "bg-yellow-500 dark:bg-yellow-400";
      case "anger":
        return "bg-red-500 dark:bg-red-400";
      case "sadness":
        return "bg-indigo-500 dark:bg-indigo-400";
      default:
        return "bg-gray-400 dark:bg-gray-500";
    }
  };
  const getWellnessScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-blue-600 dark:text-blue-400";
    if (score >= 40) return "text-yellow-600 dark:text-yellow-400";
    if (score >= 20) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };
  return (
    <div className={`${className || ""}`}>
      <div className="p-4 space-y-4">
        {" "}
        {/* Wellness Score */}
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Wellness Score</h3>
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${getWellnessScoreColor(
                  stats.wellnessScore
                ).replace("text-", "border-")}`}
              >
                <span
                  className={`text-xl font-bold ${getWellnessScoreColor(
                    stats.wellnessScore
                  )}`}
                >
                  {stats.wellnessScore}
                </span>
              </div>
            </div>
          </div>
          <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ease-in-out ${
                stats.wellnessScore >= 80
                  ? "bg-green-500 dark:bg-green-400"
                  : stats.wellnessScore >= 60
                  ? "bg-blue-500 dark:bg-blue-400"
                  : stats.wellnessScore >= 40
                  ? "bg-yellow-500 dark:bg-yellow-400"
                  : stats.wellnessScore >= 20
                  ? "bg-orange-500 dark:bg-orange-400"
                  : "bg-red-500 dark:bg-red-400"
              }`}
              style={{ width: `${stats.wellnessScore}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Based on your journaling patterns and emotional trends
          </p>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/30 rounded-lg p-4 flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center mb-2">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                <line x1="16" x2="16" y1="2" y2="6"></line>
                <line x1="8" x2="8" y1="2" y2="6"></line>
                <line x1="3" x2="21" y1="10" y2="10"></line>
                <path d="m9 16 2 2 4-4"></path>
              </svg>
            </div>
            <span className="text-xs text-muted-foreground mb-1">
              Weekly Entries
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-semibold">
                {stats.weeklyEntries}
              </span>
              <span className="text-xs text-muted-foreground">/7</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-blue-500 transition-all duration-700 ease-in-out"
                style={{ width: `${stats.journalProgress}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-muted/30 rounded-lg p-4 flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center mb-2">
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            <span className="text-xs text-muted-foreground mb-1">
              Current Streak
            </span>
            <div className="flex items-center">
              <span className="text-2xl font-semibold">{stats.streakDays}</span>
              <span className="text-xs text-muted-foreground ml-1">days</span>
            </div>
            <div className="flex items-center mt-2 gap-0.5">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-3 rounded-sm ${
                    i < stats.streakDays
                      ? "bg-orange-500 dark:bg-orange-400"
                      : "bg-muted"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>{" "}
        {/* Mood Distribution */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3">
            Recent Mood Pattern{" "}
            <span className="text-xs text-muted-foreground">
              (last 10 entries)
            </span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col space-y-2">
              {" "}
              {Object.entries(stats.moodDistribution)
                .filter(([, percentage]) => percentage > 0)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([mood, percentage]) => (
                  <div key={mood} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-background border border-muted">
                      <div className="w-5 h-5">{getMoodIcon(mood)}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">
                          {mood.charAt(0).toUpperCase() + mood.slice(1)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {percentage}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getMoodColor(
                            mood
                          )} transition-all duration-700 ease-in-out`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex flex-col items-center justify-center bg-background rounded-lg p-3 border border-muted/40">
              <span className="text-xs text-muted-foreground mb-1">
                Dominant Mood
              </span>{" "}
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-muted/20 mb-1">
                <div className="w-8 h-8">{getMoodIcon(stats.dominantMood)}</div>
              </div>
              <span className="text-sm font-medium">
                {stats.dominantMood.charAt(0).toUpperCase() +
                  stats.dominantMood.slice(1)}
              </span>
              <div
                className={`w-6 h-1 mt-1 rounded-full ${getMoodColor(
                  stats.dominantMood
                )}`}
              ></div>
            </div>
          </div>
        </div>
        {/* Common Themes */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3">Common Themes</h3>
          <div className="flex flex-wrap gap-2">
            {stats.commonTags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-full border border-blue-200 dark:border-blue-800/40"
              >
                <span className="mr-1 text-blue-500 dark:text-blue-300">#</span>
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellbeingStats;
