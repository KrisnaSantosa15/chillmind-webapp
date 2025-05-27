// Updated version with Firestore support only
import { JournalEntry } from "@/components/dashboard/JournalSection";
import journalFirestore from "./journalFirestore";
import { getCurrentUser } from "./firebaseUtils";

// Emotion categories
export type Emotion =
  | "joy"
  | "love"
  | "surprise"
  | "fear"
  | "anger"
  | "sadness"
  | "neutral";

// API response interfaces
interface EmotionPredictionResponse {
  emotion: Emotion;
  confidence: number;
  all_probabilities: Record<string, number>;
}

// ML model-based emotion prediction function
export const predictEmotion = async (text: string): Promise<Emotion> => {
  // If text is empty or too short, return neutral
  if (!text || text.trim().length < 3) {
    return "neutral";
  }

  try {
    // Use our internal API route to avoid CORS issues
    const response = await fetch("/api/emotion-prediction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      console.error("Error calling emotion API:", response.statusText);
      return fallbackPredictEmotion(text);
    }

    const data: EmotionPredictionResponse = await response.json();

    // Return the predicted emotion or neutral if it's not one of our types
    return data.emotion || "neutral";
  } catch (error) {
    console.error("Failed to predict emotion from API:", error);
    // Fallback to rule-based prediction if API fails
    return fallbackPredictEmotion(text);
  }
};

// Keep the original function as fallback
export const fallbackPredictEmotion = (text: string): Emotion => {
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
      return "joy";
    case "love":
      return "love";
    case "surprise":
      return "surprise";
    case "fear":
      return "fear";
    case "anger":
      return "anger";
    case "sadness":
      return "sadness";
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

// Get all journal entries - Firestore only
export const getJournalEntries = async (): Promise<JournalEntry[]> => {
  try {
    const user = getCurrentUser();
    if (user) {
      return await journalFirestore.getJournalEntriesFromFirestore(user);
    }
    return [];
  } catch (error) {
    console.error("Error getting journal entries:", error);
    return [];
  }
};

// Get the current day streak - Firestore only
export const getDayStreak = async (): Promise<number> => {
  try {
    const user = getCurrentUser();
    if (user) {
      return await journalFirestore.getUserStreak(user);
    }
    return 0;
  } catch (error) {
    console.error("Error getting day streak:", error);
    return 0;
  }
};

// Update the day streak - Firestore only
export const updateDayStreak = async (): Promise<number> => {
  try {
    const user = getCurrentUser();
    if (user) {
      return await journalFirestore.updateUserStreak(user);
    }
    return 0;
  } catch (error) {
    console.error("Error updating day streak:", error);
    return 0;
  }
};

// Import the emotion insight functions
import { getEmotionInsight, EmotionInsight } from "./emotionInsights";

// Updated return type to include emotion insight
interface JournalEntryWithInsight {
  journalEntry: JournalEntry;
  insight: EmotionInsight | null;
  emotion: Emotion;
}

// Save a journal entry - Firestore only
export const saveJournalEntry = async (
  entry: Omit<JournalEntry, "id" | "date" | "mood">
): Promise<JournalEntryWithInsight> => {
  // Predict emotion from the text
  const predictedEmotion = await predictEmotion(entry.content);
  const mood = emotionToMood(predictedEmotion);

  const entryWithMood = {
    ...entry,
    mood,
  };

  try {
    const user = getCurrentUser();
    if (user) {
      // Save entry to Firestore
      const savedEntry = await journalFirestore.saveJournalEntryToFirestore(
        user,
        entryWithMood
      );
      
      // Get insight for the detected emotion
      const insight = await getEmotionInsight(predictedEmotion, user);
      
      return { 
        journalEntry: savedEntry, 
        insight, 
        emotion: predictedEmotion 
      };
    }
    throw new Error("User not authenticated");
  } catch (error) {
    console.error("Error saving journal entry:", error);
    throw error;
  }
};

// Delete a journal entry
export const deleteJournalEntry = async (entryId: string): Promise<void> => {
  try {
    const user = getCurrentUser();
    if (user) {
      // Delete entry from Firestore
      await journalFirestore.deleteJournalEntry(user, entryId);
    } else {
      throw new Error("User not authenticated");
    }
  } catch (error) {
    console.error("Error deleting journal entry:", error);
    throw error;
  }
};

// Get mood chart data - Firestore only
export const getMoodChartData = async (
  timeRange: "week" | "month" | "year"
) => {
  try {
    const user = getCurrentUser();
    if (user) {
      // Get chart data from Firestore
      return await journalFirestore.getMoodChartDataFromFirestore(
        user,
        timeRange
      );
    }
    return getDefaultChartData(timeRange);
  } catch (error) {
    console.error("Error getting mood chart data:", error);
    return getDefaultChartData(timeRange);
  }
};

// Helper function to get default chart data
const getDefaultChartData = (timeRange: "week" | "month" | "year") => {
  // Return default neutral data
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
};

const journalStorage = {
  getJournalEntries,
  saveJournalEntry,
  predictEmotion,
  fallbackPredictEmotion,
  emotionToMood,
  getMoodChartData,
  getDayStreak,
  updateDayStreak,
  deleteJournalEntry,
};

export default journalStorage;
