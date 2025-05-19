"use client";
import { APP_NAVIGATION } from "@/constants/ui";
import { useRouter } from "next/navigation";
import React from "react";
import useMobile from "@/hooks/ui/useMobile";

function MainBottomNavigation() {
  const { push } = useRouter();
  const { isMobile } = useMobile();
  if (!isMobile) {
    return <></>;
  }
  return (
    <div className="fixed bottom-0 left-1/2 z-50  w-full -translate-x-1/2 border-t border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700">
      <div className="w-full">
        {/* <div
          className="mx-auto my-2 grid max-w-xs grid-cols-3 gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-600"
          role="group"
        >
          <button
            type="button"
            className="rounded-lg px-5 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700"
          >
            New
          </button>
          <button
            type="button"
            className="rounded-lg bg-gray-900 px-5 py-1.5 text-xs font-medium text-white dark:bg-gray-300 dark:text-gray-900"
          >
            Popular
          </button>
          <button
            type="button"
            className="rounded-lg px-5 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700"
          >
            Following
          </button>
        </div> */}
      </div>
      <div className="mx-auto grid h-full max-w-lg grid-cols-5">
        <button
          onClick={() => {
            push(APP_NAVIGATION[0].url);
          }}
          data-tooltip-target="tooltip-home"
          type="button"
          className="group inline-flex flex-col items-center justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <svg
            className="mb-1 size-5 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
          </svg>
          <span className="sr-only">Home</span>
        </button>
        <div
          id="tooltip-home"
          role="tooltip"
          className="shadow-xs tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 transition-opacity duration-300 dark:bg-gray-700"
        >
          Home
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
        <button
          data-tooltip-target="tooltip-bookmark"
          onClick={() => {
            push(APP_NAVIGATION[2].url);
          }}
          type="button"
          className="group inline-flex flex-col items-center justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <svg
            className="mb-1 size-5 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 14 20"
          >
            <path d="M13 20a1 1 0 0 1-.64-.231L7 15.3l-5.36 4.469A1 1 0 0 1 0 19V2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v17a1 1 0 0 1-1 1Z" />
          </svg>
          <span className="sr-only">Project</span>
        </button>
        <div
          id="tooltip-bookmark"
          role="tooltip"
          className="shadow-xs tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 transition-opacity duration-300 dark:bg-gray-700"
        >
          Project
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
        <button
          onClick={() => {
            push(APP_NAVIGATION[1].url);
          }}
          data-tooltip-target="tooltip-post"
          type="button"
          className="group inline-flex flex-col items-center justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <svg
            className="mb-1 size-5 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 4.75A2.25 2.25 0 0 0 3.75 7v10.5A2.25 2.25 0 0 0 6 19.75h12A2.25 2.25 0 0 0 20.25 17.5V7A2.25 2.25 0 0 0 18 4.75H6zM8 9.5h8M8 13h5"
            />
          </svg>

          <span className="sr-only">Resume</span>
        </button>
        <div
          id="tooltip-post"
          role="tooltip"
          className="shadow-xs tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 transition-opacity duration-300 dark:bg-gray-700"
        >
          Resume
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
        <button
          onClick={() => {
            push(APP_NAVIGATION[3].url);
          }}
          data-tooltip-target="tooltip-search"
          type="button"
          className="group inline-flex flex-col items-center justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <svg
            className="mb-1 size-5 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 0c2.5 2 4 5.5 4 9s-1.5 7-4 9m0 0c-2.5-2-4-5.5-4-9s1.5-7 4-9m-6.93 6h13.86M4.07 15h15.86"
            />
          </svg>
          <span className="sr-only">Community</span>
        </button>
        <div
          id="tooltip-search"
          role="tooltip"
          className="shadow-xs tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 transition-opacity duration-300 dark:bg-gray-700"
        >
          Community
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
        <button
          data-tooltip-target="tooltip-settings"
          type="button"
          className="group inline-flex flex-col items-center justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <svg
            className="mb-1 size-5 text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15.25A3.25 3.25 0 1 0 12 8.75a3.25 3.25 0 0 0 0 6.5zm7.25-3a7.25 7.25 0 0 1-1.043 3.789l1.207 1.207a.75.75 0 0 1-1.06 1.06l-1.207-1.207A7.25 7.25 0 0 1 12 19.25a7.25 7.25 0 0 1-3.789-1.043l-1.207 1.207a.75.75 0 1 1-1.06-1.06l1.207-1.207A7.25 7.25 0 0 1 4.75 12a7.25 7.25 0 0 1 1.043-3.789L4.586 7.004a.75.75 0 1 1 1.06-1.06l1.207 1.207A7.25 7.25 0 0 1 12 4.75a7.25 7.25 0 0 1 3.789 1.043l1.207-1.207a.75.75 0 1 1 1.06 1.06l-1.207 1.207A7.25 7.25 0 0 1 19.25 12z"
            />
          </svg>

          <span className="sr-only">Settings</span>
        </button>
        <div
          id="tooltip-settings"
          role="tooltip"
          className="shadow-xs tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 transition-opacity duration-300 dark:bg-gray-700"
        >
          Settings
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
      </div>
    </div>
  );
}

export default MainBottomNavigation;
