"use client";
import React, { useEffect, useState } from "react";
import AdminCard from "@/components/admin/Card";
import LandingPageForm from '@/components/admin/LandingPageForm'

export default function DashBoard() {
  const [users, setUsers] = useState<number | null>(null);
  const [posts, setPosts] = useState<number | null>(null);
  const [projects, setProjects] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

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

      <div className="mt-8">
        <h2 className="text-xl font-medium mb-4">Create Landing Page</h2>
        {message && (
          <div className="mb-4 text-sm text-green-700 bg-green-100 p-3 rounded">{message}</div>
        )}

        <LandingPageForm
          isLoading={isCreating}
          onSubmit={async (data) => {
            setIsCreating(true)
            setMessage(null)
            try {
              const res = await fetch('/api/landing-pages/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'same-origin'
              })

              if (res.ok) {
                const json = await res.json()
                setMessage('Landing page created (id: ' + json.id + '). It is saved as draft.')
              } else {
                const err = await res.json()
                setMessage('Error: ' + (err?.error || 'Failed to create landing page'))
              }
            } catch (err) {
              setMessage('Error creating landing page')
              console.error(err)
            } finally {
              setIsCreating(false)
            }
          }}
        />
      </div>
    </div>
  );
}
