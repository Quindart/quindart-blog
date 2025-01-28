import AllBlogs from "@/components/pages/home/AllBlogs";
import RecentBlogHome from "@/components/pages/home/Section";

export default function Home() {
  return (
    <>
      <main className="mx-32 min-h-screen max-2xl:w-[1200px]">
        <RecentBlogHome />
        <AllBlogs />
      </main>
    </>
  );
}
