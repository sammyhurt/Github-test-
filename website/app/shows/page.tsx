import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Wavyarnold — Live Shows & Upcoming Dates | Newark Hip-Hop',
  description:
    'Wavyarnold live shows and upcoming tour dates. Hip-hop shows Newark NJ and the Northeast. Book Wavyarnold for your venue.',
  keywords: ['wavyarnold shows', 'wavyarnold live', 'wavyarnold tour dates', 'hip hop shows newark nj'],
  alternates: { canonical: 'https://wavyarnold.com/shows' },
}

const upcomingShows = [
  { date: 'TBA', venue: 'Venue TBA', city: 'Newark, NJ', tickets: '#' },
  { date: 'TBA', venue: 'Venue TBA', city: 'Jersey City, NJ', tickets: '#' },
]

const pastShows = [
  { date: '2025', venue: 'Past Venue', city: 'Newark, NJ' },
  { date: '2025', venue: 'Past Venue', city: 'New York, NY' },
  { date: '2024', venue: 'Past Venue', city: 'Elizabeth, NJ' },
]

const eventSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Wavyarnold Upcoming Shows',
  itemListElement: upcomingShows.map((show, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Event',
      name: `Wavyarnold Live — ${show.venue}`,
      startDate: show.date,
      location: {
        '@type': 'Place',
        name: show.venue,
        address: {
          '@type': 'PostalAddress',
          addressLocality: show.city,
          addressCountry: 'US',
        },
      },
      performer: {
        '@type': 'MusicGroup',
        name: 'Wavyarnold',
      },
    },
  })),
}

export default function ShowsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />

      {/* ── Page header ───────────────────────────────────────── */}
      <section className="grain-overlay bg-midnight page-content pt-20 pb-24" aria-labelledby="shows-h1">
        <div className="max-w-screen-xl mx-auto px-6">
          <p className="section-label text-amber mb-4">Live</p>
          <h1 id="shows-h1" className="display-heading text-cream text-5xl md:text-7xl lg:text-8xl max-w-3xl">
            Live Shows &amp; Upcoming Dates
          </h1>
        </div>
      </section>

      {/* ── Upcoming Shows ────────────────────────────────────── */}
      <section className="bg-cream py-20" aria-labelledby="upcoming-heading">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 id="upcoming-heading" className="display-heading text-midnight text-3xl md:text-5xl mb-10">
            Upcoming Shows
          </h2>

          <div className="border-t border-iron/10">
            {upcomingShows.length > 0 ? (
              upcomingShows.map((show, i) => (
                <div
                  key={i}
                  className="grid grid-cols-2 md:grid-cols-4 py-6 border-b border-iron/10 items-center gap-4"
                >
                  <span className="font-display font-bold text-midnight text-xl">{show.date}</span>
                  <span className="text-iron text-sm">{show.venue}</span>
                  <span className="text-iron-light text-sm hidden md:block">{show.city}</span>
                  <a
                    href={show.tickets}
                    className="btn-amber text-xs text-center"
                  >
                    Tickets
                  </a>
                </div>
              ))
            ) : (
              <div className="py-16 text-center">
                <p className="text-iron text-base">No shows announced yet.</p>
                <p className="text-iron-light text-sm mt-2">
                  <Link href="/join" className="text-amber hover:underline">Join the list</Link> to be first when dates drop.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Past Shows ────────────────────────────────────────── */}
      <section className="bg-cream-dark py-20" aria-labelledby="past-shows-heading">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 id="past-shows-heading" className="display-heading text-midnight text-3xl md:text-4xl mb-8">
            Past Shows
          </h2>
          <div className="border-t border-iron/10 max-w-2xl">
            {pastShows.map((show, i) => (
              <div key={i} className="grid grid-cols-3 py-4 border-b border-iron/10 text-sm gap-4">
                <span className="text-iron-light">{show.date}</span>
                <span className="text-iron">{show.venue}</span>
                <span className="text-iron-light">{show.city}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Book Wavyarnold ───────────────────────────────────── */}
      <section className="bg-midnight grain-overlay py-20" aria-labelledby="book-heading">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 id="book-heading" className="display-heading text-cream text-3xl md:text-5xl mb-4">
            Book Wavyarnold
          </h2>
          <h3 className="text-amber text-lg mb-6 font-sans font-normal">
            For venues, promoters, and event coordinators
          </h3>
          <p className="text-cream/60 text-sm leading-relaxed max-w-lg mb-10">
            Wavyarnold performs across Hip-Hop, Alternative, and R&amp;B contexts and has the
            range to fit a variety of lineups and venues. Booking across the Northeast —
            Newark, Jersey City, New York, Philadelphia, and beyond.
          </p>
          <Link href="/contact" className="btn-amber">
            Contact for Booking
          </Link>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="bg-amber py-16">
        <div className="max-w-screen-xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-display font-bold text-midnight text-xl md:text-2xl">
            Show dates land in your inbox first.
          </p>
          <Link href="/join" className="btn-primary">Join the List</Link>
        </div>
      </section>
    </>
  )
}
