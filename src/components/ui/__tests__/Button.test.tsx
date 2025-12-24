/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from "@/components/ui/Button";

describe("Button Component - Whitebox Testing", () => {
  describe("Rendering Tests", () => {
    it("should render button with default props", () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole("button", { name: /click me/i });
      expect(button).toBeInTheDocument();
    });

    it("should render button with children text", () => {
      render(<Button>Test Button</Button>);
      expect(screen.getByText("Test Button")).toBeInTheDocument();
    });

    it("should render button with primary variant by default", () => {
      render(<Button>Primary</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-primary");
    });
  });

  describe("Variant Styling Tests", () => {
    it("should apply primary variant styles", () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass(
        "bg-primary",
        "text-white",
        "hover:bg-primary-light"
      );
    });

    it("should apply secondary variant styles", () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-secondary", "text-white");
    });

    it("should apply outline variant styles", () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("border", "border-primary", "text-primary");
    });

    it("should apply accent variant styles", () => {
      render(<Button variant="accent">Accent</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-accent", "text-white");
    });
  });

  describe("Size Styling Tests", () => {
    it("should apply small size styles", () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-sm", "px-3", "py-1.5");
    });

    it("should apply medium size styles by default", () => {
      render(<Button>Medium</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-base", "px-4", "py-2");
    });

    it("should apply large size styles", () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-lg", "px-6", "py-3");
    });
  });

  describe("Loading State Tests", () => {
    it("should show loading spinner when isLoading is true", () => {
      render(<Button isLoading>Loading</Button>);
      const button = screen.getByRole("button");
      const spinner = button.querySelector("svg.animate-spin");
      expect(spinner).toBeInTheDocument();
    });

    it("should be disabled when isLoading is true", () => {
      render(<Button isLoading>Loading</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("should apply disabled styles when isLoading", () => {
      render(<Button isLoading>Loading</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("opacity-50", "cursor-not-allowed");
    });

    it("should not show icon when isLoading is true", () => {
      const icon = <span data-testid="test-icon">Icon</span>;
      render(
        <Button isLoading icon={icon}>
          With Icon
        </Button>
      );
      expect(screen.queryByTestId("test-icon")).not.toBeInTheDocument();
    });
  });

  describe("Disabled State Tests", () => {
    it("should be disabled when disabled prop is true", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("should apply disabled styles", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("opacity-50", "cursor-not-allowed");
    });

    it("should not trigger onClick when disabled", () => {
      const handleClick = jest.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      );
      const button = screen.getByRole("button");
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("Icon Tests", () => {
    it("should render icon when provided", () => {
      const icon = <span data-testid="test-icon">📌</span>;
      render(<Button icon={icon}>With Icon</Button>);
      expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    });

    it("should render icon with correct spacing", () => {
      const icon = <span data-testid="test-icon">📌</span>;
      render(<Button icon={icon}>With Icon</Button>);
      const iconSpan = screen.getByTestId("test-icon").parentElement;
      expect(iconSpan).toHaveClass("mr-2");
    });
  });

  describe("Click Handler Tests", () => {
    it("should call onClick handler when clicked", () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole("button");
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should pass event to onClick handler", () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole("button");
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe("Custom Props Tests", () => {
    it("should apply custom className", () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });

    it("should pass through additional HTML button props", () => {
      render(
        <Button type="submit" data-testid="submit-btn">
          Submit
        </Button>
      );
      const button = screen.getByTestId("submit-btn");
      expect(button).toHaveAttribute("type", "submit");
    });

    it("should merge custom className with default styles", () => {
      render(<Button className="mt-4">Custom</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("mt-4", "bg-primary", "rounded-full");
    });
  });

  describe("Base Styles Tests", () => {
    it("should always have base styles", () => {
      render(<Button>Base</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass(
        "rounded-full",
        "font-medium",
        "transition-colors",
        "flex",
        "items-center",
        "justify-center"
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty children", () => {
      render(<Button></Button>);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("should handle both disabled and isLoading props", () => {
      render(
        <Button disabled isLoading>
          Both
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveClass("opacity-50");
    });

    it("should combine all variant, size, and custom classes", () => {
      render(
        <Button variant="outline" size="lg" className="shadow-lg">
          Combined
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass(
        "border",
        "border-primary",
        "text-lg",
        "px-6",
        "py-3",
        "shadow-lg"
      );
    });
  });
});
