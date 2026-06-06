import type { Metadata } from 'next';
import './globals.css';
import { Outfit } from 'next/font/google';
import { Footer } from '@/components/layout';
import { ThemeProvider } from '@/lib/theme';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SMARTSORT AI | Smart Waste Ecosystem',
  description: 'AI-Based Smart Waste Classification & Recycling Ecosystem powered by Gemini API.',
  icons: {
    icon: '/favicon.ico',
  },
};

const antiFOUCScript = `
  (function() {
    try {
      var theme = localStorage.getItem('smartsort-theme');
      if (!theme || theme === 'system') {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
        }
      } else if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } catch(e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: antiFOUCScript }} />
      </head>
      <body
        className={`${outfit.className} bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 selection:bg-eco-500 selection:text-white`}
      >
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}