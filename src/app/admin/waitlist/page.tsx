/**
 * /admin/waitlist — Password-gated admin dashboard.
 *
 * Authentication flow:
 *   1. Server component reads the `subletly_admin` httpOnly cookie.
 *   2. If missing → renders <AdminLogin /> (client component with password form).
 *   3. On successful login, POST /api/admin/auth sets the cookie and the
 *      page reloads, showing the full <AdminDashboard />.
 *
 * The ADMIN_PASSWORD env var must be set in .env.local.
 */

import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { AdminLogin, AdminDashboard } from '@/components/admin/AdminClient';

export const metadata: Metadata = {
  title: 'Admin — Waitlist',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

const COOKIE_NAME = 'subletly_admin';

export default async function AdminWaitlistPage() {
  const store = await cookies();
  const isAuthed = store.get(COOKIE_NAME)?.value === 'authenticated';

  if (!isAuthed) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
}
