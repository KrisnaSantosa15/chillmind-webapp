"use client";

import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

type Message = {
  id: string;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
  isTyping?: boolean;
  options?: string[];
};

type Suggestion = {
  id: string;
  text: string;
  icon: string;
  category: string;
};

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI mental health assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
    },
    {
      id: '2',
      text: "I can help with relaxation techniques, mood tracking insights, or answer questions about mental health. Feel free to ask me anything!",
      sender: 'ai',
      timestamp: new Date(Date.now() - 1000 * 60 * 4), // 4 minutes ago
      options: ["Tell me about anxiety", "I'm feeling stressed", "Need help sleeping"]
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const suggestedTopics: Suggestion[] = [
    {
      id: '1',
      text: "How can I manage exam stress?",
      icon: "book",
      category: "stress"
    },
    {
      id: '2',
      text: "Techniques for better sleep",
      icon: "moon",
      category: "sleep"
    },
    {
      id: '3',
      text: "Dealing with social anxiety",
      icon: "users",
      category: "anxiety"
    },
    {
      id: '4',
      text: "Mindfulness exercises",
      icon: "brain",
      category: "mindfulness"
    },
    {
      id: '5',
      text: "Signs of depression",
      icon: "cloud-rain",
      category: "depression"
    },
    {
      id: '6',
      text: "Setting healthy boundaries",
      icon: "shield-alt",
      category: "relationships"
    },
    {
      id: '7',
      text: "How to help a friend in crisis",
      icon: "hand-holding-heart",
      category: "support"
    }
  ];

  const quickReplies = [
    "I'm feeling anxious today",
    "How can I improve my mood?",
    "What are some relaxation techniques?",
    "Tell me about meditation"
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim() === '') return;
    
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setNewMessage('');
    setSelectedTopic('');
    
    // Show typing indicator
    setIsTyping(true);
    
    // Add typing indicator message
    const typingMsg: Message = {
      id: `typing-${Date.now()}`,
      text: '',
      sender: 'ai',
      timestamp: new Date(),
      isTyping: true
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, typingMsg]);
    }, 500);
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      // Remove typing indicator
      setIsTyping(false);
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      
      // Prepare AI response
      const aiResponses = [
        {
          text: "I understand how you feel. Would you like to explore some coping strategies for this situation?",
          options: ["Yes, please", "Tell me more", "Not right now"]
        },
        {
          text: "That's an interesting question. Based on research, maintaining a consistent sleep schedule can significantly improve your mental wellbeing.",
          options: ["How much sleep do I need?", "I have trouble falling asleep", "Tell me more"]
        },
        {
          text: "I'm here to support you. Have you tried mindfulness meditation? It can be very effective for reducing anxiety.",
          options: ["How do I start?", "Does it really work?", "I've tried it before"]
        },
        {
          text: "Many students experience similar feelings during exam periods. Let's discuss some techniques to manage academic stress.",
          options: ["Study techniques", "Relaxation methods", "Time management tips"]
        },
        {
          text: "It sounds like you're going through a challenging time. Remember that seeking help is a sign of strength, not weakness.",
          options: ["Where can I find help?", "I'm not sure if I need help", "Thank you"]
        }
      ];
      
      // Select a random response
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      // Create the AI message with the selected response
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse.text,
        sender: 'ai',
        timestamp: new Date(),
        options: randomResponse.options
      };
      
      // Add the AI message to the messages array
      setMessages(prev => [...prev, aiMsg]);
    }, 2000);
  };

  const selectTopic = (topic: string) => {
    setSelectedTopic(topic);
    setNewMessage(topic);
    
    // Focus the input field
    const inputElement = document.getElementById('message-input');
    if (inputElement) {
      inputElement.focus();
    }
  };

  const handleQuickReply = (text: string) => {
    setNewMessage(text);
    // Auto-submit the form
    setTimeout(() => {
      const formElement = document.getElementById('message-form');
      if (formElement) {
        formElement.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }, 100);
  };

  const handleOptionClick = (option: string) => {
    setNewMessage(option);
    // Auto-submit the form
    setTimeout(() => {
      const formElement = document.getElementById('message-form');
      if (formElement) {
        formElement.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }, 100);
  };
  
  return (
    <DashboardLayout>
      <div className="max-w-8xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar with categories and topics */}
          <div className="md:col-span-1">
            <div className="bg-background rounded-xl shadow-sm border border-muted p-4 md:sticky md:top-6">
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                <i className="fas fa-lightbulb text-primary mr-2"></i>
                Topics
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Anxiety</h4>
                  {suggestedTopics.filter(topic => topic.category === 'anxiety' || topic.category === 'stress').map(topic => (
                    <button
                      key={topic.id}
                      onClick={() => selectTopic(topic.text)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center ${
                        selectedTopic === topic.text 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <i className={`fas fa-${topic.icon} text-primary/70 mr-2 w-5`}></i>
                      <span className="truncate">{topic.text}</span>
                    </button>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Wellbeing</h4>
                  {suggestedTopics.filter(topic => topic.category === 'sleep' || topic.category === 'mindfulness').map(topic => (
                    <button
                      key={topic.id}
                      onClick={() => selectTopic(topic.text)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center ${
                        selectedTopic === topic.text 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <i className={`fas fa-${topic.icon} text-primary/70 mr-2 w-5`}></i>
                      <span className="truncate">{topic.text}</span>
                    </button>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Support</h4>
                  {suggestedTopics.filter(topic => topic.category === 'depression' || topic.category === 'support' || topic.category === 'relationships').map(topic => (
                    <button
                      key={topic.id}
                      onClick={() => selectTopic(topic.text)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center ${
                        selectedTopic === topic.text 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <i className={`fas fa-${topic.icon} text-primary/70 mr-2 w-5`}></i>
                      <span className="truncate">{topic.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Main chat area */}
          <div className="md:col-span-3">
            <div className="bg-background rounded-xl shadow-sm border border-muted overflow-hidden flex flex-col h-[75vh]">
              {/* Header */}
              <div className="p-4 border-b border-muted flex items-center justify-between bg-gradient-to-r from-primary/5 to-primary-light/5">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3 animate-pulse-slow">
                    <i className="fas fa-robot text-primary"></i>
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-foreground">ChillMind Assistant</h2>
                    <span className="text-xs text-primary flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1"></span>
                      <span className="mr-2">Available 24/7</span>
                      {isTyping && <span className="text-muted-foreground">typing...</span>}
                    </span>
                  </div>
                </div>
                <div>
                  <button className="p-2 text-muted-foreground hover:text-foreground rounded-full transition-colors">
                    <i className="fas fa-info-circle"></i>
                  </button>
                </div>
              </div>
              
              {/* Messages area */}
              <div className="flex-1 p-4 overflow-y-auto" ref={messageContainerRef}>
                <div className="space-y-4">
                  {messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-2xl p-4 ${
                          message.sender === 'user' 
                            ? 'bg-primary text-white rounded-br-none' 
                            : 'bg-muted text-foreground rounded-bl-none'
                        } ${message.isTyping ? 'animate-pulse' : ''}`}
                      >
                        {message.isTyping ? (
                          <div className="flex space-x-2 justify-center items-center h-6">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm">{message.text}</p>
                            <span className="text-xs opacity-70 block mt-1 text-right">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            
                            {/* Response options */}
                            {message.options && message.sender === 'ai' && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {message.options.map((option, index) => (
                                  <button
                                    key={index}
                                    onClick={() => handleOptionClick(option)}
                                    className="px-3 py-1.5 text-xs bg-background text-foreground rounded-full hover:bg-muted transition-colors"
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
                <div className="mb-3 overflow-x-auto pb-2 flex gap-2">
                  {quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(reply)}
                      className="flex-shrink-0 px-3 py-1.5 text-xs bg-background text-foreground rounded-full border border-muted hover:bg-muted/50 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
                
                {/* Message form */}
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
                <div className="mt-3 text-xs text-muted-foreground text-center">
                  <p>Your conversations are private and used only to provide personalized support.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 