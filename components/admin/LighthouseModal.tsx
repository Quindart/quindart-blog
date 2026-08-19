'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface LighthouseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  landingPageId: number;
  onScoreUpdate: (score: number) => void;
}

export default function LighthouseModal({
  open,
  onOpenChange,
  landingPageId,
  onScoreUpdate,
}: LighthouseModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckScore = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/landing-pages/check-lighthouse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: landingPageId }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to check Lighthouse score');
      }

      const data = await response.json();
      onScoreUpdate(data.score);
      alert(`✓ Lighthouse Score: ${data.score}`);
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Check Lighthouse Score</h2>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        <div className="flex gap-4">
          <Button onClick={handleCheckScore} disabled={isLoading}>
            {isLoading ? 'Checking...' : 'Check Score'}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
