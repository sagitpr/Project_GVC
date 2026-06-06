'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, X, Leaf, Moon, Sun, User } from 'lucide-react';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { useTheme } from '@/lib/theme';

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/scanner', label: 'Scan' },
  { href: '/education', label: 'Edukasi' },
  { href: '/community', label: 'Komunitas' },
  { href: '/pickup', label: 'Pickup' },
  { href: '/wallet', label: 'Dompet' },
  { href: '/partners', label: 'Mitra' },
  { href: '/dashboard', label: 'Dampak' },
  { href: '/history', label: 'Riwayat' },
];

function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:text-amber-500 dark:hover:text-amber-400"
      aria-label={resolvedTheme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
      title={resolvedTheme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
    >
      <Sun className="size-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute inset-0 m-auto size-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
    </button>
  );
}

export function AppHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="eco-glass border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="section-eco">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-eco-500 to-teal-500 shadow-sm">
                <Leaf className="size-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                Smart<span className="text-eco-600">Sort</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                    pathname === link.href
                      ? 'bg-eco-100 dark:bg-eco-900/50 text-eco-700 dark:text-eco-300'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-1">
              {/* Dark mode toggle */}
              <ThemeToggle />
              <NotificationBell />
              <Link
                href="/auth"
                className="btn-eco-ghost text-sm"
              >
                Masuk
              </Link>
              <Link
                href="/auth?register=1"
                className="btn-eco-primary text-sm px-5 py-2"
              >
                Daftar
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
            >
              {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden eco-glass border-b border-slate-200/60 dark:border-slate-700/60">
          <div className="section-eco py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300',
                  pathname === link.href
                    ? 'bg-eco-100 dark:bg-eco-900/50 text-eco-700 dark:text-eco-300'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-3 border-slate-200 dark:border-slate-700" />

            {/* Dark mode toggle in mobile */}
            <div className="px-4 py-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Tampilan</span>
                <ThemeToggle />
              </div>
            </div>

            <hr className="my-3 border-slate-200 dark:border-slate-700" />
            <Link
              href="/auth"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <User className="size-4" />
              Masuk
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
