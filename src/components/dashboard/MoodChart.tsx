"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Chart, registerables } from "chart.js";
import { getMoodChartData } from "@/lib/journalStorage";

Chart.register(...registerables);

const neutralLinePlugin = {
  id: "neutralLine",
  beforeDraw: (chart: Chart<"line">) => {
    if (!chart.chartArea) return;

    const ctx = chart.ctx;
    const chartArea = chart.chartArea;
    const yScale = chart.scales.y;

    if (!yScale) return;

    const neutralY = yScale.getPixelForValue(3.5);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(chartArea.left, neutralY);
    ctx.lineTo(chartArea.right, neutralY);
    ctx.setLineDash([8, 4]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(148, 163, 184, 0.8)";
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "rgba(148, 163, 184, 0.8)";
    ctx.textAlign = "right";
    ctx.font = "10px Arial";
    ctx.fillText("Neutral", chartArea.right - 5, neutralY - 5);

    ctx.restore();
  },
};

Chart.register(neutralLinePlugin);

interface MoodChartProps {
  timeRange?: "week" | "month" | "year";
  height?: number;
  darkMode?: boolean;
}

interface ChartData {
  labels: string[];
  data: number[];
}

const MoodChart: React.FC<MoodChartProps> = ({
  timeRange = "week",
  height = 200,
  darkMode = false,
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    data: [],
  });

  const createChart = useCallback(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    let labels: string[] = [];
    let data: number[] = [];

    if (
      chartData &&
      chartData.labels &&
      Array.isArray(chartData.labels) &&
      chartData.labels.length > 0 &&
      chartData.data &&
      Array.isArray(chartData.data) &&
      chartData.data.length > 0
    ) {
      labels = chartData.labels;
      data = chartData.data;
    } else {
      if (timeRange === "week") {
        labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const today = new Date().getDay();
        data = Array(7).fill(3.5);
        if (today >= 0 && today < 7) {
          data[today] = 3.5; // Neutral
        }
      } else if (timeRange === "month") {
        labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
        data = [3.5, 3.5, 3.5, 3.5];
      } else {
        labels = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        data = [3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5];
      }
    }

    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--primary")
      .trim();
    const foregroundColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--foreground")
      .trim();

    const gridColor = darkMode
      ? "rgba(100, 116, 139, 0.1)"
      : "rgba(100, 116, 139, 0.2)";
    const textColor = darkMode ? "#94a3b8" : foregroundColor || "#2a2f45";

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Mood",
            data: data,
            fill: false,
            borderColor: darkMode
              ? "#818cf8"
              : primaryColor || "rgb(99, 102, 241)",
            tension: 0.4,
            pointBackgroundColor: function (context) {
              const value = context.raw as number;
              if (value >= 5.5) return "#34D399";
              if (value >= 4.5) return "#818CF8";
              if (value >= 3.75) return "#A855F7";
              if (value >= 3.25 && value <= 3.75) return "#94A3B8";
              if (value >= 2.5) return "#FBBF24";
              if (value >= 1.5) return "#F87171";
              return "#60A5FA";
            },
            pointBorderColor: darkMode ? "#0f172a" : "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: "easeOutQuart",
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            titleColor: "#fff",
            bodyColor: "#fff",
            padding: 10,
            displayColors: false,
            callbacks: {
              label: function (context) {
                const value = context.raw as number;
                const moodLabels: Record<number, string> = {
                  1: "Sadness",
                  2: "Anger",
                  3: "Fear",
                  3.5: "Neutral",
                  4: "Surprise",
                  5: "Love",
                  6: "Joy",
                };

                const moodValues = Object.keys(moodLabels).map(Number);
                const closestValue = moodValues.reduce((prev, curr) =>
                  Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
                );

                const mood = moodLabels[closestValue];
                if (closestValue === 3.5) {
                  return `Mood: ${mood}`;
                } else if (closestValue > 3.5) {
                  return `Mood: ${mood} (Positive)`;
                } else {
                  return `Mood: ${mood} (Negative)`;
                }
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 6,
            grid: {
              color: gridColor,
              drawOnChartArea: true,
            },
            ticks: {
              callback: function (value) {
                const moodLabels: Record<number, string> = {
                  1: "Sadness",
                  2: "Anger",
                  3: "Fear",
                  3.5: "Neutral",
                  4: "Surprise",
                  5: "Love",
                  6: "Joy",
                };
                return moodLabels[value as number] || "";
              },
              color: textColor,
              stepSize: 1,
              autoSkip: false,
              major: {
                enabled: true,
              },
            },
          },
          x: {
            grid: {
              color: gridColor,
            },
            ticks: {
              color: textColor,
            },
          },
        },
      },
    });
  }, [timeRange, darkMode, chartData]);

  useEffect(() => {
    const defaultData = {
      labels:
        timeRange === "week"
          ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
          : timeRange === "month"
          ? ["Week 1", "Week 2", "Week 3", "Week 4"]
          : [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
      data: Array(
        timeRange === "week" ? 7 : timeRange === "month" ? 4 : 12
      ).fill(3.5),
    };

    setChartData(defaultData);

    const fetchData = async () => {
      try {
        const data = await getMoodChartData(timeRange);
        if (data && data.labels && data.data) {
          setChartData(data as ChartData);
        }
      } catch (error) {
        console.error("Error fetching mood chart data:", error);
      }
    };

    fetchData();
  }, [timeRange]);

  useEffect(() => {
    createChart();
  }, [createChart]);

  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    const handleThemeChange = () => {
      createChart();
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleThemeChange);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          (mutation.attributeName === "class" &&
            (mutation.target as Element).classList.contains("dark-theme")) ||
          (mutation.target as Element).classList.contains("light-theme")
        ) {
          handleThemeChange();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
      observer.disconnect();
    };
  }, [createChart]);

  return (
    <div style={{ height: `${height}px`, position: "relative" }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default MoodChart;
