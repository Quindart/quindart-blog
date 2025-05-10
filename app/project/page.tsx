"use client";

import { useProject } from "@/hooks/useProject";
import { Tooltip, TextInput } from "flowbite-react";
import { FaEye, FaGithub, FaGlobe, FaShareAlt } from "react-icons/fa";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { FaHeart } from "react-icons/fa";
const ProjectCard = ({
  id,
  title,
  description,
  images,
  links,
  createdAt,
}: any) => {
  const github = links?.find((l: any) => l.includes("github"));
  const site = links?.find(
    (l: any) => !l.includes("github") && /^https?:\/\//.test(l),
  );

  return (
    <div
      key={id}
      className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <Image
        src={images[0]}
        alt={title}
        width={300}
        height={200}
        className="mb-4 w-full rounded-md object-cover"
      />
      <div>
        <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
        <p className="text-xs text-gray-500">
          {new Date(createdAt).toLocaleDateString()}
        </p>
        <p className="mt-2 line-clamp-3 text-sm text-gray-600">
          {description || "No description available."}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-4">
          {github && (
            <Tooltip content="View on GitHub">
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900"
              >
                <FaGithub className="text-2xl text-gray-700" />
              </a>
            </Tooltip>
          )}
          {site && (
            <Tooltip content="Visit Website">
              <a
                href={site}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-900"
              >
                <FaGlobe className="text-2xl text-gray-700" />
              </a>
            </Tooltip>
          )}
        </div>
        <div className="flex gap-4">
          {/* React Heart Button */}
          <Tooltip content="React">
            <button className="text-slate-500 hover:text-slate-700">
              <FaHeart className="text-lg" />
            </button>
          </Tooltip>
          {/* Share Button */}
          <Tooltip content="Share">
            <button className="text-slate-500 hover:text-slate-700">
              <FaShareAlt className="text-lg" />
            </button>
          </Tooltip>
          {/* View Button */}
          <Tooltip content="View">
            <button className="text-slate-500 hover:text-slate-700">
              <FaEye className="text-lg" />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

// Main ProjectPage Component
export default function ProjectPage() {
  const { projects, loading, error, fetchProjects } = useProject();
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filtered = useMemo(
    () =>
      projects?.filter((p) =>
        p.title.toLowerCase().includes(filter.toLowerCase()),
      ),
    [projects, filter],
  );

  // Render Logic
  if (error)
    return <div className="py-4 text-center text-red-500">{error}</div>;

  return (
    <div className="h-full min-h-screen">
      {loading ? (
        <div className="h-full min-h-screen bg-white">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <header
            className="py-12 text-center"
            style={{
              backgroundImage: "url(/assets/images/background.webp)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <h1
              className="z-10 text-4xl font-bold text-slate-700"
              style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
            >
              Projects
            </h1>
            <div className="mt-4 flex justify-center">
              <TextInput
                type="text"
                placeholder="You can search project by name here"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-1/3"
              />
            </div>
          </header>

          <div className="mx-8 mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered
              ?.sort(
                (a: any, b: any) =>
                  new Date(`${b?.createdAt}`).getTime() -
                  new Date(`${a?.createdAt}`).getTime(),
              )
              .map((project) => <ProjectCard key={project.id} {...project} />)}
          </div>
        </>
      )}
    </div>
  );
}
