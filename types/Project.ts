import { Project } from "@/lib/prisma/generated";

export interface ProjectInput {
    title: string;
    slug: string;
    description: string;
    images?: string[];
    links?: string[];
    authorId: number;
    categoryId?: number;
    seo?: {
        metaTitle: string;
        metaDescription: string;
        keywords: string[];
        canonicalUrl?: string;
    };
}

export interface UpdateProjectInput {
    id: number;
    title?: string;
    slug?: string;
    description?: string;
    images?: string[];
    links?: string[];
    categoryId?: number;
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
        keywords?: string[];
        canonicalUrl?: string;
    };
}

export interface UseProject {
    projects: Project[] | null;
    project: Project | null;
    loading: boolean;
    error: string | null;
    fetchProjects: () => Promise<void>;
    fetchProjectBySlug: (slug: string) => Promise<void>;
    createProject: (data: ProjectInput) => Promise<Project | null>;
    updateProject: (data: UpdateProjectInput) => Promise<Project | null>;
    deleteProject: (id: number) => Promise<Project | null>;
}