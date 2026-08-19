"use client";
import React, { useEffect, useState } from "react";
import AdminCard from "@/components/admin/Card";

export default function DashBoard() {
  const [users, setUsers] = useState<number | null>(null);
  const [posts, setPosts] = useState<number | null>(null);
  const [projects, setProjects] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      const [uRes, pRes, prRes] = await Promise.all([
        fetch("/api/users", { credentials: "same-origin" }),
        fetch("/api/blogs", { credentials: "same-origin" }),
        fetch("/api/projects", { credentials: "same-origin" }),
      ]);
      const [uData, pData, prData] = await Promise.all([
        uRes.json(),
        pRes.json(),
        prRes.json(),
      ]);
      setUsers(Array.isArray(uData) ? uData.length : 0);
      setPosts(Array.isArray(pData) ? pData.length : 0);
      setProjects(Array.isArray(prData) ? prData.length : 0);
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
      <div className="flex gap-4">
        <AdminCard title="Users" value={users ?? 0} />
        <AdminCard title="Posts" value={posts ?? 0} />
        <AdminCard title="Projects" value={projects ?? 0} />
      </div>
    </div>
  );
}
