import { useEffect, useState } from 'react';
interface SEO {
    id: number;
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    canonicalUrl?: string | null;
}

interface User {
    id: number;
    name?: string | null;
}

interface Category {
    id: number;
    name: string;
}

interface Post {
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

interface BlogHook {
    blogs: Post[];
    blog: Post | null;
    loading: boolean;
    error: string | null;
    fetchBlogs: () => Promise<void>;
    fetchBlogBySlug: (slug: string) => Promise<void>;
}

function useBlog(): BlogHook {
    const [blogs, setBlogs] = useState<Post[]>([]);
    const [blog, setBlog] = useState<Post | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBlogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/blogs');
            if (!response.ok) {
                throw new Error('Failed to fetch blogs');
            }
            const data: Post[] = await response.json();
            setBlogs(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const fetchBlogBySlug = async (slug: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/blogs/${slug}`);
            if (!response.ok) {
                throw new Error('Failed to fetch blog');
            }
            const data: Post = await response.json();
            setBlog(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchBlogs();
    }, []);

    return {
        blogs,
        blog,
        loading,
        error,
        fetchBlogs,
        fetchBlogBySlug,
    };
}

export default useBlog;