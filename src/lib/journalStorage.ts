import { JournalEntry } from "@/components/dashboard/JournalSection";

// Emotion categories
export type Emotion =
  | "joy"
  | "love"
  | "surprise"
  | "fear"
  | "anger"
  | "sadness"
  | "neutral";

// Dummy emotion prediction function (will be replaced with ML model later)
export const predictEmotion = (text: string): Emotion => {
  // Simple keyword-based emotion detection (very basic)
  const lowerText = text.toLowerCase();
  const emotionKeywords = {
    joy: ["happy", "excited", "great", "wonderful", "amazing", "joy", "glad"],
    love: ["love", "care", "affection", "appreciate", "grateful", "thankful"],
    surprise: [
      "surprised",
      "unexpected",
      "wow",
      "astonished",
      "shocked",
      "amazed",
    ],
    fear: ["afraid", "scared", "nervous", "worried", "anxious", "terrified"],
    anger: ["angry", "upset", "annoyed", "frustrated", "mad", "irritated"],
    sadness: ["sad", "depressed", "unhappy", "disappointed", "sorry", "regret"],
    neutral: ["ok", "fine", "average", "neutral", "normal"],
  };

  // Count occurrences of emotion keywords
  const emotionCounts: Record<Emotion, number> = {
    joy: 0,
    love: 0,
    surprise: 0,
    fear: 0,
    anger: 0,
    sadness: 0,
    neutral: 0,
  };

  // Count occurrences of each emotion keyword
  for (const emotion of Object.keys(emotionKeywords) as Emotion[]) {
    for (const keyword of emotionKeywords[emotion]) {
      const regex = new RegExp("\\b" + keyword + "\\b", "gi");
      const matches = lowerText.match(regex);
      if (matches) {
        emotionCounts[emotion] += matches.length;
      }
    }
  }

  // Find the emotion with the highest count
  let maxCount = 0;
  let predictedEmotion: Emotion = "neutral";

  for (const emotion of Object.keys(emotionCounts) as Emotion[]) {
    if (emotionCounts[emotion] > maxCount) {
      maxCount = emotionCounts[emotion];
      predictedEmotion = emotion;
    }
  }

  // If no emotion was detected strongly, return neutral
  return maxCount > 0 ? predictedEmotion : "neutral";
};

// Convert emotion to mood for consistency with the UI
export const emotionToMood = (emotion: Emotion): string => {
  switch (emotion) {
    case "joy":
      return "happy";
    case "love":
      return "relaxed";
    case "surprise":
      return "surprised";
    case "fear":
      return "anxious";
    case "anger":
      return "angry";
    case "sadness":
      return "sad";
    default:
      return "neutral";
  }
};

// Convert emotion to numeric value for the chart
export const emotionToValue = (emotion: Emotion | string): number => {
  // Handle both emotion types and mood strings that are stored in entries
  // Ensure input is lowercase for case-insensitive matching
  const lowerEmotion =
    typeof emotion === "string" ? emotion.toLowerCase() : emotion;

  // Log for debugging purposes
  console.log(`Converting emotion "${emotion}" to chart value`);

  switch (lowerEmotion) {
    case "joy":
    case "happy":
    case "excited":
      return 6; // Joy
    case "love":
    case "relaxed":
      return 5; // Love
    case "surprise":
    case "surprised":
      return 4; // Surprise
    case "fear":
    case "anxious":
      return 3; // Fear
    case "anger":
    case "angry":
      return 2; // Anger
    case "sadness":
    case "sad":
      return 1; // Sadness
    case "neutral":
      return 3.5; // Middle value - Neutral
    default:
      console.warn(
        `Unrecognized emotion value: ${emotion}, defaulting to neutral (3.5)`
      );
      return 3.5;
  }
};

// Storage key for journal entries
const JOURNAL_ENTRIES_KEY = "chillmind_journal_entries";
const STREAK_KEY = "chillmind_day_streak";

// Get all journal entries from local storage
export const getJournalEntries = (): JournalEntry[] => {
  if (typeof window === "undefined") return [];

  const entriesJson = localStorage.getItem(JOURNAL_ENTRIES_KEY);
  return entriesJson ? JSON.parse(entriesJson) : [];
};

