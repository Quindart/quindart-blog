/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import AllBlogsHome from "@/components/containers/home/allBlogs";
import SectionHomePage from "@/components/containers/home/section";
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
            <SectionHomePage blogs={recentblogs} />
            <AllBlogsHome blogs={blogs} />
          </>
        )}
      </div>
    </>
  );
}
