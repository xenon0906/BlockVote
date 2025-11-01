import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://blockvoteapp.vercel.app'),
  title: {
    default: 'BlockVote - Decentralized Voting Platform',
    template: '%s | BlockVote'
  },
  description: 'Create polls, vote transparently, and earn rewards on Ethereum blockchain. Free, secure, and decentralized voting system with instant rewards.',
  keywords: ['blockchain', 'voting', 'decentralized', 'ethereum', 'web3', 'poll', 'cryptocurrency', 'dao', 'governance'],
  authors: [{ name: 'BlockVote' }],
  creator: 'BlockVote',
  publisher: 'BlockVote',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'BlockVote',
    startupImage: [
      '/apple-touch-icon.png',
    ],
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#6366f1' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://blockvoteapp.vercel.app',
    siteName: 'BlockVote',
    title: 'BlockVote - Decentralized Voting Platform',
    description: 'Create polls, vote transparently, and earn rewards on Ethereum blockchain',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BlockVote - Decentralized Voting Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlockVote - Decentralized Voting Platform',
    description: 'Create polls, vote transparently, and earn rewards on blockchain',
    images: ['/og-image.png'],
    creator: '@blockvote',
  },
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
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#6366f1" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