// Get the current day streak
export const getDayStreak = (): number => {
  if (typeof window === "undefined") return 0;

  const streakJson = localStorage.getItem(STREAK_KEY);
  if (!streakJson) return 0;

  const streak = JSON.parse(streakJson);
  // Check if streak data is recent (within 48 hours)
  const lastUpdate = new Date(streak.lastUpdate);
  const now = new Date();
  const hoursDiff = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

  // If more than 48 hours have passed, reset the streak
  if (hoursDiff >= 48) {
    const newStreak = { days: 1, lastUpdate: now.toISOString() };
    localStorage.setItem(STREAK_KEY, JSON.stringify(newStreak));
    return 1;
  }

  // Return current streak
  return streak.days || 0;
};

// Update the day streak
export const updateDayStreak = (): number => {
  if (typeof window === "undefined") return 0;

  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const streakJson = localStorage.getItem(STREAK_KEY);

  if (!streakJson) {
    // First time journaling - start with day 1
    const newStreak = { days: 1, lastUpdate: now.toISOString() };
    localStorage.setItem(STREAK_KEY, JSON.stringify(newStreak));
    return 1;
  }

  const streak = JSON.parse(streakJson);
  const lastUpdate = new Date(streak.lastUpdate);
  const lastUpdateDay = lastUpdate.toISOString().split("T")[0];
  const hoursDiff = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

  // If entry is from a new day and within 48 hours of last entry, increment streak
  if (today !== lastUpdateDay && hoursDiff < 48) {
    const newDays = streak.days + 1;
    const newStreak = { days: newDays, lastUpdate: now.toISOString() };
    localStorage.setItem(STREAK_KEY, JSON.stringify(newStreak));
    return newDays;
  }
  // If entry is from today, maintain current streak but update timestamp
  else if (today === lastUpdateDay) {
    const newStreak = { days: streak.days, lastUpdate: now.toISOString() };
    localStorage.setItem(STREAK_KEY, JSON.stringify(newStreak));
    return streak.days;
  }
  // If more than 48 hours have passed, reset the streak
  else {
    const newStreak = { days: 1, lastUpdate: now.toISOString() };
    localStorage.setItem(STREAK_KEY, JSON.stringify(newStreak));
    return 1;
  }
};

// Save a journal entry to local storage
export const saveJournalEntry = (
  entry: Omit<JournalEntry, "id" | "date">
): JournalEntry => {
  const entries = getJournalEntries();

  const newEntry: JournalEntry = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    ...entry,
  };

  // Add new entry at the beginning
  entries.unshift(newEntry);

  // Save to local storage
  localStorage.setItem(JOURNAL_ENTRIES_KEY, JSON.stringify(entries));

  // Update streak and return the new streak count
  updateDayStreak();

  return newEntry;
};

