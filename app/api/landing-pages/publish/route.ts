import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/prisma';

const DOMAIN = 'quindart.com';

export async function POST(request: NextRequest) {
  try {
    // Verify auth
    try {
      requireAuth();
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { id } = body;

    // Fetch landing page
    const landingPage = await db.landingPage.findUnique({
      where: { id: parseInt(id) },
    });

    // Return 404 if not found
    if (!landingPage) {
      return NextResponse.json(
        { error: 'Landing page not found' },
        { status: 404 }
      );
    }

    // Check Lighthouse score
    if (landingPage.lighthouseScore === null) {
      return NextResponse.json(
        { error: 'Lighthouse check not run. Please check Lighthouse score first.' },
        { status: 400 }
      );
    }

    if (landingPage.lighthouseScore < 90) {
      return NextResponse.json(
        { error: `Lighthouse score is ${landingPage.lighthouseScore}. Must be 90 or higher to publish.` },
        { status: 400 }
      );
    }

    // Update status to "published"
    const updated = await db.landingPage.update({
      where: { id: parseInt(id) },
      data: { status: 'published' },
    });

    // Return 200 with response
    return NextResponse.json(
      {
        id: updated.id,
        status: 'published',
        lighthouseScore: updated.lighthouseScore,
        subdomain: `${updated.slug}.${DOMAIN}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error publishing landing page:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
