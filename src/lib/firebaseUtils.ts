// Firebase utilities
import { User } from "firebase/auth";
import { auth } from "./firebase";

// Get the current user from Firebase auth
export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null;
  return auth.currentUser;
};
