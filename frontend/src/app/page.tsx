'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Camera,
  BarChart2,
  Leaf,
  ChevronDown,
  User,
  LogOut,
  Sparkles,
  Recycle,
  Truck,
  Wallet,
  GraduationCap,
  Users,
  Award,
  HeartHandshake,
  ScanLine,
  Building2,
  TreePine,
  Factory,
  Globe,
  ArrowRight,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authApi } from '../lib/api';
import Aurora from '../components/Aurora';
import GooeyNav from '../components/ui/GooeyNav';
import GlassIcons from '../components/ui/GlassIcons';
import type { AnimatedListItem } from '../components/AnimatedList';

// Lazy-load below-the-fold and decorative components
const LaserFlow = dynamic(() => import('../components/LaserFlow'), {
  ssr: false,
});
const LiquidEther = dynamic(() => import('../components/LiquidEther'), {
  ssr: false,
});
const ScrollStack = dynamic(() => import('../components/ScrollStack'), {
  ssr: false,
});
const AnimatedList = dynamic(() => import('../components/AnimatedList'), {
  ssr: false,
});

export default function LandingPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    setCurrentUser(authApi.getCurrentUser());
  }, []);

  const prefersReducedMotion = useReducedMotion();

  const handleNavClick = useCallback((item: { label: string; href: string }) => {
    router.push(item.href);
  }, [router]);

  const handleLogout = () => {
    authApi.logout();
    setCurrentUser(null);
    window.location.reload();
  };

  // ScrollStack cards — Resource Recovery Network flow
  const howItWorksCards = [
    {
      icon: <Camera size={26} />,
      title: 'Scan & Klasifikasi',
      content:
        'Gunakan AI Vision untuk memindai sampah Anda. Sistem akan mengidentifikasi jenis material (plastik, organik, kertas, kaca, logam, elektronik) dan membaca label kemasan via OCR dalam hitungan detik.',
    },
    {
      icon: <Sparkles size={26} />,
      title: 'Analisis & Validasi',
      content:
        'AI menghitung skor dampak lingkungan, menentukan kategori daur ulang, dan memberikan rekomendasi penanganan yang tepat untuk setiap jenis sampah.',
    },
    {
      icon: <MapPin size={26} />,
      title: 'Setor ke SmartSort Network',
      content:
        'Setorkan sampah yang sudah diklasifikasi ke jaringan SmartSort. Pilih antara penjemputan langsung (pickup) atau antar ke drop point terdekat di kota Anda.',
    },
    {
      icon: <Building2 size={26} />,
      title: 'Bank Sampah Mitra',
      content:
        'Sampah Anda diterima dan diproses oleh bank sampah mitra terverifikasi. Setiap setoran dicatat dalam sistem Digital Waste Bank dan memberikan kontribusi poin.',
    },
    {
      icon: <Factory size={26} />,
      title: 'Pengolahan Industri',
      content:
        'Material sampah disalurkan ke perusahaan pengolah mitra untuk didaur ulang menjadi bahan baku produk baru — plastik menjadi bijih plastik, kertas menjadi pulp daur ulang, organik menjadi kompos.',
    },
    {
      icon: <Recycle size={26} />,
      title: 'Produk Baru & Dampak Lingkungan',
      content:
        'Hasil daur ulang kembali ke masyarakat dalam bentuk produk baru. Pantau dampak nyata kontribusi Anda: pengurangan CO₂, jumlah kursi taman dari plastik daur ulang, dan lainnya.',
    },
  ];

  // AnimatedList items — ecosystem features
  const featureItems: AnimatedListItem[] = [
    {
      icon: <ScanLine size={18} />,
      title: 'AI Waste Scanner',
      description: 'Deteksi dan klasifikasi 6 jenis material sampah menggunakan AI Vision canggih dengan akurasi tinggi.',
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      icon: <Building2 size={18} />,
      title: 'Resource Recovery Hub',
      description: 'Temukan drop point, bank sampah resmi, dan mitra pengolah terdekat di seluruh Indonesia.',
      color: 'bg-teal-50 text-teal-600',
    },
    {
      icon: <Truck size={18} />,
      title: 'Pickup ke Resource Center',
      description: 'Jadwalkan penjemputan sampah daur ulang dari rumah atau tempat usaha Anda.',
      color: 'bg-sky-50 text-sky-600',
    },
    {
      icon: <Wallet size={18} />,
      title: 'Digital Waste Bank',
      description: 'Setiap setoran tercatat dalam sistem bank sampah digital. Pantau saldo, histori, dan kontribusi Anda.',
      color: 'bg-cyan-50 text-cyan-600',
    },
    {
      icon: <Leaf size={18} />,
      title: 'Smart Impact Tracking',
      description: 'Lihat dampak nyata: berapa kg CO₂ terreduksi, berapa kursi taman dari plastik Anda, berapa pohon terselamatkan.',
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      icon: <Award size={18} />,
      title: 'Eco Points & Rewards',
      description: 'Kumpulkan poin dari setiap kontribusi daur ulang. Tukarkan dengan berbagai reward dan voucher.',
      color: 'bg-amber-50 text-amber-600',
    },
    {
      icon: <BarChart2 size={18} />,
      title: 'Smart City Analytics',
      description: 'Pemerintah daerah dapat memantau volume sampah, tingkat daur ulang, dan partisipasi masyarakat secara real-time.',
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      icon: <GraduationCap size={18} />,
      title: 'Edukasi Lingkungan',
      description: 'Belajar cara memilah sampah, mendaur ulang, dan berkontribusi pada ekonomi sirkular nasional.',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: <Users size={18} />,
      title: 'Komunitas & Tantangan',
      description: 'Gabung komunitas peduli lingkungan, ikuti tantangan eco mission, dan ajak sekolah/kampus/RT Anda berpartisipasi.',
      color: 'bg-violet-50 text-violet-600',
    },
    {
      icon: <Factory size={18} />,
      title: 'Industrial Partner Network',
      description: 'Jaringan perusahaan pengolah daur ulang yang mengubah sampah menjadi bahan baku produk baru.',
      color: 'bg-rose-50 text-rose-600',
    },
  ];

  // Impact stats for section 5
  const impactStats = [
    { value: '12.450', label: 'Kg Sampah Terkelola', icon: <Recycle size={24} /> },
    { value: '28.500', label: 'Kg CO₂ Terreduksi', icon: <Leaf size={24} /> },
    { value: '3.200', label: 'Warga Aktif', icon: <Users size={24} /> },
    { value: '45', label: 'Mitra Pengolah', icon: <Factory size={24} /> },
  ];

  // Partner categories for section 4
  const partnerCategories = [
    { name: 'Pengolah Plastik', desc: 'Mengubah plastik menjadi bijih plastik, serat, dan produk daur ulang.', count: 12 },
    { name: 'Pengolah Organik', desc: 'Mengolah sampah organik menjadi kompos dan biogas.', count: 8 },
    { name: 'Pengolah Kertas', desc: 'Mendaur ulang kertas menjadi pulp dan produk kertas baru.', count: 6 },
    { name: 'Pengolah Logam', desc: 'Melebur dan memurnikan logam untuk digunakan kembali.', count: 5 },
    { name: 'Pengolah Kaca', desc: 'Mendaur ulang kaca menjadi cullet dan produk kaca baru.', count: 4 },
    { name: 'Pengolah Elektronik', desc: 'Mengolah limbah elektronik menjadi material berharga.', count: 10 },
  ];

  return (
    <div className="relative bg-white dark:bg-slate-900 overflow-x-hidden text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* 1. Frosted Glass Floating Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 frosted-glass border-b border-slate-200/60 dark:border-slate-700/60 transition-all duration-300 ease-out py-4 px-6 md:px-12 flex justify-between items-center">
        <Link href="/" className="relative z-10 text-xl md:text-2xl font-bold tracking-[0.25em] text-slate-900 dark:text-white select-none">
          SMARTSORT<span className="text-emerald-500">AI</span>
        </Link>

        <GooeyNav
          items={[
            { label: 'Scanner', href: '/scanner' },
            { label: 'Jemput', href: '/pickup' },
            { label: 'Dampak', href: '/dashboard' },
            { label: 'Mitra', href: '/partners' },
            { label: 'Riwayat', href: '/history' },
          ]}
          className="hidden md:flex"
          animationTime={500}
          particleCount={8}
          particleDistances={[60, 10]}
          particleR={80}
          colors={[0, 3, 2, 0, 3, 2, 0, 1]}
          onItemClick={handleNavClick}
        />

        <div className="flex items-center space-x-4">
          {currentUser ? (
            <div className="flex items-center space-x-3 bg-slate-100/80 dark:bg-slate-800/80 px-4 py-2 rounded-xl">
              <User size={16} className="text-slate-500 dark:text-slate-400" />
              <span className="text-xs font-semibold tracking-wider text-slate-900 dark:text-white uppercase">{currentUser.username}</span>
              <button onClick={handleLogout} className="text-slate-500 hover:text-red-500 transition-colors ml-2" title="Keluar">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link href="/auth" className="text-xs font-semibold tracking-widest text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white uppercase transition-colors">
              Masuk / Daftar
            </Link>
          )}
        </div>
      </header>

      {/* ====================================================================== */}
      {/* SECTION 1: HERO — MASALAH SAMPAH NASIONAL & SOLUSI SMARTSORT            */}
      {/* ====================================================================== */}
      <div className="relative">
        <Aurora className="h-screen w-full flex flex-col justify-between items-center pt-24 pb-12 px-6 relative">
          <LaserFlow flowSpeed={0.15} flowStrength={0.12} lineCount={10} />
          <LiquidEther
            className="z-[2]"
            autoDemo={true}
            autoSpeed={0.15}
            autoIntensity={0.6}
            colors={['#16A34A', '#22C55E', '#BBF7D0']}
          />

          <div className="relative z-10 text-center max-w-4xl mt-16 md:mt-24">
            <p className="text-xs md:text-sm font-semibold tracking-[0.3em] text-emerald-600 uppercase mb-4 animate-fade-in">
              National Circular Economy & Resource Recovery Ecosystem
            </p>
            <h1 className="text-4xl md:text-6xl font-light tracking-tight text-slate-900 dark:text-white leading-tight mb-6">
              Ubah Sampah Jadi <br className="hidden md:inline" />
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-400">
                Sumber Daya Bernilai
              </span>
            </h1>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-light mb-8">
              Indonesia menghasilkan <strong className="text-slate-900 dark:text-white">67,8 juta ton</strong> sampah per tahun. 
              Kurang dari 10% yang didaur ulang. SmartSort menghubungkan masyarakat, bank sampah, 
              dan industri pengolah dalam satu ekosistem ekonomi sirkular nasional — mengubah sampah 
              menjadi sumber daya yang kembali bermanfaat bagi masyarakat.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                href="/scanner"
                className="w-full sm:w-56 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold tracking-widest uppercase py-4 rounded-xl transition-all duration-300 ease-out text-center shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 hover:-translate-y-0.5 active:translate-y-0"
              >
                Mulai Scan Sampah
              </Link>
              <Link
              href="/dashboard"
              className="w-full sm:w-56 border-2 border-slate-900/10 dark:border-white/10 hover:border-emerald-500/30 bg-transparent text-slate-900 dark:text-white text-xs font-semibold tracking-widest uppercase py-4 rounded-xl transition-all duration-300 ease-out text-center hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20"
              >
                Lihat Dampak Lingkungan
              </Link>
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center cursor-pointer text-slate-500 dark:text-slate-400">
            {prefersReducedMotion ? (
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-1">Pelajari Selengkapnya</span>
                <ChevronDown size={16} />
              </div>
            ) : (
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
                className="flex flex-col items-center"
              >
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-1">Pelajari Selengkapnya</span>
                <ChevronDown size={16} />
              </motion.div>
            )}
          </div>
        </Aurora>
      </div>

      {/* ====================================================================== */}
      {/* SECTION 2: BAGAIMANA SMARTSORT BEKERJA (ScrollStack)                    */}
      {/* ====================================================================== */}
      <ScrollStack
        cards={howItWorksCards}
        title="Bagaimana SmartSort Bekerja"
        subtitle="RESOURCE RECOVERY FLOW"
      />

      {/* ====================================================================== */}
      {/* SECTION 3: ALUR DAUR ULANG NASIONAL — Visual Flow                      */}
      {/* ====================================================================== */}
      <section className="bg-gradient-to-b from-white to-emerald-50/30 py-24 px-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(#16A34A0A_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.25em] text-emerald-600 uppercase mb-4">
              ALUR DAUR ULANG NASIONAL
            </p>
            <h2 className="text-2xl md:text-4xl font-light tracking-tight text-slate-900 dark:text-white mb-4">
              Dari Sampah Menjadi <span className="font-semibold text-gradient-eco">Produk Baru</span>
            </h2>
            <div className="w-16 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto" />
          </div>

          {/* Flow Steps */}
          <div className="grid grid-cols-2 md:grid-cols-7 gap-3 md:gap-4 items-start">
            {[
              { label: 'Masyarakat', icon: <Users size={20} />, color: 'bg-emerald-500' },
              { label: 'AI Scan', icon: <ScanLine size={20} />, color: 'bg-teal-500' },
              { label: 'Sorting Center', icon: <Building2 size={20} />, color: 'bg-cyan-500' },
              { label: 'Bank Sampah', icon: <Wallet size={20} />, color: 'bg-emerald-500' },
              { label: 'Industri Pengolah', icon: <Factory size={20} />, color: 'bg-teal-500' },
              { label: 'Produk Baru', icon: <Recycle size={20} />, color: 'bg-cyan-500' },
              { label: 'Kembali ke Masyarakat', icon: <HeartHandshake size={20} />, color: 'bg-emerald-500' },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center text-white shadow-lg mb-3`}>
                  {step.icon}
                </div>
                <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">{step.label}</span>
                {i < 6 && (
                  <ArrowRight className="hidden md:block size-5 text-emerald-300 mt-2" />
                )}
              </div>
            ))}
          </div>

          {/* Mobile flow arrows (horizontal scroll hint) */}
          <div className="mt-8 text-center md:hidden">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light flex items-center justify-center gap-2">
              <ArrowRight size={14} className="animate-pulse" />
              Scroll untuk melihat alur lengkap
              <ArrowRight size={14} className="animate-pulse" />
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* SECTION 3.5: FITUR EKOSISTEM — Glass Icons Showcase                     */}
      {/* ====================================================================== */}
      <section className="bg-gradient-to-b from-emerald-50/30 to-white dark:from-emerald-950/10 dark:to-slate-900 py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#16A34A08_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.25em] text-emerald-600 uppercase mb-4">
              EKOSISTEM SMARTSORT
            </p>
            <h2 className="text-2xl md:text-4xl font-light tracking-tight text-slate-900 dark:text-white mb-4">
              Satu Platform untuk <span className="font-semibold text-gradient-eco">Ekonomi Sirkular</span>
            </h2>
            <div className="w-16 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto" />
          </div>

          <GlassIcons
            items={[
              { icon: <ScanLine size={20} />, color: 'emerald', label: 'Scanner AI', href: '/scanner' },
              { icon: <Truck size={20} />, color: 'teal', label: 'Pickup Sampah', href: '/pickup' },
              { icon: <Recycle size={20} />, color: 'green', label: 'Resource Recovery', href: '/dashboard' },
              { icon: <Wallet size={20} />, color: 'amber', label: 'Eco Wallet', href: '/wallet' },
              { icon: <Users size={20} />, color: 'violet', label: 'Komunitas', href: '/community' },
              { icon: <GraduationCap size={20} />, color: 'sky', label: 'Edukasi', href: '/education' },
            ]}
            columns={3}
            variant="default"
            colorful={true}
          />

          <div className="text-center mt-12">
            <Link
              href="/scanner"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold tracking-widest uppercase px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/50 hover:shadow-xl hover:-translate-y-0.5"
            >
              <Camera size={16} />
              Mulai Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* SECTION 4: MITRA PENGOLAHAN — Industrial Partner Network                */}
      {/* ====================================================================== */}
      <section className="bg-white dark:bg-slate-900 py-24 px-6 relative border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.25em] text-emerald-600 uppercase mb-4">
              INDUSTRIAL PARTNER NETWORK
            </p>
            <h2 className="text-2xl md:text-4xl font-light tracking-tight text-slate-900 dark:text-white mb-4">
              Mitra Pengolahan <span className="font-semibold text-gradient-eco">SmartSort</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-light">
              SmartSort menjadi penghubung antara masyarakat dengan jaringan mitra pengolahan 
              daur ulang di seluruh Indonesia. Setiap material sampah akan disalurkan ke mitra 
              pengolah yang sesuai.
            </p>
            <div className="w-16 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerCategories.map((partner, i) => (
              <div
                key={i}
                className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:border-emerald-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Factory size={24} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{partner.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{partner.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{partner.count} Mitra Terdaftar</span>
                  <ArrowRight size={14} className="text-slate-500 dark:text-slate-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/partners"
              className="inline-flex items-center gap-2 border-2 border-emerald-600/30 hover:border-emerald-600 text-emerald-600 text-xs font-semibold tracking-widest uppercase px-8 py-4 rounded-xl transition-all duration-300"
            >
              Lihat Semua Mitra
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* SECTION 5: DAMPAK LINGKUNGAN — Smart Impact Statistics                  */}
      {/* ====================================================================== */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 dark:from-emerald-950 dark:via-emerald-900 dark:to-teal-950 py-24 px-6 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.25em] text-emerald-300 uppercase mb-4">
              SMART IMPACT TRACKING
            </p>
            <h2 className="text-2xl md:text-4xl font-light tracking-tight text-white mb-4">
              Dampak Nyata <span className="font-semibold text-emerald-300">Ekosistem SmartSort</span>
            </h2>
            <p className="text-sm text-emerald-200/70 max-w-2xl mx-auto font-light">
              Setiap kontribusi masyarakat tercatat dan memberikan dampak terukur terhadap lingkungan 
              dan ekonomi sirkular nasional.
            </p>
            <div className="w-16 h-[2px] bg-emerald-400/50 mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {impactStats.map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 mx-auto mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-xs text-emerald-200/70 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Impact detail cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-emerald-300 mb-2">15 Kg Plastik</div>
              <div className="text-xs text-emerald-200/60 mb-4">Contoh dampak dari 1 setoran</div>
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2 text-xs text-emerald-200/80">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Mengurangi <strong className="text-white">35 Kg CO₂</strong> emisi</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-200/80">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Menjadi bahan baku <strong className="text-white">10 kursi taman</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-200/80">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Mengurangi <strong className="text-white">10 kg</strong> sampah ke TPA</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-emerald-300 mb-2">10 Kg Kertas</div>
              <div className="text-xs text-emerald-200/60 mb-4">Dampak dari daur ulang kertas</div>
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2 text-xs text-emerald-200/80">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Menyelamatkan <strong className="text-white">1 pohon</strong> dewasa</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-200/80">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Menghemat <strong className="text-white">26.000 liter</strong> air</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-200/80">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Mengurangi <strong className="text-white">20 Kg CO₂</strong> emisi</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-emerald-300 mb-2">5 Kg Logam</div>
              <div className="text-xs text-emerald-200/60 mb-4">Dampak dari daur ulang logam</div>
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2 text-xs text-emerald-200/80">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Menghemat <strong className="text-white">60%</strong> energi produksi</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-200/80">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Mengurangi <strong className="text-white">15 Kg CO₂</strong> emisi</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-200/80">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Material dapat digunakan <strong className="text-white">tanpa batas</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* SECTION 6: KOMUNITAS & EDUKASI — AnimatedList Features                  */}
      {/* ====================================================================== */}
      <section className="bg-gradient-to-b from-white dark:from-slate-900 to-emerald-50/30 dark:to-emerald-950/20 py-24 px-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(#16A34A0A_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(22,163,74,0.05)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative">
          <AnimatedList
            items={featureItems}
            variant="default"
            title="Fitur Ekosistem SmartSort"
            subtitle="EKONOMI SIRKULAR NASIONAL"
          />

          <div className="mt-12 text-center">
            <Link                href="/scanner"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold tracking-widest uppercase px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/50 hover:shadow-xl hover:shadow-emerald-300 dark:hover:shadow-emerald-800/50 hover:-translate-y-0.5"
            >
              <Camera size={16} />
              Mulai Kontribusi Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* SECTION 7: SMART CITY ANALYTICS + FOOTER                                */}
      {/* ====================================================================== */}
      <section className="bg-slate-100/40 dark:bg-slate-800/40 py-24 px-6 md:px-12 relative z-10 border-t border-slate-200/60 dark:border-slate-700/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-light tracking-tight text-slate-900 dark:text-white mb-4">
              Smart City & <span className="font-semibold text-gradient-eco">SmartSort Analytics</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-light">
              Pemerintah daerah dan Dinas Lingkungan Hidup dapat memantau data daur ulang secara real-time 
              untuk pengambilan keputusan yang lebih baik dalam pengelolaan sampah kota.
            </p>
            <div className="w-16 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 hover:shadow-lg hover:border-emerald-100 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                <BarChart2 size={24} />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">Volume & Jenis Sampah</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                Pantau volume sampah per kategori, wilayah aktif, dan tren daur ulang kota secara real-time.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 hover:shadow-lg hover:border-emerald-100 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                <Globe size={24} />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">Partisipasi Masyarakat</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                Ukur tingkat partisipasi warga, sekolah, kampus, dan komunitas dalam program daur ulang kota.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 hover:shadow-lg hover:border-emerald-100 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                <TreePine size={24} />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">Tingkat Daur Ulang</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-light">
                Lacak persentase sampah yang berhasil didaur ulang dan dampak lingkungan yang tercapai.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
