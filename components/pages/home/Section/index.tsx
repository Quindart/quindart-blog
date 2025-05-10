import Image from "next/image";
import React from "react";
import CardSectionHome from "@/components/ui/CardSectionHome";

function SectionHomePage({ blogs }: any) {
  return (
    <div className="mt-4 flex gap-10 ">
      <div className="relative h-[550px] w-[1000px]">
        <div className="absolute bottom-0 left-10 z-10 mb-10 ">
          <h1 className="mb-4 w-[500px] text-2xl font-[800] text-gray-200">
            I&#39;m Le Minh Quang, a Software Engineer, and I&#39;m glad you stopped by!
          </h1>
          <a
            target="blank"
            href="https://discord.gg/rfNQujbZ"
            className="inline-flex items-center rounded-lg bg-primary px-3 py-2 text-center text-sm font-medium text-white  focus:outline-none focus:ring-1 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 "
          >
            Join my community here!
            <svg
              className="ms-2 size-3.5 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </div>
        <div>
          <Image
            className="absolute h-auto cursor-pointer rounded-lg opacity-80 shadow-lg  transition-all duration-300 hover:grayscale-0"
            src="/assets/images/main-home.jpg"
            width={1000}
            height={500}
            alt="quindart-main-home"
          />
        </div>
      </div>
      <div className="relative h-auto ">
        <h1 className="mb-6 text-2xl font-bold text-main-blog">Recent blogs</h1>
        {blogs.map((blog: any, key: number) => (
          <CardSectionHome
            title={blog.title}
            slug={blog.slug}
            createdAt={blog.createdAt}
            key={key}
            excerpt={blog.excerpt}
          />
        ))}
      </div>
    </div>
  );
}

export default SectionHomePage;
