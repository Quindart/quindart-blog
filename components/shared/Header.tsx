"use client";
import clsx from "clsx";
import React from "react";
import SearchInput from "../ui/SearchInput";
import { useRouter, usePathname } from "next/navigation";
import { APP_NAVIGATION } from "@/constants/ui";

function Header() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header
      className={
        "sticky top-0 z-[10000] hidden border-b-[0.5px] bg-white transition-all duration-300 ease-in-out sm:block"
      }
    >
      <div className="container mx-auto flex h-24  items-center justify-between gap-10 px-4 sm:px-8 lg:px-32">
        <a href="/" className="text-2xl font-[900] text-main-blog">
          Quindart
          <span className="ml-1 text-4xl text-red-500">.</span>
        </a>
        <nav className="flex gap-10">
          {APP_NAVIGATION.map((item: any) => (
            <button
              key={item.key}
              onClick={() => router.push(item.url)}
              className="text-base"
            >
              <span
                className={clsx(
                  "relative text-gray-600 hover:text-gray-800 group",
                  {
                    "text-gray-800 font-bold": pathname === item.url,
                  },
                )}
              >
                {item.name}
                <span
                  className={clsx(
                    "absolute left-0 bottom-[-2px] h-[1px] w-full bg-gray-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left",
                    {
                      "scale-x-100": pathname === item.url,
                    },
                  )}
                />
              </span>
            </button>
          ))}
        </nav>
        <div className="flex items-center">
          <SearchInput />
        </div>
      </div>
    </header>
  );
}

export default Header;
