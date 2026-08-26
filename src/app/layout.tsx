// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://tariffecomuni.it'),
  title: {
    default: 'TariffeComuni.it — Confronta offerte luce e gas per il tuo comune',
    template: '%s | TariffeComuni.it',
  },
  description: 'Il comparatore indipendente di tariffe energia per tutti i 7.900 comuni italiani. Dati ARERA aggiornati, zero pubblicità invasiva.',
  keywords: ['tariffe luce', 'tariffe gas', 'confronto energia', 'bolletta luce', 'bolletta gas', 'risparmio energia'],
  authors: [{ name: 'TariffeComuni.it' }],
  creator: 'TariffeComuni.it',
  publisher: 'TariffeComuni.it',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: 'https://tariffecomuni.it',
    siteName: 'TariffeComuni.it',
    title: 'TariffeComuni.it — Confronta offerte luce e gas per il tuo comune',
    description: 'Il comparatore indipendente di tariffe energia per tutti i 7.900 comuni italiani.',
    images: [
      { url: '/og-image.svg', width: 1200, height: 630, alt: 'TariffeComuni.it - Confronto tariffe energia per comune' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TariffeComuni.it',
    description: 'Confronta le tariffe luce e gas nel tuo comune. Dati ARERA aggiornati.',
    images: ['/og-image.svg'],
  },
  verification: {
    google: 'TUO_CODICE_GOOGLE_SEARCH_CONSOLE',
  },
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <link rel="sitemap" href="/sitemap.xml" />
        <link rel="alternate" type="application/rss+xml" title="TariffeComuni.it" href="/feed.xml" />
      </head>
      <body className="antialiased text-gray-900">{children}</body>
    </html>
  );
}