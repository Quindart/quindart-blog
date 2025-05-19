import { Project } from '@/lib/prisma/generated';
import { ProjectInput, UpdateProjectInput, UseProject } from '@/types/Project';
import { useState, useCallback } from 'react';


export const useProject = (): UseProject => {
    const [projects, setProjects] = useState<Project[] | null>(null);
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Lấy tất cả dự án
    const fetchProjects = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/projects');
            if (!response.ok) {
                throw new Error('Lỗi khi lấy danh sách dự án');
            }
            const data = await response.json();
            setProjects(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi không xác định');
        } finally {
            setLoading(false);
        }
    }, []);

    // Lấy dự án theo slug
    const fetchProjectBySlug = useCallback(async (slug: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/projects?slug=${encodeURIComponent(slug)}`);
            if (!response.ok) {
                throw new Error('Lỗi khi lấy dự án');
            }
            const data = await response.json();
            setProject(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi không xác định');
        } finally {
            setLoading(false);
        }
    }, []);

    const createProject = useCallback(async (data: ProjectInput): Promise<Project | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Lỗi khi tạo dự án');
            }
            const newProject = await response.json();
            setProjects(prev => (prev ? [...prev, newProject] : [newProject]));
            return newProject;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi không xác định');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Cập nhật dự án
    const updateProject = useCallback(async (data: UpdateProjectInput): Promise<Project | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/projects', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Lỗi khi cập nhật dự án');
            }
            const updatedProject = await response.json();
            setProjects(prev =>
                prev ? prev.map(p => (p.id === updatedProject.id ? updatedProject : p)) : null
            );
            setProject(updatedProject);
            return updatedProject;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi không xác định');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Xóa dự án
    const deleteProject = useCallback(async (id: number): Promise<Project | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/projects?id=${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Lỗi khi xóa dự án');
            }
            const deletedProject = await response.json();
            setProjects(prev => (prev ? prev.filter(p => p.id !== id) : null));
            setProject(null);
            return deletedProject.project;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Lỗi không xác định');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        projects,
        project,
        loading,
        error,
        fetchProjects,
        fetchProjectBySlug,
        createProject,
        updateProject,
        deleteProject,
    };
};