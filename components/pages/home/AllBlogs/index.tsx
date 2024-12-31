import CardBlog from "@/components/ui/CardBlog";
import { CardMe } from "@/components/ui/CardMe";
import { Button, Spinner } from "flowbite-react";
import React from "react";
const BLOGS_CARD = [
  {
    img: "/assets/blogs/mono-vs-micro_card.webp",
    title: "Từ Monolithic Đến Microservices",
    desc: "Microservices là kiến trúc hệ thống phân tán, tách biệt các service để phát triển và bảo trì dễ dàng hơn, vì mỗi service là một module độc lập. Tuy nhiên, nếu không hiểu rõ kiến trúc và cách tổ chức, ưu điểm này có thể thành nhược điểm, ảnh hưởng đến hiệu suất. Microservices yêu cầu kiến thức về mạng, DevOps, OOP, SOLID, và nhiều kỹ năng khác."
  },
  {
    img: "/assets/blogs/system-design.webp",
    title: "System Degisn Interview",
    desc: "System Design Interview là vòng phỏng vấn đánh giá khả năng thiết kế hệ thống phần mềm có quy mô lớn, được sử dụng bởi phần lớn các big tech ở thị trường Việt Nam. System Design Interviews có nhiều loại khác nhau, bao gồm OOP Design, Front-end Design, Product Design và Infrastructure Design."
  },
  {
    img: "/assets/blogs/wsl_card.webp",
    title: "Installing Linux by WSL step by step",
    desc: "Windows Subsystem for Linux (WSL) hữu ích khi bạn cần phát triển hoặc làm việc với các công cụ và môi trường phát triển Linux trên máy Windows mà không cần phải sử dụng máy ảo. Trong thực tế việc production project lên host thường được chạy ở môi trường Linux, trong khi giai đoạn development đa số sử dụng HĐH Window việc kiểm thử và testing trở nên khó khăn. Ngoài ra, bạn cũng rất khó chịu khi một lib nào đó có sẵn trên linux nhưng lại không hỗ trợ cho window. WSL ra đời nhằm tối giản việc phải cài đặt máy ảo phức tạp, mà bạn vẫn có thể thao tác với bash của linux thông qua CMD hay PowerShell."
  }
];

function AllBlogsHome() {
  return (
    <div className="mt-20 flex gap-10">
      <div className=" h-auto flex-1">
        <h1 className="mb-10 text-2xl font-bold text-main-blog">Danh sách bài viết</h1>
        {
          BLOGS_CARD?.map((blog,key)=>(
            <CardBlog key={key} title={blog.title} img={blog.img} desc={blog.desc}/>
          ))
        }
        <Button className="mx-auto" color="gray">
         Xem thêm...
        </Button>
      </div>
      <div className="w-96">
        <CardMe />
      </div>
    </div>
  );
}

export default AllBlogsHome;
