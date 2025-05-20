"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function ComingSoonPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toolName = searchParams.get('tool') || 'Interactive Tool';
  const returnPath = searchParams.get('return') || '/dashboard/resources';

  return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <div className="mb-6">
          <div className="w-20 h-20 bg-indigo-600 dark:bg-indigo-800 text-white rounded-full mx-auto flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Coming Soon</h1>
        <p className="text-lg text-gray-500 mb-6">
          {toolName} is currently under development and will be available soon.
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          We&apos;re working hard to bring you the best mental health tools. 
          Thank you for your patience.
        </p>
        
        <div className="inline-flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
          >
            Go Back
          </button>
          <Link 
            href={returnPath} 
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
          >
            Return to Resources
          </Link>
        </div>
      </div>
  );
}
