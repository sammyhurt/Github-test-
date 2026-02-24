/**
 * GET /api/admin/submissions
 * GET /api/admin/submissions?format=csv
 *
 * Returns waitlist submissions as JSON (or CSV for export).
 * Protected by the admin session cookie set in /api/admin/auth.
 *
 * Query params:
 *   role        — filter by role ('host' | 'renter')
 *   neighborhood — filter by neighborhood slug
 *   renterType  — filter by renter type slug
 *   search      — search name or email
 *   format      — 'csv' to download as CSV
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSubmissions } from '@/lib/db';
import type { WaitlistSubmission } from '@/types/waitlist';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const COOKIE_NAME = 'subletly_admin';

async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === 'authenticated';
}

function submissionsToCSV(rows: WaitlistSubmission[]): string {
  const HEADERS = [
    'id',
    'created_at',
    'role',
    'renter_type',
    'neighborhoods',
    'name',
    'email',
    'phone',
    'move_in_date',
    'budget_min',
    'budget_max',
    'unit_type',
    'available_date',
    'notes',
    'referral_source',
    'consent',
  ] as const;

  function escape(val: unknown): string {
    if (val === null || val === undefined) return '';
    const str = Array.isArray(val) ? val.join('; ') : String(val);
    // RFC 4180: wrap in quotes if contains comma, quote, or newline
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  const lines = [HEADERS.join(',')];

  for (const row of rows) {
    lines.push(
      [
        escape(row.id),
        escape(row.createdAt),
        escape(row.role),
        escape(row.renterType),
        escape(row.neighborhoods),
        escape(row.name),
        escape(row.email),
        escape(row.phone),
        escape(row.moveInDate),
        escape(row.budgetMin),
        escape(row.budgetMax),
        escape(row.unitType),
        escape(row.availableDate),
        escape(row.notes),
        escape(row.referralSource),
        escape(row.consent),
      ].join(','),
    );
  }

  return lines.join('\r\n');
}

export async function GET(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role') ?? undefined;
  const neighborhood = searchParams.get('neighborhood') ?? undefined;
  const renterType = searchParams.get('renterType') ?? undefined;
  const search = searchParams.get('search') ?? undefined;
  const format = searchParams.get('format');

  const submissions = getSubmissions({
    role,
    neighborhood,
    renterType,
    search,
    includeSpam: false,
  });

  if (format === 'csv') {
    const csv = submissionsToCSV(submissions);
    const filename = `subletly-waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  }

  return NextResponse.json({ success: true, data: submissions });
}
