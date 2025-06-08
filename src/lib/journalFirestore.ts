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

const emotionToValue = (emotion: string): number => {
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

export const saveJournalEntryToFirestore = async (
  user: User,
  entry: Omit<JournalEntry, "id" | "date">
): Promise<JournalEntry> => {
  if (!user || !user.uid) {
    throw new Error("User is not authenticated");
  }

  try {
    const firestoreEntry: FirestoreJournalEntry = {
      content: entry.content,
      mood: entry.mood,
      tags: entry.tags || [],
      date: serverTimestamp(),
      userId: user.uid,
    };

    const userRef = doc(db, "users", user.uid);
    const journalCollectionRef = collection(userRef, "journal_entries");

    const docRef = await addDoc(journalCollectionRef, firestoreEntry);

    await updateUserStreak(user);

    return {
      id: docRef.id,
      date: new Date().toISOString(),
      ...entry,
    };
  } catch (error) {
    console.error("Error saving journal entry to Firestore:", error);
    throw error;
  }
};

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

    const q = query(
      journalCollectionRef,
      orderBy("date", "desc"),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return [];
    }

    return querySnapshot.docs.map(firestoreToJournalEntry);
  } catch (error) {
    console.error("Error getting journal entries from Firestore:", error);
    throw error;
  }
};

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
    });
  } catch (error) {
    console.error("Error updating journal entry:", error);
    throw error;
  }
};
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

    let lastUpdate: Date;
    if (streak.lastUpdate instanceof Timestamp) {
      lastUpdate = streak.lastUpdate.toDate();
    } else if (streak.lastUpdate instanceof Date) {
      lastUpdate = streak.lastUpdate;
    } else {
      lastUpdate = new Date();
    }

    const currentTime = new Date();
    const hoursDiff =
      (currentTime.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

    if (hoursDiff >= 48) {
      console.log(
        "Streak might be stale but keeping it for cumulative tracking"
      );
    }

    return streak.days || 0;
  } catch (error) {
    console.error("Error getting user streak:", error);
    throw error;
  }
};

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

    let lastUpdate: Date;
    if (streak.lastUpdate instanceof Timestamp) {
      lastUpdate = streak.lastUpdate.toDate();
    } else if (streak.lastUpdate instanceof Date) {
      lastUpdate = streak.lastUpdate;
    } else {
      lastUpdate = new Date();
    }

    const lastUpdateDay = lastUpdate.toISOString().split("T")[0];
    const currentTime = new Date();
    const hoursDiff =
      (currentTime.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

    let newDays = streak.days;

    if (today !== lastUpdateDay) {
      newDays = streak.days + 1;
      // console.log("Incrementing streak from", streak.days, "to", newDays);
    } else {
      // console.log(
      //   "Entry is from the same day, maintaining current streak:",
      //   streak.days
      // );
    }

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

export const getMoodChartDataFromFirestore = async (
  user: User,
  timeRange: "week" | "month" | "year"
) => {
  if (!user || !user.uid) {
    throw new Error("User is not authenticated");
  }

  const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  try {
    const userRef = doc(db, "users", user.uid);
    const journalCollectionRef = collection(userRef, "journal_entries");

    const now = new Date();
    let startDate;

    if (timeRange === "week") {
      startDate = new Date(now);
      const dayOfWeek = startDate.getDay();
      const diff = startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      startDate.setDate(diff);
      startDate.setHours(0, 0, 0, 0);
    } else if (timeRange === "month") {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
    } else {
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    const q = query(
      journalCollectionRef,
      where("date", ">=", startDate),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(q);

    const entries = querySnapshot.docs.map(firestoreToJournalEntry);

    let labels: string[] = [];
    let defaultData: number[] = [];

    if (timeRange === "week") {
      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      defaultData = [3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5];
    } else if (timeRange === "month") {
      labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
      defaultData = [3.5, 3.5, 3.5, 3.5];
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
      ];
    }

    if (entries.length === 0) {
      return {
        labels,
        data: defaultData,
      };
    }

    const entriesByPeriod: Record<number, JournalEntry[]> = {};
    const dayToIndexMap: Record<string, number> = {};

    const monthViewWeekStartDates: Date[] = [];

    if (timeRange === "week") {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayName = days[date.getDay()];
        const dayIndex = labels.indexOf(dayName);

        const dateStr = formatLocalDate(date);
        dayToIndexMap[dateStr] = dayIndex;
      }
    } else if (timeRange === "month") {
      const startOfChartWeek4 = new Date(now);
      const currentDay = startOfChartWeek4.getDay();
      const offsetToMonday = currentDay === 0 ? -6 : 1 - currentDay;
      startOfChartWeek4.setDate(startOfChartWeek4.getDate() + offsetToMonday);
      startOfChartWeek4.setHours(0, 0, 0, 0);

      for (let i = 0; i < 4; i++) {
        const weekStartDate = new Date(startOfChartWeek4);
        weekStartDate.setDate(startOfChartWeek4.getDate() - (3 - i) * 7);
        monthViewWeekStartDates.push(weekStartDate);
      }
    }

    entries.forEach((entry) => {
      const entryDate = new Date(entry.date);
      let index = -1;

      if (timeRange === "week") {
        const dateStr = formatLocalDate(entryDate);
        index =
          dayToIndexMap[dateStr] !== undefined ? dayToIndexMap[dateStr] : -1;
      } else if (timeRange === "month") {
        if (monthViewWeekStartDates.length === 4) {
          if (entryDate >= monthViewWeekStartDates[3]) {
            index = 3;
          } else if (entryDate >= monthViewWeekStartDates[2]) {
            index = 2;
          } else if (entryDate >= monthViewWeekStartDates[1]) {
            index = 1;
          } else if (entryDate >= monthViewWeekStartDates[0]) {
            index = 0;
          }
        }
      } else {
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

    const data = Array(labels.length).fill(null);

    Object.keys(entriesByPeriod).forEach((indexStr) => {
      const index = parseInt(indexStr);
      const periodEntries = entriesByPeriod[index];

      if (periodEntries && periodEntries.length > 0) {
        if (periodEntries.length === 1) {
          const emotionValue = emotionToValue(periodEntries[0].mood);
          data[index] = emotionValue;
        } else {
          const moodCounts: Record<string, number> = {};

          periodEntries.forEach((entry) => {
            if (!moodCounts[entry.mood]) {
              moodCounts[entry.mood] = 0;
            }
            moodCounts[entry.mood]++;
          });

          let maxCount = 0;
          let dominantMood = "neutral";

          Object.keys(moodCounts).forEach((mood) => {
            if (moodCounts[mood] > maxCount) {
              maxCount = moodCounts[mood];
              dominantMood = mood;
            }
          });

          if (
            Object.values(moodCounts).filter((count) => count === maxCount)
              .length > 1
          ) {
            let totalValue = 0;
            periodEntries.forEach((entry) => {
              const emotionValue = emotionToValue(entry.mood);
              totalValue += emotionValue;
            });

            data[index] = totalValue / periodEntries.length;
          } else {
            const dominantValue = emotionToValue(dominantMood);
            data[index] = dominantValue;
          }
        }
      }
    });

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
