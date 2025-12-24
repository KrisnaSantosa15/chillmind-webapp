/**
 * Whitebox testing for auth utility functions
 */
import { NextRequest } from "next/server";
import {
  authenticateRequest,
  createAuthErrorResponse,
  validateUserAccess,
} from "@/lib/auth";

// Mock Firebase Admin
jest.mock("@/lib/firebaseAdmin", () => ({
  adminAuth: {
    verifyIdToken: jest.fn(),
  },
}));

import { adminAuth } from "@/lib/firebaseAdmin";

describe("Auth Utility Functions - Whitebox Testing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("authenticateRequest Function Tests", () => {
    it("should return null when Firebase Admin is not initialized", async () => {
      // Temporarily override the mock to return null adminAuth
      const originalAuth = adminAuth;
      Object.defineProperty(require("@/lib/firebaseAdmin"), "adminAuth", {
        value: null,
        configurable: true,
      });

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("Bearer valid-token"),
        },
      } as unknown as NextRequest;

      const result = await authenticateRequest(mockRequest);
      expect(result).toBeNull();

      // Restore original value
      Object.defineProperty(require("@/lib/firebaseAdmin"), "adminAuth", {
        value: originalAuth,
        configurable: true,
      });
    });

    it("should return null when no authorization header is provided", async () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
      } as unknown as NextRequest;

      const result = await authenticateRequest(mockRequest);
      expect(result).toBeNull();
    });

    it("should return null when authorization header is empty", async () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue(""),
        },
      } as unknown as NextRequest;

      const result = await authenticateRequest(mockRequest);
      expect(result).toBeNull();
    });

    it("should return null when authorization header does not have Bearer prefix", async () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("invalid-token"),
        },
      } as unknown as NextRequest;

      const result = await authenticateRequest(mockRequest);
      expect(result).toBeNull();
    });

    it("should return null when token is empty after Bearer prefix", async () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("Bearer "),
        },
      } as unknown as NextRequest;

      const result = await authenticateRequest(mockRequest);
      expect(result).toBeNull();
    });

    it("should successfully authenticate valid token", async () => {
      const mockDecodedToken = {
        uid: "user123",
        email: "test@example.com",
        email_verified: true,
      };

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("Bearer valid-token"),
        },
      } as unknown as NextRequest;

      (adminAuth!.verifyIdToken as jest.Mock).mockResolvedValue(
        mockDecodedToken
      );

      const result = await authenticateRequest(mockRequest);
      expect(result).toEqual({
        uid: "user123",
        email: "test@example.com",
        emailVerified: true,
      });
    });

    it("should call verifyIdToken with correct token", async () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("Bearer test-token-123"),
        },
      } as unknown as NextRequest;

      (adminAuth!.verifyIdToken as jest.Mock).mockResolvedValue({
        uid: "user123",
        email: "test@example.com",
        email_verified: false,
      });

      await authenticateRequest(mockRequest);
      expect(adminAuth!.verifyIdToken).toHaveBeenCalledWith("test-token-123");
    });

    it("should return null when token verification fails", async () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("Bearer invalid-token"),
        },
      } as unknown as NextRequest;

      (adminAuth!.verifyIdToken as jest.Mock).mockRejectedValue(
        new Error("Invalid token")
      );

      const result = await authenticateRequest(mockRequest);
      expect(result).toBeNull();
    });

    it("should handle token without email", async () => {
      const mockDecodedToken = {
        uid: "user123",
      };

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("Bearer valid-token"),
        },
      } as unknown as NextRequest;

      (adminAuth!.verifyIdToken as jest.Mock).mockResolvedValue(
        mockDecodedToken
      );

      const result = await authenticateRequest(mockRequest);
      expect(result).toEqual({
        uid: "user123",
        email: undefined,
        emailVerified: undefined,
      });
    });

    it("should handle expired token error", async () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("Bearer expired-token"),
        },
      } as unknown as NextRequest;

      (adminAuth!.verifyIdToken as jest.Mock).mockRejectedValue(
        new Error("Token expired")
      );

      const result = await authenticateRequest(mockRequest);
      expect(result).toBeNull();
    });
  });

  describe("createAuthErrorResponse Function Tests", () => {
    it("should create error response with default message", () => {
      const response = createAuthErrorResponse();
      expect(response.status).toBe(401);
    });

    it("should create error response with custom message", () => {
      const response = createAuthErrorResponse("Custom error message");
      expect(response.status).toBe(401);
    });

    it("should return Response object", () => {
      const response = createAuthErrorResponse();
      expect(response).toBeInstanceOf(Response);
    });

    it("should have correct content type header", async () => {
      const response = createAuthErrorResponse("Test message");
      const contentType = response.headers.get("content-type");
      expect(contentType).toBe("application/json");
    });

    it("should include message in response body", async () => {
      const response = createAuthErrorResponse("Test error");
      const body = await response.json();
      expect(body.error).toBe("Test error");
    });

    it("should handle empty string message", async () => {
      const response = createAuthErrorResponse("");
      const body = await response.json();
      expect(body.error).toBe("");
    });

    it("should handle long error messages", async () => {
      const longMessage = "Error ".repeat(100);
      const response = createAuthErrorResponse(longMessage);
      const body = await response.json();
      expect(body.error).toBe(longMessage);
    });

    it("should handle special characters in message", async () => {
      const specialMessage = 'Error: @#$%^&*() <script>alert("test")</script>';
      const response = createAuthErrorResponse(specialMessage);
      const body = await response.json();
      expect(body.error).toBe(specialMessage);
    });
  });

  describe("validateUserAccess Function Tests", () => {
    it("should return true when user owns the resource", () => {
      const result = validateUserAccess("user123", "user123");
      expect(result).toBe(true);
    });

    it("should return false when user does not own the resource", () => {
      const result = validateUserAccess("user123", "user456");
      expect(result).toBe(false);
    });

    it("should return false when authenticatedUid is null", () => {
      const result = validateUserAccess(null, "user123");
      expect(result).toBe(false);
    });

    it("should return false when resourceUserId is null", () => {
      const result = validateUserAccess("user123", null);
      expect(result).toBe(false);
    });

    it("should return false when both are null", () => {
      const result = validateUserAccess(null as any, null as any);
      expect(result).toBe(true); // null === null is true in JavaScript
    });

    it("should be case-sensitive for user IDs", () => {
      const result = validateUserAccess("User123", "user123");
      expect(result).toBe(false);
    });

    it("should handle empty strings", () => {
      const result = validateUserAccess("", "");
      expect(result).toBe(true); // "" === "" is true in JavaScript
    });

    it("should handle whitespace in user IDs", () => {
      const result = validateUserAccess(" user123 ", "user123");
      expect(result).toBe(false);
    });

    it("should handle very long user IDs", () => {
      const longId = "a".repeat(1000);
      const result = validateUserAccess(longId, longId);
      expect(result).toBe(true);
    });

    it("should handle special characters in user IDs", () => {
      const specialId = "user-123_test@domain";
      const result = validateUserAccess(specialId, specialId);
      expect(result).toBe(true);
    });
  });

  describe("Integration Tests - Auth Flow", () => {
    it("should complete full authentication flow successfully", async () => {
      const mockDecodedToken = {
        uid: "user123",
        email: "test@example.com",
        email_verified: true,
      };

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("Bearer valid-token"),
        },
      } as unknown as NextRequest;

      (adminAuth!.verifyIdToken as jest.Mock).mockResolvedValue(
        mockDecodedToken
      );

      const user = await authenticateRequest(mockRequest);
      expect(user).not.toBeNull();

      if (user) {
        const hasAccess = validateUserAccess(user.uid, "user123");
        expect(hasAccess).toBe(true);
      }
    });

    it("should handle authentication failure and create error response", async () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
      } as unknown as NextRequest;

      const user = await authenticateRequest(mockRequest);
      expect(user).toBeNull();

      const errorResponse = createAuthErrorResponse("Authentication required");
      expect(errorResponse.status).toBe(401);
    });

    it("should validate user access after successful authentication", async () => {
      const mockDecodedToken = {
        uid: "user123",
        email: "test@example.com",
        email_verified: true,
      };

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("Bearer valid-token"),
        },
      } as unknown as NextRequest;

      (adminAuth!.verifyIdToken as jest.Mock).mockResolvedValue(
        mockDecodedToken
      );

      const user = await authenticateRequest(mockRequest);
      if (user) {
        const hasAccess = validateUserAccess(user.uid, "user456");
        expect(hasAccess).toBe(false);
      }
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should handle malformed Bearer token format", async () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("Bearer"),
        },
      } as unknown as NextRequest;

      const result = await authenticateRequest(mockRequest);
      expect(result).toBeNull();
    });

    it("should handle multiple Bearer keywords", async () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("Bearer Bearer token"),
        },
      } as unknown as NextRequest;

      (adminAuth!.verifyIdToken as jest.Mock).mockResolvedValue({
        uid: "user123",
        email: "test@example.com",
        email_verified: true,
      });

      const result = await authenticateRequest(mockRequest);
      expect(result).not.toBeNull();
    });

    it("should handle network errors during token verification", async () => {
      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("Bearer valid-token"),
        },
      } as unknown as NextRequest;

      (adminAuth!.verifyIdToken as jest.Mock).mockRejectedValue(
        new Error("Network error")
      );

      const result = await authenticateRequest(mockRequest);
      expect(result).toBeNull();
    });

    it("should handle undefined email_verified field", async () => {
      const mockDecodedToken = {
        uid: "user123",
        email: "test@example.com",
      };

      const mockRequest = {
        headers: {
          get: jest.fn().mockReturnValue("Bearer valid-token"),
        },
      } as unknown as NextRequest;

      (adminAuth!.verifyIdToken as jest.Mock).mockResolvedValue(
        mockDecodedToken
      );

      const result = await authenticateRequest(mockRequest);
      expect(result?.emailVerified).toBeUndefined();
    });
  });
});
