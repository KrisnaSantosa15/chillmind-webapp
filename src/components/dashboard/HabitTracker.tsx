"use client";

import React, { useState } from 'react';

type Habit = {
  id: string;
  name: string;
  icon: string;
  colorClass: string;
  days: boolean[];
};

const HabitTracker: React.FC = () => {
  // Sample data
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: 'Exercise',
      icon: 'walking',
      colorClass: 'bg-blue-100 text-blue-600',
      days: [true, true, false, false, false, false, false],
    },
    {
      id: '2',
      name: 'Meditation',
      icon: 'spa',
      colorClass: 'bg-purple-100 text-purple-600',
      days: [true, false, true, false, true, false, false],
    },
    {
      id: '3',
      name: 'Reading',
      icon: 'book',
      colorClass: 'bg-indigo-100 text-indigo-600',
      days: [false, true, true, true, false, false, false],
    },
  ]);

  const toggleHabitDay = (habitId: string, dayIndex: number) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const newDays = [...habit.days];
        newDays[dayIndex] = !newDays[dayIndex];
        return { ...habit, days: newDays };
      }
      return habit;
    }));
  };

  // Icons mapping
  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'walking':
        return <i className="fas fa-walking text-sm"></i>;
      case 'spa':
        return <i className="fas fa-spa text-sm"></i>;
      case 'book':
        return <i className="fas fa-book text-sm"></i>;
      default:
        return <i className="fas fa-check text-sm"></i>;
    }
  };

  return (
    <div className="bg-background rounded-xl shadow-sm p-6 border border-muted">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Habit Tracker
        </h2>
        <button className="text-sm font-medium text-primary hover:text-primary/80">
          Manage
        </button>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Track your daily wellness habits
      </p>

      <div className="mt-4 space-y-3">
        {habits.map((habit) => (
          <div key={habit.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full ${habit.colorClass} flex items-center justify-center mr-3`}>
                {getIcon(habit.icon)}
              </div>
              <span className="text-sm font-medium text-foreground">{habit.name}</span>
            </div>
            <div className="flex space-x-1">
              {habit.days.map((completed, index) => (
                <button
                  key={`${habit.id}-day-${index}`}
                  className={`habit-tracker-day w-6 h-6 rounded-full ${
                    completed 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                  } flex items-center justify-center text-xs`}
                  onClick={() => toggleHabitDay(habit.id, index)}
                >
                  {completed ? (
                    <i className="fas fa-check"></i>
                  ) : (
                    <i className="fas fa-times"></i>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full px-4 py-2 text-sm font-medium text-center text-primary border border-primary rounded-md hover:bg-primary/10">
        Add New Habit
      </button>
    </div>
  );
};

export default HabitTracker; 