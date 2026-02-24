'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Download,
  Search,
  Filter,
  LogOut,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';
import type { WaitlistSubmission } from '@/types/waitlist';

// ─── Login form ────────────────────────────────────────────────────────────────

export function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        const json = await res.json();
        setError(json.message ?? 'Login failed.');
      }
    } catch {
      setError('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-brand-600 text-white text-xl font-bold">
            S
          </span>
          <h1 className="mt-4 text-xl font-bold text-gray-900">
            Subletly Admin
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Enter the admin password to continue.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow-card"
        >
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
            autoFocus
            required
          />

          {error && (
            <p className="mt-2 text-xs text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="mt-4 w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? 'Checking…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Main admin dashboard ─────────────────────────────────────────────────────

const ROLE_OPTIONS = ['all', 'renter', 'host'] as const;
const NEIGHBORHOOD_OPTIONS = [
  'all',
  'bushwick',
  'williamsburg',
  'bed_stuy',
  'other_nyc',
] as const;
const RENTER_TYPE_OPTIONS = [
  'all',
  'travel_nurse',
  'healthcare_worker',
  'student',
  'professional',
  'other',
] as const;

function labelOf(slug: string): string {
  const map: Record<string, string> = {
    all: 'All',
    renter: 'Renter',
    host: 'Host',
    travel_nurse: 'Travel Nurse',
    healthcare_worker: 'Healthcare Worker',
    student: 'Student',
    professional: 'Professional',
    other: 'Other',
    bushwick: 'Bushwick',
    williamsburg: 'Williamsburg',
    bed_stuy: 'Bed-Stuy',
    other_nyc: 'Other NYC',
  };
  return map[slug] ?? slug;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function AdminDashboard() {
  const [submissions, setSubmissions] = useState<WaitlistSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [role, setRole] = useState<string>('all');
  const [neighborhood, setNeighborhood] = useState<string>('all');
  const [renterType, setRenterType] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (role !== 'all') params.set('role', role);
      if (neighborhood !== 'all') params.set('neighborhood', neighborhood);
      if (renterType !== 'all') params.set('renterType', renterType);
      if (debouncedSearch) params.set('search', debouncedSearch);

      const res = await fetch(`/api/admin/submissions?${params.toString()}`);
      if (res.status === 401) {
        window.location.reload();
        return;
      }
      const json = await res.json();
      setSubmissions(json.data ?? []);
    } catch {
      setError('Failed to load submissions.');
    } finally {
      setLoading(false);
    }
  }, [role, neighborhood, renterType, debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    window.location.reload();
  }

  function handleExport() {
    const params = new URLSearchParams({ format: 'csv' });
    if (role !== 'all') params.set('role', role);
    if (neighborhood !== 'all') params.set('neighborhood', neighborhood);
    if (renterType !== 'all') params.set('renterType', renterType);
    if (debouncedSearch) params.set('search', debouncedSearch);
    window.location.href = `/api/admin/submissions?${params.toString()}`;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
              S
            </span>
            <div>
              <h1 className="text-sm font-semibold text-gray-900">
                Waitlist Admin
              </h1>
              <p className="text-xs text-gray-500">
                {submissions.length} submission
                {submissions.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Filters */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email…"
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />

            <SelectFilter
              value={role}
              onChange={setRole}
              options={[...ROLE_OPTIONS]}
            />
            <SelectFilter
              value={neighborhood}
              onChange={setNeighborhood}
              options={[...NEIGHBORHOOD_OPTIONS]}
            />
            <SelectFilter
              value={renterType}
              onChange={setRenterType}
              options={[...RENTER_TYPE_OPTIONS]}
            />
          </div>
        </div>

        {/* Table */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-brand-500" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-white text-center">
            <p className="text-sm font-medium text-gray-600">
              No submissions found
            </p>
            <p className="text-xs text-gray-400">
              Try adjusting your filters or check back later.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left">
                  {[
                    'Submitted',
                    'Name',
                    'Email',
                    'Role',
                    'Type',
                    'Neighborhoods',
                    'Move-in / Available',
                    'Budget / Unit',
                    'Source',
                  ].map((h) => (
                    <th
                      key={h}
                      className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {submissions.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">
                      {formatDate(s.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                      {s.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <a
                        href={`mailto:${s.email}`}
                        className="hover:text-brand-600 hover:underline"
                      >
                        {s.email}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={[
                          'inline-flex rounded-full px-2 py-0.5 text-xs font-semibold',
                          s.role === 'host'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700',
                        ].join(' ')}
                      >
                        {labelOf(s.role)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {s.renterType ? labelOf(s.renterType) : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {s.neighborhoods.map(labelOf).join(', ')}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">
                      {s.role === 'renter'
                        ? s.moveInDate ?? '—'
                        : s.availableDate ?? '—'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">
                      {s.role === 'renter'
                        ? s.budgetMin && s.budgetMax
                          ? `$${s.budgetMin}–$${s.budgetMax}`
                          : '—'
                        : s.unitType
                          ? labelOf(s.unitType)
                          : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {s.referralSource
                        ? labelOf(s.referralSource)
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-3 text-xs text-gray-400">
          Showing {submissions.length} non-spam submission
          {submissions.length !== 1 ? 's' : ''}. IP addresses and spam
          submissions are excluded from this view and the CSV export.
        </p>
      </main>
    </div>
  );
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function SelectFilter({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-8 text-xs font-medium text-gray-700 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {labelOf(opt)}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
    </div>
  );
}
