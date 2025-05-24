"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Chart, registerables } from 'chart.js';
import { getMoodChartData } from '@/lib/journalStorage';

// Register all Chart.js components
Chart.register(...registerables);

// Create a custom plugin to draw a dashed line at the Neutral value
const neutralLinePlugin = {
  id: 'neutralLine',
  beforeDraw: (chart: Chart<'line'>) => {
    if (!chart.chartArea) return;
    
    const ctx = chart.ctx;
    const chartArea = chart.chartArea;
    const yScale = chart.scales.y;
    
    if (!yScale) return;
    
    // Calculate the pixel position for neutral value (3.5)
    const neutralY = yScale.getPixelForValue(3.5);
    
    // Draw a dashed line
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(chartArea.left, neutralY);
    ctx.lineTo(chartArea.right, neutralY);
    ctx.setLineDash([8, 4]); // More distinctive dash pattern for better visibility
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.8)'; // Slightly more visible gray color
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash pattern
    
    // Add a small "Neutral" label at the right end of the dashed line
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.textAlign = 'right';
    ctx.font = '10px Arial';
    ctx.fillText('Neutral', chartArea.right - 5, neutralY - 5);
    
    ctx.restore();
  }
};

// Register the plugin
Chart.register(neutralLinePlugin);

interface MoodChartProps {
  timeRange?: 'week' | 'month' | 'year';
  height?: number;
  darkMode?: boolean;
  // Note: key prop is handled by React automatically, not explicitly in the component
}

interface ChartData {
  labels: string[];
  data: number[];
}

const MoodChart: React.FC<MoodChartProps> = ({ 
  timeRange = 'week',
  height = 200,
  darkMode = false
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [chartData, setChartData] = useState<ChartData>({ labels: [], data: [] });

  // Create chart function - wrapped with useCallback to avoid dependency issues
  const createChart = useCallback(() => {
    if (!chartRef.current) return;
    
    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    // Use data from journal entries, or fallback to sample data if no entries exist
    let labels: string[] = [];
    let data: number[] = [];

    if (chartData && chartData.labels && Array.isArray(chartData.labels) && chartData.labels.length > 0 && 
        chartData.data && Array.isArray(chartData.data) && chartData.data.length > 0) {
      labels = chartData.labels;
      data = chartData.data;
    } else {
      // Fallback sample data
      if (timeRange === 'week') {
        labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        // Default to neutral (3.5) for all days with a slight highlight on today
        const today = new Date().getDay();
        data = Array(7).fill(3.5);
        // Set today's day to 3.5 (Neutral) to emphasize it
        if (today >= 0 && today < 7) {
          data[today] = 3.5; // Neutral
        }
      } else if (timeRange === 'month') {
        labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
        data = [3.5, 3.5, 3.5, 3.5]; // Default to neutral for all weeks
      } else {
        labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        data = [3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5]; // Default to neutral for all months
      }
    }

    // Get theme colors from CSS variables
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
    const foregroundColor = getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim();

    // Color settings based on darkMode prop
    const gridColor = darkMode ? 'rgba(100, 116, 139, 0.1)' : 'rgba(100, 116, 139, 0.2)';
    const textColor = darkMode ? '#94a3b8' : (foregroundColor || '#2a2f45');

    // Create the chart
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Mood',
            data: data,
            fill: false,
            borderColor: darkMode ? '#818cf8' : (primaryColor || 'rgb(99, 102, 241)'),
            tension: 0.4,
            pointBackgroundColor: function(context) {
              // Color points differently based on mood value
              const value = context.raw as number;
              if (value >= 5.5) return '#34D399'; // Joy - green
              if (value >= 4.5) return '#818CF8'; // Love - indigo
              if (value >= 3.75) return '#A855F7'; // Surprise - purple
              if (value >= 3.25 && value <= 3.75) return '#94A3B8'; // Neutral - gray
              if (value >= 2.5) return '#FBBF24'; // Fear - amber
              if (value >= 1.5) return '#F87171'; // Anger - red
              return '#60A5FA'; // Sadness - blue
            },
            pointBorderColor: darkMode ? '#0f172a' : '#ffffff',
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
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            titleColor: '#fff',
            bodyColor: '#fff',
            padding: 10,
            displayColors: false,
            callbacks: {
              label: function(context) {
                const value = context.raw as number;
                // Map to closest mood
                const moodLabels: Record<number, string> = {
                  1: "Sadness",
                  2: "Anger",
                  3: "Fear", 
                  3.5: "Neutral",
                  4: "Surprise", 
                  5: "Love",
                  6: "Joy",
                };
                
                // Find closest mood value
                const moodValues = Object.keys(moodLabels).map(Number);
                const closestValue = moodValues.reduce((prev, curr) => 
                  Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
                );
                
                // Return both the mood name and whether it's above or below neutral (when not neutral)
                const mood = moodLabels[closestValue];
                if (closestValue === 3.5) {
                  return `Mood: ${mood}`;
                } else if (closestValue > 3.5) {
                  return `Mood: ${mood} (Positive)`;
                } else {
                  return `Mood: ${mood} (Negative)`;
                }
              }
            }
          }
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
              // Custom ticks to ensure all emotions are displayed properly
              callback: function (value) {
                const moodLabels: Record<number, string> = {
                  1: "Sadness",
                  2: "Anger",
                  3: "Fear", 
                  3.5: "Neutral", // Special value for Neutral
                  4: "Surprise", 
                  5: "Love",
                  6: "Joy",
                };
                return moodLabels[value as number] || "";
              },
              color: textColor,
              // Force display specific tick values to show all emotions including Neutral
              stepSize: 1,
              // Ensure Neutral appears at 3.5
              // Include specific manual values to ensure Neutral shows up
              autoSkip: false,
              major: {
                enabled: true
              }
            }
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

  // Load chart data and refresh when timeRange changes or when component key changes
  useEffect(() => {
    
    // Set initial default data immediately to prevent the "Cannot read properties of undefined" error
    const defaultData = {
      labels: timeRange === 'week' 
        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        : timeRange === 'month'
        ? ["Week 1", "Week 2", "Week 3", "Week 4"]
        : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      data: Array(timeRange === 'week' ? 7 : timeRange === 'month' ? 4 : 12).fill(3.5)
    };
    
    // Set default data immediately to prevent the error while loading
    setChartData(defaultData);
    
    // Get chart data from journal entries
    const fetchData = async () => {
      try {
        const data = await getMoodChartData(timeRange);
        if (data && data.labels && data.data) {
          setChartData(data as ChartData);
        }
      } catch (error) {
        console.error('Error fetching mood chart data:', error);
        // Default data is already set, no need to set it again
      }
    };
    
    fetchData();
  }, [timeRange]);

  // Create and update chart when component mounts, when data changes, or when theme changes
  useEffect(() => {
    createChart();
  }, [createChart]);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  // Add theme change listener
  useEffect(() => {
    // Function to handle theme changes
    const handleThemeChange = () => {
      createChart();
    };

    // Listen for theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleThemeChange);

    // Also check for manual theme toggles
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class' && 
            (mutation.target as Element).classList.contains('dark-theme') || 
            (mutation.target as Element).classList.contains('light-theme')) {
          handleThemeChange();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
      observer.disconnect();
    };
  }, [createChart]);

  return (
    <div style={{ height: `${height}px`, position: 'relative' }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default MoodChart;