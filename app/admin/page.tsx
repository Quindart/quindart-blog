import { redirect } from 'next/navigation';

export default function AdminRedirect() {
  // Redirect `/admin` to the canonical admin login path.
  redirect('/admin/dashboard/login');
}
