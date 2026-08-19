"use client";
import React from "react";

export default function AdminCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="p-4 bg-white rounded shadow-sm w-64">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
    </div>
  );
}
