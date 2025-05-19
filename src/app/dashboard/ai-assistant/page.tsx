"use client";

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AIAssistantWidget from '@/components/dashboard/AIAssistantWidget';
import '@/styles/ai-markdown.css';

type Suggestion = {
  id: string;
  text: string;
  icon: string;
  category: string;
};

export default function AIAssistantPage() {
  const [selectedTopic, setSelectedTopic] = useState('');

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

  const selectTopic = (topic: string) => {
    setSelectedTopic(topic);
    // Find the message input element in the AIAssistantWidget and set its value
    const inputElement = document.getElementById('message-input') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = topic;
      inputElement.focus();
      // Dispatch an input event to update the component's state
      inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    }
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
            <AIAssistantWidget height="75vh" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
