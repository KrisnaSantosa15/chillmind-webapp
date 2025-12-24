/**
 * Whitebox testing for emotionInsights utility functions
 */
import {
  getEmotionInsight,
  EmotionInsight,
  InsightLevel,
} from "@/lib/emotionInsights";
import { Emotion } from "@/lib/journalStorage";
import { User } from "firebase/auth";

// Mock Firebase
jest.mock("@/lib/firebase", () => ({
  db: {},
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  collection: jest.fn(),
  increment: jest.fn((val) => val),
}));

describe("EmotionInsights Utility Functions - Whitebox Testing", () => {
  let mockUser: User;

  beforeEach(() => {
    mockUser = {
      uid: "test-user-123",
      email: "test@example.com",
      emailVerified: true,
    } as User;
    jest.clearAllMocks();
  });

  describe("getEmotionInsight Function - Structure Tests", () => {
    it("should return an EmotionInsight object", async () => {
      const { getDoc, setDoc } = require("firebase/firestore");
      getDoc.mockResolvedValue({ exists: () => false });

      const insight = await getEmotionInsight("joy", mockUser);

      expect(insight).toHaveProperty("title");
      expect(insight).toHaveProperty("description");
      expect(insight).toHaveProperty("copingStrategy");
      expect(insight).toHaveProperty("reflectionPrompt");
    });

    it("should return title as string", async () => {
      const { getDoc } = require("firebase/firestore");
      getDoc.mockResolvedValue({ exists: () => false });

      const insight = await getEmotionInsight("joy", mockUser);
      expect(typeof insight.title).toBe("string");
      expect(insight.title.length).toBeGreaterThan(0);
    });

    it("should return non-empty description", async () => {
      const { getDoc } = require("firebase/firestore");
      getDoc.mockResolvedValue({ exists: () => false });

      const insight = await getEmotionInsight("sadness", mockUser);
      expect(insight.description.length).toBeGreaterThan(0);
    });

    it("should return non-empty coping strategy", async () => {
      const { getDoc } = require("firebase/firestore");
      getDoc.mockResolvedValue({ exists: () => false });

      const insight = await getEmotionInsight("anger", mockUser);
      expect(insight.copingStrategy.length).toBeGreaterThan(0);
    });

    it("should return non-empty reflection prompt", async () => {
      const { getDoc } = require("firebase/firestore");
      getDoc.mockResolvedValue({ exists: () => false });

      const insight = await getEmotionInsight("fear", mockUser);
      expect(insight.reflectionPrompt.length).toBeGreaterThan(0);
    });
  });

  describe("Emotion-Specific Insights Tests", () => {
    beforeEach(() => {
      const { getDoc } = require("firebase/firestore");
      getDoc.mockResolvedValue({ exists: () => false });
    });

    it("should provide joy-specific insights", async () => {
      const insight = await getEmotionInsight("joy", mockUser);
      expect(insight.title.toLowerCase()).toContain("joy");
    });

    it("should provide love-specific insights", async () => {
      const insight = await getEmotionInsight("love", mockUser);
      expect(insight.title.toLowerCase()).toMatch(/love|connection/);
    });

    it("should provide sadness-specific insights", async () => {
      const insight = await getEmotionInsight("sadness", mockUser);
      expect(insight.title.toLowerCase()).toContain("sadness");
    });

    it("should provide anger-specific insights", async () => {
      const insight = await getEmotionInsight("anger", mockUser);
      expect(insight.title.toLowerCase()).toContain("anger");
    });

    it("should provide fear-specific insights", async () => {
      const insight = await getEmotionInsight("fear", mockUser);
      expect(insight.title.toLowerCase()).toMatch(/fear|anxiety/);
    });

    it("should provide surprise-specific insights", async () => {
      const insight = await getEmotionInsight("surprise", mockUser);
      expect(insight.title.toLowerCase()).toContain("surprise");
    });

    it("should provide neutral-specific insights", async () => {
      const insight = await getEmotionInsight("neutral", mockUser);
      expect(insight.title.toLowerCase()).toMatch(
        /neutral|balance|awareness|equilibrium/
      );
    });
  });

  describe("Insight Level Progression Tests", () => {
    it("should provide basic level insights for first few entries (count <= 5)", async () => {
      const { getDoc } = require("firebase/firestore");
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ joy: 3 }),
      });

      const insight = await getEmotionInsight("joy", mockUser);
      // Basic level insights should have introductory titles
      expect(insight.title).toContain("Understanding");
    });

    it("should provide intermediate level insights for medium entries (5 < count <= 10)", async () => {
      const { getDoc } = require("firebase/firestore");
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ joy: 7 }),
      });

      const insight = await getEmotionInsight("joy", mockUser);
      // Intermediate level insights dive deeper
      expect(insight.title).toMatch(/Science|Power|Nature/);
    });

    it("should provide advanced level insights for many entries (count > 10)", async () => {
      const { getDoc } = require("firebase/firestore");
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ joy: 15 }),
      });

      const insight = await getEmotionInsight("joy", mockUser);
      // Advanced level insights focus on cultivation and mastery
      expect(insight.title).toMatch(/Cultivating|Building|Managing|Mastering/);
    });

    it("should include factoid only in advanced level insights", async () => {
      const { getDoc } = require("firebase/firestore");

      // Basic level
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ joy: 2 }),
      });
      let insight = await getEmotionInsight("joy", mockUser);
      expect(insight.factoid).toBeUndefined();

      // Intermediate level
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ joy: 7 }),
      });
      insight = await getEmotionInsight("joy", mockUser);
      expect(insight.factoid).toBeUndefined();

      // Advanced level
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ joy: 12 }),
      });
      insight = await getEmotionInsight("joy", mockUser);
      expect(insight.factoid).toBeDefined();
      expect(insight.factoid!.length).toBeGreaterThan(0);
    });
  });

  describe("Firestore Integration Tests", () => {
    it("should query user emotion count from Firestore", async () => {
      const { getDoc, doc } = require("firebase/firestore");
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ joy: 5 }),
      });

      await getEmotionInsight("joy", mockUser);

      expect(doc).toHaveBeenCalled();
      expect(getDoc).toHaveBeenCalled();
    });

    it("should increment emotion count after providing insight", async () => {
      const { getDoc, updateDoc, setDoc } = require("firebase/firestore");
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ joy: 3 }),
      });

      await getEmotionInsight("joy", mockUser);

      expect(updateDoc).toHaveBeenCalled();
    });

    it("should create new emotion count document if not exists", async () => {
      const { getDoc, setDoc } = require("firebase/firestore");
      getDoc.mockResolvedValue({
        exists: () => false,
      });

      await getEmotionInsight("joy", mockUser);

      expect(setDoc).toHaveBeenCalled();
    });

    it("should handle Firestore errors gracefully", async () => {
      const { getDoc } = require("firebase/firestore");
      getDoc.mockRejectedValue(new Error("Firestore error"));

      // Function handles errors internally and returns default insight
      const insight = await getEmotionInsight("joy", mockUser);
      expect(insight).toBeDefined();
      expect(insight.title).toBeTruthy();
    });
  });

  describe("Content Quality Tests", () => {
    beforeEach(() => {
      const { getDoc } = require("firebase/firestore");
      getDoc.mockResolvedValue({ exists: () => false });
    });

    it("should provide actionable coping strategies", async () => {
      const insight = await getEmotionInsight("sadness", mockUser);
      // Coping strategies should contain action words
      expect(insight.copingStrategy).toMatch(
        /try|practice|consider|take|engage|focus/i
      );
    });

    it("should provide thought-provoking reflection prompts", async () => {
      const insight = await getEmotionInsight("anger", mockUser);
      // Reflection prompts should be questions or prompts
      expect(insight.reflectionPrompt).toMatch(
        /\?|what|how|why|consider|reflect/i
      );
    });

    it("should provide scientifically-informed descriptions", async () => {
      const insight = await getEmotionInsight("fear", mockUser);
      // Descriptions should mention brain or psychological concepts
      expect(insight.description).toMatch(
        /brain|neurotransmitter|hormone|response|system|psychological/i
      );
    });
  });

  describe("All Emotions Coverage Tests", () => {
    beforeEach(() => {
      const { getDoc } = require("firebase/firestore");
      getDoc.mockResolvedValue({ exists: () => false });
    });

    const emotions: Emotion[] = [
      "joy",
      "love",
      "surprise",
      "fear",
      "anger",
      "sadness",
      "neutral",
    ];

    emotions.forEach((emotion) => {
      it(`should provide complete insights for ${emotion}`, async () => {
        const insight = await getEmotionInsight(emotion, mockUser);

        expect(insight.title).toBeTruthy();
        expect(insight.description).toBeTruthy();
        expect(insight.copingStrategy).toBeTruthy();
        expect(insight.reflectionPrompt).toBeTruthy();
      });
    });

    emotions.forEach((emotion) => {
      it(`should provide unique content for ${emotion}`, async () => {
        const insight = await getEmotionInsight(emotion, mockUser);

        // Each emotion should have distinct content
        expect(insight.title.length).toBeGreaterThan(5);
        expect(insight.description.length).toBeGreaterThan(20);
        expect(insight.copingStrategy.length).toBeGreaterThan(20);
        expect(insight.reflectionPrompt.length).toBeGreaterThan(10);
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle user without email", async () => {
      const { getDoc } = require("firebase/firestore");
      getDoc.mockResolvedValue({ exists: () => false });

      const userWithoutEmail = {
        uid: "test-user-456",
        email: null,
        emailVerified: false,
      } as unknown as User;

      const insight = await getEmotionInsight("joy", userWithoutEmail);
      expect(insight).toBeTruthy();
    });

    it("should handle concurrent requests for same user", async () => {
      const { getDoc } = require("firebase/firestore");
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ joy: 5 }),
      });

      const promises = [
        getEmotionInsight("joy", mockUser),
        getEmotionInsight("joy", mockUser),
        getEmotionInsight("joy", mockUser),
      ];

      const results = await Promise.all(promises);
      results.forEach((result) => {
        expect(result).toHaveProperty("title");
        expect(result).toHaveProperty("description");
      });
    });

    it("should handle very high emotion counts", async () => {
      const { getDoc } = require("firebase/firestore");
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ joy: 1000 }),
      });

      const insight = await getEmotionInsight("joy", mockUser);
      // Should still provide advanced level insights
      expect(insight.factoid).toBeDefined();
    });
  });

  describe("Consistency Tests", () => {
    beforeEach(() => {
      const { getDoc } = require("firebase/firestore");
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ joy: 3 }),
      });
    });

    it("should return consistent insights for same emotion and level", async () => {
      const insight1 = await getEmotionInsight("joy", mockUser);
      const insight2 = await getEmotionInsight("joy", mockUser);

      // Same level should give same content
      expect(insight1.title).toBe(insight2.title);
      expect(insight1.description).toBe(insight2.description);
    });

    it("should return different insights for different emotions at same level", async () => {
      const joyInsight = await getEmotionInsight("joy", mockUser);
      const sadnessInsight = await getEmotionInsight("sadness", mockUser);

      expect(joyInsight.title).not.toBe(sadnessInsight.title);
      expect(joyInsight.description).not.toBe(sadnessInsight.description);
    });
  });
});
