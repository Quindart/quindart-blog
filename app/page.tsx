import AllBlogs from "@/components/pages/home/AllBlogs";
import RecentBlogHome from "@/components/pages/home/Section";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-32 min-h-screen max-2xl:w-[1200px]">
        <RecentBlogHome />
        <AllBlogs />
      </main>
      <Footer />
    </>
  );
}
