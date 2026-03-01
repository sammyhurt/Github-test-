import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Wavyarnold — Newark, NJ Rapper | Hip-Hop, R&B, Alternative',
  description:
    'Wavyarnold is a Hip-Hop, R&B, and Alternative artist from Newark, NJ. Broken but still coloring. New music, real story.',
  alternates: { canonical: 'https://wavyarnold.com' },
}

const homepageSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'MusicGroup',
      name: 'Wavyarnold',
      url: 'https://wavyarnold.com',
      description:
        'Wavyarnold is a Hip-Hop, R&B, and Alternative artist from Newark, NJ.',
      genre: ['Hip-Hop', 'Rap', 'Alternative', 'R&B'],
      foundingLocation: {
        '@type': 'Place',
        name: 'Newark, NJ',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Newark',
          addressRegion: 'NJ',
          addressCountry: 'US',
        },
      },
    },
    {
      '@type': 'Person',
      name: 'Wavyarnold',
      url: 'https://wavyarnold.com/about',
      jobTitle: 'Recording Artist',
      description:
        'Hip-Hop, R&B, and Alternative artist based in Newark, NJ.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Newark',
        addressRegion: 'NJ',
      },
    },
  ],
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageSchema) }}
      />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        className="grain-overlay relative min-h-screen bg-midnight flex flex-col justify-end page-content"
        aria-label="Hero"
      >
        {/* Background texture block */}
        <div className="absolute inset-0 bg-gradient-to-br from-midnight via-iron to-midnight opacity-90" />

        {/* Decorative amber rule */}
        <div className="absolute top-1/3 left-6 md:left-16 w-[2px] h-32 bg-amber" aria-hidden="true" />

        <div className="relative z-10 max-w-screen-xl mx-auto px-6 pb-20 md:pb-28 w-full">
          <p className="section-label text-amber mb-6">Newark, NJ · Hip-Hop · R&amp;B · Alternative</p>

          <h1 className="display-heading text-cream text-6xl md:text-8xl lg:text-[9rem] mb-8 max-w-4xl">
            Broken but still coloring.
          </h1>

          <p className="text-cream/60 text-base md:text-lg max-w-md mb-10 leading-relaxed">
            Some people stop when things break. Wavyarnold makes music instead.
            Newark-built. Emotion-forward. Always moving.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/music" className="btn-amber">
              Stream Now
            </Link>
            <Link href="/join" className="btn-outline border-cream text-cream hover:bg-cream hover:text-midnight">
              Join the List
            </Link>
          </div>
        </div>
      </section>

      {/* ── New Music ─────────────────────────────────────────── */}
      <section className="bg-cream py-20 md:py-28" aria-labelledby="new-music-heading">
        <div className="max-w-screen-xl mx-auto px-6">
          <p className="section-label text-iron-light mb-3">Latest Release</p>
          <h2 id="new-music-heading" className="display-heading text-midnight text-4xl md:text-6xl mb-12">
            New Music
          </h2>

          {/* Release card placeholder — swap in real release data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-iron/10">
            <div className="bg-iron aspect-square md:aspect-auto flex items-center justify-center">
              <span className="text-cream/20 text-sm uppercase tracking-widest">Cover Art</span>
            </div>
            <div className="bg-midnight p-10 md:p-16 flex flex-col justify-between min-h-[320px]">
              <div>
                <p className="section-label text-amber mb-4">Single · 2026</p>
                <h3 className="display-heading text-cream text-3xl md:text-4xl mb-4">
                  [Latest Release Title]
                </h3>
                <p className="text-cream/60 text-sm leading-relaxed max-w-sm">
                  The music doesn't lie. Stream everywhere now.
                </p>
              </div>
              <Link href="/music" className="btn-amber mt-8 self-start">
                Stream Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── About ─────────────────────────────────────────────── */}
      <section className="bg-midnight py-20 md:py-28 grain-overlay" aria-labelledby="about-heading">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-label text-amber mb-3">About Wavyarnold</p>
              <h2 id="about-heading" className="display-heading text-cream text-4xl md:text-5xl mb-6">
                Newark, NJ.<br />Hip-Hop, Rap,<br />Alternative, R&amp;B.
              </h2>
              <p className="text-cream/60 text-sm md:text-base leading-relaxed mb-8 max-w-md">
                His music lives in the space between breaking down and breaking through —
                raw enough to feel it, layered enough to keep coming back. He&apos;s
                building something real, one release at a time, from a city that never
                made it easy.
              </p>
              <Link href="/about" className="btn-outline border-cream text-cream hover:bg-cream hover:text-midnight">
                Full Story
              </Link>
            </div>

            {/* Visual block */}
            <div className="relative">
              <div className="aspect-[3/4] bg-iron flex items-center justify-center">
                <span className="text-cream/10 text-sm uppercase tracking-widest">Photo</span>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Upcoming Shows ────────────────────────────────────── */}
      <section className="bg-cream-dark py-20 md:py-28" aria-labelledby="shows-heading">
        <div className="max-w-screen-xl mx-auto px-6">
          <p className="section-label text-iron-light mb-3">Live</p>
          <h2 id="shows-heading" className="display-heading text-midnight text-4xl md:text-6xl mb-12">
            Upcoming Shows
          </h2>

          {/* Show rows — placeholder */}
          <div className="space-y-0 border-t border-iron/10">
            {[
              { date: 'TBA', venue: 'Venue TBA', city: 'Newark, NJ' },
              { date: 'TBA', venue: 'Venue TBA', city: 'Jersey City, NJ' },
            ].map((show, i) => (
              <div
                key={i}
                className="grid grid-cols-3 md:grid-cols-4 py-5 border-b border-iron/10 items-center gap-4"
              >
                <span className="font-display font-bold text-midnight text-lg">{show.date}</span>
                <span className="text-iron text-sm col-span-2 md:col-span-1">{show.venue}</span>
                <span className="text-iron-light text-sm hidden md:block">{show.city}</span>
                <Link href="/shows" className="text-xs uppercase tracking-widest text-amber hover:underline text-right">
                  Details →
                </Link>
              </div>
            ))}
          </div>

          <Link href="/shows" className="btn-primary mt-12 inline-block">
            All Dates
          </Link>
        </div>
      </section>

      {/* ── Stay Connected / Join CTA ─────────────────────────── */}
      <section className="bg-amber py-20 md:py-28" aria-labelledby="join-heading">
        <div className="max-w-screen-xl mx-auto px-6 text-center">
          <p className="section-label text-midnight/50 mb-3">Stay Connected</p>
          <h2 id="join-heading" className="display-heading text-midnight text-4xl md:text-6xl mb-4">
            Color the noise.
          </h2>
          <h3 className="text-midnight/70 text-lg md:text-xl mb-10 font-sans font-normal">
            Join the list — new music, show dates, and nothing you didn&apos;t ask for.
          </h3>
          <Link href="/join" className="btn-primary">
            Get in First
          </Link>
        </div>
      </section>
    </>
  )
}
