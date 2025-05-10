/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import AllBlogs from "@/components/pages/home/AllBlogs";
import RecentBlogHome from "@/components/pages/home/Section";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useBlog from "@/hooks/useBlog";
import { useEffect } from "react";

export default function Home() {
  const { blogs, loading, error, recentblogs, fetchBlogs } = useBlog();

  useEffect(() => {
    fetchBlogs();
  }, []);
  return (
    <>
      <main className="mx-32 mb-10 min-h-screen max-2xl:w-[1200px]">
        {loading ? (
          <div className="fixed inset-x-0">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <RecentBlogHome blogs={recentblogs} />
            <AllBlogs blogs={blogs} />
          </>
        )}
      </main>
    </>
  );
}
