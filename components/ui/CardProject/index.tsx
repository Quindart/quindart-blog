"use client";
import { Tooltip } from "flowbite-react";
import { FaEye, FaGithub, FaGlobe, FaHeart, FaShareAlt } from "react-icons/fa";
import Image from "next/image";
import React from "react";

function CardProject({
  id,
  title,
  description,
  images,
  links,
  createdAt,
}: any) {
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
        width={1200}
        height={1200}
        priority
        className="mb-4 h-72 w-full rounded-md object-cover"
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
}

export default React.memo(CardProject);
