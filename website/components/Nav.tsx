'use client'

import Link from 'next/link'
import { useState } from 'react'

const links = [
  { href: '/music', label: 'Music' },
  { href: '/shows', label: 'Shows' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-cream border-b border-iron/10"
        style={{ height: 'var(--header-height)' }}
      >
        <div className="max-w-screen-xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo / Wordmark */}
          <Link
            href="/"
            className="font-display font-bold text-midnight text-xl tracking-tight hover:text-iron transition-colors"
            aria-label="Wavyarnold — Home"
          >
            WAVYARNOLD
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="nav-link text-iron hover:text-midnight"
              >
                {l.label}
              </Link>
            ))}
            <Link href="/join" className="btn-primary py-2 px-5 text-xs">
              Join the List
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span
              className={`block h-[2px] w-6 bg-midnight transition-transform duration-200 ${open ? 'translate-y-[7px] rotate-45' : ''}`}
            />
            <span
              className={`block h-[2px] w-6 bg-midnight transition-opacity duration-200 ${open ? 'opacity-0' : ''}`}
            />
            <span
              className={`block h-[2px] w-6 bg-midnight transition-transform duration-200 ${open ? '-translate-y-[7px] -rotate-45' : ''}`}
            />
          </button>
        </div>
      </header>

      {/* Mobile menu drawer */}
      {open && (
        <div className="fixed inset-0 z-40 bg-cream pt-[69px]" role="dialog" aria-label="Mobile navigation">
          <nav className="flex flex-col px-6 py-8 gap-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-2xl font-display font-bold text-midnight border-b border-iron/10 pb-6"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/join" className="btn-amber mt-4 text-center" onClick={() => setOpen(false)}>
              Join the List
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}
