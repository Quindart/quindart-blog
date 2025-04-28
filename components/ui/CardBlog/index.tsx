"use client";
import Image from "next/image";
import React from "react";
type CardBlogProps = {
  img: string;
  title: string;
  desc: string;
  slug: string;
};
function CardBlog({ img, title, desc, slug }: CardBlogProps) {
  return (
    <a
      href={`/blog/${slug}`}
      className="mb-4 flex flex-col items-center rounded-lg border border-gray-200 bg-white  hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700  md:flex-row"
    >
      <Image
        className="h-96 w-full rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
        src={`${img}`}
        width={200}
        height={200}
        alt="card-quindart-blog"
      />
      <div className="flex flex-col justify-between p-4 leading-normal">
        <h5 className="mb-2 text-2xl font-bold tracking-tight  dark:text-white">
          {title}
        </h5>
        <p className="mb-3 font-normal text-primary dark:text-gray-400">
          {desc}
        </p>
      </div>
    </a>
  );
}

export default CardBlog;
