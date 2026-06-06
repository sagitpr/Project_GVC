'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Factory, Recycle, Leaf, Building2, Truck, Shield, Search, MapPin, Users, Award } from 'lucide-react';

const partnerCategories = [
  {
    title: 'Pengolah Plastik',
    icon: <Recycle size={28} />,
    color: 'bg-sky-500',
    lightBg: 'bg-sky-50',
    textColor: 'text-sky-600',
    borderColor: 'border-sky-100',
    desc: 'Mengubah limbah plastik menjadi bijih plastik daur ulang, serat tekstil, dan berbagai produk plastik baru.',
    partners: [
      { name: 'PT Plastik Daur Indonesia', location: 'Jakarta', verified: true },
      { name: 'Eco Plastic Solutions', location: 'Bandung', verified: true },
      { name: 'RecyPlast Nusantara', location: 'Surabaya', verified: true },
    ],
    stats: '12 Mitra Aktif',
  },
  {
    title: 'Pengolah Organik',
    icon: <Leaf size={28} />,
    color: 'bg-emerald-500',
    lightBg: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-100',
    desc: 'Mengolah sampah organik menjadi kompos berkualitas, biogas, dan pupuk organik untuk pertanian.',
    partners: [
      { name: 'Kompos Nusantara', location: 'Bogor', verified: true },
      { name: 'Green Earth Organics', location: 'Yogyakarta', verified: true },
      { name: 'BioCycle Indonesia', location: 'Malang', verified: true },
    ],
    stats: '8 Mitra Aktif',
  },
  {
    title: 'Pengolah Kertas',
    icon: <Building2 size={28} />,
    color: 'bg-amber-500',
    lightBg: 'bg-amber-50',
    textColor: 'text-amber-600',
    borderColor: 'border-amber-100',
    desc: 'Mendaur ulang kertas bekas menjadi pulp, kertas daur ulang, kardus, dan produk kertas lainnya.',
    partners: [
      { name: 'PaperCycle Indonesia', location: 'Tangerang', verified: true },
      { name: 'Daur Kertas Sejahtera', location: 'Semarang', verified: true },
    ],
    stats: '6 Mitra Aktif',
  },
  {
    title: 'Pengolah Logam',
    icon: <Award size={28} />,
    color: 'bg-indigo-500',
    lightBg: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    borderColor: 'border-indigo-100',
    desc: 'Melebur dan memurnikan logam bekas (aluminium, besi, tembaga) untuk digunakan kembali sebagai bahan baku industri.',
    partners: [
      { name: 'Metal Recycling Nusantara', location: 'Surabaya', verified: true },
      { name: 'Indo Steel Recovery', location: 'Cilegon', verified: true },
    ],
    stats: '5 Mitra Aktif',
  },
  {
    title: 'Pengolah Kaca',
    icon: <Shield size={28} />,
    color: 'bg-teal-500',
    lightBg: 'bg-teal-50',
    textColor: 'text-teal-600',
    borderColor: 'border-teal-100',
    desc: 'Mendaur ulang kaca menjadi cullet (pecahan kaca) dan produk kaca baru untuk industri konstruksi dan kemasan.',
    partners: [
      { name: 'GlassCycle Indonesia', location: 'Jakarta', verified: true },
      { name: 'Kaca Daur Nusantara', location: 'Bandung', verified: true },
    ],
    stats: '4 Mitra Aktif',
  },
  {
    title: 'Pengolah Elektronik',
    icon: <Truck size={28} />,
    color: 'bg-purple-500',
    lightBg: 'bg-purple-50',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-100',
    desc: 'Mengolah limbah elektronik (e-waste) untuk memulihkan material berharga seperti emas, tembaga, dan logam langka.',
    partners: [
      { name: 'E-Waste Solution Indonesia', location: 'Jakarta', verified: true },
      { name: 'TechRecycle Nusantara', location: 'Bandung', verified: true },
      { name: 'Green Electronics Recovery', location: 'Surabaya', verified: true },
    ],
    stats: '10 Mitra Aktif',
  },
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-900 pb-16">
      {/* Header */}
      <div className="sticky top-0 z-30 eco-glass border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <ArrowLeft className="size-5" />
              </Link>
              <div>
                <h1 className="text-base font-bold text-slate-900 dark:text-white">Mitra Pengolahan</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 -mt-0.5">Industrial Partner Network</p>
              </div>
            </div>
            <Link
              href="/scanner"
              className="btn-eco-primary text-xs gap-1.5"
            >
              <Recycle className="size-3.5" />
              Mulai Scan
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        {/* Hero description */}
        <div className="text-center mb-12">
          <div className="mx-auto size-16 rounded-2xl bg-gradient-to-br from-eco-500 to-teal-500 flex items-center justify-center shadow-lg mb-4">
            <Factory className="size-8 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Jaringan Mitra Pengolahan <span className="text-gradient-eco">SmartSort</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            SmartSort menjadi penghubung antara masyarakat dengan perusahaan pengolah daur ulang 
            terverifikasi di seluruh Indonesia. Setiap material sampah akan disalurkan ke mitra 
            pengolah yang sesuai untuk diubah menjadi produk bernilai.
          </p>
        </div>

        {/* How it works summary */}
        <div className="bg-gradient-to-br from-eco-500/5 to-teal-500/5 dark:from-eco-500/10 dark:to-teal-500/10 border border-eco-100 dark:border-eco-900/30 rounded-2xl p-6 md:p-8 mb-12">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Shield className="size-4 text-eco-600" />
            Bagaimana Alur Ke Mitra Pengolah?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="size-8 rounded-lg bg-eco-100 dark:bg-eco-900/30 flex items-center justify-center text-eco-600 dark:text-eco-400 shrink-0">
                <span className="font-bold text-xs">1</span>
              </div>
              <span className="text-slate-600 dark:text-slate-300">AI scan & klasifikasi material</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="size-8 rounded-lg bg-eco-100 dark:bg-eco-900/30 flex items-center justify-center text-eco-600 dark:text-eco-400 shrink-0">
                <span className="font-bold text-xs">2</span>
              </div>
              <span className="text-slate-600 dark:text-slate-300">Setor via pickup atau drop point</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="size-8 rounded-lg bg-eco-100 dark:bg-eco-900/30 flex items-center justify-center text-eco-600 dark:text-eco-400 shrink-0">
                <span className="font-bold text-xs">3</span>
              </div>
              <span className="text-slate-600 dark:text-slate-300">Disalurkan ke mitra pengolah terverifikasi</span>
            </div>
          </div>
        </div>

        {/* Partner categories */}
        <div className="space-y-8">
          {partnerCategories.map((cat, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left: Category info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`size-12 rounded-xl ${cat.lightBg} ${cat.textColor} flex items-center justify-center`}>
                        {cat.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{cat.title}</h3>
                        <span className="text-xs font-medium text-eco-600">{cat.stats}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{cat.desc}</p>
                  </div>

                  {/* Right: Partner list */}
                  <div className="md:w-72">
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-3">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Mitra Terdaftar</h4>
                      {cat.partners.map((partner, j) => (
                        <div key={j} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="size-6 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-400 dark:text-slate-500">
                              {partner.name.charAt(0)}
                            </div>
                            <div>
                              <span className="text-slate-800 dark:text-slate-200 font-medium text-xs">{partner.name}</span>
                              <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                                <MapPin size={10} />
                                <span>{partner.location}</span>
                              </div>
                            </div>
                          </div>
                          {partner.verified && (
                            <span title="Terverifikasi"><Shield size={14} className="text-emerald-500 shrink-0" /></span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-gradient-to-br from-eco-50 to-teal-50 dark:from-eco-900/20 dark:to-teal-900/20 border border-eco-100 dark:border-eco-900/30 rounded-2xl p-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Ingin menjadi mitra pengolah?
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            SmartSort membuka kemitraan bagi perusahaan pengolah daur ulang di seluruh Indonesia. 
            Hubungi tim kami untuk informasi lebih lanjut.
          </p>
          <Link
            href="/scanner"
            className="btn-eco-primary text-xs"
          >
            Mulai Kontribusi Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
