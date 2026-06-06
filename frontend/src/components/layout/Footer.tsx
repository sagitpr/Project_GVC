import Link from 'next/link';
import { Leaf, Recycle, Factory, HeartHandshake, MapPin, Mail } from 'lucide-react';

const footerLinks = {
  platform: [
    { label: 'AI Scanner', href: '/scanner' },
    { label: 'Dashboard Dampak', href: '/dashboard' },
    { label: 'Riwayat Scan', href: '/history' },
    { label: 'Jemput Sampah', href: '/pickup' },
    { label: 'Mitra Pengolahan', href: '/partners' },
  ],
  ekosistem: [
    { label: 'Edukasi', href: '/education' },
    { label: 'Komunitas', href: '/community' },
    { label: 'Dompet Digital', href: '/wallet' },
    { label: 'Pusat Reward', href: '/wallet' },
  ],
  perusahaan: [
    { label: 'Tentang SmartSort', href: '#' },
    { label: 'Kebijakan Privasi', href: '#' },
    { label: 'Syarat & Ketentuan', href: '#' },
    { label: 'Karier', href: '#' },
    { label: 'Hubungi Kami', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-white/5">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-eco-500 to-teal-500 shadow-sm shadow-emerald-900/30">
                <Leaf className="size-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-wider text-white">
                Smart<span className="text-eco-400">Sort</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-6">
              National Circular Economy &amp; Resource Recovery Ecosystem — 
              menghubungkan masyarakat, bank sampah, dan industri pengolah 
              dalam satu ekosistem ekonomi sirkular nasional.
            </p>

            {/* Impact stats mini */}
            <div className="flex items-center gap-5 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Recycle className="size-3.5 text-emerald-400" />
                <span>12+ Mitra</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Factory className="size-3.5 text-emerald-400" />
                <span>45+ Pengolah</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HeartHandshake className="size-3.5 text-emerald-400" />
                <span>3.200+ Warga</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-white mb-5">
              Platform
            </h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ecosystem Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-white mb-5">
              Ekosistem
            </h4>
            <ul className="space-y-3">
              {footerLinks.ekosistem.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-white mb-5">
              Perusahaan
            </h4>
            <ul className="space-y-3">
              {footerLinks.perusahaan.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Newsletter CTA */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-white mb-5">
              Ikuti Kami
            </h4>
            <div className="space-y-3">
              <a
                href="mailto:hello@smartsort.id"
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-200"
              >
                <Mail className="size-3.5" />
                <span>hello@smartsort.id</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-200"
              >
                <MapPin className="size-3.5" />
                <span>Indonesia</span>
              </a>
            </div>

            <div className="mt-6">
              <p className="text-xs text-slate-500 mb-3 font-medium">
                Dukung ekonomi sirkular nasional
              </p>
              <Link
                href="/scanner"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold tracking-widest uppercase px-5 py-3 rounded-xl transition-all duration-200"
              >
                Mulai Scan Sekarang
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-600 font-light">
            &copy; {new Date().getFullYear()} SmartSort AI. National Circular Economy &amp; Resource Recovery Ecosystem.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <Leaf className="size-3 text-emerald-500/60" />
              Ramah Lingkungan
            </span>
            <span className="flex items-center gap-1">
              <Recycle className="size-3 text-emerald-500/60" />
              100% Daur Ulang
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
