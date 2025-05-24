// Firebase Firestore utilities for journal entries
import { db } from "@/lib/firebase";
import { User } from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  query,
  orderBy,
  limit,
  where,
  serverTimestamp,
  deleteDoc,
  updateDoc,
  DocumentData,
  Timestamp,
  FieldValue,
} from "firebase/firestore";
import { JournalEntry } from "@/components/dashboard/JournalSection";

// Firestore types
interface FirestoreJournalEntry {
  id?: string;
  content: string;
  mood: string;
  tags: string[];
  date: Timestamp | Date | FieldValue;
  userId: string;
}

interface FirestoreStreak {
  days: number;
  lastUpdate: Timestamp | Date | FieldValue;
  userId: string;
}

// Convert emotion to numeric value for the chart (copied from journalStorage to avoid circular imports)
const emotionToValue = (emotion: string): number => {
  // Ensure input is lowercase for case-insensitive matching
  const lowerEmotion = emotion.toLowerCase();

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
      return 3.5;
  }
};

// Convert Firestore document to JournalEntry
export const firestoreToJournalEntry = (doc: DocumentData): JournalEntry => {
  const data = doc.data();
  return {
    id: doc.id,
    content: data.content || "",
    mood: data.mood || "neutral",
    tags: data.tags || [],
    date:
      data.date instanceof Timestamp
        ? data.date.toDate().toISOString()
        : new Date(data.date).toISOString(),
  };
};

// Save a journal entry to Firestore
export const saveJournalEntryToFirestore = async (
  user: User,
  entry: Omit<JournalEntry, "id" | "date">
): Promise<JournalEntry> => {
  if (!user || !user.uid) {
    throw new Error("User is not authenticated");
  }

  try {
    // Create the entry with user ID
    const firestoreEntry: FirestoreJournalEntry = {
      content: entry.content,
      mood: entry.mood,
      tags: entry.tags || [],
      date: serverTimestamp(),
      userId: user.uid,
    };

    // Get reference to the journal collection for this user
    const userRef = doc(db, "users", user.uid);
    const journalCollectionRef = collection(userRef, "journal_entries");

    // Add the entry to Firestore
    const docRef = await addDoc(journalCollectionRef, firestoreEntry);

    // Update the day streak
    await updateUserStreak(user);

    // Return the entry with generated ID and date
    return {
      id: docRef.id,
      date: new Date().toISOString(), // We use client date since serverTimestamp isn't returned immediately
      ...entry,
    };
  } catch (error) {
    console.error("Error saving journal entry to Firestore:", error);
    throw error;
  }
};

// Get all journal entries for a user from Firestore
export const getJournalEntriesFromFirestore = async (
  user: User,
  limitCount = 50
): Promise<JournalEntry[]> => {
  if (!user || !user.uid) {
    throw new Error("User is not authenticated");
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const journalCollectionRef = collection(userRef, "journal_entries");

    // Query for entries, ordered by date (newest first)
    const q = query(
      journalCollectionRef,
      orderBy("date", "desc"),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return [];
    }

    // Convert Firestore documents to JournalEntry objects
    return querySnapshot.docs.map(firestoreToJournalEntry);
  } catch (error) {
    console.error("Error getting journal entries from Firestore:", error);
    throw error;
  }
};

// Get a single journal entry by ID
export const getJournalEntryById = async (
  user: User,
  entryId: string
): Promise<JournalEntry | null> => {
  if (!user || !user.uid) {
    throw new Error("User is not authenticated");
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const entryRef = doc(collection(userRef, "journal_entries"), entryId);

    const docSnapshot = await getDoc(entryRef);

    if (!docSnapshot.exists()) {
      return null;
    }

    return firestoreToJournalEntry(docSnapshot);
  } catch (error) {
    console.error("Error getting journal entry by ID:", error);
    throw error;
  }
};

// Delete a journal entry
export const deleteJournalEntry = async (
  user: User,
  entryId: string
): Promise<void> => {
  if (!user || !user.uid) {
    throw new Error("User is not authenticated");
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const entryRef = doc(collection(userRef, "journal_entries"), entryId);

    await deleteDoc(entryRef);
  } catch (error) {
    console.error("Error deleting journal entry:", error);
    throw error;
  }
};

// Update an existing journal entry
export const updateJournalEntry = async (
  user: User,
  entryId: string,
  updates: Partial<Omit<JournalEntry, "id" | "date">>
): Promise<void> => {
  if (!user || !user.uid) {
    throw new Error("User is not authenticated");
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const entryRef = doc(collection(userRef, "journal_entries"), entryId);

    await updateDoc(entryRef, {
      ...updates,
      // Don't update the date when editing
    });
  } catch (error) {
    console.error("Error updating journal entry:", error);
    throw error;
  }
};

