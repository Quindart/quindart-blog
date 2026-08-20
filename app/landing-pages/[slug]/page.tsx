import { landingPageService } from '@/lib/services/landing-page.service';
import { Metadata } from 'next';

interface LandingPageProps {
  params: { slug: string };
}

async function getLandingPage(slug: string) {
  const landingPage = await landingPageService.getLandingPageBySlug(slug);

  if (!landingPage || landingPage.status !== 'published') {
    return null;
  }

  return landingPage;
}

export async function generateMetadata({
  params,
}: LandingPageProps): Promise<Metadata> {
  const landingPage = await getLandingPage(params.slug);

  if (!landingPage) {
    return {
      title: 'Not Found',
    };
  }

  return {
    title: landingPage.metaTitle,
    description: landingPage.metaDescription,
    keywords: landingPage.keywords,
    ...(landingPage.canonicalUrl && { canonical: landingPage.canonicalUrl }),
    openGraph: {
      title: landingPage.metaTitle,
      description: landingPage.metaDescription,
      type: 'website',
    },
  };
}

export default async function LandingPageView({
  params,
}: LandingPageProps) {
  const landingPage = await getLandingPage(params.slug);

  if (!landingPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
          <p className="text-gray-600">
            This landing page does not exist or has not been published yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen"
      dangerouslySetInnerHTML={{ __html: landingPage.html }}
    />
  );
}
