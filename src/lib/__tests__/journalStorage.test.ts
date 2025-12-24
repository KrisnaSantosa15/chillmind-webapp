/**
 * Whitebox testing for journalStorage utility functions
 */
import {
  emotionToMood,
  emotionToValue,
  fallbackPredictEmotion,
  Emotion,
} from "@/lib/journalStorage";

describe("journalStorage Utility Functions - Whitebox Testing", () => {
  describe("emotionToMood Function Tests", () => {
    it("should convert joy to joy mood", () => {
      expect(emotionToMood("joy")).toBe("joy");
    });

    it("should convert love to love mood", () => {
      expect(emotionToMood("love")).toBe("love");
    });

    it("should convert surprise to surprise mood", () => {
      expect(emotionToMood("surprise")).toBe("surprise");
    });

    it("should convert fear to fear mood", () => {
      expect(emotionToMood("fear")).toBe("fear");
    });

    it("should convert anger to anger mood", () => {
      expect(emotionToMood("anger")).toBe("anger");
    });

    it("should convert sadness to sadness mood", () => {
      expect(emotionToMood("sadness")).toBe("sadness");
    });

    it("should convert neutral to neutral mood", () => {
      expect(emotionToMood("neutral")).toBe("neutral");
    });

    it("should handle unknown emotion and return neutral", () => {
      expect(emotionToMood("unknown" as Emotion)).toBe("neutral");
    });
  });

  describe("emotionToValue Function Tests", () => {
    it("should assign value 6 to joy", () => {
      expect(emotionToValue("joy")).toBe(6);
    });

    it("should assign value 5 to love", () => {
      expect(emotionToValue("love")).toBe(5);
    });

    it("should assign value 4 to surprise", () => {
      expect(emotionToValue("surprise")).toBe(4);
    });

    it("should assign value 3.5 to neutral", () => {
      expect(emotionToValue("neutral")).toBe(3.5);
    });

    it("should assign value 3 to fear", () => {
      expect(emotionToValue("fear")).toBe(3);
    });

    it("should assign value 1 to sadness", () => {
      expect(emotionToValue("sadness")).toBe(1);
    });

    it("should assign value 2 to anger", () => {
      expect(emotionToValue("anger")).toBe(2);
    });

    it("should handle unknown emotion and return 3.5", () => {
      expect(emotionToValue("unknown")).toBe(3.5);
    });

    it("should handle empty string and return 3.5", () => {
      expect(emotionToValue("")).toBe(3.5);
    });

    it("should be case-insensitive", () => {
      expect(emotionToValue("JOY")).toBe(6);
      expect(emotionToValue("Love")).toBe(5);
      expect(emotionToValue("ANGER")).toBe(2);
    });
  });

  describe("fallbackPredictEmotion Function Tests", () => {
    describe("Joy Detection", () => {
      it('should detect joy from "happy" keyword', () => {
        expect(fallbackPredictEmotion("I am so happy today")).toBe("joy");
      });

      it('should detect joy from "excited" keyword', () => {
        expect(fallbackPredictEmotion("I am excited about the trip")).toBe(
          "joy"
        );
      });

      it('should detect joy from "wonderful" keyword', () => {
        expect(fallbackPredictEmotion("What a wonderful day")).toBe("joy");
      });

      it("should detect joy from multiple joy keywords", () => {
        expect(
          fallbackPredictEmotion("I am so happy and excited, this is amazing")
        ).toBe("joy");
      });
    });

    describe("Love Detection", () => {
      it('should detect love from "love" keyword', () => {
        expect(fallbackPredictEmotion("I love spending time with family")).toBe(
          "love"
        );
      });

      it('should detect love from "grateful" keyword', () => {
        expect(fallbackPredictEmotion("I am grateful for everything")).toBe(
          "love"
        );
      });

      it('should detect love from "appreciate" keyword', () => {
        expect(fallbackPredictEmotion("I appreciate all the support")).toBe(
          "love"
        );
      });

      it("should detect love from multiple love keywords", () => {
        expect(fallbackPredictEmotion("I love and appreciate my friends")).toBe(
          "love"
        );
      });
    });

    describe("Surprise Detection", () => {
      it('should detect surprise from "surprised" keyword', () => {
        expect(fallbackPredictEmotion("I was so surprised by the news")).toBe(
          "surprise"
        );
      });

      it('should detect surprise from "wow" keyword', () => {
        expect(fallbackPredictEmotion("Wow, that was unexpected")).toBe(
          "surprise"
        );
      });

      it('should detect surprise from "shocked" keyword', () => {
        expect(fallbackPredictEmotion("I am shocked by what happened")).toBe(
          "surprise"
        );
      });
    });

    describe("Fear Detection", () => {
      it('should detect fear from "afraid" keyword', () => {
        expect(fallbackPredictEmotion("I am afraid of the dark")).toBe("fear");
      });

      it('should detect fear from "anxious" keyword', () => {
        expect(fallbackPredictEmotion("Feeling anxious about the exam")).toBe(
          "fear"
        );
      });

      it('should detect fear from "worried" keyword', () => {
        expect(fallbackPredictEmotion("I am worried about the future")).toBe(
          "fear"
        );
      });

      it("should detect fear from multiple fear keywords", () => {
        expect(fallbackPredictEmotion("I am scared and nervous")).toBe("fear");
      });
    });

    describe("Anger Detection", () => {
      it('should detect anger from "angry" keyword', () => {
        expect(fallbackPredictEmotion("I am so angry right now")).toBe("anger");
      });

      it('should detect anger from "frustrated" keyword', () => {
        expect(
          fallbackPredictEmotion("Feeling frustrated with everything")
        ).toBe("anger");
      });

      it('should detect anger from "annoyed" keyword', () => {
        expect(fallbackPredictEmotion("I am annoyed by this situation")).toBe(
          "anger"
        );
      });
    });

    describe("Sadness Detection", () => {
      it('should detect sadness from "sad" keyword', () => {
        expect(fallbackPredictEmotion("I am feeling sad today")).toBe(
          "sadness"
        );
      });

      it('should detect sadness from "depressed" keyword', () => {
        expect(fallbackPredictEmotion("Feeling depressed lately")).toBe(
          "sadness"
        );
      });

      it('should detect sadness from "disappointed" keyword', () => {
        expect(fallbackPredictEmotion("I am disappointed in the outcome")).toBe(
          "sadness"
        );
      });
    });

    describe("Neutral Detection", () => {
      it("should return neutral for text without emotion keywords", () => {
        expect(fallbackPredictEmotion("The weather is nice")).toBe("neutral");
      });

      it("should return neutral for empty text", () => {
        expect(fallbackPredictEmotion("")).toBe("neutral");
      });

      it('should return neutral for "ok" keyword', () => {
        expect(fallbackPredictEmotion("I am ok with this")).toBe("neutral");
      });

      it('should return neutral for "fine" keyword', () => {
        expect(fallbackPredictEmotion("Everything is fine")).toBe("neutral");
      });
    });

    describe("Edge Cases", () => {
      it("should be case-insensitive", () => {
        expect(fallbackPredictEmotion("I AM HAPPY")).toBe("joy");
        expect(fallbackPredictEmotion("I Love This")).toBe("love");
        expect(fallbackPredictEmotion("SO ANGRY")).toBe("anger");
      });

      it("should detect whole words only", () => {
        // "sad" should not be detected in "saddle"
        const result = fallbackPredictEmotion("I rode the saddle today");
        expect(result).toBe("neutral");
      });

      it("should prioritize emotion with most keyword matches", () => {
        const result = fallbackPredictEmotion(
          "I am happy happy happy but a bit sad"
        );
        expect(result).toBe("joy");
      });

      it("should handle mixed emotions and return dominant one", () => {
        const result = fallbackPredictEmotion(
          "I am angry angry angry and frustrated but also happy"
        );
        expect(result).toBe("anger");
      });

      it("should handle very long text", () => {
        const longText = "I am happy ".repeat(50) + " today";
        expect(fallbackPredictEmotion(longText)).toBe("joy");
      });

      it("should handle special characters", () => {
        expect(fallbackPredictEmotion("I am happy! @#$%^&*()")).toBe("joy");
      });

      it("should handle text with newlines", () => {
        expect(
          fallbackPredictEmotion("I am happy\nand grateful\nfor today")
        ).toBe("joy");
      });

      it("should handle unicode characters", () => {
        expect(fallbackPredictEmotion("I am happy 😊 today")).toBe("joy");
      });
    });

    describe("Algorithm Internal Logic Tests", () => {
      it("should count multiple occurrences of same keyword", () => {
        const result = fallbackPredictEmotion("happy happy happy");
        expect(result).toBe("joy");
      });

      it("should aggregate counts across different keywords of same emotion", () => {
        const result = fallbackPredictEmotion(
          "I am happy and excited and wonderful"
        );
        expect(result).toBe("joy");
      });

      it("should handle ties by returning first emotion with max count", () => {
        // When there's a tie, should return one of the tied emotions consistently
        const result = fallbackPredictEmotion("I am happy and sad");
        expect(["joy", "sadness"]).toContain(result);
      });
    });

    describe("Boundary Conditions", () => {
      it("should handle single character text", () => {
        expect(fallbackPredictEmotion("a")).toBe("neutral");
      });

      it("should handle text with only spaces", () => {
        expect(fallbackPredictEmotion("   ")).toBe("neutral");
      });

      it("should handle text with only punctuation", () => {
        expect(fallbackPredictEmotion("!!??..,")).toBe("neutral");
      });

      it("should handle text with numbers", () => {
        expect(fallbackPredictEmotion("I am happy 123 times")).toBe("joy");
      });

      it("should handle hyphenated words", () => {
        // hyphenated words like "so-happy" can still match "happy" keyword
        expect(fallbackPredictEmotion("I am so-happy today")).toBe("joy");
      });
    });
  });

  describe("Integration Tests - Multiple Functions", () => {
    it("should work together: fallback prediction + emotion to mood conversion", () => {
      const emotion = fallbackPredictEmotion("I am very happy today");
      const mood = emotionToMood(emotion);
      expect(mood).toBe("joy");
    });

    it("should work together: fallback prediction + emotion to value conversion", () => {
      const emotion = fallbackPredictEmotion("I am angry and frustrated");
      const value = emotionToValue(emotion);
      expect(value).toBe(2);
    });

    it("should handle neutral text through the pipeline", () => {
      const emotion = fallbackPredictEmotion("The cat sat on the mat");
      const mood = emotionToMood(emotion);
      const value = emotionToValue(emotion);
      expect(emotion).toBe("neutral");
      expect(mood).toBe("neutral");
      expect(value).toBe(3.5);
    });
  });
});
