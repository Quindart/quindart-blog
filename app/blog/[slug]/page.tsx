"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, useScroll, useSpring } from "framer-motion";
import useBlog from "@/hooks/useBlog";
import HeaderBlogDetail from "./head";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function BlogDetail() {
  const params = useParams<{ slug: string }>();
  const { slug } = params;
  const { blog, loading, error, fetchBlogBySlug } = useBlog();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    if (slug) {
      fetchBlogBySlug(slug);
    }
  }, [slug]);

  return (
    <div className="relative h-full min-h-full">
      <motion.div
        className="fixed left-0 top-0 z-[99999] h-1 bg-blue-700"
        style={{
          scaleX,
          transformOrigin: "0%",
          width: "100%",
        }}
      />

      {loading ? (
        <div className="h-full min-h-full">
          <LoadingSpinner />
        </div>
      ) : (
        <div>
          <HeaderBlogDetail
            bgUrl={
              blog?.featuredImage ||
              "https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg"
            }
            title={`${blog?.title}`}
          />
          <section className="mx-auto w-[1280px]">
            <div id="blog__content" className="mt-20">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: `${blog?.content}` }}
              />
              {blog?.seo && (
                <div className="mt-10 border-t pt-5">
                  <h3 className="text-xl font-semibold">SEO Metadata</h3>
                  <p>
                    <strong>Meta Title:</strong> {blog?.seo.metaTitle}
                  </p>
                  <p>
                    <strong>Meta Description:</strong>{" "}
                    {blog?.seo.metaDescription}
                  </p>
                  <p>
                    <strong>Keywords:</strong> {blog?.seo.keywords.join(", ")}
                  </p>
                  {blog?.seo.canonicalUrl && (
                    <p>
                      <strong>Canonical URL:</strong> {blog?.seo.canonicalUrl}
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
