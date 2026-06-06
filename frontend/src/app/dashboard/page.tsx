'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Award, Zap, BarChart2, Calendar, Leaf, FileText, ChevronRight, Activity, Recycle, Droplets, TreePine, Factory } from 'lucide-react';
import { analyticsApi, authApi } from '../../lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const token = authApi.getToken();
    if (!token) {
      router.push('/auth');
    } else {
      fetchDashboard();
    }
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await analyticsApi.getDashboard();
      setDashboardData(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Gagal memuat statistik. Pastikan backend server menyala.');
    } finally {
      setLoading(false);
    }
  };

  const getPercentage = (count: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  // Impact calculation factors — defined once and reused
  const IMPACT_FACTORS: Record<string, { co2: number; weight: number; product: string; products: string }> = {
    PLASTIC: { co2: 2.5, weight: 0.5, product: 'kursi taman', products: 'Kursi taman, tas, botol baru' },
    PAPER: { co2: 1.0, weight: 0.3, product: 'kardus', products: 'Kardus, kertas HVS daur ulang' },
    GLASS: { co2: 1.5, weight: 1.0, product: 'botol baru', products: 'Botol baru, material konstruksi' },
    METAL: { co2: 4.0, weight: 0.8, product: 'rangka produk', products: 'Kaleng, sparepart, rangka' },
    ORGANIC: { co2: 0.5, weight: 0.5, product: 'kompos', products: 'Kompos, pupuk organik' },
    ELECTRONIC: { co2: 5.0, weight: 1.5, product: 'komponen elektronik', products: 'Logam mulia, komponen elektronik' },
  };

  const calcImpact = (cat: string, factor: 'co2' | 'weight' | 'product' | 'products') => {
    const f = IMPACT_FACTORS[cat?.toUpperCase()];
    return f ? f[factor] : factor === 'co2' ? 0.5 : factor === 'weight' ? 0.3 : factor === 'product' ? 'produk bernilai' : 'Produk bernilai';
  };

  const calcTotal = (factor: 'co2' | 'weight') => {
    if (!categoryBreakdown) return 0;
    return Object.entries(categoryBreakdown).reduce((acc: number, [cat, count]: [string, any]) => {
      return acc + (calcImpact(cat, factor) as number) * count;
    }, 0);
  };

  const getCategoryTheme = (cat: string) => {
    switch (cat?.toUpperCase()) {
      case 'PLASTIC': return { color: 'bg-sky-500', text: 'text-sky-500' };
      case 'ORGANIC': return { color: 'bg-emerald-500', text: 'text-emerald-500' };
      case 'PAPER': return { color: 'bg-amber-500', text: 'text-amber-500' };
      case 'GLASS': return { color: 'bg-teal-500', text: 'text-teal-500' };
      case 'METAL': return { color: 'bg-indigo-500', text: 'text-indigo-500' };
      case 'ELECTRONIC': return { color: 'bg-purple-500', text: 'text-purple-500' };
      default: return { color: 'bg-slate-400', text: 'text-slate-400' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col justify-center items-center">
        <Loader2 size={36} className="text-eco-600 animate-spin mb-4" />
        <span className="text-xs font-semibold tracking-widest text-slate-500 dark:text-slate-400 uppercase">Memuat Eco Dashboard...</span>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col justify-center items-center px-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 flex items-center justify-center mb-4">
          <Activity size={24} />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase mb-2">Terjadi Hambatan</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 max-w-sm leading-relaxed">{errorMsg}</p>
        <button 
          onClick={fetchDashboard}
          className="bg-eco-600 hover:bg-eco-700 text-white text-[10px] font-semibold tracking-widest uppercase px-6 py-4 rounded-xl transition-colors"
        >
          COBA LAGI
        </button>
      </div>
    );
  }

  const { user, categoryBreakdown, recentScans, communityStats } = dashboardData;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 selection:bg-eco-500 selection:text-white pb-24 relative">
      {/* Background visual details */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#EEEEEE_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

      {/* Floating Navbar */}
      <header className="fixed top-0 left-0 w-full z-40 frosted-glass border-b border-slate-200/60 dark:border-slate-700/60 py-4 px-6 md:px-12 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 text-xs font-semibold tracking-widest text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white uppercase transition-colors">
          <ArrowLeft size={16} />
          <span>Utama</span>
        </Link>
        <div className="text-sm font-bold tracking-[0.2em] uppercase select-none">
          ECO ANALYTICS DASHBOARD
        </div>
        <Link href="/scanner" className="text-xs font-semibold tracking-widest text-eco-600 hover:underline uppercase">
          Scan Baru
        </Link>
      </header>

      <main className="max-w-5xl mx-auto pt-24 px-6 relative z-10 space-y-10">
        
        {/* ROW 1: USER SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Accumulate points */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[9px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-1">Total Poin</span>
              <h3 className="text-3xl font-light text-slate-900 dark:text-white tracking-tight">{user.ecoPoints}</h3>
              <span className="text-[10px] text-emerald-500 font-medium">Eco Points</span>
            </div>
            <div className="w-12 h-12 bg-eco-600/5 rounded-full flex items-center justify-center text-eco-600">
              <Award size={24} />
            </div>
          </div>

          {/* Card 2: Total user scans */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[9px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase block mb-1">Scan Saya</span>
              <h3 className="text-3xl font-light text-slate-900 dark:text-white tracking-tight">{user.totalScans}</h3>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none">Sampah Terklasifikasi</span>
            </div>
            <div className="w-12 h-12 bg-amber-500/5 rounded-full flex items-center justify-center text-amber-500">
              <Zap size={24} />
            </div>
          </div>

          {/* Card 3: Global Carbon Savings */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[9px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase block mb-1">Dampak Global</span>
              <h3 className="text-3xl font-light text-slate-900 dark:text-white tracking-tight">{(communityStats.carbonReduced || 0).toFixed(1)} <span className="text-base font-medium">kg</span></h3>
              <span className="text-[10px] text-emerald-500 font-medium">CO₂ Terreduksi</span>
            </div>
            <div className="w-12 h-12 bg-emerald-500/5 rounded-full flex items-center justify-center text-emerald-500">
              <Leaf size={24} />
            </div>
          </div>
        </div>

        {/* ROW 2: DETAILED ANALYSIS & CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Block (Category Distributions via custom responsive SVG/HTML system) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
            <div>
              <h3 className="text-base font-light tracking-tight text-slate-900 dark:text-white uppercase">Kategori Sampah Terbanyak</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-light">Distribusi material dari riwayat scan personal Anda.</p>
            </div>

            {user.totalScans === 0 ? (
              <div className="h-64 flex flex-col justify-center items-center text-center bg-slate-100/20 dark:bg-slate-700/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-600">
                <BarChart2 size={32} className="text-slate-500/60 dark:text-slate-400/60 mb-2" />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-light">Belum ada data scan. Mulai memilah sampah sekarang!</span>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(categoryBreakdown).map(([cat, count]: [string, any]) => {
                  const percent = getPercentage(count, user.totalScans);
                  const theme = getCategoryTheme(cat);
                  return (
                    <div key={cat} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider">{cat}</span>
                        <span className="text-slate-500 dark:text-slate-400">{count} Scan ({percent}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${theme.color} transition-all duration-300 ease-out`} 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Block (Global Community Stats dashboard) */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 md:p-8 space-y-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-light tracking-tight text-slate-900 dark:text-white uppercase">Komunitas SmartSort</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-light">Kontribusi ekologi kolektif platform.</p>
            </div>

            <div className="space-y-6 py-6 border-y border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-light">Total Partisipasi Scan</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{communityStats.totalScans}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-light">Reduksi CO₂ Global</span>
                <span className="text-sm font-semibold text-emerald-500">{communityStats.carbonReduced} Kg CO₂</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-light">Rata-rata Akurasi AI</span>
                <span className="text-sm font-semibold text-eco-600">94.8%</span>
              </div>
            </div>

            <Link 
              href="/history"
              className="w-full py-4 text-center bg-slate-100 dark:bg-slate-700 hover:bg-slate-100/60 dark:hover:bg-slate-600/60 rounded-xl text-xs font-semibold tracking-widest uppercase transition-colors text-slate-900 dark:text-white"
            >
              LIHAT RIWAYAT DETAIL
            </Link>
          </div>
        </div>

        {/* ROW 3: SMART IMPACT TRACKING */}
        <div className="bg-gradient-to-br from-eco-500/5 to-teal-500/5 dark:from-eco-500/10 dark:to-teal-500/10 border border-eco-100 dark:border-eco-900/30 rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-to-br from-eco-500 to-teal-500 flex items-center justify-center">
              <TreePine className="size-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Smart Impact Tracking</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Dampak lingkungan dari kontribusi daur ulang Anda</p>
            </div>
          </div>

          {user.totalScans === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500 font-light">
              Belum ada data untuk dihitung dampaknya. Mulai scan sampah sekarang!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Carbon Reduction */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 text-center">
                <div className="mx-auto size-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-3">
                  <Leaf className="size-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-emerald-600">
                  {calcTotal('co2').toFixed(1)} <span className="text-sm">kg</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">CO₂ Terreduksi</p>
                <div className="mt-2 text-[10px] text-emerald-500 font-medium">Setara menanam {(calcTotal('co2') / 21).toFixed(1)} pohon/tahun</div>
              </div>

              {/* Material Recovered */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 text-center">
                <div className="mx-auto size-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mb-3">
                  <Recycle className="size-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-amber-600">
                  {calcTotal('weight').toFixed(1)} <span className="text-sm">kg</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Material Berhasil Dipulihkan</p>
                <div className="mt-2 text-[10px] text-amber-500 font-medium">Kembali menjadi bahan baku industri</div>
              </div>

              {/* Products Created */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 text-center">
                <div className="mx-auto size-12 rounded-full bg-eco-100 dark:bg-eco-900/50 flex items-center justify-center mb-3">
                  <Factory className="size-6 text-eco-600 dark:text-eco-400" />
                </div>
                <div className="text-2xl font-bold text-eco-600 dark:text-eco-400">
                  {Object.entries(categoryBreakdown).reduce((acc: number, [cat, count]: [string, any]) => {
                    const productList = (calcImpact(cat, 'products') as string).split(', ').length;
                    return acc + productList * count;
                  }, 0).toFixed(0)}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Produk Potensial Dihasilkan</p>
                <div className="mt-2 text-[10px] text-eco-500 font-medium">
                  {Object.entries(categoryBreakdown).length > 0 ? (() => {
                    const topCat = Object.entries(categoryBreakdown).sort(([,a]: any, [,b]: any) => b - a)[0];
                    return calcImpact(topCat[0], 'products') as string;
                  })() : ''}
                </div>
              </div>
            </div>
          )}

          {/* Impact details per category */}
          {user.totalScans > 0 && (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">Rincian Dampak Per Material</h4>
              <div className="space-y-3">
                {Object.entries(categoryBreakdown).filter(([, count]: [string, any]) => count > 0).map(([cat, count]: [string, any]) => {
                  const co2 = ((calcImpact(cat, 'co2') as number) * count).toFixed(1);
                  const weight = ((calcImpact(cat, 'weight') as number) * count).toFixed(1);
                  const product = calcImpact(cat, 'product') as string;
                  return (
                    <div key={cat} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase text-slate-700 dark:text-slate-300 w-20">{cat}</span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">{count} item ({weight} kg)</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-medium text-emerald-600">-{co2} kg CO₂</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-2">→ {product}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ROW 4: RECENT SCANS LIST */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-light tracking-tight text-slate-900 dark:text-white uppercase">5 Scan Terakhir</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-light">Aktifitas pemilahan sampah terbaru Anda.</p>
            </div>
            <Link href="/history" className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5 font-medium uppercase tracking-wider">
              <span>Semua Riwayat</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {recentScans.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400 font-light">
              Belum ada riwayat aktivitas scan terbaru.
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {recentScans.map((scan: any) => {
                const theme = getCategoryTheme(scan.category);
                return (
                  <div key={scan.id} className="py-4 flex justify-between items-center text-xs first:pt-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <span className={`w-3 h-3 rounded-full ${theme.color}`} />
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider block">{scan.category}</span>
                        {scan.brand && (
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-none">Merek: {scan.brand}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="font-semibold text-slate-900 dark:text-white block">Score: {scan.ecoScore}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-light">
                          {new Date(scan.createdAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
