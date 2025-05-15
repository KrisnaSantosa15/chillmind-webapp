"use client";

import React from 'react';

const MentalHealthStatus: React.FC = () => {
  // Sample data
  const mentalHealthMetrics = [
    { name: 'Stress Level', value: 60, status: 'Moderate', colorClass: 'bg-yellow-500' },
    { name: 'Anxiety', value: 30, status: 'Low', colorClass: 'bg-green-500' },
    { name: 'Depression Level', value: 70, status: 'Moderate', colorClass: 'bg-blue-500' },
  ];

  return (
    <div className="bg-background rounded-xl shadow-sm p-6 border border-muted">
      <h2 className="text-lg font-semibold text-foreground">
        Your Mental Health Status
      </h2>
      <div className="mt-4 space-y-4">
        {mentalHealthMetrics.map((metric) => (
          <div key={metric.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-foreground">{metric.name}</span>
              <span className="text-xs font-medium text-primary">{metric.status}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${metric.colorClass}`}
                style={{ width: `${metric.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 w-full px-4 py-2 text-sm font-medium text-center text-white bg-primary rounded-md hover:bg-primary/90">
        Take Assessment Again
      </button>
    </div>
  );
};

export default MentalHealthStatus; 