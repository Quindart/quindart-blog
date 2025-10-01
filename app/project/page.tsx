"use client";
import { useProject } from "@/hooks/useProject";
import { useEffect, useState, useMemo } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import HeaderProject from "@/components/containers/project/header";
import ListProject from "@/components/containers/project/listProject";

export default function ProjectPage() {
  const { projects, loading, fetchProjects } = useProject();
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
  if (loading) return <LoadingSpinner />;
  return (
    <div className="h-full min-h-screen">
      <>
        <HeaderProject filter={filter} setFilter={setFilter} />
        <ListProject filtered={filtered} />
      </>
    </div>
  );
}
