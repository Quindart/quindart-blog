import Image from "next/image";
import React from "react";
type PropsType = {
  bgUrl?: string;
  title: string;
};
function HeaderBlogDetail({ bgUrl, title }: PropsType) {
  return (
    <div className="relative ">
      <div id="header__bg" className="relative  bg-slate-700">
        <Image
          src={`${bgUrl}`}
          width={1280}
          height={300}
          priority
          className="h-80 w-full object-cover opacity-45"
          alt="bg-blog-quindart"
        />
        <div
          className="absolute inset-x-0 top-44 z-20 px-2 xl:px-0 "
          id="blog__info"
        >
          <div className="mx-auto xl:w-[1280px]">
            <h1 className="text-md line-clamp-3 font-[900] text-slate-100 xl:w-[1000px] xl:text-4xl">
              {title}
            </h1>
            <p className="mt-4 italic text-slate-300 xl:mx-6">
              {" "}
              Author: Le Minh Quang, Date: August 23, 2022
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderBlogDetail;
