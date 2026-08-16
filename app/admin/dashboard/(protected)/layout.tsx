import React from 'react';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/Header';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) {
    redirect('/admin/dashboard/login');
  }

  try {
    jwt.verify(token as string, JWT_SECRET);
  } catch (e) {
    redirect('/admin/dashboard/login');
  }

  return (
    <div className="min-h-screen max-w-screen-xl flex bg-gray-50">
        <div className="p-6 w-full">{children}</div>
    </div>
  );
}