// Get mood data for the chart based on time range
export const getMoodChartData = (timeRange: "week" | "month" | "year") => {
  const entries = getJournalEntries();
  if (entries.length === 0) {
    // Return default neutral data instead of empty arrays
    if (timeRange === "week") {
      return {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        data: [3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5], // All neutral
      };
    } else if (timeRange === "month") {
      return {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        data: [3.5, 3.5, 3.5, 3.5], // All neutral
      };
    } else {
      return {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        data: [3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5], // All neutral
      };
    }
  }

  const now = new Date();
  let filteredEntries: JournalEntry[] = [];
  let labels: string[] = [];
  const dayToIndexMap: Record<string, number> = {};

  if (timeRange === "week") {
    // Get entries from last 7 days
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    labels = [];

    // Create array of last 7 days - with proper order (starting from past to current day)
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];
      const dayIndex = labels.length;
      labels.push(dayName);

      // Store the mapping of date string (YYYY-MM-DD) to index
      const dateStr = date.toISOString().split("T")[0]; // Get YYYY-MM-DD format
      dayToIndexMap[dateStr] = dayIndex;
    }

    // Filter entries from last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    filteredEntries = entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= oneWeekAgo;
    });
  } else if (timeRange === "month") {
    // Get entries from last 4 weeks
    labels = ["Week 1", "Week 2", "Week 3", "Week 4"];

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    filteredEntries = entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= oneMonthAgo;
    });
  } else {
    // Get entries from last 12 months
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    labels = [];

    // Create array of months in order
    const currentMonth = now.getMonth();
    for (let i = 0; i < 12; i++) {
      const monthIndex = (currentMonth - 11 + i + 12) % 12;
      labels.push(months[monthIndex]);
    }

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    filteredEntries = entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= oneYearAgo;
    });
  }

  // Group entries by day (for week view)
  // or by week (for month view)
  // or by month (for year view)
  const entriesByPeriod: Record<number, JournalEntry[]> = {};

  filteredEntries.forEach((entry) => {
    const entryDate = new Date(entry.date);
    let index = -1;

    if (timeRange === "week") {
      // Map to the specific day using our mapping
      const dateStr = entryDate.toISOString().split("T")[0];
      index =
        dayToIndexMap[dateStr] !== undefined ? dayToIndexMap[dateStr] : -1;
    } else if (timeRange === "month") {
      // Map to the week
      const weekDiff = Math.floor(
        (now.getTime() - entryDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
      );
      if (weekDiff < 4) {
        index = weekDiff;
      }
    } else {
      // Map to the month
      const monthIndex = entryDate.getMonth();
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const monthName = months[monthIndex];
      index = labels.indexOf(monthName);
    }

    if (index !== -1) {
      if (!entriesByPeriod[index]) {
        entriesByPeriod[index] = [];
      }
      entriesByPeriod[index].push(entry);
    }
  });

  // Initialize data array with nulls
  const data = Array(labels.length).fill(null);
  // Calculate average mood for each period
  Object.keys(entriesByPeriod).forEach((indexStr) => {
    const index = parseInt(indexStr);
    const periodEntries = entriesByPeriod[index];
    if (periodEntries && periodEntries.length > 0) {
      if (periodEntries.length === 1) {
        // If there's just one entry, use its exact emotion value
        const emotionValue = emotionToValue(periodEntries[0].mood);
        console.log(
          `Single entry for ${labels[index]}: mood=${periodEntries[0].mood}, value=${emotionValue}`
        );
        data[index] = emotionValue;
      } else {
        // For multiple entries, find the most frequent emotion rather than averaging
        const moodCounts: Record<string, number> = {};

        // Count occurrences of each mood
        periodEntries.forEach((entry) => {
          if (!moodCounts[entry.mood]) {
            moodCounts[entry.mood] = 0;
          }
          moodCounts[entry.mood]++;
        });

        // Find the most frequent mood
        let maxCount = 0;
        let dominantMood = "neutral";

        Object.keys(moodCounts).forEach((mood) => {
          if (moodCounts[mood] > maxCount) {
            maxCount = moodCounts[mood];
            dominantMood = mood;
          }
        });

        // If there's a tie, use a weighted average
        if (
          Object.values(moodCounts).filter((count) => count === maxCount)
            .length > 1
        ) {
          // Calculate weighted average if no clear dominant mood
          let totalValue = 0;
          periodEntries.forEach((entry) => {
            const emotionValue = emotionToValue(entry.mood);
            console.log(
              `Entry for ${labels[index]}: mood=${entry.mood}, value=${emotionValue}`
            );
            totalValue += emotionValue;
          });

          data[index] = totalValue / periodEntries.length;
          console.log(
            `Multiple entries with tie for ${labels[index]}, using average: ${data[index]}`
          );
        } else {
          // Use the dominant mood's value
          const dominantValue = emotionToValue(dominantMood);
          data[index] = dominantValue;
          console.log(
            `Multiple entries for ${labels[index]}, dominant mood: ${dominantMood} (${dominantValue})`
          );
        }
      }
    }
  });
  // Replace nulls with default value (3.5 - neutral)
  const finalData = data.map((value) => (value === null ? 3.5 : value));
  // Ensure we have some data to display - log the final chart data
  console.log("Final chart data:", {
    labels,
    data: finalData,
    defaultMood: "Neutral",
    explanation:
      "Joy=6, Love=5, Surprise=4, Neutral=3.5, Fear=3, Anger=2, Sadness=1",
  });

  return {
    labels,
    data: finalData,
  };
};

const journalStorage = {
  getJournalEntries,
  saveJournalEntry,
  predictEmotion,
  emotionToMood,
  getMoodChartData,
  getDayStreak,
  updateDayStreak,
};

export default journalStorage;
