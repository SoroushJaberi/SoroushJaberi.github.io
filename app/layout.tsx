import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono, Instrument_Serif } from 'next/font/google';
import './globals.css';

// Optimized, self-hosted at build time — no runtime requests, no layout shift.
const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});
const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});
const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const siteUrl = 'https://soroushjaberi.github.io';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Soroush Jaberi | AI Researcher & Data Scientist',
    template: '%s | Soroush Jaberi',
  },
  description:
    'AI Researcher and Data Scientist focused on NLP, medical imaging, retrieval-augmented generation, and practical machine learning systems.',
  keywords: [
    'Soroush Jaberi',
    'AI Researcher',
    'Data Scientist',
    'Machine Learning',
    'Deep Learning',
    'NLP',
    'Medical AI',
    'Computer Vision',
    'RAG',
    'Large Language Models',
    'Persian Sentiment Analysis',
  ],
  authors: [{ name: 'Soroush Jaberi' }],
  creator: 'Soroush Jaberi',
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Soroush Jaberi | AI Researcher & Data Scientist',
    description:
      'Research-driven machine learning systems for NLP, medical imaging, and intelligent document retrieval.',
    url: siteUrl,
    siteName: 'Soroush Jaberi Portfolio',
    type: 'website',
  },
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${display.variable} ${mono.variable} ${serif.variable}`}>
      <body className="antialiased min-h-screen selection:bg-primary selection:text-primary-foreground bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
