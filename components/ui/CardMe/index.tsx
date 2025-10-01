"use client";
import { Card, Dropdown } from "flowbite-react";
import Image from "next/image";

export function CardMe() {
  return (
    <Card className="max-w-sm shadow-none">
      <div className="flex justify-end xl:px-4 xl:pt-4">
        <Dropdown inline label="">
          <Dropdown.Item>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Download CV
            </a>
          </Dropdown.Item>
        </Dropdown>
      </div>
      <div className="flex flex-col items-center pb-10">
        <Image
          alt="Bonnie image"
          height="96"
          src={"/assets/images/avt.webp"}
          width="96"
          priority
          className="mb-3 rounded-full"
        />
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
          Le Minh Quang
        </h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Software Developer
        </span>
        <div className="mt-4 flex flex-wrap space-x-3 lg:mt-6">
          <a
            href="/resume"
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          >
            See more
          </a>
          <a
            href="/resume"
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          >
            Contact me
          </a>
        </div>
      </div>
    </Card>
  );
}
