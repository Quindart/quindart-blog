import { landingPageService } from '@/lib/services/landing-page.service';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const landingPages = await landingPageService.getAllLandingPages();
    return NextResponse.json(landingPages, { status: 200 });
  } catch (error) {
    console.error('Error fetching landing pages:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
