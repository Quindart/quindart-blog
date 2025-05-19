"use client";
import CardBlog from "@/components/ui/CardBlog";
import { CardMe } from "@/components/ui/CardMe";
import { Button, Spinner } from "flowbite-react";
import React from "react";

function AllBlogsHome({ blogs, loading, error }: any) {
  return (
    <div className=" mt-10 flex flex-col-reverse flex-wrap gap-10 lg:flex-row lg:flex-nowrap xl:mt-20">
      <div className="h-auto w-full px-4  lg:w-[calc(60%-20px)] xl:w-[calc(70%-20px)]">
        <h1 className="mb-6 text-2xl font-bold text-main-blog lg:mb-10 lg:ml-0">
          All blogs
        </h1>
        <>
          {loading && (
            <div className="flex justify-center">
              <Spinner size="lg" />
            </div>
          )}
          {error && (
            <div className="text-center text-red-500">Error: {error}</div>
          )}
          {!loading && !error && blogs.length === 0 && (
            <div className="text-center">No blogs.</div>
          )}
          {!loading &&
            !error &&
            blogs.map((blog: any, key: number) => (
              <CardBlog
                key={key}
                title={blog.title}
                img={blog.featuredImage || "/assets/blogs/default.webp"}
                desc={blog.excerpt || "Không có mô tả"}
                slug={blog.slug}
              />
            ))}
        </>
      </div>
      <div className="w-full md:hidden lg:block lg:w-[calc(40%-20px)] xl:w-[calc(30%-20px)]">
        <CardMe />
      </div>
    </div>
  );
}

export default AllBlogsHome;
