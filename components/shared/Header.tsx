"use client";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import SearchInput from "../ui/SearchInput";

const APP_HEADER = [
  {
    name: "Bài viết",
    key: "home",
    url: "/",
  },
  {
    name: "Resume",
    key: "lifestyle",
    url: "/life-style",
  },
  {
    name: "Dự án",
    key: "culture",
    url: "/culture",
  },
  {
    name: "Liên hệ",
    key: "contact",
    url: "/contact",
  },
];

function Header() {
  const [isScroll, setScroll] = useState(false);

  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScroll(true);
      } else setScroll(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup event listener
  }, []);

  return (
    <>
    {
      !isScroll && 
      <div className="mx-32 flex h-24 justify-between gap-10 align-middle max-2xl:w-[1200px]">
      <h1 className="my-auto text-2xl font-[900] text-main-blog">
        Quindart
        <span className="ml-1 text-4xl text-red-500">.</span>
      </h1>
      <div className="mx-auto flex gap-10">
        {APP_HEADER.map((item, key) => (
          <button key={key}>
            <span
              className={clsx(
                "relative text-gray-600 hover:text-gray-800 group",
                {
                  "text-gray-800 font-bold": currentPath === item.url,
                }
              )}
            >
              {item.name}
              <span
                className={clsx(
                  "absolute left-0 bottom-[-2px] h-[1px] w-full bg-gray-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left",
                  {
                    "scale-x-100": currentPath === item.url,
                  }
                )}
              ></span>
            </span>
          </button>
        ))}
      </div>
      <div className="my-auto text-primary">
        <SearchInput />
      </div>
    </div>
    }
    <header
    className={clsx(
      "inset-x-0 border-b-[0.5px] top-0 bg-white z-50 transition-transform duration-500 ease-in-out",
      {
        "fixed opacity-100 translate-y-0 shadow-md": isScroll, 
        "absolute opacity-100 translate-y-[-100%]": !isScroll, 
      }
    )}
  >
      <div className="mx-32 flex h-24 justify-between gap-10 align-middle max-2xl:w-[1200px]">
        <h1 className="my-auto text-2xl font-[900] text-main-blog">
          Quindart
          <span className="ml-1 text-4xl text-red-500">.</span>
        </h1>
        <div className="mx-auto flex gap-10">
          {APP_HEADER.map((item, key) => (
            <button key={key}>
              <span
                className={clsx(
                  "relative text-gray-600 hover:text-gray-800 group",
                  {
                    "text-gray-800 font-bold": currentPath === item.url,
                  }
                )}
              >
                {item.name}
                <span
                  className={clsx(
                    "absolute left-0 bottom-[-2px] h-[1px] w-full bg-gray-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left",
                    {
                      "scale-x-100": currentPath === item.url,
                    }
                  )}
                ></span>
              </span>
            </button>
          ))}
        </div>

        <div className="my-auto text-primary">
          <SearchInput />
        </div>
      </div>
    </header>
    </>
  );
}

export default Header;
