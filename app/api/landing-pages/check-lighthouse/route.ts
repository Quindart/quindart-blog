import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { landingPageService } from '@/lib/services/landing-page.service';

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
    const landingPage = await landingPageService.getLandingPageById(
      parseInt(id)
    );

    // Return 404 if not found
    if (!landingPage) {
      return NextResponse.json(
        { error: 'Landing page not found' },
        { status: 404 }
      );
    }

    // Run Lighthouse audit (dynamic import to avoid ESM issues at build time)
    const { runLighthouseAudit } = await import(
      '@/lib/landing-pages/lighthouse'
    );
    const { score, report } = await runLighthouseAudit(landingPage.html);

    // Update in DB
    const updated = await landingPageService.updateLandingPage(parseInt(id), {
      lighthouseScore: score,
      lighthouseReport: report,
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
