import { blogService } from '@/lib/services/blog.service';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const posts = await blogService.getAllPosts();
        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const body = await request.json();
        const post = await blogService.getPostBySlug(params.slug);
        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }
        const updatedPost = await blogService.updatePost(post.id, {
            title: body.title,
            slug: body.slug,
            content: body.content,
            excerpt: body.excerpt,
            featuredImage: body.featuredImage,
            status: body.status,
            categoryId: body.categoryId,
            seo: body.seo
                ? {
                    metaTitle: body.seo.metaTitle,
                    metaDescription: body.seo.metaDescription,
                    keywords: body.seo.keywords,
                    canonicalUrl: body.seo.canonicalUrl,
                }
                : undefined,
        });
        return NextResponse.json(updatedPost, { status: 200 });
    } catch (error) {
        console.error('Error updating post:', error);
        return NextResponse.json(
            { error: 'Failed to update post' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const post = await blogService.getPostBySlug(params.slug);
        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }
        await blogService.deletePost(post.id);
        return NextResponse.json(
            { message: 'Post deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json(
            { error: 'Failed to delete post' },
            { status: 500 }
        );
    }
}