import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { landingPageService } from '@/lib/services/landing-page.service';
import {
  validateSlug,
  validateHtml,
  validateImageUrls,
} from '@/lib/landing-pages/validate';

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
    const {
      slug,
      html,
      images,
      metaTitle,
      metaDescription,
      keywords,
      canonicalUrl,
    } = body;

    // Validate slug
    const slugValidation = validateSlug(slug);
    if (!slugValidation.valid) {
      return NextResponse.json(
        { error: slugValidation.error },
        { status: 400 }
      );
    }

    // Validate HTML
    const htmlValidation = validateHtml(html);
    if (!htmlValidation.valid) {
      return NextResponse.json(
        { error: htmlValidation.error },
        { status: 400 }
      );
    }

    // Validate image URLs
    const imageValidation = validateImageUrls(images || []);
    if (!imageValidation.valid) {
      return NextResponse.json(
        { error: imageValidation.error },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existingPage = await landingPageService.getLandingPageBySlug(slug);

    if (existingPage) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 409 }
      );
    }

    // Sanitize keywords
    const sanitizedKeywords = (keywords || [])
      .map((k: string) => k.trim().toLowerCase())
      .filter((k: string) => k.length > 0);

    // Create landing page
    const landingPage = await landingPageService.createLandingPage({
      slug,
      html,
      images: images || [],
      status: 'draft',
      metaTitle,
      metaDescription,
      keywords: sanitizedKeywords,
      canonicalUrl: canonicalUrl || null,
    });

    // Return created landing page
    return NextResponse.json(
      {
        id: landingPage.id,
        slug: landingPage.slug,
        status: landingPage.status,
        lighthouseScore: landingPage.lighthouseScore,
        createdAt: landingPage.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating landing page:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
