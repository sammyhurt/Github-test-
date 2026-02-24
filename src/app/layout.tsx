import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Subletly — Brooklyn Furnished Rentals',
    template: '%s | Subletly',
  },
  description:
    "Brooklyn's furnished rental network for travel nurses, healthcare workers, and professionals. Skip the broker. Get matched.",
  keywords: [
    'furnished rentals Brooklyn',
    'travel nurse housing NYC',
    'short term furnished apartment',
    'sublet Brooklyn',
    'Bushwick furnished',
    'Williamsburg sublet',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Subletly',
    title: 'Subletly — Brooklyn Furnished Rentals',
    description:
      "Skip the broker. Brooklyn's furnished rental network built for healthcare workers and travelers.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4f46e5',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
