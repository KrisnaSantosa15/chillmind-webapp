import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { JournalEntry } from "@/components/dashboard/JournalSection";
import { authenticateRequest, createAuthErrorResponse } from "@/lib/auth";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// Helper function to authenticate user from request
async function authenticateUser(request: NextRequest): Promise<string | null> {
  const authenticatedUser = await authenticateRequest(request);
  return authenticatedUser?.uid || null;
}

// Convert Firestore document to JournalEntry
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

// GET /api/journals/[id] - Get specific journal entry by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await authenticateUser(request);
    if (!userId) {
      return createAuthErrorResponse("Authentication required");
    }

    const { id: entryId } = await params;
    if (!entryId) {
      return NextResponse.json(
        { error: "Entry ID is required" },
        { status: 400 }
      );
    }

    // Get the specific journal entry from Firestore
    const userRef = doc(db, "users", userId);
    const entryRef = doc(collection(userRef, "journal_entries"), entryId);

    const docSnapshot = await getDoc(entryRef);

    if (!docSnapshot.exists()) {
      return NextResponse.json(
        { error: "Journal entry not found" },
        { status: 404 }
      );
    }

    const entry = firestoreToJournalEntry({
      id: docSnapshot.id,
      data: () => docSnapshot.data() as Record<string, unknown>,
    });

    return NextResponse.json({
      success: true,
      data: entry,
    });
  } catch (error) {
    console.error("Error fetching journal entry:", error);
    return NextResponse.json(
      { error: "Failed to fetch journal entry" },
      { status: 500 }
    );
  }
}

// PUT /api/journals/[id] - Update existing journal entry
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await authenticateUser(request);
    if (!userId) {
      return createAuthErrorResponse("Authentication required");
    }

    const { id: entryId } = await params;
    if (!entryId) {
      return NextResponse.json(
        { error: "Entry ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { content, mood, tags } = body;

    // Validate at least one field is provided for update
    if (!content && !mood && !tags) {
      return NextResponse.json(
        {
          error:
            "At least one field (content, mood, or tags) must be provided for update",
        },
        { status: 400 }
      );
    }

    // Build updates object
    const updates: Record<string, unknown> = {};
    if (content !== undefined) {
      if (typeof content !== "string") {
        return NextResponse.json(
          { error: "Content must be a string" },
          { status: 400 }
        );
      }
      updates.content = content.trim();
    }

    if (mood !== undefined) {
      if (typeof mood !== "string") {
        return NextResponse.json(
          { error: "Mood must be a string" },
          { status: 400 }
        );
      }
      updates.mood = mood.toLowerCase();
    }

    if (tags !== undefined) {
      if (!Array.isArray(tags)) {
        return NextResponse.json(
          { error: "Tags must be an array" },
          { status: 400 }
        );
      }
      updates.tags = tags;
    }

    // Get entry reference
    const userRef = doc(db, "users", userId);
    const entryRef = doc(collection(userRef, "journal_entries"), entryId);

    // Check if entry exists first
    const docSnapshot = await getDoc(entryRef);
    if (!docSnapshot.exists()) {
      return NextResponse.json(
        { error: "Journal entry not found" },
        { status: 404 }
      );
    } // Update the entry
    await updateDoc(entryRef, updates as Record<string, string | string[]>);

    // Fetch the updated entry to return
    const updatedDocSnapshot = await getDoc(entryRef);
    const updatedEntry = firestoreToJournalEntry({
      id: updatedDocSnapshot.id,
      data: () => updatedDocSnapshot.data() as Record<string, unknown>,
    });

    return NextResponse.json({
      success: true,
      data: updatedEntry,
      message: "Journal entry updated successfully",
    });
  } catch (error) {
    console.error("Error updating journal entry:", error);
    return NextResponse.json(
      { error: "Failed to update journal entry" },
      { status: 500 }
    );
  }
}

// DELETE /api/journals/[id] - Delete journal entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await authenticateUser(request);
    if (!userId) {
      return createAuthErrorResponse("Authentication required");
    }

    const { id: entryId } = await params;
    if (!entryId) {
      return NextResponse.json(
        { error: "Entry ID is required" },
        { status: 400 }
      );
    }

    // Get entry reference
    const userRef = doc(db, "users", userId);
    const entryRef = doc(collection(userRef, "journal_entries"), entryId);

    // Check if entry exists first
    const docSnapshot = await getDoc(entryRef);
    if (!docSnapshot.exists()) {
      return NextResponse.json(
        { error: "Journal entry not found" },
        { status: 404 }
      );
    }

    // Delete the entry
    await deleteDoc(entryRef);

    return NextResponse.json({
      success: true,
      message: "Journal entry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting journal entry:", error);
    return NextResponse.json(
      { error: "Failed to delete journal entry" },
      { status: 500 }
    );
  }
}
