import { NextRequest, NextResponse } from 'next/server';
import { projectService } from '@/lib/services/project.service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');

        if (slug) {
            const project = await projectService.getProjectBySlug(slug);
            if (!project) {
                return NextResponse.json({ error: 'Dự án không tìm thấy' }, { status: 404 });
            }
            return NextResponse.json(project);
        }

        const projects = await projectService.getAllProjects();
        return NextResponse.json(projects);
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi khi lấy dữ liệu dự án' }, { status: 500 });
    }
}

// Xử lý POST: Tạo dự án mới
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, slug, description, images, links, authorId, categoryId, seo } = body;

        // Kiểm tra các trường bắt buộc
        if (!title || !slug || !description || !authorId) {
            return NextResponse.json(
                { error: 'Thiếu các trường bắt buộc: title, slug, description, authorId' },
                { status: 400 }
            );
        }

        const project = await projectService.createProject({
            title,
            slug,
            description,
            images,
            links,
            authorId: Number(authorId),
            categoryId: categoryId ? Number(categoryId) : undefined,
            seo,
        });

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi khi tạo dự án' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, title, slug, description, images, links, categoryId, seo } = body;

        if (!id) {
            return NextResponse.json({ error: 'Thiếu ID dự án' }, { status: 400 });
        }

        const project = await projectService.updateProject(Number(id), {
            title,
            slug,
            description,
            images,
            links,
            categoryId: categoryId ? Number(categoryId) : undefined,
            seo,
        });

        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi khi cập nhật dự án' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Thiếu ID dự án' }, { status: 400 });
        }

        const project = await projectService.deleteProject(Number(id));
        return NextResponse.json({ message: 'Xóa dự án thành công', project });
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi khi xóa dự án' }, { status: 500 });
    }
}