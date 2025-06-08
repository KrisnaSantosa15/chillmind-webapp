import { useState, useEffect } from "react";
import { JournalEntry } from "@/components/dashboard/JournalSection";
import {
  getJournalEntries,
  saveJournalEntry,
  emotionToMood,
  predictEmotion,
  getMoodChartData,
} from "./journalStorage";

export const useJournal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        const storedEntries = await getJournalEntries();
        setEntries(storedEntries);
      } catch (err) {
        console.error("Error loading journal entries:", err);
        setError("Failed to load journal entries");
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  useEffect(() => {
    const handleStorageChange = async (e: StorageEvent) => {
      if (e.key === "chillmind_journal_entries") {
        try {
          const storedEntries = await getJournalEntries();
          setEntries(storedEntries);
        } catch (err) {
          console.error("Error synchronizing journal entries:", err);
        }
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange);
      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }
  }, []);
  const addEntry = (
    content: string,
    promptType: string,
    customTags: string[] = []
  ): Promise<JournalEntry> => {
    return new Promise(async (resolve, reject) => {
      try {
        const tagRegex = /#(\w+)/g;
        const tags: string[] = [...customTags];
        let match;

        while ((match = tagRegex.exec(content)) !== null) {
          if (!tags.includes(match[1].toLowerCase())) {
            tags.push(match[1].toLowerCase());
          }
        }

        if (tags.length === 0) {
          switch (promptType) {
            case "highlights":
              tags.push("highlights");
              break;
            case "gratitude":
              tags.push("gratitude");
              break;
            case "challenges":
              tags.push("challenge");
              break;
            case "reflection":
              tags.push("reflection");
              break;
            default:
              tags.push("journal");
              break;
          }
        }
        const result = await saveJournalEntry({
          content,
          tags,
        });

        setEntries((prev) => [result.journalEntry, ...prev]);
        resolve(result.journalEntry);
      } catch (err) {
        console.error("Error adding journal entry:", err);
        reject(err);
      }
    });
  };

  const deleteEntry = (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        const updatedEntries = entries.filter((entry) => entry.id !== id);
        localStorage.setItem(
          "chillmind_journal_entries",
          JSON.stringify(updatedEntries)
        );
        setEntries(updatedEntries);
        resolve();
      } catch (err) {
        console.error("Error deleting journal entry:", err);
        reject(err);
      }
    });
  };
  const updateEntry = (
    id: string,
    updates: Partial<Omit<JournalEntry, "id" | "date">>
  ): Promise<JournalEntry> => {
    return new Promise(async (resolve, reject) => {
      try {
        const entryIndex = entries.findIndex((entry) => entry.id === id);

        if (entryIndex === -1) {
          throw new Error("Entry not found");
        }

        let mood = entries[entryIndex].mood;
        if (updates.content) {
          const emotion = await predictEmotion(updates.content);
          mood = emotionToMood(emotion);
        }

        const updatedEntry = {
          ...entries[entryIndex],
          ...updates,
          mood: updates.mood || mood,
        };

        const updatedEntries = [...entries];
        updatedEntries[entryIndex] = updatedEntry;

        localStorage.setItem(
          "chillmind_journal_entries",
          JSON.stringify(updatedEntries)
        );
        setEntries(updatedEntries);

        resolve(updatedEntry);
      } catch (err) {
        console.error("Error updating journal entry:", err);
        reject(err);
      }
    });
  };

  const getChartData = (timeRange: "week" | "month" | "year") => {
    return getMoodChartData(timeRange);
  };

  return {
    entries,
    loading,
    error,
    addEntry,
    deleteEntry,
    updateEntry,
    getChartData,
  };
};

export default useJournal;
