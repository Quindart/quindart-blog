export interface SEO {
    id: number;
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    canonicalUrl?: string | null;
}

export interface User {
    id: number;
    name?: string | null;
}

export interface Category {
    id: number;
    name: string;
}

export interface Post {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt?: string | null;
    featuredImage?: string | null;
    status: string;
    author: User;
    authorId: number;
    category?: Category | null;
    categoryId?: number | null;
    seo?: SEO | null;
    createdAt: string;
    updatedAt: string;
}

export interface BlogHook {
    blogs: Post[];
    recentblogs: Post[];
    blog: Post | null;
    loading: boolean;
    error: string | null;
    fetchBlogs: () => Promise<void>;
    fetchBlogBySlug: (slug: string) => Promise<void>;
}