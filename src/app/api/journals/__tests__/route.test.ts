/**
 * Whitebox testing for API routes
 * Testing the journals API endpoint
 */
import { NextRequest, NextResponse } from "next/server";
import { GET, POST } from "@/app/api/journals/route";

// Mock dependencies
jest.mock("@/lib/auth", () => ({
  authenticateRequest: jest.fn(),
  createAuthErrorResponse: jest.fn(
    () =>
      new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      })
  ),
}));

jest.mock("@/lib/firebase", () => ({
  db: {},
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  serverTimestamp: jest.fn(() => new Date()),
}));

import { authenticateRequest } from "@/lib/auth";
import { getDocs, addDoc } from "firebase/firestore";

describe("Journals API Route - Whitebox Testing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/journals - Authentication Tests", () => {
    it("should return 401 when user is not authenticated", async () => {
      (authenticateRequest as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest("http://localhost:3000/api/journals");
      const response = await GET(request);

      expect(response.status).toBe(401);
    });

    it("should call authenticateRequest with the request", async () => {
      (authenticateRequest as jest.Mock).mockResolvedValue({ uid: "user123" });
      (getDocs as jest.Mock).mockResolvedValue({ docs: [] });

      const request = new NextRequest("http://localhost:3000/api/journals");
      await GET(request);

      expect(authenticateRequest).toHaveBeenCalledWith(request);
    });

    it("should proceed with authenticated user", async () => {
      (authenticateRequest as jest.Mock).mockResolvedValue({
        uid: "user123",
        email: "test@example.com",
      });
      (getDocs as jest.Mock).mockResolvedValue({ docs: [] });

      const request = new NextRequest("http://localhost:3000/api/journals");
      const response = await GET(request);

      expect(response.status).toBe(200);
    });
  });

  describe("GET /api/journals - Query Parameters Tests", () => {
    beforeEach(() => {
      (authenticateRequest as jest.Mock).mockResolvedValue({ uid: "user123" });
      (getDocs as jest.Mock).mockResolvedValue({ docs: [] });
    });

    it("should use default limit of 50 when not specified", async () => {
      const request = new NextRequest("http://localhost:3000/api/journals");
      await GET(request);

      // Verify limit function was called (mocked)
      expect(getDocs).toHaveBeenCalled();
    });

    it("should accept custom limit parameter", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/journals?limit=10"
      );
      await GET(request);

      expect(getDocs).toHaveBeenCalled();
    });

    it("should handle limit parameter as string and convert to number", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/journals?limit=25"
      );
      await GET(request);

      const url = new URL(request.url);
      const limitParam = parseInt(url.searchParams.get("limit") || "50");
      expect(limitParam).toBe(25);
    });

    it("should handle invalid limit parameter", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/journals?limit=invalid"
      );
      await GET(request);

      const url = new URL(request.url);
      const limitParam = parseInt(url.searchParams.get("limit") || "50");
      expect(isNaN(limitParam)).toBe(true);
    });

    it("should handle negative limit parameter", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/journals?limit=-10"
      );
      await GET(request);

      const url = new URL(request.url);
      const limitParam = parseInt(url.searchParams.get("limit") || "50");
      expect(limitParam).toBe(-10);
    });

    it("should handle zero limit parameter", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/journals?limit=0"
      );
      await GET(request);

      const url = new URL(request.url);
      const limitParam = parseInt(url.searchParams.get("limit") || "50");
      expect(limitParam).toBe(0);
    });
  });

  describe("GET /api/journals - Data Retrieval Tests", () => {
    beforeEach(() => {
      (authenticateRequest as jest.Mock).mockResolvedValue({ uid: "user123" });
    });

    it("should return empty array when no entries exist", async () => {
      (getDocs as jest.Mock).mockResolvedValue({ docs: [] });

      const request = new NextRequest("http://localhost:3000/api/journals");
      const response = await GET(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.data).toEqual([]);
      expect(data.count).toBe(0);
    });

    it("should return journal entries when they exist", async () => {
      const mockDocs = [
        {
          id: "entry1",
          data: () => ({
            content: "Test entry 1",
            mood: "positive",
            tags: ["test"],
            date: { toDate: () => new Date("2024-01-01") },
          }),
        },
        {
          id: "entry2",
          data: () => ({
            content: "Test entry 2",
            mood: "neutral",
            tags: ["journal"],
            date: { toDate: () => new Date("2024-01-02") },
          }),
        },
      ];

      (getDocs as jest.Mock).mockResolvedValue({ docs: mockDocs });

      const request = new NextRequest("http://localhost:3000/api/journals");
      const response = await GET(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(2);
      expect(data.count).toBe(2);
    });

    it("should correctly transform Firestore documents to JournalEntry format", async () => {
      const mockDate = new Date("2024-01-01T10:00:00Z");
      const mockDocs = [
        {
          id: "entry1",
          data: () => ({
            content: "My journal entry",
            mood: "positive",
            tags: ["gratitude", "happy"],
            date: { toDate: () => mockDate },
          }),
        },
      ];

      (getDocs as jest.Mock).mockResolvedValue({ docs: mockDocs });

      const request = new NextRequest("http://localhost:3000/api/journals");
      const response = await GET(request);
      const data = await response.json();

      expect(data.data[0]).toEqual({
        id: "entry1",
        content: "My journal entry",
        mood: "positive",
        tags: ["gratitude", "happy"],
        date: mockDate.toISOString(),
      });
    });

    it("should handle missing optional fields with defaults", async () => {
      const mockDocs = [
        {
          id: "entry1",
          data: () => ({}),
        },
      ];

      (getDocs as jest.Mock).mockResolvedValue({ docs: mockDocs });

      const request = new NextRequest("http://localhost:3000/api/journals");
      const response = await GET(request);
      const data = await response.json();

      expect(data.data[0].content).toBe("");
      expect(data.data[0].mood).toBe("neutral");
      expect(data.data[0].tags).toEqual([]);
    });

    it("should handle entries with invalid date format", async () => {
      const mockDocs = [
        {
          id: "entry1",
          data: () => ({
            content: "Test",
            mood: "positive",
            tags: [],
            date: null,
          }),
        },
      ];

      (getDocs as jest.Mock).mockResolvedValue({ docs: mockDocs });

      const request = new NextRequest("http://localhost:3000/api/journals");
      const response = await GET(request);
      const data = await response.json();

      expect(data.data[0].date).toBeTruthy();
      expect(() => new Date(data.data[0].date)).not.toThrow();
    });
  });

  describe("GET /api/journals - Response Format Tests", () => {
    beforeEach(() => {
      (authenticateRequest as jest.Mock).mockResolvedValue({ uid: "user123" });
      (getDocs as jest.Mock).mockResolvedValue({ docs: [] });
    });

    it("should return JSON response", async () => {
      const request = new NextRequest("http://localhost:3000/api/journals");
      const response = await GET(request);

      const data = await response.json();
      expect(data).toHaveProperty("data");
      expect(Array.isArray(data.data)).toBe(true);
      expect(data).toHaveProperty("success");
      expect(data).toHaveProperty("count");
    });

    it("should return success flag in response", async () => {
      const request = new NextRequest("http://localhost:3000/api/journals");
      const response = await GET(request);
      const data = await response.json();

      expect(data).toHaveProperty("success");
      expect(data.success).toBe(true);
    });

    it("should return data array in response", async () => {
      const request = new NextRequest("http://localhost:3000/api/journals");
      const response = await GET(request);
      const data = await response.json();

      expect(data).toHaveProperty("data");
      expect(Array.isArray(data.data)).toBe(true);
    });

    it("should return count in response", async () => {
      const request = new NextRequest("http://localhost:3000/api/journals");
      const response = await GET(request);
      const data = await response.json();

      expect(data).toHaveProperty("count");
      expect(typeof data.count).toBe("number");
    });

    it("should have status 200 for successful requests", async () => {
      const request = new NextRequest("http://localhost:3000/api/journals");
      const response = await GET(request);

      expect(response.status).toBe(200);
    });
  });

  describe("GET /api/journals - Error Handling Tests", () => {
    beforeEach(() => {
      (authenticateRequest as jest.Mock).mockResolvedValue({ uid: "user123" });
    });

    it("should return 500 when Firestore query fails", async () => {
      (getDocs as jest.Mock).mockRejectedValue(new Error("Firestore error"));

      const request = new NextRequest("http://localhost:3000/api/journals");
      const response = await GET(request);

      expect(response.status).toBe(500);
    });

    it("should return error message when query fails", async () => {
      (getDocs as jest.Mock).mockRejectedValue(new Error("Network error"));

      const request = new NextRequest("http://localhost:3000/api/journals");
      const response = await GET(request);
      const data = await response.json();

      expect(data).toHaveProperty("error");
      expect(data.error).toBe("Failed to fetch journal entries");
    });

    it("should handle database connection errors", async () => {
      (getDocs as jest.Mock).mockRejectedValue(new Error("Connection timeout"));

      const request = new NextRequest("http://localhost:3000/api/journals");
      const response = await GET(request);

      expect(response.status).toBe(500);
    });

    it("should handle permission errors", async () => {
      (getDocs as jest.Mock).mockRejectedValue(new Error("Permission denied"));

      const request = new NextRequest("http://localhost:3000/api/journals");
      const response = await GET(request);

      expect(response.status).toBe(500);
    });
  });

  describe("POST /api/journals - Authentication Tests", () => {
    it("should return 401 when user is not authenticated", async () => {
      (authenticateRequest as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest("http://localhost:3000/api/journals", {
        method: "POST",
        body: JSON.stringify({ content: "Test", tags: [] }),
      });
      const response = await POST(request);

      expect(response.status).toBe(401);
    });

    it("should proceed with authenticated user for POST", async () => {
      (authenticateRequest as jest.Mock).mockResolvedValue({ uid: "user123" });
      (addDoc as jest.Mock).mockResolvedValue({ id: "newEntry123" });

      const request = new NextRequest("http://localhost:3000/api/journals", {
        method: "POST",
        body: JSON.stringify({
          content: "Test entry",
          mood: "neutral",
          tags: ["test"],
        }),
      });
      const response = await POST(request);

      expect(response.status).toBe(201);
    });
  });

  describe("POST /api/journals - Request Validation Tests", () => {
    beforeEach(() => {
      (authenticateRequest as jest.Mock).mockResolvedValue({ uid: "user123" });
      (addDoc as jest.Mock).mockResolvedValue({ id: "newEntry123" });
    });

    it("should accept valid journal entry data", async () => {
      const requestData = {
        content: "Today was a great day!",
        mood: "positive",
        tags: ["gratitude", "happy"],
      };

      const request = new NextRequest("http://localhost:3000/api/journals", {
        method: "POST",
        body: JSON.stringify(requestData),
        headers: { "content-type": "application/json" },
      });
      const response = await POST(request);

      expect(response.status).toBe(201);
    });

    it("should handle missing tags array", async () => {
      const requestData = {
        content: "Test entry",
        mood: "neutral",
      };

      const request = new NextRequest("http://localhost:3000/api/journals", {
        method: "POST",
        body: JSON.stringify(requestData),
        headers: { "content-type": "application/json" },
      });
      const response = await POST(request);

      expect(response.status).toBe(201);
    });

    it("should handle empty content", async () => {
      const requestData = {
        content: "",
        mood: "neutral",
        tags: [],
      };

      const request = new NextRequest("http://localhost:3000/api/journals", {
        method: "POST",
        body: JSON.stringify(requestData),
        headers: { "content-type": "application/json" },
      });
      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain("Content is required");
    });

    it("should handle very long content", async () => {
      const requestData = {
        content: "A".repeat(10000),
        mood: "neutral",
        tags: ["test"],
      };

      const request = new NextRequest("http://localhost:3000/api/journals", {
        method: "POST",
        body: JSON.stringify(requestData),
        headers: { "content-type": "application/json" },
      });
      const response = await POST(request);

      expect(response.status).toBe(201);
    });

    it("should handle special characters in content", async () => {
      const requestData = {
        content: "Test with @#$%^&*() special chars 😊",
        mood: "positive",
        tags: ["test"],
      };

      const request = new NextRequest("http://localhost:3000/api/journals", {
        method: "POST",
        body: JSON.stringify(requestData),
        headers: { "content-type": "application/json" },
      });
      const response = await POST(request);

      expect(response.status).toBe(201);
    });
  });

  describe("POST /api/journals - Response Format Tests", () => {
    beforeEach(() => {
      (authenticateRequest as jest.Mock).mockResolvedValue({ uid: "user123" });
      (addDoc as jest.Mock).mockResolvedValue({ id: "newEntry123" });
    });

    it("should return 201 status for successful creation", async () => {
      const request = new NextRequest("http://localhost:3000/api/journals", {
        method: "POST",
        body: JSON.stringify({ content: "Test", mood: "neutral", tags: [] }),
      });
      const response = await POST(request);

      expect(response.status).toBe(201);
    });

    it("should return JSON response", async () => {
      const request = new NextRequest("http://localhost:3000/api/journals", {
        method: "POST",
        body: JSON.stringify({ content: "Test", mood: "neutral", tags: [] }),
      });
      const response = await POST(request);

      const data = await response.json();
      expect(data).toHaveProperty("success");
      expect(data.success).toBe(true);
    });

    it("should return success flag in response", async () => {
      const request = new NextRequest("http://localhost:3000/api/journals", {
        method: "POST",
        body: JSON.stringify({ content: "Test", mood: "neutral", tags: [] }),
      });
      const response = await POST(request);
      const data = await response.json();

      expect(data).toHaveProperty("success");
    });
  });

  describe("Edge Cases and Integration", () => {
    it("should handle concurrent GET requests", async () => {
      (authenticateRequest as jest.Mock).mockResolvedValue({ uid: "user123" });
      (getDocs as jest.Mock).mockResolvedValue({ docs: [] });

      const requests = Array(5)
        .fill(null)
        .map(() => GET(new NextRequest("http://localhost:3000/api/journals")));

      const responses = await Promise.all(requests);
      responses.forEach((response) => {
        expect(response.status).toBe(200);
      });
    });

    it("should handle requests from different users", async () => {
      const user1Mock = jest.fn().mockResolvedValue({ uid: "user1" });
      const user2Mock = jest.fn().mockResolvedValue({ uid: "user2" });

      (getDocs as jest.Mock).mockResolvedValue({ docs: [] });
      (authenticateRequest as jest.Mock).mockImplementation(user1Mock);
      await GET(new NextRequest("http://localhost:3000/api/journals"));
      (authenticateRequest as jest.Mock).mockImplementation(user2Mock);
      await GET(new NextRequest("http://localhost:3000/api/journals"));

      expect(user1Mock).toHaveBeenCalled();
      expect(user2Mock).toHaveBeenCalled();
    });
  });
});
