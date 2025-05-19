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
      className="relative flex min-h-screen w-full flex-col items-center py-8 sm:py-10"
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
      <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <header className="mb-10 text-center text-white">
          <h1 className="flex animate-bounce items-center justify-center gap-2 text-2xl font-bold sm:text-3xl lg:text-4xl">
            <UsersIcon className="size-8 sm:size-10" /> Sunny Community
          </h1>
          <p
            className="mx-auto mt-4 max-w-xl text-base text-slate-100 sm:text-lg lg:text-xl"
            style={{ textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)" }}
          >
            Let explore, learn, and grow together in a passionate and creative
            community
          </p>
        </header>

        {/* Main Content */}
        <main className="grid grid-cols-1 gap-6 sm:gap-8">
          {/* Introduction Section */}
          <section className="rounded-lg bg-white/90 p-5 shadow-lg sm:p-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-700 sm:text-2xl lg:text-3xl">
              <GlobeAltIcon className="spin-slow size-6 text-slate-500 sm:size-8" />
              About the Community
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-700 sm:text-base">
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
              className="h-auto w-full object-cover"
            />
          </section>

          {/* Fields of Work Section */}
          <section className="rounded-lg bg-white/90 p-5 shadow-lg sm:p-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-700 sm:text-2xl lg:text-3xl">
              <CodeBracketIcon className="size-6 animate-pulse text-slate-500 sm:size-8" />
              Areas of Activity
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-700 sm:text-base">
              <li className="flex items-center gap-2">
                <CodeBracketIcon className="size-5 text-slate-500 sm:size-6" />
                <strong>Software Engineering:</strong> Developing high-quality
                software.
              </li>
              <li className="flex items-center gap-2">
                <GlobeAltIcon className="size-5 text-slate-500 sm:size-6" />
                <strong>Blog Management Systems:</strong> Building and
                optimizing blog platforms.
              </li>
              <li className="flex items-center gap-2">
                <ChatBubbleLeftIcon className="size-5 text-slate-500 sm:size-6" />
                <strong>ChatGPT:</strong> Applying AI to develop intelligent
                chatbots.
              </li>
              <li className="flex items-center gap-2">
                <UsersIcon className="size-5 text-slate-500 sm:size-6" />
                <strong>Freelance Team:</strong> Supporting flexible and
                creative freelance projects.
              </li>
            </ul>
          </section>
        </main>

        {/* Call to Action */}
        <div className="mt-10 text-center">
          <Button
            href="https://discord.gg/rfNQujbZ"
            target="_blank"
            style={{ backgroundColor: "#5865F2", borderColor: "#5865F2" }}
            className="mx-auto flex h-12 items-center gap-2 text-base transition-transform duration-300 hover:scale-105 sm:h-14 sm:text-lg"
          >
            <ChatBubbleLeftIcon className="mr-2 size-4 sm:size-5" /> Join Now!
          </Button>
        </div>
      </div>
      <style jsx global>{`
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .spin-slow {
          animation: spin-slow 5s linear infinite;
        }
      `}</style>
    </div>
  );
}
