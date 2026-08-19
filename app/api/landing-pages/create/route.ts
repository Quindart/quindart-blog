import { NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { sanitizeHtml } from '@/lib/landing-pages/sanitize'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const slug = (body.slug || '').toString().trim()
    const html = (body.html || '').toString()
    const images = Array.isArray(body.images) ? body.images : []
    const metaTitle = (body.metaTitle || '').toString()
    const metaDescription = (body.metaDescription || '').toString()
    const keywords = Array.isArray(body.keywords) ? body.keywords : []
    const canonicalUrl = body.canonicalUrl ? String(body.canonicalUrl) : null

    if (!slug || !html || !metaTitle || !metaDescription) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Basic slug safety: allow only URL-friendly characters
    if (!/^[a-z0-9\-]+$/.test(slug)) {
      return NextResponse.json({ error: 'Invalid slug. Use lowercase letters, numbers and hyphens only.' }, { status: 400 })
    }

    const sanitized = sanitizeHtml(html)

    const created = await db.landingPage.create({
      data: {
        slug,
        html: sanitized,
        images,
        metaTitle,
        metaDescription,
        keywords,
        canonicalUrl,
        status: 'draft'
      }
    })

    return NextResponse.json({ success: true, id: created.id }, { status: 201 })
  } catch (error) {
    console.error('Error creating landing page:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
