import { db } from '@/lib/prisma';
import { Metadata } from 'next';

interface LandingPageProps {
  params: { slug: string };
}

async function getLandingPage(slug: string) {
  const landingPage = await db.landingPage.findUnique({
    where: { slug },
  });

  if (!landingPage || landingPage.status !== 'published') {
    return null;
  }

  return landingPage;
}

export async function generateMetadata({ params }: LandingPageProps): Promise<Metadata> {
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

export default async function LandingPageView({ params }: LandingPageProps) {
  const landingPage = await getLandingPage(params.slug);

  if (!landingPage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
          <p className="text-gray-600">This landing page does not exist or has not been published yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div
          className="prose prose-lg max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: landingPage.html }}
        />
      </div>
    </div>
  );
}
