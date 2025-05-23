"use client";

import React from 'react';

type Psychologist = {
  id: string;
  name: string;
  title: string;
  availability: string;
  association: string;
  image: string;
  online: boolean;
};

const AskPsychologist: React.FC = () => {
  const psychologists: Psychologist[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      title: 'Clinical Psychologist',
      availability: 'Available now for a 15-minute consultation about stress management techniques.',
      association: 'Stress Management',
      image: '/avatars/sarah.jpg',
      online: true
    },
    {
      id: '2',
      name: 'Dr. Mark Williams',
      title: 'Cognitive Behavioral Therapist',
      availability: 'Specializes in anxiety disorders. Next available tomorrow at 2pm.',
      association: 'Anxiety',
      image: '/avatars/mark.jpg',
      online: false
    }
  ];

  return (
    <div className="bg-background rounded-xl shadow-sm border border-muted overflow-hidden">
      <div className="p-4 border-b border-muted flex justify-between items-center">
        <h3 className="text-sm font-medium text-foreground">Ask a Psychologist</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">3 online</span>
      </div>
      
      <div className="divide-y divide-muted">
        {psychologists.map(psych => (
          <div key={psych.id} className="p-4">
            <div className="flex items-start">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-gray-500">
                  {/* Fallback avatar display with initials */}
                  {psych.name.split(' ').map(n => n[0]).join('')}
                </div>
                {psych.online && (
                  <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-1 ring-white"></span>
                )}
              </div>
              
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{psych.name}</h4>
                    <p className="text-xs text-muted-foreground">{psych.title}</p>
                  </div>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {psych.availability}
                </p>
                
                <div className="mt-3">
                  {psych.online ? (
                    <button className="w-full px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-md hover:bg-primary/90">
                      Book Session
                    </button>
                  ) : (
                    <button className="w-full px-3 py-1.5 border border-primary text-primary text-xs font-medium rounded-md hover:bg-primary/10">
                      Schedule Later
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-muted/30">
        <div className="mb-2">
          <h4 className="text-xs font-medium text-foreground">What can a psychologist help with?</h4>
          <ul className="mt-1 text-xs text-muted-foreground list-disc pl-4 space-y-1">
            <li>Understanding and managing complex emotions</li>
            <li>Developing effective coping strategies</li>
            <li>Addressing specific mental health concerns</li>
            <li>Learning techniques for stress reduction</li>
          </ul>
        </div>
        
        <button className="mt-2 w-full px-3 py-2 bg-secondary/10 text-secondary text-xs font-medium rounded-md hover:bg-secondary/20">
          View All Psychologists
        </button>
      </div>
    </div>
  );
};

export default AskPsychologist; 