import { LandingPage } from '../prisma/generated';
import { prisma } from '../prisma/prisma';

export class LandingPageService {
  async createLandingPage(data: {
    slug: string;
    html: string;
    metaTitle: string;
    metaDescription: string;
    keywords?: string[];
    canonicalUrl?: string;
    images?: string[];
    status?: string;
  }): Promise<LandingPage> {
    return prisma.landingPage.create({
      data: {
        slug: data.slug,
        html: data.html,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        keywords: data.keywords || [],
        canonicalUrl: data.canonicalUrl,
        images: data.images || [],
        status: data.status || 'draft',
      },
    });
  }

  async getAllLandingPages(): Promise<LandingPage[]> {
    return prisma.landingPage.findMany();
  }

  async getLandingPageBySlug(slug: string): Promise<LandingPage | null> {
    return prisma.landingPage.findUnique({
      where: { slug },
    });
  }

  async getLandingPageById(id: number): Promise<LandingPage | null> {
    return prisma.landingPage.findUnique({
      where: { id },
    });
  }

  async updateLandingPage(
    id: number,
    data: {
      slug?: string;
      html?: string;
      metaTitle?: string;
      metaDescription?: string;
      keywords?: string[];
      canonicalUrl?: string;
      images?: string[];
      status?: string;
      lighthouseScore?: number;
      lighthouseReport?: any;
    }
  ): Promise<LandingPage> {
    return prisma.landingPage.update({
      where: { id },
      data: {
        slug: data.slug,
        html: data.html,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        keywords: data.keywords,
        canonicalUrl: data.canonicalUrl,
        images: data.images,
        status: data.status,
        lighthouseScore: data.lighthouseScore,
        lighthouseReport: data.lighthouseReport,
      },
    });
  }

  async deleteLandingPage(id: number): Promise<LandingPage> {
    return prisma.landingPage.delete({
      where: { id },
    });
  }
}

export const landingPageService = new LandingPageService();
