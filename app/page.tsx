import type { Metadata } from "next";
import Portfolio from "@/components/containers/home/portfolio/Portfolio";

export const metadata: Metadata = {
  title: "Quang — Software Engineer | Quindart",
  description:
    "Mình là Quang, một Software Engineer. Khám phá các dự án, cách mình làm sản phẩm và những ghi chép từ công việc.",
};

export default function Page() {
  return <Portfolio />;
}
