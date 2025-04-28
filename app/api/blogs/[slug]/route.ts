import { blogService } from '@/lib/services/blog.service';
import { NextResponse } from 'next/server';
export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const post = await blogService.getPostBySlug(params.slug);
        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }
        return NextResponse.json(post, { status: 200 });
    } catch (error) {
        console.error('Error fetching post:', error);
        return NextResponse.json(
            { error: 'Failed to fetch post' },
            { status: 500 }
        );
    }
}
