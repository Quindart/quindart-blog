"use client";
import CardBlog from "@/components/ui/CardBlog";
import { CardMe } from "@/components/ui/CardMe";
import { Button, Spinner } from "flowbite-react";
import React from "react";
import useBlog from "@/hooks/useBlog";

function AllBlogsHome() {
  const { blogs, loading, error } = useBlog();

  return (
    <div className="mt-20 flex gap-10">
      <div className="h-auto flex-1">
        <h1 className="mb-10 text-2xl font-bold text-main-blog">
          Danh sách bài viết
        </h1>
        {loading && (
          <div className="flex justify-center">
            <Spinner size="lg" />
          </div>
        )}
        {error && <div className="text-center text-red-500">Lỗi: {error}</div>}
        {!loading && !error && blogs.length === 0 && (
          <div className="text-center">Không có bài viết nào.</div>
        )}
        {!loading &&
          !error &&
          blogs.map((blog, key) => (
            <CardBlog
              key={key}
              title={blog.title}
              img={blog.featuredImage || "/assets/blogs/default.webp"}
              desc={blog.excerpt || "Không có mô tả"}
              slug={blog.slug}
            />
          ))}
      </div>
      <div className="w-96">
        <CardMe />
      </div>
    </div>
  );
}

export default AllBlogsHome;
