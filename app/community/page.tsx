"use client";
import { Button } from "flowbite-react";
import Image from "next/image";
import {
  UsersIcon,
  GlobeAltIcon,
  CodeBracketIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";

export default function CommunityPage() {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center py-10"
      style={{
        backgroundImage: "url(/assets/community/sunny.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-slate-600 opacity-50"></div>

      {/* Main Content with Overlay */}
      <div className="relative z-10 w-full max-w-6xl px-4">
        {/* Header Section */}
        <header className="mb-12 text-center text-white">
          <h1 className="flex animate-bounce items-center justify-center gap-3 text-4xl font-bold">
            <UsersIcon className="size-10" /> Sunny Community
          </h1>
          <p
            className="mx-auto mt-6 max-w-2xl text-center text-xl text-slate-100"
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
          >
            Let explore, learn, and grow together in a passionate and creative
            community
          </p>
        </header>

        {/* Main Content */}
        <main className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Introduction Section */}
          <section className="rounded-lg bg-white bg-opacity-90 p-6 shadow-lg">
            <h2 className="flex items-center gap-2 text-3xl font-semibold text-slate-700">
              <GlobeAltIcon className="animate-spin-slow size-8 text-slate-500" />
              About the Community
            </h2>
            <p className="mt-4 leading-relaxed text-gray-700">
              The Sunny Community brings together 36 passionate developers
              specializing in software engineering, blog management systems,
              ChatGPT, and a freelance team. We are proud to have members from
              across Vietnam, including Hanoi, Ho Chi Minh City, Da Nang, as
              well as members in Germany and the USA.
            </p>
          </section>

          {/* Community Image */}
          <section className="overflow-hidden rounded-lg shadow-lg">
            <Image
              width={1000}
              height={1000}
              alt="community-quindart-blog"
              src="/assets/community/community.webp"
              className="size-full object-cover"
            />
          </section>

          {/* Fields of Work Section */}
          <section className="col-span-1 rounded-lg bg-white bg-opacity-90 p-6 shadow-lg md:col-span-2">
            <h2 className="flex items-center gap-2 text-3xl font-semibold text-slate-700">
              <CodeBracketIcon className="size-8 animate-pulse text-slate-500" />
              Areas of Activity
            </h2>
            <ul className="mt-4 space-y-3 text-gray-700">
              <li className="flex items-center gap-2">
                <CodeBracketIcon className="size-6 text-slate-500" />
                <strong>Software Engineering:</strong> Developing high-quality
                software.
              </li>
              <li className="flex items-center gap-2">
                <GlobeAltIcon className="size-6 text-slate-500" />
                <strong>Blog Management Systems:</strong> Building and
                optimizing blog platforms.
              </li>
              <li className="flex items-center gap-2">
                <ChatBubbleLeftIcon className="size-6 text-slate-500" />
                <strong>ChatGPT:</strong> Applying AI to develop intelligent
                chatbots.
              </li>
              <li className="flex items-center gap-2">
                <UsersIcon className="size-6 text-slate-500" />
                <strong>Freelance Team:</strong> Supporting flexible and
                creative freelance projects.
              </li>
            </ul>
          </section>
        </main>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Button
            href="https://discord.gg/rfNQujbZ"
            target="_blank"
            style={{ backgroundColor: "#5865F2", borderColor: "#5865F2" }}
            className="mx-auto flex h-14 items-center gap-2 text-lg transition-transform duration-300 hover:scale-105"
          >
            <ChatBubbleLeftIcon className="mr-2 size-5" /> Join Now!
          </Button>
        </div>
      </div>

      {/* Custom Tailwind Animation */}
      <style jsx global>{`
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 5s linear infinite;
        }
      `}</style>
    </div>
  );
}
