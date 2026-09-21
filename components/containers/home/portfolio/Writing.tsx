/* eslint-disable tailwindcss/no-custom-classname */
"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import useBlog from "@/hooks/useBlog";

export default function Writing({ all = false }: { all?: boolean }) {
  const { blogs, loading, error, fetchBlogs } = useBlog();
  const pageSize = all ? 6 : 3;
  const publishedPosts = blogs.filter((post) => post.status === "published");
  const pageCount = Math.max(1, Math.ceil(publishedPosts.length / pageSize));
  const [page, setPage] = useState(1);
  const posts = publishedPosts.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);
  if (loading)
    return (
      <p
        className="border-t border-gray-200 py-8 text-sm text-gray-500"
        role="status"
      >
        Đang mở sổ ghi chép…
      </p>
    );
  if (error)
    return (
      <div className="border-t border-gray-200 py-8 text-sm text-gray-500">
        <p>Chưa thể tải bài viết lúc này.</p>
        <button
          onClick={() => void fetchBlogs()}
          className="mt-3 inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-gray-900 transition hover:border-main-blog hover:text-main-blog"
        >
          Thử lại <ArrowUpRight size={16} />
        </button>
      </div>
    );
  if (!posts.length)
    return (
      <p className="border-t border-gray-200 py-8 text-sm text-gray-500">
        Những ghi chép mới đang được chuẩn bị. Hẹn gặp bạn ở bài viết tiếp theo.
      </p>
    );
  return (
    <div>
      {posts.map((post, index) => (
        <Link
          href={`/blog/${encodeURIComponent(post.slug)}`}
          key={post.id}
          className="group grid grid-cols-[2rem_5rem_1fr_1.25rem] items-center gap-3 border-t border-gray-200 py-6 sm:grid-cols-[3rem_7rem_1fr_1.5rem] sm:gap-5"
        >
          <span className="font-serif text-sm italic text-primary">
            {String((page - 1) * pageSize + index + 1).padStart(2, "0")}
          </span>
          <span className="relative h-14 w-20 overflow-hidden rounded-md bg-muted sm:h-16 sm:w-28">
            <Image
              src={post.featuredImage || "/assets/blogs/default.webp"}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 80px, 112px"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          </span>
          <div>
            <span className="text-[10px] uppercase tracking-[0.15em] text-primary">
              {post.category?.name || "Ghi chép kỹ thuật"}
            </span>
            <h3 className="mt-1 text-lg font-medium tracking-tight transition-colors group-hover:text-primary sm:text-xl">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="mt-2 line-clamp-2 text-xs leading-6 text-gray-500">
                {post.excerpt}
              </p>
            )}
          </div>
          <ArrowUpRight
            aria-hidden="true"
            className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
          />
        </Link>
      ))}
      {pageCount > 1 && (
        <nav
          className="flex items-center justify-between border-t border-gray-200 pt-5"
          aria-label="Phân trang bài viết"
        >
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            className="rounded-md border border-gray-300 px-3 py-2 text-xs transition hover:border-main-blog hover:text-main-blog disabled:cursor-not-allowed disabled:opacity-40"
          >
            Trước
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: pageCount }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  aria-label={`Đến trang ${pageNumber}`}
                  aria-current={page === pageNumber ? "page" : undefined}
                  className={`grid size-8 place-items-center rounded-md text-xs transition ${page === pageNumber ? "bg-primary text-primary-foreground" : "border border-gray-200 hover:border-main-blog hover:text-main-blog"}`}
                >
                  {pageNumber}
                </button>
              ),
            )}
          </div>
          <button
            type="button"
            onClick={() =>
              setPage((current) => Math.min(pageCount, current + 1))
            }
            disabled={page === pageCount}
            className="rounded-md border border-gray-300 px-3 py-2 text-xs transition hover:border-main-blog hover:text-main-blog disabled:cursor-not-allowed disabled:opacity-40"
          >
            Sau
          </button>
        </nav>
      )}
    </div>
  );
}
