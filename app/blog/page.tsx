import type { Metadata } from "next";
import Writing from "@/components/containers/home/portfolio/Writing";

export const metadata: Metadata = { title: "Ghi chép từ công việc | Quindart" };

export default function BlogPage() {
  return (
    <main className="mx-auto min-h-screen max-w-screen-xl px-4 py-12">
      <h1 className="text-4xl font-bold text-main-blog">
        Ghi chép từ công việc
      </h1>
      <p className="mt-4 text-gray-600">
        Những điều mình học được khi xây dựng sản phẩm và giải quyết bài toán kỹ
        thuật.
      </p>
      <div className="mt-10 bg-background p-6 text-foreground">
        <Writing all />
      </div>
    </main>
  );
}
