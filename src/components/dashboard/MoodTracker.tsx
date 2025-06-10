"use client";

import React, { useState } from "react";

const MoodTracker: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
  };

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Daily Check-in
      </h3>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {/* Mood tracker */}
        <div className="col-span-2">
          <h4 className="text-xs font-medium text-muted-foreground mb-2">
            How are you feeling?
          </h4>
          <div className="grid grid-cols-5 gap-2">
            <button
              className={`mood-option flex flex-col items-center justify-center p-3 rounded-lg bg-red-50 text-red-600 border ${
                selectedMood === "angry"
                  ? "border-primary ring-2 ring-primary/50"
                  : "border-transparent"
              }`}
              onClick={() => handleMoodSelect("angry")}
            >
              <i className="fas fa-angry text-2xl"></i>
              <span className="mt-2 text-xs font-medium">Angry</span>
            </button>
            <button
              className={`mood-option flex flex-col items-center justify-center p-3 rounded-lg bg-yellow-50 text-yellow-600 border ${
                selectedMood === "sad"
                  ? "border-primary ring-2 ring-primary/50"
                  : "border-transparent"
              }`}
              onClick={() => handleMoodSelect("sad")}
            >
              <i className="fas fa-frown text-2xl"></i>
              <span className="mt-2 text-xs font-medium">Sad</span>
            </button>
            <button
              className={`mood-option flex flex-col items-center justify-center p-3 rounded-lg bg-gray-100 text-gray-600 border ${
                selectedMood === "neutral"
                  ? "border-primary ring-2 ring-primary/50"
                  : "border-transparent"
              }`}
              onClick={() => handleMoodSelect("neutral")}
            >
              <i className="fas fa-meh text-2xl"></i>
              <span className="mt-2 text-xs font-medium">Neutral</span>
            </button>
            <button
              className={`mood-option flex flex-col items-center justify-center p-3 rounded-lg bg-blue-50 text-blue-600 border ${
                selectedMood === "happy"
                  ? "border-primary ring-2 ring-primary/50"
                  : "border-transparent"
              }`}
              onClick={() => handleMoodSelect("happy")}
            >
              <i className="fas fa-smile text-2xl"></i>
              <span className="mt-2 text-xs font-medium">Happy</span>
            </button>
            <button
              className={`mood-option flex flex-col items-center justify-center p-3 rounded-lg bg-green-50 text-green-600 border ${
                selectedMood === "excited"
                  ? "border-primary ring-2 ring-primary/50"
                  : "border-transparent"
              }`}
              onClick={() => handleMoodSelect("excited")}
            >
              <i className="fas fa-laugh text-2xl"></i>
              <span className="mt-2 text-xs font-medium">Excited</span>
            </button>
          </div>
        </div>
      </div>
      <button className="mt-4 w-full px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90">
        Complete Check-in
      </button>
    </div>
  );
};

export default MoodTracker;
