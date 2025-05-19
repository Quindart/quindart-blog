/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import AllBlogs from "@/components/containers/home/AllBlogs";
import RecentBlogHome from "@/components/containers/home/Section";
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
      <div className="mx-auto min-h-screen max-2xl:mb-10 2xl:max-w-screen-xl">
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
      </div>
    </>
  );
}
