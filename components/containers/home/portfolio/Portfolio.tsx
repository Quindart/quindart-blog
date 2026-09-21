/* eslint-disable tailwindcss/no-custom-classname */
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import Writing from "./Writing";

const linkedin = "https://www.linkedin.com/in/minh-quang-le-76410730a/";
const eyebrow =
  "text-[10px] font-medium uppercase tracking-[0.18em] text-gray-500";
const linkStyle =
  "inline-flex items-center gap-2 border-b border-gray-300 pb-1 text-xs transition-all hover:gap-3 hover:text-primary";
const projects = [
  {
    number: "01",
    title: "Một nơi cho tri thức.",
    name: "Quindart Blog",
    category: "SẢN PHẨM CÁ NHÂN · WEB",
    image: "/assets/projects/quindartBlog.webp",
    alt: "Giao diện nền tảng blog Quindart",
    description:
      "Không gian lưu lại kiến thức, chia sẻ góc nhìn kỹ thuật và kết nối những người cùng làm sản phẩm.",
    contribution:
      "Xây dựng giao diện đọc bài, quản lý nội dung và dữ liệu trong cùng một ứng dụng.",
    stack: "Next.js / TypeScript / Prisma",
    tone: "bg-[#e7d6c9]",
  },
  {
    number: "02",
    title: "Kết nối một hành trình học tập.",
    name: "IUH · Quản lý khóa luận",
    category: "GIÁO DỤC · WEB APPLICATION",
    image: "/assets/projects/education-iuh.webp",
    alt: "Giao diện hệ thống quản lý khóa luận IUH",
    description:
      "Đưa đề tài, tài liệu và tiến độ về một nơi để sinh viên và giảng viên phối hợp thuận tiện hơn.",
    contribution:
      "Phát triển quản lý nhóm, tài liệu, tiến độ và phân quyền cho từng vai trò.",
    stack: "React / React Query / Node.js",
    tone: "bg-[#dce0d5]",
  },
];