// Get the day streak for a user
export const getUserStreak = async (user: User): Promise<number> => {
  if (!user || !user.uid) {
    throw new Error("User is not authenticated");
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const streakRef = doc(collection(userRef, "stats"), "streak");

    const docSnapshot = await getDoc(streakRef);

    if (!docSnapshot.exists()) {
      return 0;
    }
    const streak = docSnapshot.data() as FirestoreStreak;

    // Check if streak is recent (within 48 hours)
    let lastUpdate: Date;
    if (streak.lastUpdate instanceof Timestamp) {
      lastUpdate = streak.lastUpdate.toDate();
    } else if (streak.lastUpdate instanceof Date) {
      lastUpdate = streak.lastUpdate;
    } else {
      // If it's a FieldValue (serverTimestamp), use current time
      lastUpdate = new Date();
    }

    const currentTime = new Date();
    const hoursDiff =
      (currentTime.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

    // If more than 48 hours have passed, reset the streak
    if (hoursDiff >= 48) {
      await updateUserStreak(user, true); // reset streak
      return 1;
    }

    return streak.days || 0;
  } catch (error) {
    console.error("Error getting user streak:", error);
    throw error;
  }
};

// Update the day streak for a user
export const updateUserStreak = async (
  user: User,
  reset = false
): Promise<number> => {
  if (!user || !user.uid) {
    throw new Error("User is not authenticated");
  }
  try {
    const userRef = doc(db, "users", user.uid);
    const streakRef = doc(collection(userRef, "stats"), "streak");

    const streakCurrentTime = new Date();
    const today = streakCurrentTime.toISOString().split("T")[0];

    // If resetting, set streak to 1
    if (reset) {
      const newStreak: FirestoreStreak = {
        days: 1,
        lastUpdate: serverTimestamp(),
        userId: user.uid,
      };

      await setDoc(streakRef, newStreak);
      return 1;
    }

    const docSnapshot = await getDoc(streakRef);

    // If no streak document exists, create it with day 1
    if (!docSnapshot.exists()) {
      const newStreak: FirestoreStreak = {
        days: 1,
        lastUpdate: serverTimestamp(),
        userId: user.uid,
      };

      await setDoc(streakRef, newStreak);
      return 1;
    }
    const streak = docSnapshot.data() as FirestoreStreak;

    // Check if streak is recent (within 48 hours)
    let lastUpdate: Date;
    if (streak.lastUpdate instanceof Timestamp) {
      lastUpdate = streak.lastUpdate.toDate();
    } else if (streak.lastUpdate instanceof Date) {
      lastUpdate = streak.lastUpdate;
    } else {
      // If it's a FieldValue (serverTimestamp), use current time
      lastUpdate = new Date();
    }

    const lastUpdateDay = lastUpdate.toISOString().split("T")[0];
    const currentTime = new Date();
    const hoursDiff =
      (currentTime.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

    let newDays = streak.days;

    // If entry is from a new day and within 48 hours of last entry, increment streak
    if (today !== lastUpdateDay && hoursDiff < 48) {
      newDays = streak.days + 1;
    }
    // If more than 48 hours have passed, reset the streak
    else if (hoursDiff >= 48) {
      newDays = 1;
    }
    // Otherwise maintain current streak but update timestamp

    const newStreak: FirestoreStreak = {
      days: newDays,
      lastUpdate: serverTimestamp(),
      userId: user.uid,
    };

    await setDoc(streakRef, newStreak);
    return newDays;
  } catch (error) {
    console.error("Error updating user streak:", error);
    throw error;
  }
};

// Get mood data for the chart based on time range
export const getMoodChartDataFromFirestore = async (
  user: User,
  timeRange: "week" | "month" | "year"
) => {
  if (!user || !user.uid) {
    throw new Error("User is not authenticated");
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const journalCollectionRef = collection(userRef, "journal_entries");

    // Determine the date range based on timeRange
    const now = new Date();
    let startDate;

    if (timeRange === "week") {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    } else if (timeRange === "month") {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
    } else {
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    // Query for entries within the date range
    const q = query(
      journalCollectionRef,
      where("date", ">=", startDate),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(q);

    // Convert Firestore documents to JournalEntry objects
    const entries = querySnapshot.docs.map(firestoreToJournalEntry);

    // Generate default empty data
    let labels: string[] = [];
    let defaultData: number[] = [];

    if (timeRange === "week") {
      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      defaultData = [3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5]; // All neutral
    } else if (timeRange === "month") {
      labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
      defaultData = [3.5, 3.5, 3.5, 3.5]; // All neutral
    } else {
      labels = [
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
      defaultData = [
        3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5,
      ]; // All neutral
    }

    if (entries.length === 0) {
      return {
        labels,
        data: defaultData,
      };
    }

    // Process entries similar to the journalStorage.getMoodChartData function
    const entriesByPeriod: Record<number, JournalEntry[]> = {};
    const dayToIndexMap: Record<string, number> = {};

    if (timeRange === "week") {
      // Create array of last 7 days - with proper order (starting from past to current day)
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayName = days[date.getDay()];
        const dayIndex = labels.indexOf(dayName);

        // Store the mapping of date string (YYYY-MM-DD) to index
        const dateStr = date.toISOString().split("T")[0]; // Get YYYY-MM-DD format
        dayToIndexMap[dateStr] = dayIndex;
      }
    }

    entries.forEach((entry) => {
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
          data[index] = emotionValue;
        } else {
          // For multiple entries, find the most frequent emotion
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
              totalValue += emotionValue;
            });

            data[index] = totalValue / periodEntries.length;
          } else {
            // Use the dominant mood's value
            const dominantValue = emotionToValue(dominantMood);
            data[index] = dominantValue;
          }
        }
      }
    });

    // Replace nulls with default value (3.5 - neutral)
    const finalData = data.map((value) => (value === null ? 3.5 : value));

    return {
      labels,
      data: finalData,
    };
  } catch (error) {
    console.error("Error getting mood chart data from Firestore:", error);
    throw error;
  }
};

// Export a default object with all the functions
const journalFirestore = {
  saveJournalEntryToFirestore,
  getJournalEntriesFromFirestore,
  getJournalEntryById,
  deleteJournalEntry,
  updateJournalEntry,
  getUserStreak,
  updateUserStreak,
  getMoodChartDataFromFirestore,
};

export default journalFirestore;
