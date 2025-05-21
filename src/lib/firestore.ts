// Firebase Firestore utilities
import { db } from "@/lib/firebase";
import { User } from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

// Import types from model.ts
import { DemographicData, PredictionResults } from "./model";
import { FieldValue } from "firebase/firestore";

// Type definitions
export interface AssessmentResults {
  demographics: DemographicData;
  predictionResults: PredictionResults;
  scores: {
    phq9: number;
    gad7: number;
    pss: number;
  };
  answers?: {
    phq9Answers: number[];
    gad7Answers: number[];
    pssAnswers: number[];
  };
  timestamp: FieldValue; // Will be serverTimestamp()
}

// Save assessment results to Firestore
export const saveAssessmentResults = async (
  user: User,
  demographics: DemographicData,
  predictionResults: PredictionResults,
  rawScores: {
    phq9: number;
    gad7: number;
    pss: number;
  },
  answers?: {
    phq9Answers: number[];
    gad7Answers: number[];
    pssAnswers: number[];
  }
) => {
  if (!user || !user.uid) {
    throw new Error("User is not authenticated");
  }

  try {
    // Create user document with assessments collection if doesn't exist
    const userRef = doc(db, "users", user.uid);

    // Check if user document exists, if not create it
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });
    } // Create assessment document with timestamp and data
    const assessmentsRef = collection(userRef, "assessments");

    const assessmentData: AssessmentResults = {
      demographics,
      predictionResults,
      scores: rawScores,
      ...(answers && { answers }), // Include answers if provided
      timestamp: serverTimestamp(),
    };

    // Use auto-generated ID for the assessment
    const newAssessmentRef = doc(assessmentsRef);
    await setDoc(newAssessmentRef, assessmentData);

    return newAssessmentRef.id;
  } catch (error) {
    console.error("Error saving assessment results:", error);
    throw error;
  }
};

// Get the latest assessment for a user
export const getLatestAssessment = async (user: User) => {
  if (!user || !user.uid) {
    throw new Error("User is not authenticated");
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const assessmentsRef = collection(userRef, "assessments");

    // Query for the latest assessment
    const querySnapshot = await getDocs(
      query(assessmentsRef, orderBy("timestamp", "desc"), limit(1))
    );

    if (querySnapshot.empty) {
      return null;
    }

    // Return the first (latest) assessment
    const latestAssessment = querySnapshot.docs[0].data() as AssessmentResults;

    // Convert Firestore Timestamp to JS Date for better client-side handling
    const timestamp = latestAssessment.timestamp as unknown as {
      toDate: () => Date;
    };

    return {
      id: querySnapshot.docs[0].id,
      ...latestAssessment,
      timestamp: timestamp.toDate(),
    };
  } catch (error) {
    console.error("Error getting latest assessment:", error);
    throw error;
  }
};
