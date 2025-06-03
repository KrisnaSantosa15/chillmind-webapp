// JWT Authentication utilities for API routes
import { NextRequest } from "next/server";
import { adminAuth } from "./firebaseAdmin";

export interface AuthenticatedUser {
  uid: string;
  email?: string;
  emailVerified?: boolean;
}

/**
 * Extract and validate JWT token from Authorization header
 * @param request - NextRequest object
 * @returns Promise<AuthenticatedUser | null>
 */
export async function authenticateRequest(
  request: NextRequest
): Promise<AuthenticatedUser | null> {
  try {
    // Get Authorization header
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      console.log("No authorization header provided");
      return null;
    }

    // Extract Bearer token
    const token = authHeader.replace("Bearer ", "");

    if (!token || token === authHeader) {
      console.log(
        "Invalid authorization header format. Expected: Bearer <token>"
      );
      return null;
    }

    // Verify the Firebase ID token using Admin SDK
    const decodedToken = await adminAuth.verifyIdToken(token);

    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
    };
  } catch (error) {
    console.error("JWT authentication error:", error);
    return null;
  }
}



/**
 * Create standardized auth error response
 */
export function createAuthErrorResponse(message = "Unauthorized") {
  return Response.json(
    {
      error: message,
      hint: "Include 'Authorization: Bearer <token>' header with valid Firebase ID token",
    },
    { status: 401 }
  );
}

/**
 * Validate if user has access to specific resource
 * @param authenticatedUserId - ID of authenticated user
 * @param resourceUserId - ID of user who owns the resource
 * @returns boolean
 */
export function validateUserAccess(
  authenticatedUserId: string,
  resourceUserId: string
): boolean {
  return authenticatedUserId === resourceUserId;
}
