/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import AllBlogsHome from "@/components/containers/home/AllBlogsHome";
import SectionHomePage from "@/components/containers/home/SectionHomePage";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useBlog from "@/hooks/useBlog";
import { useEffect } from "react";

export default function Page() {
  const { blogs, loading, recentblogs, fetchBlogs } = useBlog();
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
