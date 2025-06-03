import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { authenticateRequest, createAuthErrorResponse } from "@/lib/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  orderBy,
  where,
} from "firebase/firestore";

// Helper function to authenticate user from request
async function authenticateUser(request: NextRequest): Promise<string | null> {
  const authenticatedUser = await authenticateRequest(request);
  return authenticatedUser?.uid || null;
}

// Convert emotion to numeric value for the chart
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

// Format date as local date string for consistency
const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// GET /api/user/mood-chart?timeRange=week|month|year
export async function GET(request: NextRequest) {
  try {
    const userId = await authenticateUser(request);
    if (!userId) {
      return createAuthErrorResponse("Authentication required");
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") as
      | "week"
      | "month"
      | "year";

    if (!timeRange || !["week", "month", "year"].includes(timeRange)) {
      return NextResponse.json(
        { error: "Invalid timeRange. Must be 'week', 'month', or 'year'" },
        { status: 400 }
      );
    }

    // Get user's journal entries from Firestore
    const userRef = doc(db, "users", userId);
    const journalCollectionRef = collection(userRef, "journal_entries");

    // Determine the date range based on timeRange
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

    // Query for entries within the date range
    const q = query(
      journalCollectionRef,
      where("date", ">=", startDate),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(q);

    // Convert Firestore documents to entries
    const entries = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        content: data.content || "",
        mood: data.mood || "neutral",
        tags: data.tags || [],
        date: data.date?.toDate()?.toISOString() || new Date().toISOString(),
      };
    });

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
      return NextResponse.json({
        success: true,
        data: {
          labels,
          data: defaultData,
        },
      });
    }

    // Process entries similar to the original logic
    const entriesByPeriod: Record<number, typeof entries> = {};
    const dayToIndexMap: Record<string, number> = {}; // For week view
    const monthViewWeekStartDates: Date[] = []; // For month view

    // Setup for week view
    if (timeRange === "week") {
      const startOfWeek = new Date(startDate);
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const dateStr = formatLocalDate(date);
        dayToIndexMap[dateStr] = i;
      }
    }

    // Setup for month view
    if (timeRange === "month") {
      const startOfChartWeek4 = new Date(now);
      const dayOfWeek = startOfChartWeek4.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startOfChartWeek4.setDate(startOfChartWeek4.getDate() - daysToMonday);
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
        // timeRange === "year"
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
          const emotionValue = emotionToValue(periodEntries[0].mood);
          data[index] = emotionValue;
        } else {
          let totalValue = 0;
          periodEntries.forEach((entry) => {
            const emotionValue = emotionToValue(entry.mood);
            totalValue += emotionValue;
          });
          data[index] = totalValue / periodEntries.length;
        }
      }
    });

    // Replace nulls with default value (3.5 - neutral)
    const finalData = data.map((value) => (value === null ? 3.5 : value));

    return NextResponse.json({
      success: true,
      data: {
        labels,
        data: finalData,
      },
    });
  } catch (error) {
    console.error("Error getting mood chart data:", error);
    return NextResponse.json(
      { error: "Failed to get mood chart data" },
      { status: 500 }
    );
  }
}
