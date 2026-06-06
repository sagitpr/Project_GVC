'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Scan, LayoutDashboard, History, Home, User, Truck, GraduationCap, Users, Wallet } from 'lucide-react';

const bottomLinks = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/scanner', label: 'Scan', icon: Scan },
  { href: '/wallet', label: 'Dompet', icon: Wallet },
  { href: '/education', label: 'Edukasi', icon: GraduationCap },
  { href: '/community', label: 'Komunitas', icon: Users },
  { href: '/dashboard', label: 'Dampak', icon: LayoutDashboard },
  { href: '/auth', label: 'Akun', icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      <div className="eco-glass border-t border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center justify-around py-2 px-2">
          {bottomLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-300',
                  isActive
                    ? 'text-eco-600'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                )}
              >
                <Icon className={cn('size-5', isActive && 'drop-shadow-sm')} />
                <span className="text-[10px] font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
