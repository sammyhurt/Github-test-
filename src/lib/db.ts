/**
 * Database abstraction layer — currently backed by SQLite (better-sqlite3).
 *
 * TODO: Replace with Firebase Firestore or Supabase Postgres for production.
 *   Firebase:  https://firebase.google.com/docs/firestore/quickstart
 *   Supabase:  https://supabase.com/docs/guides/database
 *
 * The public surface of this module (getDb, insertSubmission, getSubmissions,
 * countSubmissions) must stay stable when swapping backends.
 */

import path from 'path';
import fs from 'fs';
import type { WaitlistSubmission, Neighborhood } from '@/types/waitlist';

// ---------------------------------------------------------------------------
// Type alias so we can lazy-require better-sqlite3 without touching the
// module-level type declarations when it's not installed.
// ---------------------------------------------------------------------------
type BetterSqlite3 = typeof import('better-sqlite3');
type Database = InstanceType<BetterSqlite3>;

let _db: Database | null = null;

function getDb(): Database {
  if (_db) return _db;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const BetterSqlite3 = require('better-sqlite3') as BetterSqlite3;

  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'waitlist.db');
  _db = new BetterSqlite3(dbPath);
  _db.pragma('journal_mode = WAL');
  _db.pragma('foreign_keys = ON');

  _db.exec(`
    CREATE TABLE IF NOT EXISTS waitlist_submissions (
      id              TEXT    PRIMARY KEY,
      created_at      TEXT    NOT NULL,
      role            TEXT    NOT NULL,
      renter_type     TEXT,
      neighborhoods   TEXT    NOT NULL,   -- JSON array of strings
      name            TEXT    NOT NULL,
      email           TEXT    NOT NULL,
      phone           TEXT,
      move_in_date    TEXT,
      budget_min      INTEGER,
      budget_max      INTEGER,
      unit_type       TEXT,
      available_date  TEXT,
      notes           TEXT,
      referral_source TEXT,
      consent         INTEGER NOT NULL DEFAULT 1,
      ip_address      TEXT,
      is_spam         INTEGER NOT NULL DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_ws_role      ON waitlist_submissions (role);
    CREATE INDEX IF NOT EXISTS idx_ws_email     ON waitlist_submissions (email);
    CREATE INDEX IF NOT EXISTS idx_ws_created   ON waitlist_submissions (created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_ws_is_spam   ON waitlist_submissions (is_spam);
  `);

  return _db;
}

// ---------------------------------------------------------------------------
// Row helpers
// ---------------------------------------------------------------------------

interface DbRow {
  id: string;
  created_at: string;
  role: string;
  renter_type: string | null;
  neighborhoods: string; // JSON
  name: string;
  email: string;
  phone: string | null;
  move_in_date: string | null;
  budget_min: number | null;
  budget_max: number | null;
  unit_type: string | null;
  available_date: string | null;
  notes: string | null;
  referral_source: string | null;
  consent: number;
  ip_address: string | null;
  is_spam: number;
}

function rowToSubmission(row: DbRow): WaitlistSubmission {
  return {
    id: row.id,
    createdAt: row.created_at,
    role: row.role as WaitlistSubmission['role'],
    renterType: (row.renter_type as WaitlistSubmission['renterType']) ?? null,
    neighborhoods: JSON.parse(row.neighborhoods) as Neighborhood[],
    name: row.name,
    email: row.email,
    phone: row.phone,
    moveInDate: row.move_in_date,
    budgetMin: row.budget_min,
    budgetMax: row.budget_max,
    unitType: (row.unit_type as WaitlistSubmission['unitType']) ?? null,
    availableDate: row.available_date,
    notes: row.notes,
    referralSource: row.referral_source,
    consent: Boolean(row.consent),
    ipAddress: row.ip_address,
    isSpam: Boolean(row.is_spam),
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface InsertSubmissionInput {
  id: string;
  role: string;
  renterType?: string | null;
  neighborhoods: string[];
  name: string;
  email: string;
  phone?: string | null;
  moveInDate?: string | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
  unitType?: string | null;
  availableDate?: string | null;
  notes?: string | null;
  referralSource?: string | null;
  consent: boolean;
  ipAddress?: string | null;
  isSpam?: boolean;
}

export function insertSubmission(input: InsertSubmissionInput): void {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO waitlist_submissions
      (id, created_at, role, renter_type, neighborhoods, name, email,
       phone, move_in_date, budget_min, budget_max, unit_type,
       available_date, notes, referral_source, consent, ip_address, is_spam)
    VALUES
      (@id, @createdAt, @role, @renterType, @neighborhoods, @name, @email,
       @phone, @moveInDate, @budgetMin, @budgetMax, @unitType,
       @availableDate, @notes, @referralSource, @consent, @ipAddress, @isSpam)
  `);

  stmt.run({
    id: input.id,
    createdAt: new Date().toISOString(),
    role: input.role,
    renterType: input.renterType ?? null,
    neighborhoods: JSON.stringify(input.neighborhoods),
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    moveInDate: input.moveInDate ?? null,
    budgetMin: input.budgetMin ?? null,
    budgetMax: input.budgetMax ?? null,
    unitType: input.unitType ?? null,
    availableDate: input.availableDate ?? null,
    notes: input.notes ?? null,
    referralSource: input.referralSource ?? null,
    consent: input.consent ? 1 : 0,
    ipAddress: input.ipAddress ?? null,
    isSpam: input.isSpam ? 1 : 0,
  });
}

export interface GetSubmissionsOptions {
  role?: string;
  neighborhood?: string;
  renterType?: string;
  search?: string;
  includeSpam?: boolean;
  limit?: number;
  offset?: number;
}

export function getSubmissions(
  opts: GetSubmissionsOptions = {},
): WaitlistSubmission[] {
  const db = getDb();

  const conditions: string[] = [];
  const params: Record<string, unknown> = {};

  if (!opts.includeSpam) {
    conditions.push('is_spam = 0');
  }
  if (opts.role && opts.role !== 'all') {
    conditions.push('role = @role');
    params.role = opts.role;
  }
  if (opts.renterType && opts.renterType !== 'all') {
    conditions.push('renter_type = @renterType');
    params.renterType = opts.renterType;
  }
  if (opts.neighborhood && opts.neighborhood !== 'all') {
    // neighborhoods is a JSON array — use LIKE for simple search
    conditions.push("neighborhoods LIKE '%' || @neighborhood || '%'");
    params.neighborhood = opts.neighborhood;
  }
  if (opts.search) {
    conditions.push(
      "(name LIKE '%' || @search || '%' OR email LIKE '%' || @search || '%')",
    );
    params.search = opts.search;
  }

  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const limit = opts.limit ?? 500;
  const offset = opts.offset ?? 0;

  const rows = db
    .prepare(
      `SELECT * FROM waitlist_submissions ${where}
       ORDER BY created_at DESC LIMIT @limit OFFSET @offset`,
    )
    .all({ ...params, limit, offset }) as DbRow[];

  return rows.map(rowToSubmission);
}

export function countSubmissions(includeSpam = false): number {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT COUNT(*) as cnt FROM waitlist_submissions WHERE is_spam = ${includeSpam ? 1 : 0} OR is_spam = 0`,
    )
    .get() as { cnt: number };
  return row.cnt;
}

export function emailExists(email: string): boolean {
  const db = getDb();
  const row = db
    .prepare(
      'SELECT id FROM waitlist_submissions WHERE email = ? AND is_spam = 0 LIMIT 1',
    )
    .get(email.toLowerCase().trim());
  return Boolean(row);
}
