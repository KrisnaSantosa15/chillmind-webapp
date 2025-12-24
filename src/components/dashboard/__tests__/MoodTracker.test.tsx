/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import MoodTracker from "@/components/dashboard/MoodTracker";

describe("MoodTracker Component - Whitebox Testing", () => {
  describe("Initial Rendering Tests", () => {
    it("should render MoodTracker component", () => {
      render(<MoodTracker />);
      expect(screen.getByText("Daily Check-in")).toBeInTheDocument();
    });

    it("should render mood selection question", () => {
      render(<MoodTracker />);
      expect(screen.getByText("How are you feeling?")).toBeInTheDocument();
    });

    it("should render Complete Check-in button", () => {
      render(<MoodTracker />);
      expect(
        screen.getByRole("button", { name: /Complete Check-in/i })
      ).toBeInTheDocument();
    });

    it("should render all five mood options", () => {
      render(<MoodTracker />);
      expect(screen.getByText("Angry")).toBeInTheDocument();
      expect(screen.getByText("Sad")).toBeInTheDocument();
      expect(screen.getByText("Neutral")).toBeInTheDocument();
      expect(screen.getByText("Happy")).toBeInTheDocument();
      expect(screen.getByText("Excited")).toBeInTheDocument();
    });
  });

  describe("Mood Selection State Tests", () => {
    it("should not have any mood selected initially", () => {
      render(<MoodTracker />);
      const moodButtons = screen.getAllByRole("button").slice(0, 5); // First 5 buttons are mood options
      moodButtons.forEach((button) => {
        expect(button).not.toHaveClass(
          "border-primary",
          "ring-2",
          "ring-primary/50"
        );
      });
    });

    it("should select angry mood when clicked", () => {
      render(<MoodTracker />);
      const angryButton = screen.getByText("Angry").closest("button");
      fireEvent.click(angryButton!);
      expect(angryButton).toHaveClass(
        "border-primary",
        "ring-2",
        "ring-primary/50"
      );
    });

    it("should select sad mood when clicked", () => {
      render(<MoodTracker />);
      const sadButton = screen.getByText("Sad").closest("button");
      fireEvent.click(sadButton!);
      expect(sadButton).toHaveClass(
        "border-primary",
        "ring-2",
        "ring-primary/50"
      );
    });

    it("should select neutral mood when clicked", () => {
      render(<MoodTracker />);
      const neutralButton = screen.getByText("Neutral").closest("button");
      fireEvent.click(neutralButton!);
      expect(neutralButton).toHaveClass(
        "border-primary",
        "ring-2",
        "ring-primary/50"
      );
    });

    it("should select happy mood when clicked", () => {
      render(<MoodTracker />);
      const happyButton = screen.getByText("Happy").closest("button");
      fireEvent.click(happyButton!);
      expect(happyButton).toHaveClass(
        "border-primary",
        "ring-2",
        "ring-primary/50"
      );
    });

    it("should select excited mood when clicked", () => {
      render(<MoodTracker />);
      const excitedButton = screen.getByText("Excited").closest("button");
      fireEvent.click(excitedButton!);
      expect(excitedButton).toHaveClass(
        "border-primary",
        "ring-2",
        "ring-primary/50"
      );
    });
  });

  describe("Mood State Management Tests", () => {
    it("should deselect previous mood when new mood is selected", () => {
      render(<MoodTracker />);
      const happyButton = screen.getByText("Happy").closest("button");
      const sadButton = screen.getByText("Sad").closest("button");

      fireEvent.click(happyButton!);
      expect(happyButton).toHaveClass("border-primary");

      fireEvent.click(sadButton!);
      expect(sadButton).toHaveClass("border-primary");
      expect(happyButton).not.toHaveClass("border-primary", "ring-2");
    });

    it("should toggle mood selection correctly multiple times", () => {
      render(<MoodTracker />);
      const neutralButton = screen.getByText("Neutral").closest("button");
      const angryButton = screen.getByText("Angry").closest("button");
      const excitedButton = screen.getByText("Excited").closest("button");

      fireEvent.click(neutralButton!);
      expect(neutralButton).toHaveClass("border-primary");

      fireEvent.click(angryButton!);
      expect(angryButton).toHaveClass("border-primary");
      expect(neutralButton).not.toHaveClass("border-primary", "ring-2");

      fireEvent.click(excitedButton!);
      expect(excitedButton).toHaveClass("border-primary");
      expect(angryButton).not.toHaveClass("border-primary", "ring-2");
    });
  });

  describe("Mood Styling Tests", () => {
    it("should have correct color scheme for angry mood", () => {
      render(<MoodTracker />);
      const angryButton = screen.getByText("Angry").closest("button");
      expect(angryButton).toHaveClass("bg-red-50", "text-red-600");
    });

    it("should have correct color scheme for sad mood", () => {
      render(<MoodTracker />);
      const sadButton = screen.getByText("Sad").closest("button");
      expect(sadButton).toHaveClass("bg-yellow-50", "text-yellow-600");
    });

    it("should have correct color scheme for neutral mood", () => {
      render(<MoodTracker />);
      const neutralButton = screen.getByText("Neutral").closest("button");
      expect(neutralButton).toHaveClass("bg-gray-100", "text-gray-600");
    });

    it("should have correct color scheme for happy mood", () => {
      render(<MoodTracker />);
      const happyButton = screen.getByText("Happy").closest("button");
      expect(happyButton).toHaveClass("bg-blue-50", "text-blue-600");
    });

    it("should have correct color scheme for excited mood", () => {
      render(<MoodTracker />);
      const excitedButton = screen.getByText("Excited").closest("button");
      expect(excitedButton).toHaveClass("bg-green-50", "text-green-600");
    });
  });

  describe("Grid Layout Tests", () => {
    it("should render moods in a grid of 5 columns", () => {
      render(<MoodTracker />);
      const moodContainer = screen.getByText(
        "How are you feeling?"
      ).nextElementSibling;
      expect(moodContainer).toHaveClass("grid", "grid-cols-5", "gap-2");
    });

    it("should have proper base styling for mood buttons", () => {
      render(<MoodTracker />);
      const angryButton = screen.getByText("Angry").closest("button");
      expect(angryButton).toHaveClass(
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "p-3",
        "rounded-lg"
      );
    });
  });

  describe("Complete Check-in Button Tests", () => {
    it("should render complete button with correct styling", () => {
      render(<MoodTracker />);
      const completeButton = screen.getByRole("button", {
        name: /Complete Check-in/i,
      });
      expect(completeButton).toHaveClass(
        "mt-4",
        "w-full",
        "px-4",
        "py-2",
        "bg-primary",
        "text-white"
      );
    });

    it("should have hover effect on complete button", () => {
      render(<MoodTracker />);
      const completeButton = screen.getByRole("button", {
        name: /Complete Check-in/i,
      });
      expect(completeButton).toHaveClass("hover:bg-primary/90");
    });
  });

  describe("Accessibility Tests", () => {
    it("should have proper button roles for all mood options", () => {
      render(<MoodTracker />);
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThanOrEqual(6); // 5 mood buttons + 1 complete button
    });

    it("should have readable text for all moods", () => {
      render(<MoodTracker />);
      const moods = ["Angry", "Sad", "Neutral", "Happy", "Excited"];
      moods.forEach((mood) => {
        expect(screen.getByText(mood)).toBeVisible();
      });
    });
  });

  describe("Component Structure Tests", () => {
    it("should render section title with correct styling", () => {
      render(<MoodTracker />);
      const title = screen.getByText("Daily Check-in");
      expect(title).toHaveClass(
        "text-sm",
        "font-medium",
        "text-muted-foreground",
        "uppercase",
        "tracking-wider"
      );
    });

    it("should render mood question with correct styling", () => {
      render(<MoodTracker />);
      const question = screen.getByText("How are you feeling?");
      expect(question).toHaveClass(
        "text-xs",
        "font-medium",
        "text-muted-foreground",
        "mb-2"
      );
    });

    it("should have proper container structure", () => {
      render(<MoodTracker />);
      const container = screen.getByText("Daily Check-in").closest("div");
      expect(container).toHaveClass("mt-6");
    });
  });

  describe("Icon Rendering Tests", () => {
    it("should render FontAwesome icon for each mood", () => {
      render(<MoodTracker />);
      const angryButton = screen.getByText("Angry").closest("button");
      const icon = angryButton!.querySelector("i.fas.fa-angry");
      expect(icon).toBeInTheDocument();
    });

    it("should have correct icon size", () => {
      render(<MoodTracker />);
      const sadButton = screen.getByText("Sad").closest("button");
      const icon = sadButton!.querySelector("i.text-2xl");
      expect(icon).toBeInTheDocument();
    });
  });
});
