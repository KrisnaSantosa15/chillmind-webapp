// API client for journal operations using REST API endpoints
import { JournalEntry } from "@/components/dashboard/JournalSection";
import { getCurrentUser } from "./firebaseUtils";

// Base API configuration
const API_BASE = "/api/journals";

// Helper function to get headers with JWT authentication
const getHeaders = async (): Promise<HeadersInit> => {
  const user = getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Get Firebase ID token for JWT authentication
  const idToken = await user.getIdToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${idToken}`,
  };
};

// Handle API response
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }
  return response.json();
};

// Journal API client
export const journalApiClient = {
  // Get all journal entries
  async getEntries(limit = 50): Promise<JournalEntry[]> {
    const headers = await getHeaders();
    const url = new URL(API_BASE, window.location.origin);
    url.searchParams.set("limit", limit.toString());

    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    const data = await handleResponse(response);
    return data.data || [];
  },

  // Create new journal entry
  async createEntry(
    entry: Omit<JournalEntry, "id" | "date">
  ): Promise<JournalEntry> {
    const headers = await getHeaders();

    const response = await fetch(API_BASE, {
      method: "POST",
      headers,
      body: JSON.stringify({
        content: entry.content,
        mood: entry.mood,
        tags: entry.tags,
      }),
    });

    const data = await handleResponse(response);
    return data.data;
  },

  // Get specific journal entry by ID
  async getEntry(id: string): Promise<JournalEntry> {
    const headers = await getHeaders();

    const response = await fetch(`${API_BASE}/${id}`, {
      method: "GET",
      headers,
    });

    const data = await handleResponse(response);
    return data.data;
  },

  // Update existing journal entry
  async updateEntry(
    id: string,
    updates: Partial<Omit<JournalEntry, "id" | "date">>
  ): Promise<JournalEntry> {
    const headers = await getHeaders();

    const response = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(updates),
    });

    const data = await handleResponse(response);
    return data.data;
  },

  // Delete journal entry
  async deleteEntry(id: string): Promise<void> {
    const headers = await getHeaders();

    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers,
    });

    await handleResponse(response);
  },
  // Get streak data
  async getStreak(): Promise<number> {
    const headers = await getHeaders();

    const response = await fetch("/api/user/streak", {
      method: "GET",
      headers,
    });

    const data = await handleResponse(response);
    return data.data?.days || 0;
  },

  // Update user streak
  async updateStreak(): Promise<number> {
    const headers = await getHeaders();

    const response = await fetch("/api/user/streak", {
      method: "POST",
      headers,
    });

    const data = await handleResponse(response);
    return data.data?.days || 0;
  },

  // Get mood chart data
  async getMoodChartData(
    timeRange: "week" | "month" | "year" = "week"
  ): Promise<{ labels: string[]; data: number[] }> {
    const headers = await getHeaders();
    const url = new URL("/api/user/mood-chart", window.location.origin);
    url.searchParams.set("timeRange", timeRange);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    });

    const apiResponse = await handleResponse(response);
    return apiResponse.data || { labels: [], data: [] };
  },
};

export default journalApiClient;
