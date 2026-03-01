import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Booking, Press & Partnerships — Wavyarnold',
  description:
    'Contact Wavyarnold for booking, press, and partnerships. Newark, NJ hip-hop artist available for live performances across the Northeast.',
  keywords: ['wavyarnold booking', 'book wavyarnold', 'wavyarnold press contact', 'newark hip hop artist booking'],
  alternates: { canonical: 'https://wavyarnold.com/contact' },
}

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Wavyarnold',
  url: 'https://wavyarnold.com/contact',
  description: 'Booking, press, and partnership contact for Wavyarnold.',
}

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />

      {/* ── Page header ───────────────────────────────────────── */}
      <section className="grain-overlay bg-midnight page-content pt-20 pb-24" aria-labelledby="contact-h1">
        <div className="max-w-screen-xl mx-auto px-6">
          <p className="section-label text-amber mb-4">Contact</p>
          <h1 id="contact-h1" className="display-heading text-cream text-5xl md:text-7xl max-w-3xl">
            Booking, Press &amp; Partnerships
          </h1>
        </div>
      </section>

      {/* ── Contact forms ─────────────────────────────────────── */}
      <section className="bg-cream py-20">
        <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-0">

          {/* Venues & Promoters */}
          <div className="bg-midnight p-10 md:p-14" aria-labelledby="venues-heading">
            <h2 id="venues-heading" className="display-heading text-cream text-2xl md:text-3xl mb-2">
              For Venues &amp; Promoters
            </h2>
            <p className="text-cream/50 text-sm mb-8">Booking inquiries for live performances.</p>

            <form className="flex flex-col gap-4" aria-label="Booking inquiry form">
              <div>
                <label htmlFor="booking-name" className="block text-xs uppercase tracking-widest text-cream/40 mb-1">Name</label>
                <input
                  id="booking-name"
                  type="text"
                  name="name"
                  required
                  className="w-full bg-iron text-cream px-4 py-3 text-sm font-sans outline-none border border-iron/50 focus:border-amber transition-colors"
                  placeholder="Your name / venue"
                />
              </div>
              <div>
                <label htmlFor="booking-email" className="block text-xs uppercase tracking-widest text-cream/40 mb-1">Email</label>
                <input
                  id="booking-email"
                  type="email"
                  name="email"
                  required
                  className="w-full bg-iron text-cream px-4 py-3 text-sm font-sans outline-none border border-iron/50 focus:border-amber transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="booking-message" className="block text-xs uppercase tracking-widest text-cream/40 mb-1">Details</label>
                <textarea
                  id="booking-message"
                  name="message"
                  rows={4}
                  required
                  className="w-full bg-iron text-cream px-4 py-3 text-sm font-sans outline-none border border-iron/50 focus:border-amber transition-colors resize-none"
                  placeholder="Date, venue, city, and event type"
                />
              </div>
              <button type="submit" className="btn-amber">
                Send Booking Inquiry
              </button>
            </form>
          </div>

          {/* Press & General */}
          <div className="bg-cream-dark p-10 md:p-14 border-l border-iron/10" aria-labelledby="press-contact-heading">
            <div className="mb-14">
              <h2 id="press-contact-heading" className="display-heading text-midnight text-2xl md:text-3xl mb-2">
                For Press &amp; Media
              </h2>
              <p className="text-iron text-sm mb-6">
                Interview requests, editorial features, and press inquiries.
              </p>
              <a
                href="mailto:press@wavyarnold.com"
                className="btn-primary text-sm"
                aria-label="Email press inquiries"
              >
                press@wavyarnold.com
              </a>
            </div>

            <div className="border-t border-iron/10 pt-10">
              <h2 className="display-heading text-midnight text-xl md:text-2xl mb-2">
                General
              </h2>
              <p className="text-iron text-sm mb-6">
                Collaboration, features, and everything else.
              </p>
              <a
                href="mailto:contact@wavyarnold.com"
                className="btn-outline text-sm"
                aria-label="Send general contact email"
              >
                contact@wavyarnold.com
              </a>
            </div>

            <div className="border-t border-iron/10 pt-10 mt-10">
              <h2 className="display-heading text-midnight text-xl md:text-2xl mb-2">
                Download the Press Kit
              </h2>
              <p className="text-iron text-sm mb-6">
                Bio, photos, and links — everything in one place.
              </p>
              <a href="#" className="btn-outline text-sm">Download EPK</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="bg-midnight py-16 border-t border-iron">
        <div className="max-w-screen-xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-cream font-sans text-base">
            Not booking? Stay in the loop.
          </p>
          <Link href="/join" className="btn-amber">Join the List</Link>
        </div>
      </section>
    </>
  )
}
