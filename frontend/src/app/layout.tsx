import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SMARTSORT AI | Smart Waste Ecosystem',
  description: 'AI-Based Smart Waste Classification & Recycling Ecosystem powered by Gemini API.',
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
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <style>{`
          body {
            font-family: 'Outfit', sans-serif;
          }
        `}</style>
      </head>
      <body className="bg-tesla-white text-tesla-dark selection:bg-tesla-blue selection:text-white">
        {children}
      </body>
    </html>
  );
}
