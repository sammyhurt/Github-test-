import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Wavyarnold — Newark, NJ Hip-Hop Artist',
  description:
    'Wavyarnold bio — Hip-Hop, R&B, and Alternative artist based in Newark, NJ. Building something real, one release at a time.',
  keywords: ['wavyarnold bio', 'wavyarnold artist', 'newark nj hip hop artist bio', 'independent hip hop artist newark'],
  alternates: { canonical: 'https://wavyarnold.com/about' },
}

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Wavyarnold',
  url: 'https://wavyarnold.com/about',
  jobTitle: 'Recording Artist',
  description:
    'Wavyarnold is a Hip-Hop, R&B, and Alternative artist based in Newark, NJ.',
  genre: ['Hip-Hop', 'Rap', 'Alternative', 'R&B'],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Newark',
    addressRegion: 'NJ',
    addressCountry: 'US',
  },
  sameAs: [
    'https://instagram.com/wavyarnold',
    'https://tiktok.com/@wavyarnold',
  ],
}

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

      {/* ── Page header ───────────────────────────────────────── */}
      <section className="grain-overlay bg-midnight page-content pt-20 pb-24 md:pb-32" aria-labelledby="about-h1">
        <div className="max-w-screen-xl mx-auto px-6">
          <p className="section-label text-amber mb-4">About</p>
          <h1 id="about-h1" className="display-heading text-cream text-5xl md:text-7xl lg:text-8xl max-w-3xl">
            Wavyarnold —<br />Newark, NJ Artist
          </h1>
        </div>
      </section>

      {/* ── Short bio ─────────────────────────────────────────── */}
      <section className="bg-cream py-20" aria-labelledby="short-bio-heading">
        <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Photo placeholder */}
          <div className="relative">
            <div className="aspect-[4/5] bg-iron flex items-center justify-center">
              <span className="text-cream/10 text-sm uppercase tracking-widest">Photo</span>
            </div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-amber" aria-hidden="true" />
          </div>

          <div>
            <h2 id="short-bio-heading" className="display-heading text-midnight text-3xl md:text-4xl mb-6">
              The Short Version
            </h2>
            <p className="text-iron text-base md:text-lg leading-relaxed mb-10">
              Wavyarnold is a Hip-Hop, R&amp;B, and Alternative artist out of Newark, NJ.
              His music lives in the space between breaking down and breaking through —
              raw enough to feel it, layered enough to keep coming back. He&apos;s building
              something real, one release at a time, from a city that never made it easy.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/music" className="btn-primary">Hear the Music</Link>
              <Link href="/contact" className="btn-outline">Press &amp; Booking</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Full story ────────────────────────────────────────── */}
      <section className="bg-cream-dark py-20" aria-labelledby="full-story-heading">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="max-w-3xl">
            <h2 id="full-story-heading" className="display-heading text-midnight text-3xl md:text-5xl mb-10">
              The Full Story
            </h2>

            <div className="space-y-6 text-iron text-base leading-relaxed">
              <p>
                There&apos;s a certain kind of artist who comes up in Newark — one shaped less
                by opportunity and more by the decision to keep going when opportunity doesn&apos;t
                show. Wavyarnold is that kind of artist.
              </p>
              <p>
                Born and based in Newark, NJ, Wavyarnold makes Hip-Hop, Rap, Alternative, and
                R&amp;B music that refuses to pick one lane and stay there. His catalog moves
                between the blunt, percussive energy of street rap and the slower burn of
                alternative R&amp;B — sometimes within the same track. What holds it together
                isn&apos;t genre, it&apos;s perspective. Every song sounds like someone being honest
                about something hard.
              </p>
              <p>
                His core theme — <em>broken but still coloring</em> — isn&apos;t a marketing line.
                It&apos;s a description of the work. Wavyarnold makes music for the people who are
                still functioning through something, still creating, still showing up even when
                the internal picture is cracked.
              </p>
              <p>
                The Newark roots are never incidental. This is a city that demands a certain
                kind of realness — where hype fades fast and consistency means something.
                Wavyarnold&apos;s approach to his craft reflects that environment: no shortcuts,
                no forced moments, no manufactured personality. The work speaks for itself,
                and it&apos;s being built to last.
              </p>
              <p>
                Right now, Wavyarnold is in a deliberate growth phase: building his streaming
                presence, deepening his fan community, securing consistent bookings across the
                Northeast, and creating the kind of content that keeps people engaged between
                releases. He&apos;s not chasing virality. He&apos;s building an audience that actually
                comes back.
              </p>
              <p>
                This is a career being built with intention, from Newark, NJ — and it&apos;s moving.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Genres & Sound ────────────────────────────────────── */}
      <section className="bg-midnight py-20 grain-overlay" aria-labelledby="genres-heading">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 id="genres-heading" className="display-heading text-cream text-3xl md:text-5xl mb-12">
            Genres &amp; Sound
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-iron">
            {[
              {
                title: 'Hip-Hop / Rap',
                desc: 'Percussive, direct, rooted in Newark\'s street-level reality. The blunt end of the catalog.',
              },
              {
                title: 'Alternative',
                desc: 'Cross-genre emotional depth. Songs that sit in the slow burn between rap and something harder to name.',
              },
              {
                title: 'R&B',
                desc: 'Feeling over formula. The melodic thread that holds the harder material together.',
              },
            ].map((g) => (
              <div key={g.title} className="border-b md:border-b-0 md:border-r border-iron last:border-0 p-10">
                <h3 className="display-heading text-amber text-xl mb-4">{g.title}</h3>
                <p className="text-cream/60 text-sm leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── From Newark ───────────────────────────────────────── */}
      <section className="bg-cream py-20" aria-labelledby="newark-heading">
        <div className="max-w-screen-xl mx-auto px-6 max-w-3xl">
          <h2 id="newark-heading" className="display-heading text-midnight text-3xl md:text-5xl mb-6">
            From Newark
          </h2>
          <p className="text-iron text-base leading-relaxed mb-4">
            Newark isn&apos;t a backdrop. It&apos;s a character in every record. Made in Newark —
            this one&apos;s for everyone who stayed.
          </p>
          <p className="text-iron text-base leading-relaxed">
            The city shaped the voice, the standard, and the drive to build something that
            outlasts the moment. When you hear the music, you hear Newark: Jersey City,
            Elizabeth, Irvington — the whole region that knows what it means to keep
            moving when the odds don&apos;t care.
          </p>
        </div>
      </section>

      {/* ── Press & Booking ───────────────────────────────────── */}
      <section className="bg-amber py-20" aria-labelledby="press-heading">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 id="press-heading" className="display-heading text-midnight text-3xl md:text-5xl mb-12">
            Press &amp; Booking
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-midnight p-10">
              <h3 className="display-heading text-cream text-xl mb-3">Download Press Kit</h3>
              <p className="text-cream/60 text-sm mb-6">Bio, photos, and links — everything you need in one place.</p>
              <a href="#" className="btn-amber text-sm">Download EPK</a>
            </div>
            <div className="bg-midnight p-10">
              <h3 className="display-heading text-cream text-xl mb-3">Contact for Bookings</h3>
              <p className="text-cream/60 text-sm mb-6">For venues, promoters, and event coordinators across the Northeast.</p>
              <Link href="/contact" className="btn-amber text-sm">Get in Touch</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA: Join ─────────────────────────────────────────── */}
      <section className="bg-midnight py-16 border-t border-iron">
        <div className="max-w-screen-xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-cream font-display font-bold text-xl md:text-2xl">
            Stay connected. New music first.
          </p>
          <Link href="/join" className="btn-amber">Join the List</Link>
        </div>
      </section>
    </>
  )
}
