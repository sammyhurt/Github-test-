import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Wavyarnold — Discography | New Hip-Hop Music Newark NJ',
  description:
    'Stream Wavyarnold\'s music — Hip-Hop, R&B, and Alternative from Newark, NJ. All releases, everywhere.',
  keywords: ['wavyarnold music', 'wavyarnold songs', 'wavyarnold discography', 'new hip hop music newark nj'],
  alternates: { canonical: 'https://wavyarnold.com/music' },
}

const streamingPlatforms = [
  { name: 'Spotify', href: 'https://open.spotify.com' },
  { name: 'Apple Music', href: 'https://music.apple.com' },
  { name: 'Tidal', href: 'https://tidal.com' },
  { name: 'YouTube Music', href: 'https://music.youtube.com' },
  { name: 'Amazon Music', href: 'https://music.amazon.com' },
]

const releases = [
  { title: 'Release Title 01', type: 'Single', year: '2026', slug: 'release-01' },
  { title: 'Release Title 02', type: 'Single', year: '2025', slug: 'release-02' },
  { title: 'Release Title 03', type: 'EP', year: '2025', slug: 'release-03' },
  { title: 'Release Title 04', type: 'Single', year: '2024', slug: 'release-04' },
]

export default function MusicPage() {
  return (
    <>
      {/* ── Page header ───────────────────────────────────────── */}
      <section className="grain-overlay bg-midnight page-content pt-20 pb-24" aria-labelledby="music-h1">
        <div className="max-w-screen-xl mx-auto px-6">
          <p className="section-label text-amber mb-4">Discography</p>
          <h1 id="music-h1" className="display-heading text-cream text-5xl md:text-7xl lg:text-8xl">
            Wavyarnold —<br />Discography
          </h1>
        </div>
      </section>

      {/* ── Latest Release (featured) ─────────────────────────── */}
      <section className="bg-cream" aria-labelledby="latest-release-heading">
        <div className="max-w-screen-xl mx-auto px-6 py-20">
          <p className="section-label text-iron-light mb-3">Latest Release</p>
          <h2 id="latest-release-heading" className="display-heading text-midnight text-3xl md:text-5xl mb-10">
            {releases[0].title}
            <span className="text-iron-light text-2xl ml-4">— {releases[0].year}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-iron/10">
            <div className="bg-iron aspect-square flex items-center justify-center">
              <span className="text-cream/10 text-sm uppercase tracking-widest">Cover Art</span>
            </div>
            <div className="bg-midnight p-10 md:p-16 flex flex-col justify-between min-h-[320px]">
              <div>
                <p className="section-label text-amber mb-4">{releases[0].type} · {releases[0].year}</p>
                <h3 className="display-heading text-cream text-3xl md:text-4xl mb-4">
                  {releases[0].title}
                </h3>
                <p className="text-cream/60 text-sm leading-relaxed max-w-sm">
                  The music doesn&apos;t lie. Stream everywhere now.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-8">
                {streamingPlatforms.slice(0, 2).map((p) => (
                  <a
                    key={p.name}
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-amber text-xs"
                  >
                    {p.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── All Music ─────────────────────────────────────────── */}
      <section className="bg-cream-dark py-20" aria-labelledby="all-music-heading">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 id="all-music-heading" className="display-heading text-midnight text-3xl md:text-5xl mb-12">
            All Music
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {releases.map((r) => (
              <Link
                key={r.slug}
                href={`/music/${r.slug}`}
                className="group block"
                aria-label={`${r.title} — ${r.type} ${r.year}`}
              >
                <div className="aspect-square bg-iron mb-3 overflow-hidden flex items-center justify-center group-hover:opacity-80 transition-opacity">
                  <span className="text-cream/10 text-xs uppercase tracking-widest">Cover</span>
                </div>
                <p className="font-display font-bold text-midnight text-sm group-hover:text-amber transition-colors leading-tight">
                  {r.title}
                </p>
                <p className="text-iron-light text-xs mt-1">{r.type} · {r.year}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stream Everywhere ─────────────────────────────────── */}
      <section className="bg-midnight py-20 grain-overlay" aria-labelledby="stream-heading">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 id="stream-heading" className="display-heading text-cream text-3xl md:text-5xl mb-10">
            Stream Everywhere
          </h2>
          <div className="flex flex-wrap gap-4">
            {streamingPlatforms.map((p) => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline border-cream text-cream hover:bg-cream hover:text-midnight"
              >
                {p.name} ↗
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="bg-amber py-16">
        <div className="max-w-screen-xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-display font-bold text-midnight text-xl md:text-2xl">
            New music first. Join the list.
          </p>
          <Link href="/join" className="btn-primary">Join the List</Link>
        </div>
      </section>
    </>
  )
}
