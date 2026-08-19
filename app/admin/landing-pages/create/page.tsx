'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LandingPageForm } from '@/components/admin/LandingPageForm';

export default function CreateLandingPagePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/landing-pages/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create landing page');
      }

      router.push('/admin/landing-pages');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Create Landing Page</h1>
      <LandingPageForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
