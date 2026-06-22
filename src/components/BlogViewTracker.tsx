'use client';

import { useEffect } from 'react';

interface Props {
  slug: string;
  type: 'article' | 'reference';
}

export default function BlogViewTracker({ slug, type }: Props) {
  useEffect(() => {
    // Increment view count asynchronously on client mount
    fetch('/api/blog/view', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slug, type }),
    }).catch((err) => console.error('Failed to log page view:', err));
  }, [slug, type]);

  return null;
}
