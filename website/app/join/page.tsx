import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Join the List — Wavyarnold',
  description:
    'Get Wavyarnold\'s new music, show dates, and nothing you didn\'t sign up for. Join the fan list.',
  keywords: ['wavyarnold newsletter', 'wavyarnold fan list', 'wavyarnold updates'],
  alternates: { canonical: 'https://wavyarnold.com/join' },
}

export default function JoinPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="grain-overlay bg-midnight min-h-screen page-content flex flex-col justify-center" aria-labelledby="join-h1">
        <div className="max-w-screen-xl mx-auto px-6 py-20 w-full">
          <div className="max-w-2xl">
            <p className="section-label text-amber mb-6">Stay Connected</p>
            <h1 id="join-h1" className="display-heading text-cream text-6xl md:text-8xl mb-6">
              Get in First.
            </h1>

            <h2 className="text-cream/70 text-lg md:text-xl mb-12 font-sans font-normal leading-relaxed">
              New music. Show dates. Nothing you didn&apos;t sign up for.
            </h2>

            {/* Email capture form */}
            <form
              className="flex flex-col sm:flex-row gap-0 border border-iron max-w-md"
              aria-label="Email signup form"
            >
              <label htmlFor="email-input" className="sr-only">Email address</label>
              <input
                id="email-input"
                type="email"
                name="email"
                placeholder="Your email"
                required
                className="flex-1 bg-iron text-cream placeholder-cream/30 px-5 py-4 text-sm font-sans outline-none border-0"
                autoComplete="email"
              />
              <button
                type="submit"
                className="bg-amber text-midnight px-6 py-4 text-xs uppercase tracking-widest font-sans hover:bg-amber-dark transition-colors whitespace-nowrap"
              >
                Join
              </button>
            </form>

            <p className="text-cream/30 text-xs mt-4">
              No spam. No selling your info. Just the real stuff.
            </p>
          </div>
        </div>
      </section>

      {/* ── Why Join ──────────────────────────────────────────── */}
      <section className="bg-cream py-20" aria-labelledby="why-join-heading">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 id="why-join-heading" className="display-heading text-midnight text-3xl md:text-5xl mb-12">
            Why Join?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-iron/10">
            {[
              {
                title: 'New releases before they drop',
                desc: 'Hear the music before it hits streaming. First access, every time.',
              },
              {
                title: 'Show dates and presale access',
                desc: 'Tour announcements and ticket presales go to the list first.',
              },
              {
                title: 'Occasional real talk from the artist',
                desc: 'Not a PR newsletter. Actual notes when there\'s something worth saying.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="border-b md:border-b-0 md:border-r border-iron/10 last:border-0 p-10"
              >
                <div className="w-8 h-[2px] bg-amber mb-6" aria-hidden="true" />
                <h3 className="display-heading text-midnight text-xl mb-3">{item.title}</h3>
                <p className="text-iron-light text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Explore ───────────────────────────────────────────── */}
      <section className="bg-midnight py-16 border-t border-iron">
        <div className="max-w-screen-xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-cream font-sans text-base">
            While you&apos;re here — hear the music.
          </p>
          <Link href="/music" className="btn-amber">Stream Now</Link>
        </div>
      </section>
    </>
  )
}
