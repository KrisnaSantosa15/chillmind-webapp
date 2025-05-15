"use client";

import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

interface MoodChartProps {
  timeRange?: 'week' | 'month' | 'year';
  height?: number;
  darkMode?: boolean;
}

const MoodChart: React.FC<MoodChartProps> = ({ 
  timeRange = 'week',
  height = 200,
  darkMode = false
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Create and update chart when component mounts or when theme changes
  const createChart = () => {
    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        // Sample data based on timeRange
        let labels: string[] = [];
        let data: number[] = [];

        if (timeRange === 'week') {
          labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
          data = [5, 4, 3, 5, 6, 4, 5]; // 1=Sadness, 2=Anger, 3=Fear, 4=Surprise, 5=Love, 6=Joy
        } else if (timeRange === 'month') {
          labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
          data = [4, 5, 6, 5];
        } else {
          labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          data = [3, 4, 5, 4, 6, 5, 6, 4, 3, 4, 2, 3];
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
                pointBackgroundColor: darkMode ? '#0f172a' : 'currentColor',
                pointBorderColor: darkMode ? '#818cf8' : (primaryColor || 'rgb(99, 102, 241)'),
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
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
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 6,
                grid: {
                  color: gridColor,
                },
                ticks: {
                  stepSize: 1,
                  color: textColor,
                  callback: function (value) {
                    const moods = [
                      "",
                      "Sadness",
                      "Anger",
                      "Fear",
                      "Surprise", 
                      "Love",
                      "Joy",
                    ];
                    return moods[value as number];
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
      }
    }
  };

  // React to timeRange changes
  useEffect(() => {
    createChart();
  }, [timeRange, darkMode]);

  useEffect(() => {
    // Cleanup function
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
  }, []);

  return (
    <div style={{ height: `${height}px`, position: 'relative' }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default MoodChart; 