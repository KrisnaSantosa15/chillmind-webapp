"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { useAuth } from "@/lib/authContext";
import { FirebaseError } from "firebase/app";
import LoggedInRedirect from "@/components/auth/LoggedInRedirect";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signUp(email, password, firstName, lastName);

      const hasPendingAssessment =
        localStorage.getItem("assessment_pending") === "true";

      if (hasPendingAssessment) {
        router.push("/onboarding/results");
      } else {
        router.push("/onboarding");
      }
    } catch (error: unknown) {
      console.error("Registration error:", error);
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        if (errorCode === "auth/email-already-in-use") {
          setError(
            "This email is already in use. Please use a different email or try logging in."
          );
        } else if (errorCode === "auth/invalid-email") {
          setError(
            "The email address is not valid. Please enter a valid email."
          );
        } else if (errorCode === "auth/weak-password") {
          setError("Password is too weak. Please use a stronger password.");
        } else if (errorCode === "auth/network-request-failed") {
          setError(
            "Network error. Please check your internet connection and try again."
          );
        } else {
          setError(`Authentication error: ${errorCode}`);
        }
      } else {
        setError("Failed to create account. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleGoogleSignUp = async () => {
    setError("");
    setIsLoading(true);

    try {
      await signInWithGoogle();

      const hasPendingAssessment =
        localStorage.getItem("assessment_pending") === "true";

      if (hasPendingAssessment) {
        router.push("/onboarding/results");
      } else {
        router.push("/onboarding");
      }
    } catch (error: unknown) {
      console.error("Google signup error:", error);
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        if (errorCode === "auth/popup-closed-by-user") {
          setError("Sign up was cancelled. Please try again.");
        } else if (errorCode === "auth/popup-blocked") {
          setError(
            "Sign up popup was blocked by your browser. Please allow popups for this site."
          );
        } else if (errorCode === "auth/cancelled-popup-request") {
          setError("Sign up was cancelled. Please try again.");
        } else if (errorCode === "auth/network-request-failed") {
          setError(
            "Network error. Please check your internet connection and try again."
          );
        } else {
          setError(`Authentication error: ${errorCode}`);
        }
      } else {
        setError("Failed to sign up with Google. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <LoggedInRedirect>
      <Header />
      <main className="flex min-h-screen items-center justify-center px-6 py-24">
        <div className="w-full max-w-md rounded-lg border border-muted p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-foreground">
              Create an Account
            </h1>
            <p className="mt-2 text-muted-foreground">
              Start your mental wellness journey today
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 text-red-500 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="w-full rounded border border-muted bg-background px-3 py-2 text-foreground"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="w-full rounded border border-muted bg-background px-3 py-2 text-foreground"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded border border-muted bg-background px-3 py-2 text-foreground"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Password
              </label>{" "}
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full rounded border border-muted bg-background px-3 py-2 pr-10 text-foreground"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Must be at least 8 characters with a number and special
                character
              </p>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 rounded border-muted text-primary focus:ring-primary"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-muted-foreground"
              >
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div>
              <Button
                variant="primary"
                className="w-full"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>{" "}
            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={handleGoogleSignUp}
                className="flex w-full items-center justify-center gap-3 rounded-md border border-muted bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted/50"
                disabled={isLoading}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {isLoading ? "Signing up..." : "Sign up with Google"}
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>{" "}
          </p>
        </div>
      </main>
      <Footer />
    </LoggedInRedirect>
  );
}
