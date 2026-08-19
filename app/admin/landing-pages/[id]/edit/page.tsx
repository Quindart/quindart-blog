'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { LandingPageForm } from '@/components/admin/LandingPageForm';
import { LighthouseModal } from '@/components/admin/LighthouseModal';
import { Button } from '@/components/ui/button';

export default function EditLandingPagePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [landingPage, setLandingPage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [lighthouseOpen, setLighthouseOpen] = useState(false);

  useEffect(() => {
    async function fetchPage() {
      try {
        const response = await fetch(`/api/admin/landing-pages/${id}`);
        if (!response.ok) throw new Error('Failed to load landing page');
        const data = await response.json();
        setLandingPage(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPage();
  }, [id]);

  const handleUpdate = async (data: any) => {
    try {
      const response = await fetch(`/api/admin/landing-pages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to update landing page');
      }

      const updated = await response.json();
      setLandingPage(updated);
      alert('Landing page updated!');
    } catch (err: any) {
      throw err;
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);

    try {
      const response = await fetch('/api/landing-pages/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: parseInt(id) }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to publish');
      }

      const data = await response.json();
      setLandingPage({ ...landingPage, status: 'published' });
      alert(`✓ Published at ${data.subdomain}`);
      router.push('/admin/landing-pages');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!landingPage) return <div className="p-6">Landing page not found</div>;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Landing Page</h1>
        {landingPage.status === 'draft' && landingPage.lighthouseScore >= 90 && (
          <Button onClick={handlePublish} disabled={isPublishing}>
            {isPublishing ? 'Publishing...' : 'Publish'}
          </Button>
        )}
      </div>

      <LandingPageForm initialData={landingPage} onSubmit={handleUpdate} />

      {landingPage && (
        <LighthouseModal
          open={lighthouseOpen}
          onOpenChange={setLighthouseOpen}
          landingPageId={landingPage.id}
          onScoreUpdate={(score) => setLandingPage({...landingPage, lighthouseScore: score})}
        />
      )}
    </div>
  );
}
