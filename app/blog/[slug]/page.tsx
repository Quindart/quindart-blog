"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import useBlog from "@/hooks/useBlog";
import HeaderBlogDetail from "./head";
import { Spinner } from "flowbite-react";

function BlogDetail() {
  const params = useParams<{ slug: string }>();
  const { slug } = params;
  const { blog, loading, error, fetchBlogBySlug } = useBlog();

  // Gọi API để lấy bài viết theo slug khi component mount hoặc slug thay đổi
  useEffect(() => {
    if (slug) {
      fetchBlogBySlug(slug);
    }
  }, []);

  // Xử lý trạng thái loading và lỗi
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <div className="mt-20 text-center text-red-500">Lỗi: {error}</div>;
  }

  if (!blog) {
    return <div className="mt-20 text-center">Bài viết không tồn tại</div>;
  }

  return (
    <>
      <HeaderBlogDetail
        bgUrl={
          blog.featuredImage ||
          "https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg"
        }
        title={blog.title}
      />
      <section className="mx-auto w-[1280px]">
        <div id="blog__content" className="mt-20">
          {/* Nội dung bài viết từ API */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
          {/* Thông tin SEO (nếu có) */}
          {blog.seo && (
            <div className="mt-10 border-t pt-5">
              <h3 className="text-xl font-semibold">SEO Metadata</h3>
              <p>
                <strong>Meta Title:</strong> {blog.seo.metaTitle}
              </p>
              <p>
                <strong>Meta Description:</strong> {blog.seo.metaDescription}
              </p>
              <p>
                <strong>Keywords:</strong> {blog.seo.keywords.join(", ")}
              </p>
              {blog.seo.canonicalUrl && (
                <p>
                  <strong>Canonical URL:</strong> {blog.seo.canonicalUrl}
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default BlogDetail;
