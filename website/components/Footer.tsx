import Link from 'next/link'

const year = new Date().getFullYear()

const footerLinks = [
  { href: '/music', label: 'Music' },
  { href: '/shows', label: 'Shows' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/join', label: 'Join' },
  { href: '/contact', label: 'Contact' },
]

const social = [
  { href: 'https://instagram.com/wavyarnold', label: 'Instagram' },
  { href: 'https://tiktok.com/@wavyarnold', label: 'TikTok' },
  { href: 'https://open.spotify.com', label: 'Spotify' },
  { href: 'https://music.apple.com', label: 'Apple Music' },
]

export default function Footer() {
  return (
    <footer className="bg-midnight text-cream" aria-label="Site footer">
      <div className="max-w-screen-xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-iron pb-12">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link href="/" className="font-display font-bold text-2xl tracking-tight text-cream hover:text-amber transition-colors">
              WAVYARNOLD
            </Link>
            <p className="mt-3 text-cream-dark/70 text-sm leading-relaxed">
              Broken but still coloring.<br />
              Newark, NJ.
            </p>
            <Link href="/join" className="btn-amber mt-6 text-sm inline-block">
              Join the List
            </Link>
          </div>

          {/* Site links */}
          <div>
            <p className="section-label text-cream/40 mb-4">Navigate</p>
            <ul className="flex flex-col gap-3">
              {footerLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-cream/70 hover:text-cream text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social links */}
          <div>
            <p className="section-label text-cream/40 mb-4">Stream & Follow</p>
            <ul className="flex flex-col gap-3">
              {social.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream/70 hover:text-amber text-sm transition-colors"
                  >
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-cream/30 text-xs">
            © {year} Wavyarnold. All rights reserved. Newark, NJ.
          </p>
          <p className="text-cream/30 text-xs">
            Hip-Hop · Alternative · R&amp;B
          </p>
        </div>
      </div>
    </footer>
  )
}
