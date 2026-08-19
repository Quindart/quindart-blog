import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/prisma';
import { runLighthouseAudit } from '@/lib/landing-pages/lighthouse';

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

    // Run Lighthouse audit
    const { score, report } = await runLighthouseAudit(landingPage.html);

    // Update in DB
    const updated = await db.landingPage.update({
      where: { id: parseInt(id) },
      data: {
        lighthouseScore: score,
        lighthouseReport: report,
      },
    });

    // Return 200 with response
    return NextResponse.json(
      {
        id: updated.id,
        lighthouseScore: updated.lighthouseScore,
        lighthouseReport: updated.lighthouseReport,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking lighthouse score:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
