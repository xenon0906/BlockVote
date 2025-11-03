import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BlockVote - Decentralized Polling Platform',
  description: 'Create and vote on polls using blockchain technology',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