export default function Portfolio() {
  return (
    <div data-portfolio className="bg-background text-foreground">
      <a
        href="#main-content"
        className="fixed left-3 top-3 z-50 -translate-y-32 bg-gray-900 px-5 py-3 text-sm text-white transition-transform focus:translate-y-0"
      >
        Đến nội dung chính
      </a>
      <main id="main-content">
        <section
          className="mx-auto max-w-[1320px] px-5 py-8 sm:px-8 lg:px-16 lg:pt-10"
          aria-labelledby="hero-title"
        >
          <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-5">
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-500">
              <span className="mr-2 inline-block size-1.5 rounded-full bg-primary" />
              Không ngừng học hỏi & xây dựng
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-gray-500 sm:inline">
              Portfolio — Quang
            </span>
          </div>
          <div className="grid items-center gap-10 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20 lg:py-16">
            <div>
              <p className="mb-5 text-sm">Xin chào, mình là Quang </p>
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="portfolio-bubble portfolio-bubble-one"
                />
                <span
                  aria-hidden="true"
                  className="portfolio-bubble portfolio-bubble-two"
                />
                <span
                  aria-hidden="true"
                  className="portfolio-bubble portfolio-bubble-three"
                />
                <h1
                  id="hero-title"
                  className="relative z-10 text-[clamp(2.75rem,6vw,5rem)] font-medium leading-[1.06] tracking-[-0.07em]"
                >
                  <span className="portfolio-text-slide portfolio-text-slide-1">
                    Chỉn chu trong
                  </span>
                  <span className="portfolio-text-slide portfolio-text-slide-2">
                    giao diện.
                  </span>
                  <em className="portfolio-text-slide portfolio-text-slide-3 font-serif font-normal text-primary">
                    Vững vàng
                  </em>
                  <span className="portfolio-text-slide portfolio-text-slide-4">
                    trong kỹ thuật<span className="text-primary">.</span>
                  </span>
                </h1>
              </div>
              <p className="mt-7 max-w-md text-sm leading-7 text-gray-500">
                Mình là Quang, một{" "}
                <strong className="font-medium text-gray-900">
                  Software Engineer.
                </strong>
                <br />
                Mình xây dựng trải nghiệm web dễ sử dụng và nền tảng code dễ
                phát triển lâu dài.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-5">
                <a
                  href="#du-an"
                  className="group inline-flex items-center gap-5 rounded-3xl bg-primary px-5 py-3.5 text-xs text-primary-foreground transition duration-300 hover:-translate-y-1 hover:bg-main-blog"
                >
                  Khám phá dự án{" "}
                  <ArrowDown
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-y-1"
                  />
                </a>
                <a href="#lien-he" className={linkStyle}>
                  Trao đổi cùng mình <ArrowUpRight size={17} />
                </a>
              </div>
            </div>
            <div className="mx-auto w-full max-w-md">
              <div className="portfolio-float relative aspect-[4/5] overflow-hidden bg-gray-100">
                <Image
                  src="/assets/images/avt.webp"
                  alt="Quang tập trung làm việc trong một hoạt động học tập"
                  fill
                  priority
                  sizes="(max-width: 700px) 85vw, 38vw"
                  className="object-cover grayscale sepia-[0.12] transition duration-700 hover:scale-105 hover:grayscale-0"
                />
                <span className="absolute bottom-4 left-5 text-[8px] tracking-[0.18em] text-white">
                  FIG. 01 — LUÔN LÀ MỘT NGƯỜI HỌC
                </span>
              </div>
              <div className="mt-6 flex items-center justify-between px-2 text-xs text-gray-500">
                <span>
                  Một chút tò mò.
                  <br />
                  Rất nhiều sự tận tâm.
                </span>
                <span className="font-serif text-3xl italic text-gray-900">
                  Quang.
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-5 text-[10px] text-gray-500">
            <span>Ý tưởng tốt xứng đáng với trải nghiệm tốt.</span>
            <a
              href="#du-an"
              className="group inline-flex items-center gap-2 uppercase tracking-widest"
            >
              Cuộn để khám phá{" "}
              <ArrowDown
                size={14}
                className="transition-transform duration-300 group-hover:translate-y-1"
              />
            </a>
          </div>
        </section>
        <div className="border-y border-gray-200 bg-muted p-5 text-center sm:px-8">
          <span className="block text-[9px] uppercase tracking-[0.15em] text-gray-500 sm:mr-10 sm:inline">
            Từ ý tưởng đến sản phẩm
          </span>
          <span className="text-sm font-medium">
            React <span className="mx-2 text-primary">·</span> Next.js{" "}
            <span className="mx-2 text-primary">·</span> TypeScript{" "}
            <span className="mx-2 text-primary">·</span> Node.js{" "}
            <span className="mx-2 text-primary">·</span> React Native
          </span>
        </div>
        <section
          id="du-an"
          className="mx-auto max-w-[1320px] border-b border-gray-200 px-5 py-16 sm:px-8 lg:px-16 lg:py-24"
          aria-labelledby="work-title"
        >
          <Reveal>
            <div className="mb-10 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className={eyebrow}>01 / Dự án chọn lọc</p>
                <h2
                  id="work-title"
                  className="mt-4 text-4xl font-medium -tracking-wider sm:text-5xl"
                >
                  Ý tưởng thành{" "}
                  <em className="font-serif font-normal text-primary">
                    hiện thực.
                  </em>
                </h2>
              </div>
              <Link href="/project" className={linkStyle}>
                Tất cả dự án <ArrowUpRight size={17} />
              </Link>
            </div>
          </Reveal>
          <div className="grid gap-10 md:grid-cols-2">
            {projects.map((project) => (
              <Reveal key={project.number}>
                <article>
                  <Link
                    href="/project"
                    className={`group relative block aspect-[1.35] overflow-hidden p-7 ${project.tone}`}
                    aria-label={`Khám phá ${project.name} trong danh sách dự án`}
                  >
                    <span className="font-serif absolute left-5 top-4 text-sm italic text-gray-500">
                      /{project.number}
                    </span>
                    <div className="relative mt-5 h-full origin-top-left -rotate-2 bg-white shadow-2xl transition duration-500 group-hover:rotate-0">
                      <Image
                        src={project.image}
                        alt={project.alt}
                        fill
                        sizes="(max-width: 700px) 90vw, 44vw"
                        className="object-cover object-top"
                      />
                    </div>
                    <span className="absolute bottom-4 right-4 grid size-10 place-items-center rounded-full bg-white">
                      <ArrowUpRight size={21} />
                    </span>
                  </Link>
                  <div className="mt-5 flex justify-between text-[9px] uppercase tracking-[0.14em] text-gray-500">
                    <span>{project.category}</span>
                    <span>{project.number}</span>
                  </div>
                  <h3 className="mt-3 text-2xl font-medium tracking-tight">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-gray-500">
                    {project.description}
                  </p>
                  <p className="mt-3 text-xs leading-6 text-gray-500">
                    <strong className="font-medium text-gray-900">
                      Đóng góp của mình —{" "}
                    </strong>
                    {project.contribution}
                  </p>
                  <span className="mt-5 block border-t border-gray-200 pt-3 text-[10px] text-gray-500">
                    {project.stack}
                  </span>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
        <section
          id="cach-lam"
          className="mx-auto max-w-[1320px] border-b border-gray-200 px-5 py-16 sm:px-8 lg:px-16 lg:py-24"
          aria-labelledby="approach-title"
        >
          <Reveal>
            <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className={eyebrow}>02 / Cách mình làm sản phẩm</p>
                <h2
                  id="approach-title"
                  className="mt-4 text-4xl font-medium -tracking-wider sm:text-5xl"
                >
                  Chi tiết nhỏ.
                  <br />
                  <em className="font-serif font-normal text-primary">
                    Khác biệt lớn.
                  </em>
                </h2>
              </div>
              <p className="max-w-xs text-sm leading-7 text-gray-500">
                Một sản phẩm tốt được tạo nên từ nhiều quyết định nhỏ, có chủ
                đích.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-7 md:grid-cols-3">
            {[
              [
                "01",
                "Bắt đầu từ người dùng",
                "Hiểu ai đang sử dụng, họ cần hoàn thành điều gì và đâu là điểm gây khó khăn.",
              ],
              [
                "02",
                "Chăm chút từng tương tác",
                "Phản hồi rõ ràng, chuyển động vừa đủ và trải nghiệm nhất quán trên mọi màn hình.",
              ],
              [
                "03",
                "Xây để còn phát triển",
                "Viết code để người tiếp theo có thể hiểu, sửa và mở rộng.",
              ],
            ].map(([number, title, copy]) => (
              <Reveal key={number}>
                <article className="border-t border-gray-200 pt-5">
                  <span className="font-serif text-xl italic text-primary">
                    {number} /
                  </span>
                  <h3 className="mt-5 text-lg font-medium">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-500">{copy}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
        <section
          id="ve-minh"
          className="mx-auto grid max-w-[1320px] gap-10 border-b border-gray-200 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-16 lg:py-24"
          aria-labelledby="about-title"
        >
          <Reveal>
            <p className={eyebrow}>03 / Một chút về mình</p>
            <h2
              id="about-title"
              className="mt-4 text-4xl font-medium -tracking-wider sm:text-5xl"
            >
              Tò mò để học.
              <br />
              <em className="font-serif font-normal text-primary">
                Tận tâm để làm.
              </em>
            </h2>
            <a
              href="/pdf/LeMinhQuang_Fullstack_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={`${linkStyle} mt-7`}
            >
              Xem CV của mình <ArrowUpRight size={17} />
            </a>
          </Reveal>
          <Reveal>
            <p className="text-xl leading-8 tracking-tight sm:text-2xl">
              Mình thích khoảnh khắc một ý tưởng trở thành thứ mọi người có thể
              thực sự sử dụng.
            </p>
            <p className="mt-5 text-sm leading-7 text-gray-500">
              Hành trình của mình đi qua ứng dụng web, mobile và những bài toán
              gắn với thế giới thực — từ quản lý khóa luận đến dẫn đường, định
              vị và thuyết minh theo vị trí.
            </p>
            <div className="mt-8">
              <span className="text-[9px] uppercase tracking-[0.15em] text-gray-500">
                Trải nghiệm thực tế
              </span>
              {[
                [
                  "Web & Mobile · AIAIVN",
                  "Bản đồ, GPS, iBeacon và trải nghiệm khám phá địa điểm.",
                ],
                [
                  "Phát triển sản phẩm · Freelance",
                  "Nền tảng coupon, dashboard quản trị và triển khai ứng dụng.",
                ],
                [
                  "Hệ thống giáo dục · IUH",
                  "Kết nối sinh viên, giảng viên và quy trình quản lý khóa luận.",
                ],
              ].map(([title, copy]) => (
                <div key={title} className="border-b border-gray-200 py-4">
                  <h3 className="text-sm font-medium">{title}</h3>
                  <p className="mt-1 text-xs text-gray-500">{copy}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
        <section
          className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:px-16 lg:py-24"
          aria-labelledby="writing-title"
        >
          <Reveal>
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className={eyebrow}>04 / Ghi chép từ công việc</p>
                <h2
                  id="writing-title"
                  className="mt-4 text-4xl font-medium -tracking-wider sm:text-5xl"
                >
                  Học được.{" "}
                  <em className="font-serif font-normal text-primary">
                    Viết lại.
                  </em>
                </h2>
              </div>
              <Link href="/blog" className={linkStyle}>
                Tất cả bài viết <ArrowUpRight size={17} />
              </Link>
            </div>
            <Writing />
          </Reveal>
        </section>
        <section
          id="lien-he"
          className="bg-muted px-5 pb-0 pt-16 text-center sm:px-8 lg:pt-24"
          aria-labelledby="contact-title"
        >
          <Reveal>
            <p className={`${eyebrow} justify-center`}>
              Một cuộc trò chuyện có thể là khởi đầu
            </p>
            <h2
              id="contact-title"
              className="mx-auto mt-7 max-w-3xl text-5xl font-medium leading-tight tracking-[-0.06em] sm:text-7xl"
            >
              Cùng làm điều gì đó
              <br />
              <em className="font-serif font-normal text-primary">đáng giá.</em>
            </h2>
            <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-gray-500">
              Bạn đang tìm một người đồng hành cho sản phẩm,
              <br />
              hay một thành viên mới cho đội ngũ? Mình rất muốn lắng nghe.
            </p>
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-5 rounded-md bg-primary px-5 py-3.5 text-xs text-primary-foreground transition hover:bg-main-blog"
            >
              Kết nối qua LinkedIn <ArrowUpRight size={18} />
            </a>
          </Reveal>
          <p className="font-serif mx-auto mt-14 max-w-5xl border-t border-gray-300 py-5 text-sm italic text-gray-500">
            Ý tưởng của bạn. Sự tận tâm của mình.
          </p>
        </section>
      </main>
    </div>
  );
}
