import React from "react";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

function CardSectionHome({
  title,
  excerpt,
  createdAt,
  slug,
}: {
  title: string;
  excerpt: string;
  createdAt: string;
  slug: string;
}) {
  return (
    <div className="mb-6 mt-4 max-w-md rounded-lg border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <a href={`/blog/${slug}`}>
        <h5 className="text-md mb-2 font-bold tracking-tight text-main-blog dark:text-white">
          {title}
        </h5>
      </a>

      <p className="mb-3 line-clamp-3 font-normal text-gray-600 dark:text-gray-400">
        {excerpt}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-300">
        <span>{formatDate(createdAt)}</span>
        <a
          href={`/blog/${slug}`}
          className="inline-flex items-center rounded-lg bg-primary px-3 py-2 text-center text-sm font-medium text-white hover:bg-primary focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-primary dark:focus:ring-blue-800"
        >
          See more
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
    </div>
  );
}

export default CardSectionHome;
