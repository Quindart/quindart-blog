"use client";
import React from "react";

export default function AdminHeader({
  onOpenMobile,
  onToggleCollapsed,
  collapsed,
}: {
  onOpenMobile?: () => void;
  onToggleCollapsed?: () => void;
  collapsed?: boolean;
}) {
  return (
    <header className="h-16 bg-white border-b flex items-center px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="md:hidden p-2 rounded hover:bg-gray-100"
          aria-label="Open sidebar"
        >
          ☰
        </button>
        <button
          onClick={onToggleCollapsed}
          className="hidden md:inline p-2 rounded hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          {collapsed ? "▶" : "◀"}
        </button>
        <div className="text-lg font-semibold">Dashboard</div>
      </div>
    </header>
  );
}
