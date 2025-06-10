"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EmotionInsight } from "@/lib/emotionInsights";
import { Emotion } from "@/lib/journalStorage";

interface EmotionInsightCardProps {
  insight: EmotionInsight;
  emotion: Emotion;
  onDismiss: () => void;
  onSave?: () => void;
}

export default function EmotionInsightCard({
  insight,
  emotion,
  onDismiss,
}: //   onSave
EmotionInsightCardProps) {
  const [currentTab, setCurrentTab] = useState<"learn" | "cope" | "reflect">(
    "learn"
  );
  const [isExiting, setIsExiting] = useState(false);
  const getEmotionColor = (emotion: Emotion) => {
    switch (emotion) {
      case "joy":
        return "bg-background border-blue-400";
      case "love":
        return "bg-background border-green-400";
      case "surprise":
        return "bg-background border-purple-400";
      case "fear":
        return "bg-background border-yellow-400";
      case "anger":
        return "bg-background border-red-400";
      case "sadness":
        return "bg-background border-indigo-400";
      default:
        return "bg-background border-gray-400";
    }
  };
  const getEmotionAccent = (emotion: Emotion) => {
    switch (emotion) {
      case "joy":
        return "bg-blue-600";
      case "love":
        return "bg-green-600";
      case "surprise":
        return "bg-purple-600";
      case "fear":
        return "bg-yellow-600";
      case "anger":
        return "bg-red-600";
      case "sadness":
        return "bg-indigo-600";
      default:
        return "bg-gray-600";
    }
  };
  const getMoodBackground = (emotion: Emotion) => {
    switch (emotion) {
      case "joy":
        return "bg-blue-300";
      case "love":
        return "bg-green-300";
      case "surprise":
        return "bg-purple-300";
      case "fear":
        return "bg-yellow-300";
      case "anger":
        return "bg-red-300";
      case "sadness":
        return "bg-indigo-300";
      case "neutral":
        return "bg-gray-300";
      default:
        return "bg-gray-300";
    }
  };
  const getMoodTextColor = (emotion: Emotion) => {
    switch (emotion) {
      case "joy":
        return "text-blue-600";
      case "love":
        return "text-green-600";
      case "surprise":
        return "text-purple-600";
      case "fear":
        return "text-yellow-600";
      case "anger":
        return "text-red-600";
      case "sadness":
        return "text-indigo-600";
      case "neutral":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const getMoodIcon = (emotion: Emotion) => {
    switch (emotion) {
      case "joy":
        return <i className="fas fa-smile text-lg"></i>;
      case "love":
        return <i className="fas fa-peace text-lg"></i>;
      case "surprise":
        return <i className="fas fa-surprise text-lg"></i>;
      case "fear":
        return <i className="fas fa-frown text-lg"></i>;
      case "anger":
        return <i className="fas fa-angry text-lg"></i>;
      case "sadness":
        return <i className="fas fa-sad-tear text-lg"></i>;
      case "neutral":
        return <i className="fas fa-meh text-lg"></i>;
      default:
        return <i className="fas fa-meh text-lg"></i>;
    }
  };

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

  //   const handleSave = () => {
  //     if (onSave) {
  //       onSave();
  //     }
  //     handleDismiss();
  //   };
  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`p-5 rounded-xl border-2 shadow-md dark:shadow-lg dark:shadow-black/10 w-full my-4 ${getEmotionColor(
            emotion
          )}`}
        >
          {" "}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full ${getMoodBackground(
                  emotion
                )} flex items-center justify-center mr-3 ${getMoodTextColor(
                  emotion
                )}`}
              >
                {getMoodIcon(emotion)}
              </div>
              <h3 className="text-xl text-foreground dark:text-foreground font-semibold">
                {insight.title}
              </h3>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex space-x-1 mb-4">
            <button
              onClick={() => setCurrentTab("learn")}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentTab === "learn"
                  ? `${getEmotionAccent(emotion)} text-white`
                  : `text-foreground hover:bg-opacity-80 ${getMoodBackground(
                      emotion
                    )} bg-opacity-0`
              }`}
            >
              <i className="fas fa-brain mr-2"></i>
              Learn
            </button>
            <button
              onClick={() => setCurrentTab("cope")}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentTab === "cope"
                  ? `${getEmotionAccent(emotion)} text-white`
                  : `text-foreground hover:bg-opacity-80 ${getMoodBackground(
                      emotion
                    )} bg-opacity-0`
              }`}
            >
              <i className="fas fa-hand-holding-heart mr-2"></i>
              Try This
            </button>
            <button
              onClick={() => setCurrentTab("reflect")}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentTab === "reflect"
                  ? `${getEmotionAccent(emotion)} text-white`
                  : `text-foreground hover:bg-opacity-80 ${getMoodBackground(
                      emotion
                    )} bg-opacity-0`
              }`}
            >
              <i className="fas fa-lightbulb mr-2"></i>
              Reflect
            </button>
          </div>
          <div className=" rounded-lg p-4 shadow-sm min-h-[120px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {currentTab === "learn" && (
                  <div>
                    {" "}
                    <p className="text-foreground">{insight.description}</p>
                    {insight.factoid && (
                      <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-md">
                        <i className="fas fa-info-circle mr-2"></i>
                        <span>{insight.factoid}</span>
                      </div>
                    )}
                  </div>
                )}{" "}
                {currentTab === "cope" && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-gray-500 dark:text-gray-400">
                      Try This Strategy
                    </h4>
                    <p className="text-foreground">{insight.copingStrategy}</p>
                  </div>
                )}{" "}
                {currentTab === "reflect" && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-gray-500 dark:text-gray-400">
                      For Reflection
                    </h4>
                    <p className="text-foreground italic">
                      {insight.reflectionPrompt}
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          {/* <div className="mt-4 flex justify-end">
            <button 
              onClick={handleSave}
              className="text-sm text-primary dark:text-primary hover:text-primary/80 dark:hover:text-primary/70 flex items-center transition-colors"
            >
              <i className="fas fa-bookmark mr-2"></i>
              Save this insight
            </button>
          </div> */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
