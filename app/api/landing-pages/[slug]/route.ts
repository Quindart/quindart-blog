import { landingPageService } from '@/lib/services/landing-page.service';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const landingPage = await landingPageService.getLandingPageBySlug(
      params.slug
    );
    if (!landingPage) {
      return NextResponse.json(
        { error: 'Landing page not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(landingPage, { status: 200 });
  } catch (error) {
    console.error('Error fetching landing page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch landing page' },
      { status: 500 }
    );
  }
}
