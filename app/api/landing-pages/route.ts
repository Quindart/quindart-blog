import { NextResponse } from 'next/server'
import { db } from '@/lib/prisma'

export async function GET() {
  try {
    const pages = await db.landingPage.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, slug: true, status: true, metaTitle: true, createdAt: true }
    })
    return NextResponse.json(pages)
  } catch (error) {
    console.error('Error fetching landing pages list:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
