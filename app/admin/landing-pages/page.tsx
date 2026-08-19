import Link from 'next/link';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { auth } from '@/lib/auth';
import { db } from '@/lib/prisma';

export default async function LandingPagesPage() {
  // Verify auth
  try {
    auth();
  } catch (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Unauthorized access. Please log in.</p>
      </div>
    );
  }

  // Query all landing pages
  const landingPages = await db.landingPage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Landing Pages</h1>
        <Link href="/admin/landing-pages/create">
          <Button>Create New Page</Button>
        </Link>
      </div>

      {landingPages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No landing pages yet.</p>
          <Link href="/admin/landing-pages/create">
            <Button>Create your first landing page</Button>
          </Link>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Lighthouse Score</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {landingPages.map((page) => (
              <TableRow key={page.id}>
                <TableCell className="font-medium">
                  {page.status === 'published' ? (
                    <a
                      href={`https://${page.slug}.quindart.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {page.slug}
                    </a>
                  ) : (
                    page.slug
                  )}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      'px-2 py-1 rounded text-sm font-medium',
                      page.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    )}
                  >
                    {page.status}
                  </span>
                </TableCell>
                <TableCell>
                  {page.lighthouseScore !== null ? (
                    <span
                      className={cn(
                        'font-bold',
                        page.lighthouseScore >= 90
                          ? 'text-green-600'
                          : page.lighthouseScore >= 70
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      )}
                    >
                      {page.lighthouseScore}
                    </span>
                  ) : (
                    <span className="text-gray-400">Not checked</span>
                  )}
                </TableCell>
                <TableCell>{format(page.createdAt, 'MMM d, yyyy')}</TableCell>
                <TableCell className="space-x-2">
                  <Link href={`/admin/landing-pages/${page.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <a
                    href={`/api/landing-pages/${page.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      Preview
                    </Button>
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
