import { Post } from '../prisma/generated';
import { prisma } from '../prisma/prisma';

export class BlogService {
    async createPost(data: {
        title: string;
        slug: string;
        content: string;
        excerpt?: string;
        featuredImage?: string;
        status?: string;
        authorId: number;
        categoryId?: number;
        seo?: {
            metaTitle: string;
            metaDescription: string;
            keywords: string[];
            canonicalUrl?: string;
        };
    }): Promise<Post> {
        return prisma.post.create({
            data: {
                title: data.title,
                slug: data.slug,
                content: data.content,
                excerpt: data.excerpt,
                featuredImage: data.featuredImage,
                status: data.status || 'draft',
                authorId: data.authorId,
                categoryId: data.categoryId,
                seo: data.seo
                    ? {
                        create: {
                            metaTitle: data.seo.metaTitle,
                            metaDescription: data.seo.metaDescription,
                            keywords: data.seo.keywords,
                            canonicalUrl: data.seo.canonicalUrl,
                        },
                    }
                    : undefined,
            },
            include: {
                seo: true,
                author: true,
                category: true,
            },
        });
    }

    // Lấy tất cả bài viết
    async getAllPosts(): Promise<Post[]> {
        return prisma.post.findMany({
            include: {
                seo: true,
                author: true,
                category: true,
            },
        });
    }

    // Lấy bài viết theo slug
    async getPostBySlug(slug: string): Promise<Post | null> {
        return prisma.post.findUnique({
            where: { slug },
            include: {
                seo: true,
                author: true,
                category: true,
            },
        });
    }

    // Lấy bài viết theo id
    async getPostById(id: number): Promise<Post | null> {
        return prisma.post.findUnique({
            where: { id },
            include: {
                seo: true,
                author: true,
                category: true,
            },
        });
    }

    // Cập nhật bài viết
    async updatePost(
        id: number,
        data: {
            title?: string;
            slug?: string;
            content?: string;
            excerpt?: string;
            featuredImage?: string;
            status?: string;
            categoryId?: number;
            seo?: {
                metaTitle?: string;
                metaDescription?: string;
                keywords?: string[];
                canonicalUrl?: string;
            };
        }
    ): Promise<Post> {
        return prisma.post.update({
            where: { id },
            data: {
                title: data.title,
                slug: data.slug,
                content: data.content,
                excerpt: data.excerpt,
                featuredImage: data.featuredImage,
                status: data.status,
                categoryId: data.categoryId,
                seo: data.seo
                    ? {
                        update: {
                            metaTitle: data.seo.metaTitle,
                            metaDescription: data.seo.metaDescription,
                            keywords: data.seo.keywords,
                            canonicalUrl: data.seo.canonicalUrl,
                        },
                    }
                    : undefined,
            },
            include: {
                seo: true,
                author: true,
                category: true,
            },
        });
    }

    async deletePost(id: number): Promise<Post> {
        return prisma.post.delete({
            where: { id },
            include: {
                seo: true,
            },
        });
    }
}

export const blogService = new BlogService();