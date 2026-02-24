/**
 * POST /api/admin/auth
 *
 * Validates the admin password (from ADMIN_PASSWORD env var) and sets
 * an httpOnly session cookie.
 *
 * DELETE /api/admin/auth
 * Clears the session cookie (logout).
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const COOKIE_NAME = 'subletly_admin';
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

function getAdminPassword(): string {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) {
    throw new Error(
      'ADMIN_PASSWORD environment variable is not set. ' +
        'Add it to .env.local before using the admin panel.',
    );
  }
  return pw;
}

export async function POST(req: NextRequest) {
  // Rate limit: 5 attempts per minute per IP
  const ip = getClientIp(req.headers);
  if (!checkRateLimit(`admin_auth:${ip}`, 5, 60_000)) {
    return NextResponse.json(
      { success: false, message: 'Too many login attempts. Please wait.' },
      { status: 429 },
    );
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid request.' },
      { status: 400 },
    );
  }

  let expected: string;
  try {
    expected = getAdminPassword();
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: 'Admin is not configured on this server.' },
      { status: 503 },
    );
  }

  if (!body.password || body.password !== expected) {
    return NextResponse.json(
      { success: false, message: 'Incorrect password.' },
      { status: 401 },
    );
  }

  // Set the session cookie
  const store = await cookies();
  store.set(COOKIE_NAME, 'authenticated', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: MAX_AGE_SECONDS,
    path: '/admin',
  });

  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
  return NextResponse.json({ success: true });
}
