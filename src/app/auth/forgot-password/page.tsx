"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { useAuth } from "@/lib/authContext";
import { FirebaseError } from "firebase/app";
import LoggedInRedirect from "@/components/auth/LoggedInRedirect";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await resetPassword(email);
      setSuccess("Password reset email sent. Please check your inbox.");
      setEmail("");
    } catch (error: unknown) {
      console.error("Password reset error:", error);
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        if (errorCode === "auth/invalid-email") {
          setError(
            "The email address is not valid. Please enter a valid email."
          );
        } else if (errorCode === "auth/user-not-found") {
          setError("No account found with this email. Please sign up.");
        } else if (errorCode === "auth/too-many-requests") {
          setError("Too many requests. Please try again later.");
        } else if (errorCode === "auth/network-request-failed") {
          setError(
            "Network error. Please check your internet connection and try again."
          );
        } else {
          setError(`Authentication error: ${errorCode}`);
        }
      } else {
        setError(
          "Failed to send password reset email. Please try again later."
        );
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
              Reset Password
            </h1>
            <p className="mt-2 text-muted-foreground">
              Enter your email to receive a password reset link
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-red-50 text-red-500 rounded-md text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 text-green-500 rounded-md text-sm">
                {success}
              </div>
            )}

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
              <Button
                variant="primary"
                className="w-full"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </LoggedInRedirect>
  );
}
