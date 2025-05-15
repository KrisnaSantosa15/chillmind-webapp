"use client";

import React, { useState, createContext, useContext } from 'react';

// Context to manage which accordion item is currently open
type AccordionContextType = {
  openItemId: string | null;
  toggleItem: (id: string) => void;
};

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

type AccordionItemProps = {
  title: string;
  children: React.ReactNode;
  id: string;
};

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  id
}) => {
  const context = useContext(AccordionContext);
  
  if (!context) {
    throw new Error('AccordionItem must be used within an Accordion');
  }

  const { openItemId, toggleItem } = context;
  const isOpen = openItemId === id;

  return (
    <div className="border border-muted rounded-lg overflow-hidden bg-background mb-4 transition-all duration-300 hover:border-primary/30">
      <button
        className="w-full p-6 text-left flex justify-between items-center focus:outline-none focus:bg-muted/50 cursor-pointer"
        onClick={() => toggleItem(id)}
        aria-expanded={isOpen}
      >
        <h3 className="font-bold text-foreground">{title}</h3>
        <div className="w-6 h-6 flex items-center justify-center text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-300 ease-out ${isOpen ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </button>      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 max-h-0'
        }`}
        style={{ 
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          maxHeight: isOpen ? '80vh' : '0' // Limit to 80% of viewport height
        }}
      >
        <div className="p-6 pt-0 text-muted-foreground max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

type AccordionProps = {
  children: React.ReactNode;
  className?: string;
  defaultOpenId?: string | null;
};

export const Accordion: React.FC<AccordionProps> = ({ 
  children, 
  className = '',
  defaultOpenId = null
}) => {
  const [openItemId, setOpenItemId] = useState<string | null>(defaultOpenId);

  const toggleItem = (id: string) => {
    setOpenItemId(prevId => prevId === id ? null : id);
  };

  return (
    <AccordionContext.Provider value={{ openItemId, toggleItem }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
}; 