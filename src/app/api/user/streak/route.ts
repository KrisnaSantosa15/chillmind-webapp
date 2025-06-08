import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { authenticateRequest, createAuthErrorResponse } from "@/lib/auth";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

async function authenticateUser(request: NextRequest): Promise<string | null> {
  const authenticatedUser = await authenticateRequest(request);
  return authenticatedUser?.uid || null;
}

// GET /api/user/streak - Get user's current streak
export async function GET(request: NextRequest) {
  try {
    const userId = await authenticateUser(request);
    if (!userId) {
      return createAuthErrorResponse("Authentication required");
    }

    const userRef = doc(db, "users", userId);
    const streakRef = doc(collection(userRef, "stats"), "streak");

    const docSnapshot = await getDoc(streakRef);

    if (!docSnapshot.exists()) {
      return NextResponse.json({
        success: true,
        data: {
          days: 0,
          lastUpdate: null,
        },
      });
    }

    const data = docSnapshot.data();
    return NextResponse.json({
      success: true,
      data: {
        days: data.days || 0,
        lastUpdate: data.lastUpdate?.toDate()?.toISOString() || null,
      },
    });
  } catch (error) {
    console.error("Error fetching user streak:", error);
    return NextResponse.json(
      { error: "Failed to fetch user streak" },
      { status: 500 }
    );
  }
}

// POST /api/user/streak
export async function POST(request: NextRequest) {
  try {
    const userId = await authenticateUser(request);
    if (!userId) {
      return createAuthErrorResponse("Authentication required");
    }

    const userRef = doc(db, "users", userId);
    const streakRef = doc(collection(userRef, "stats"), "streak");

    const docSnapshot = await getDoc(streakRef);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (!docSnapshot.exists()) {
      await setDoc(streakRef, {
        days: 1,
        lastUpdate: serverTimestamp(),
        userId: userId,
      });

      return NextResponse.json({
        success: true,
        data: {
          days: 1,
          lastUpdate: now.toISOString(),
        },
        message: "Streak started!",
      });
    }

    const data = docSnapshot.data();
    const lastUpdate = data.lastUpdate?.toDate();

    if (!lastUpdate) {
      await updateDoc(streakRef, {
        days: 1,
        lastUpdate: serverTimestamp(),
      });

      return NextResponse.json({
        success: true,
        data: {
          days: 1,
          lastUpdate: now.toISOString(),
        },
        message: "Streak reset!",
      });
    }

    const lastUpdateDate = new Date(
      lastUpdate.getFullYear(),
      lastUpdate.getMonth(),
      lastUpdate.getDate()
    );

    const timeDiff = today.getTime() - lastUpdateDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    let newDays = data.days || 0;

    if (daysDiff === 0) {
      // Same day, no change to streak
      return NextResponse.json({
        success: true,
        data: {
          days: newDays,
          lastUpdate: lastUpdate.toISOString(),
        },
        message: "Already logged today",
      });
    } else if (daysDiff === 1) {
      // Next day, increment streak
      newDays = newDays + 1;
    } else {
      // Gap in days, reset streak
      newDays = 1;
    }

    // Update the streak
    await updateDoc(streakRef, {
      days: newDays,
      lastUpdate: serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      data: {
        days: newDays,
        lastUpdate: now.toISOString(),
      },
      message: daysDiff === 1 ? "Streak continued!" : "Streak reset!",
    });
  } catch (error) {
    console.error("Error updating user streak:", error);
    return NextResponse.json(
      { error: "Failed to update user streak" },
      { status: 500 }
    );
  }
}
