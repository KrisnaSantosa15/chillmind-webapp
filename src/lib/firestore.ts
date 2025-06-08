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

import { DemographicData, PredictionResults } from "./model";
import { FieldValue } from "firebase/firestore";

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
  timestamp: FieldValue;
}

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
    const userRef = doc(db, "users", user.uid);

    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });
    }
    const assessmentsRef = collection(userRef, "assessments");

    const assessmentData: AssessmentResults = {
      demographics,
      predictionResults,
      scores: rawScores,
      ...(answers && { answers }),
      timestamp: serverTimestamp(),
    };

    const newAssessmentRef = doc(assessmentsRef);
    await setDoc(newAssessmentRef, assessmentData);

    return newAssessmentRef.id;
  } catch (error) {
    console.error("Error saving assessment results:", error);
    throw error;
  }
};

export const getLatestAssessment = async (user: User) => {
  if (!user || !user.uid) {
    throw new Error("User is not authenticated");
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const assessmentsRef = collection(userRef, "assessments");

    const querySnapshot = await getDocs(
      query(assessmentsRef, orderBy("timestamp", "desc"), limit(1))
    );

    if (querySnapshot.empty) {
      return null;
    }

    const latestAssessment = querySnapshot.docs[0].data() as AssessmentResults;

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

export const getAllUserAssessments = async (user: User) => {
  if (!user || !user.uid) {
    throw new Error("User is not authenticated");
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const assessmentsRef = collection(userRef, "assessments");

    const querySnapshot = await getDocs(
      query(assessmentsRef, orderBy("timestamp", "desc"))
    );

    if (querySnapshot.empty) {
      return [];
    }

    const assessments = querySnapshot.docs.map((doc) => {
      const data = doc.data() as AssessmentResults;

      const timestamp = data.timestamp as unknown as {
        toDate: () => Date;
      };

      return {
        id: doc.id,
        ...data,
        timestamp: timestamp.toDate(),
      };
    });

    return assessments;
  } catch (error) {
    console.error("Error getting all user assessments:", error);
    throw error;
  }
};
