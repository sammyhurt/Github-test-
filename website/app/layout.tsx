import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  metadataBase: new URL('https://wavyarnold.com'),
  title: {
    template: '%s | Wavyarnold',
    default: 'Wavyarnold — Newark, NJ Rapper | Hip-Hop, R&B, Alternative',
  },
  description:
    'Wavyarnold is a Hip-Hop, R&B, and Alternative artist from Newark, NJ. Music for people who feel things deeply. Broken but still coloring.',
  keywords: [
    'wavyarnold',
    'newark nj rapper',
    'newark hip hop artist',
    'newark nj r&b artist',
    'alternative hip hop newark',
  ],
  openGraph: {
    siteName: 'Wavyarnold',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
