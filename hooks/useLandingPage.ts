import { LandingPage } from '@/types/LandingPage';
import { useEffect, useState } from 'react';

interface LandingPageHook {
  landingPages: LandingPage[];
  landingPage: LandingPage | null;
  loading: boolean;
  error: string | null;
  fetchLandingPages: () => Promise<void>;
  fetchLandingPageBySlug: (slug: string) => Promise<void>;
}

function useLandingPage(): LandingPageHook {
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [landingPage, setLandingPage] = useState<LandingPage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLandingPages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/landing-pages');
      if (!response.ok) {
        throw new Error('Failed to fetch landing pages');
      }
      const data: LandingPage[] = await response.json();
      setLandingPages(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchLandingPageBySlug = async (slug: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/landing-pages/${slug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch landing page');
      }
      const data: LandingPage = await response.json();
      setLandingPage(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLandingPages();
  }, []);

  return {
    landingPages,
    landingPage,
    loading,
    error,
    fetchLandingPages,
    fetchLandingPageBySlug,
  };
}

export default useLandingPage;
