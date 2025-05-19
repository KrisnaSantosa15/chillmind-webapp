import React, { Suspense } from 'react';
import ComingSoonContent from './ComingSoonContent';

// 👇 Tell Next.js this page is dynamic only
export const dynamic = 'force-dynamic';

export default function ComingSoonPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ComingSoonContent />
    </Suspense>
  );
}
