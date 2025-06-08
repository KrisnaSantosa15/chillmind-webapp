import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { JournalEntry } from "@/components/dashboard/JournalSection";
import { authenticateRequest, createAuthErrorResponse } from "@/lib/auth";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";

async function authenticateUser(request: NextRequest): Promise<string | null> {
  const authenticatedUser = await authenticateRequest(request);
  return authenticatedUser?.uid || null;
}

const firestoreToJournalEntry = (doc: {
  id: string;
  data: () => Record<string, unknown>;
}): JournalEntry => {
  const data = doc.data();
  return {
    id: doc.id,
    content: (data.content as string) || "",
    mood: (data.mood as string) || "neutral",
    tags: (data.tags as string[]) || [],
    date:
      (data.date as { toDate: () => Date })?.toDate()?.toISOString() ||
      new Date().toISOString(),
  };
};

export async function GET(request: NextRequest) {
  try {
    const userId = await authenticateUser(request);
    if (!userId) {
      return createAuthErrorResponse("Authentication required");
    }

    const { searchParams } = new URL(request.url);
    const limitCount = parseInt(searchParams.get("limit") || "50");

    const userRef = doc(db, "users", userId);
    const journalCollectionRef = collection(userRef, "journal_entries");

    const q = query(
      journalCollectionRef,
      orderBy("date", "desc"),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const entries = querySnapshot.docs.map(firestoreToJournalEntry);

    return NextResponse.json({
      success: true,
      data: entries,
      count: entries.length,
    });
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch journal entries" },
      { status: 500 }
    );
  }
}

// POST /api/journals - Create new journal entry
export async function POST(request: NextRequest) {
  try {
    const userId = await authenticateUser(request);
    if (!userId) {
      return createAuthErrorResponse("Authentication required");
    }

    const body = await request.json();
    const { content, mood, tags } = body;

    // Validate required fields
    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required and must be a string" },
        { status: 400 }
      );
    }

    if (!mood || typeof mood !== "string") {
      return NextResponse.json(
        { error: "Mood is required and must be a string" },
        { status: 400 }
      );
    }

    if (tags && !Array.isArray(tags)) {
      return NextResponse.json(
        { error: "Tags must be an array" },
        { status: 400 }
      );
    }

    const firestoreEntry = {
      content: content.trim(),
      mood: mood.toLowerCase(),
      tags: tags || [],
      date: serverTimestamp(),
      userId: userId,
    };

    // Save to Firestore
    const userRef = doc(db, "users", userId);
    const journalCollectionRef = collection(userRef, "journal_entries");
    const docRef = await addDoc(journalCollectionRef, firestoreEntry);

    // Return the created entry
    const newEntry: JournalEntry = {
      id: docRef.id,
      content: content.trim(),
      mood: mood.toLowerCase(),
      tags: tags || [],
      date: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: newEntry,
        message: "Journal entry created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating journal entry:", error);
    return NextResponse.json(
      { error: "Failed to create journal entry" },
      { status: 500 }
    );
  }
}
