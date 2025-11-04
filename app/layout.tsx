import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#8b5cf6' },
    { media: '(prefers-color-scheme: dark)', color: '#8b5cf6' }
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL('https://blockvoteapp.vercel.app'),
  title: {
    default: 'BlockVote - Decentralized Blockchain Polling Platform',
    template: '%s | BlockVote'
  },
  description: 'Create and participate in transparent, secure blockchain polls. Vote on Ethereum Sepolia with complete transparency. Every vote counts, every opinion matters.',
  keywords: ['blockchain', 'voting', 'polls', 'ethereum', 'web3', 'decentralized', 'crypto', 'dapp', 'sepolia', 'poll creation', 'transparent voting'],
  authors: [{ name: 'BlockVote Team' }],
  creator: 'BlockVote',
  publisher: 'BlockVote',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://blockvoteapp.vercel.app',
    siteName: 'BlockVote',
    title: 'BlockVote - Decentralized Blockchain Polling',
    description: 'Create and participate in transparent, secure blockchain polls. Your voice matters on the blockchain.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BlockVote - Decentralized Polling Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlockVote - Decentralized Blockchain Polling',
    description: 'Create and participate in transparent, secure blockchain polls powered by Ethereum.',
    images: ['/og-image.png'],
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
  alternates: {
    canonical: 'https://blockvoteapp.vercel.app',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://sepolia.infura.io" />
        <link rel="dns-prefetch" href="https://sepolia.etherscan.io" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
