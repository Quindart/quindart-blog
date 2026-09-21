"use client";

import type { ReactNode } from "react";

export default function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-reveal
      className={`motion-safe:animate-[portfolio-fade-up_700ms_ease-out_both] ${className}`}
    >
      {children}
    </div>
  );
}
