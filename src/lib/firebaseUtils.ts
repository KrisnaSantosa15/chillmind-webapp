import { User } from "firebase/auth";
import { auth } from "./firebase";

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null;
  return auth.currentUser;
};
