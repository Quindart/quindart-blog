import { BlogHook, Post } from '@/types/Blog';
import { useEffect, useState } from 'react';

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
        recentblogs: blogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 2),
        blog,
        loading,
        error,
        fetchBlogs,
        fetchBlogBySlug,
    };
}

export default useBlog;