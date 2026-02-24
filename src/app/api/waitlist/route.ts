/**
 * POST /api/waitlist
 *
 * Accepts a waitlist submission, validates it server-side with Zod,
 * checks for spam (honeypot + rate limiting), then persists to SQLite.
 *
 * Anti-spam:
 *   1. Honeypot field — `website` must be absent or empty.
 *   2. Rate limit — max 3 requests per IP per 60 seconds.
 *   3. Duplicate email check — soft block (returns success to avoid enumeration).
 *
 * Consent logging:
 *   The `consent` field (boolean true) is required by the Zod schema and is
 *   stored in the database along with the timestamp (created_at) and IP
 *   address, forming an audit trail.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { randomUUID } from 'crypto';

import { waitlistSchema } from '@/lib/validation';
import { insertSubmission, countSubmissions, emailExists } from '@/lib/db';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

// Force Node.js runtime so better-sqlite3 native bindings work.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // ─── Parse body ────────────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  // ─── Rate limiting ─────────────────────────────────────────────────────────
  const ip = getClientIp(req.headers);
  const allowed = checkRateLimit(ip, 3, 60_000);
  if (!allowed) {
    return NextResponse.json(
      {
        success: false,
        message:
          'Too many requests. Please wait a moment before trying again.',
      },
      { status: 429 },
    );
  }

  // ─── Schema validation ─────────────────────────────────────────────────────
  const parsed = waitlistSchema.safeParse(body);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? 'Validation failed.';
    return NextResponse.json(
      { success: false, message: firstError, errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // ─── Honeypot check ────────────────────────────────────────────────────────
  // If the hidden `website` field was filled in, this is almost certainly a bot.
  // We still return 200 with a fake success to avoid giving bots feedback.
  const isSpam =
    typeof (body as Record<string, unknown>).website === 'string' &&
    (body as Record<string, unknown>).website !== '';

  // ─── Duplicate email check ─────────────────────────────────────────────────
  // Soft-block: return success to avoid email enumeration, but skip insertion.
  const email = data.email.toLowerCase().trim();
  if (!isSpam && emailExists(email)) {
    // Return a plausible position without re-inserting
    const total = countSubmissions();
    return NextResponse.json(
      {
        success: true,
        message: "You're already on the waitlist!",
        position: total,
      },
      { status: 200 },
    );
  }

  // ─── Persist ───────────────────────────────────────────────────────────────
  const id = randomUUID();

  insertSubmission({
    id,
    role: data.role,
    renterType: data.renterType ?? null,
    neighborhoods: data.neighborhoods as string[],
    name: data.name,
    email,
    phone: data.phone || null,
    moveInDate: data.moveInDate || null,
    budgetMin:
      data.budgetMin !== undefined ? Number(data.budgetMin) : null,
    budgetMax:
      data.budgetMax !== undefined ? Number(data.budgetMax) : null,
    unitType: data.unitType ?? null,
    availableDate: data.availableDate || null,
    notes: data.notes || null,
    referralSource: data.referralSource || null,
    consent: data.consent,
    ipAddress: ip,
    isSpam,
  });

  // ─── Response ──────────────────────────────────────────────────────────────
  const position = countSubmissions();

  return NextResponse.json(
    {
      success: true,
      message: isSpam
        ? "You're on the list!"
        : "You're on the waitlist!",
      position,
    },
    { status: 201 },
  );
}

// Reject all other methods
export async function GET() {
  return NextResponse.json({ message: 'Method not allowed.' }, { status: 405 });
}
