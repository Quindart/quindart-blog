export interface LandingPage {
  id: number;
  slug: string;
  html: string;
  images: string[];
  status: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl?: string | null;
  lighthouseScore?: number | null;
  lighthouseReport?: any;
  createdAt: string;
  updatedAt: string;
}

export interface LandingPageHook {
  landingPages: LandingPage[];
  landingPage: LandingPage | null;
  loading: boolean;
  error: string | null;
  fetchLandingPages: () => Promise<void>;
  fetchLandingPageBySlug: (slug: string) => Promise<void>;
}
