// Firebase Admin SDK configuration for server-side authentication
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let adminApp;
if (getApps().length === 0) {
  let serviceAccount;
  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_PRIVATE_KEY &&
    process.env.FIREBASE_CLIENT_EMAIL
  ) {
    serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };
  } else {
    throw new Error(
      "Firebase Admin SDK credentials not found. Please set FIREBASE_SERVICE_ACCOUNT_KEY environment variable or individual Firebase environment variables."
    );
  }

  adminApp = initializeApp({
    credential: cert(serviceAccount),
    projectId:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
      process.env.FIREBASE_PROJECT_ID,
  });
} else {
  adminApp = getApps()[0];
}

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
export { adminApp };
