import Image from "next/image";
import React from "react";
import CardSectionHome from "@/components/ui/CardSectionHome";
const BLOGS_CARD = [
  {
    title: " Chào Xuân 2025 – Ngập Tràn Niềm Vui! 🌸",
    desc: "Khởi đầu năm mới đầy may mắn, sức khỏe dồi dào, và thành công vượt bậc! Cùng đón Tết 2025 với tinh thần phấn khởi và yêu thương lan tỏa."
  },
  {
    title: "Javascript ES5 - Array method()",
    desc:"Để hiểu rõ được Javascript thì ES5 và ES6 có thể gọi là core nền tảng để nắm vững JS."
  }
];
function SectionHomePage() {
  return (
    <div className="mt-4 flex gap-10 ">
      <div className="relative h-[550px] w-[1000px]">
        <div className="absolute bottom-0 left-10 z-10 mb-10 ">
          <h1 className="mb-4 w-[500px] text-2xl font-[800] text-gray-200">
            Roadmap của tôi để trở thành một Senior Software Engineer
          </h1>
          <a  
            href="#"
            className="inline-flex items-center rounded-lg bg-primary px-3 py-2 text-center text-sm font-medium text-white  focus:outline-none focus:ring-1 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 "
          >
            Đọc thêm
            <svg
              className="ms-2 size-3.5 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </div>
        <div>
          <Image
            className="absolute h-auto cursor-pointer rounded-lg opacity-80 shadow-lg  transition-all duration-300 hover:grayscale-0"
            src="/assets/main-home.jpg"
            width={1000}
            height={500}
            alt="quindart-main-home"
          />
        </div>
      </div>
      <div className="relative h-auto ">
        <h1 className="mb-10 text-2xl font-bold text-main-blog">Bài viết gần đây</h1>
          {BLOGS_CARD.map((blog, key)=>(
            <CardSectionHome title={blog.title} key={key} desc={blog.desc} />
          ))}
      </div>
    </div>
  );
}

export default SectionHomePage;
