"use client";

import React, { useState } from "react";

type Message = {
  id: string;
  text: string;
  sender: "ai" | "user";
  timestamp: Date;
};

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI mental health assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
    {
      id: "2",
      text: "I notice you've been tracking your mood. Would you like to talk about anything specific?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (newMessage.trim() === "") return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setNewMessage("");

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponses = [
        "I understand how you feel. Would you like to explore that further?",
        "That's interesting. Can you tell me more about that?",
        "I'm here to support you. What would help you feel better right now?",
        "Have you tried any coping strategies for this situation before?",
        "It sounds like you're going through a lot. Let's break this down together.",
      ];

      const randomResponse =
        aiResponses[Math.floor(Math.random() * aiResponses.length)];

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <div className="bg-background rounded-xl shadow-sm border border-muted overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-muted flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
            <i className="fas fa-robot text-primary"></i>
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">
              AI Mental Health Assistant
            </h3>
            <span className="text-xs text-primary flex items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1"></span>
              Online
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto max-h-[300px]">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message p-3 ${
                message.sender === "user" ? "user-message" : "ai-message"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <span className="text-xs opacity-70 block mt-1">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-muted">
        <div className="mb-2">
          <h4 className="text-xs font-medium text-muted-foreground mb-1">
            Quick suggestions
          </h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setNewMessage("I&apos;m feeling anxious")}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full"
            >
              I&apos;m feeling anxious
            </button>
            <button
              onClick={() => setNewMessage("Sleep tips")}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full"
            >
              Sleep tips
            </button>
            <button
              onClick={() => setNewMessage("Mindfulness")}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full"
            >
              Mindfulness
            </button>
          </div>
        </div>

        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 text-sm border border-muted rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground placeholder:text-muted-foreground"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-r-md hover:bg-primary/90"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
