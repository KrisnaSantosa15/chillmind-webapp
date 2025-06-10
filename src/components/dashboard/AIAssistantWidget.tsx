"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

type Message = {
  id: string;
  text: string;
  sender: "ai" | "user";
  timestamp: Date;
  isTyping?: boolean;
  options?: string[];
};

type AIAssistantWidgetProps = {
  height?: string;
  compactMode?: boolean;
  initialMessage?: string;
};

async function fetchGeminiResponseStream(
  prompt: string,
  onChunk: (chunk: string) => void
): Promise<void> {
  try {
    const response = await fetch("/api/gemini/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });
    if (!response.ok) {
      try {
        const errorData = await response.json();
        onChunk(
          `[Error: ${errorData.error || "Failed to connect to AI service"}]`
        );
      } catch {
        const errorText = await response.text();
        onChunk(
          errorText.startsWith("[Error")
            ? errorText
            : `[Error: Failed to connect to AI service]`
        );
      }
      return;
    }

    if (!response.body) {
      onChunk("[Error: No response body from AI service]");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunkText = decoder.decode(value, { stream: true });
      onChunk(chunkText);
    }
  } catch (error) {
    console.error("Error fetching Gemini response:", error);
    onChunk(
      "[Error: Unable to connect to AI service. Please try again later.]"
    );
  }
}

const AIAssistantWidget: React.FC<AIAssistantWidgetProps> = ({
  height = "400px",
  compactMode = false,
  initialMessage = "",
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI mental health assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: "2",
      text: "I can help with relaxation techniques, mood tracking insights, or answer questions about mental health.",
      sender: "ai",
      timestamp: new Date(Date.now() - 1000 * 60 * 4),
      options: [
        "Tell me about anxiety",
        "I'm feeling stressed",
        "Need help sleeping",
      ],
    },
  ]);
  const [newMessage, setNewMessage] = useState(initialMessage);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (initialMessage && initialMessage !== newMessage) {
      setNewMessage(initialMessage);

      const timer = setTimeout(() => {
        const formElement = document.getElementById("message-form");
        if (formElement) {
          formElement.dispatchEvent(
            new Event("submit", { cancelable: true, bubbles: true })
          );
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [initialMessage, newMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickReplies = compactMode
    ? ["I'm feeling anxious", "Need help sleeping", "Relaxation techniques"]
    : [
        "I'm feeling anxious today",
        "How can I improve my mood?",
        "What are some relaxation techniques?",
        "Tell me about meditation",
      ];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setNewMessage("");
    setIsTyping(true);

    const typingMsg: Message = {
      id: `typing-${Date.now()}`,
      text: "",
      sender: "ai",
      timestamp: new Date(),
      isTyping: true,
    };

    setMessages((prev) => [...prev, typingMsg]);

    try {
      let aiText = "";
      await fetchGeminiResponseStream(userMsg.text, (chunk) => {
        aiText += chunk;
        setMessages((prev) => {
          const idx = prev.findIndex((m) => m.isTyping);
          if (idx === -1) return prev;
          const updated = [...prev];
          updated[idx] = { ...updated[idx], text: aiText };
          return updated;
        });
      });

      setIsTyping(false);
      setMessages((prev) => {
        const filtered = prev.filter((msg) => !msg.isTyping);
        return [
          ...filtered,
          {
            id: (Date.now() + 1).toString(),
            text: aiText || "[No response from Gemini API]",
            sender: "ai",
            timestamp: new Date(),
          },
        ];
      });
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setMessages((prev) => prev.filter((msg) => !msg.isTyping));
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          text: "[Error: Failed to get response from Gemini API]",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleQuickReply = (text: string) => {
    setNewMessage(text);
    setTimeout(() => {
      const formElement = document.getElementById("message-form");
      if (formElement) {
        formElement.dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true })
        );
      }
    }, 100);
  };

  const handleOptionClick = (option: string) => {
    setNewMessage(option);
    setTimeout(() => {
      const formElement = document.getElementById("message-form");
      if (formElement) {
        formElement.dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true })
        );
      }
    }, 100);
  };

  return (
    <div
      className="bg-background rounded-xl shadow-sm border border-muted overflow-hidden flex flex-col"
      style={{ height }}
    >
      {/* Header */}
      <div className="p-4 border-b border-muted flex items-center justify-between bg-gradient-to-r from-primary/5 to-primary-light/5">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 animate-pulse-slow">
            <i className="fas fa-robot text-primary"></i>
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">
              ChillMind Assistant
            </h3>
            <span className="text-xs text-primary flex items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1"></span>
              {isTyping ? (
                <span className="mr-1">
                  typing<span className="animate-pulse">...</span>
                </span>
              ) : (
                <span>Available 24/7</span>
              )}
            </span>
          </div>
        </div>

        <Link
          href="/dashboard/ai-assistant"
          className="text-xs text-primary hover:underline"
        >
          Full View
        </Link>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto" ref={messageContainerRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 ${
                  message.sender === "user"
                    ? "bg-primary text-white rounded-br-none"
                    : "bg-muted text-foreground rounded-bl-none"
                } ${message.isTyping ? "animate-pulse" : ""}`}
              >
                {message.isTyping ? (
                  <>
                    <p className="text-sm whitespace-pre-line">
                      {message.text}
                    </p>
                    <div className="flex space-x-2 justify-center items-center h-6 mt-1">
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="prose prose-neutral max-w-none text-sm ai-markdown">
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    </div>
                    {!compactMode && (
                      <span className="text-xs opacity-70 block mt-1 text-right">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}

                    {/* Response options */}
                    {message.options && message.sender === "ai" && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleOptionClick(option)}
                            className="px-3 py-1 text-xs bg-background text-foreground rounded-full hover:bg-muted transition-colors"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-muted bg-gradient-to-r from-background to-muted/20">
        {/* Quick replies */}
        {!compactMode && (
          <div className="mb-3 overflow-x-auto pb-2 flex gap-2">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => handleQuickReply(reply)}
                className="flex-shrink-0 px-3 py-1 text-xs bg-background text-foreground rounded-full border border-muted hover:bg-muted/50 transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* Message form */}
        <form id="message-form" onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            id="message-input"
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

        {!compactMode && (
          <div className="mt-3 text-xs text-muted-foreground text-center">
            <p>
              Your conversations are private and used only to provide
              personalized support.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistantWidget;
