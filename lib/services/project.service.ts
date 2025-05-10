import { Project } from '../prisma/generated';
import { prisma } from '../prisma/prisma';

export class ProjectService {
    async createProject(data: {
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
    }): Promise<Project> {
        return prisma.project.create({
            data: {
                title: data.title,
                slug: data.slug,
                description: data.description,
                images: data.images || [],
                links: data.links || [],
                authorId: data.authorId,
                categoryId: data.categoryId,
                seo: data.seo
                    ? {
                        create: {
                            metaTitle: data.seo.metaTitle,
                            metaDescription: data.seo.metaDescription,
                            keywords: data.seo.keywords,
                            canonicalUrl: data.seo.canonicalUrl,
                        },
                    }
                    : undefined,
            },
            include: {
                seo: true,
                author: true,
                category: true,
            },
        });
    }
    async getAllProjects(): Promise<Project[]> {
        return prisma.project.findMany({
            include: {
                seo: true,
                author: true,
                category: true,
            },
        });
    }
    async getProjectBySlug(slug: string): Promise<Project | null> {
        return prisma.project.findUnique({
            where: { slug },
            include: {
                seo: true,
                author: true,
                category: true,
            },
        });
    }
    async getProjectById(id: number): Promise<Project | null> {
        return prisma.project.findUnique({
            where: { id },
            include: {
                seo: true,
                author: true,
                category: true,
            },
        });
    }
    async updateProject(
        id: number,
        data: {
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
    ): Promise<Project> {
        return prisma.project.update({
            where: { id },
            data: {
                title: data.title,
                slug: data.slug,
                description: data.description,
                images: data.images,
                links: data.links,
                categoryId: data.categoryId,
                seo: data.seo
                    ? {
                        update: {
                            metaTitle: data.seo.metaTitle,
                            metaDescription: data.seo.metaDescription,
                            keywords: data.seo.keywords,
                            canonicalUrl: data.seo.canonicalUrl,
                        },
                    }
                    : undefined,
            },
            include: {
                seo: true,
                author: true,
                category: true,
            },
        });
    }

    async deleteProject(id: number): Promise<Project> {
        return prisma.project.delete({
            where: { id },
            include: {
                seo: true,
            },
        });
    }
}

export const projectService = new ProjectService();