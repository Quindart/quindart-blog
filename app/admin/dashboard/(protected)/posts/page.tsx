"use client";
import React, { useEffect, useState } from "react";

export default function PostsAdminPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/blogs", { credentials: "same-origin" });
      const data = await res.json();
      setPosts(data || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl mb-4">Posts</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="space-y-2">
          {posts.map((p) => (
            <li key={p.id} className="p-3 bg-white rounded shadow-sm">
              {p.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
