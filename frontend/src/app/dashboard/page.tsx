'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Award, Zap, BarChart2, Calendar, Leaf, FileText, ChevronRight, Activity } from 'lucide-react';
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

  const getCategoryTheme = (cat: string) => {
    switch (cat?.toUpperCase()) {
      case 'PLASTIC': return { color: 'bg-sky-500', text: 'text-sky-500' };
      case 'ORGANIC': return { color: 'bg-emerald-500', text: 'text-emerald-500' };
      case 'PAPER': return { color: 'bg-amber-500', text: 'text-amber-500' };
      case 'GLASS': return { color: 'bg-teal-500', text: 'text-teal-500' };
      case 'METAL': return { color: 'bg-indigo-500', text: 'text-indigo-500' };
      case 'ELECTRONIC': return { color: 'bg-purple-500', text: 'text-purple-500' };
      default: return { color: 'bg-gray-400', text: 'text-gray-400' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-tesla-white flex flex-col justify-center items-center">
        <Loader2 size={36} className="text-tesla-blue animate-spin mb-4" />
        <span className="text-xs font-semibold tracking-widest text-tesla-pewter uppercase">Memuat Eco Dashboard...</span>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-tesla-white flex flex-col justify-center items-center px-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
          <Activity size={24} />
        </div>
        <h3 className="text-sm font-semibold text-tesla-dark uppercase mb-2">Terjadi Hambatan</h3>
        <p className="text-xs text-tesla-pewter mb-6 max-w-sm leading-relaxed">{errorMsg}</p>
        <button 
          onClick={fetchDashboard}
          className="bg-tesla-blue hover:bg-[#2b56cc] text-white text-[10px] font-semibold tracking-widest uppercase px-6 py-4 rounded-tesla transition-colors"
        >
          COBA LAGI
        </button>
      </div>
    );
  }

  const { user, categoryBreakdown, recentScans, communityStats } = dashboardData;

  return (
    <div className="min-h-screen bg-tesla-white text-tesla-dark selection:bg-tesla-blue selection:text-white pb-24 relative">
      {/* Background visual details */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#EEEEEE_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

      {/* Floating Navbar */}
      <header className="fixed top-0 left-0 w-full z-40 frosted-glass border-b border-tesla-cloud/30 py-4 px-6 md:px-12 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 text-xs font-semibold tracking-widest text-tesla-pewter hover:text-tesla-dark uppercase transition-colors">
          <ArrowLeft size={16} />
          <span>Utama</span>
        </Link>
        <div className="text-sm font-bold tracking-[0.2em] uppercase select-none">
          ECO ANALYTICS DASHBOARD
        </div>
        <Link href="/scanner" className="text-xs font-semibold tracking-widest text-tesla-blue hover:underline uppercase">
          Scan Baru
        </Link>
      </header>

      <main className="max-w-5xl mx-auto pt-24 px-6 relative z-10 space-y-10">
        
        {/* ROW 1: USER SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Accumulate points */}
          <div className="bg-white border border-tesla-cloud/60 rounded-xl p-6 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[9px] font-bold tracking-wider text-tesla-pewter uppercase block mb-1">Total Poin</span>
              <h3 className="text-3xl font-light text-tesla-dark tracking-tight">{user.ecoPoints}</h3>
              <span className="text-[10px] text-emerald-500 font-medium">Eco Points</span>
            </div>
            <div className="w-12 h-12 bg-tesla-blue/5 rounded-full flex items-center justify-center text-tesla-blue">
              <Award size={24} />
            </div>
          </div>

          {/* Card 2: Total user scans */}
          <div className="bg-white border border-tesla-cloud/60 rounded-xl p-6 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[9px] font-bold tracking-wider text-tesla-pewter uppercase block mb-1">Scan Saya</span>
              <h3 className="text-3xl font-light text-tesla-dark tracking-tight">{user.totalScans}</h3>
              <span className="text-[10px] text-tesla-pewter font-medium leading-none">Sampah Terklasifikasi</span>
            </div>
            <div className="w-12 h-12 bg-amber-500/5 rounded-full flex items-center justify-center text-amber-500">
              <Zap size={24} />
            </div>
          </div>

          {/* Card 3: Global Carbon Savings */}
          <div className="bg-white border border-tesla-cloud/60 rounded-xl p-6 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[9px] font-bold tracking-wider text-emerald-600 uppercase block mb-1">Dampak Global</span>
              <h3 className="text-3xl font-light text-tesla-dark tracking-tight">{(communityStats.carbonReduced || 0).toFixed(1)} <span className="text-base font-medium">kg</span></h3>
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
          <div className="lg:col-span-2 bg-white border border-tesla-cloud/60 rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
            <div>
              <h3 className="text-base font-light tracking-tight text-tesla-dark uppercase">Kategori Sampah Terbanyak</h3>
              <p className="text-xs text-tesla-pewter font-light">Distribusi material dari riwayat scan personal Anda.</p>
            </div>

            {user.totalScans === 0 ? (
              <div className="h-64 flex flex-col justify-center items-center text-center bg-tesla-ash/20 rounded-tesla border border-dashed border-tesla-cloud">
                <BarChart2 size={32} className="text-tesla-pewter/60 mb-2" />
                <span className="text-xs text-tesla-pewter font-light">Belum ada data scan. Mulai memilah sampah sekarang!</span>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(categoryBreakdown).map(([cat, count]: [string, any]) => {
                  const percent = getPercentage(count, user.totalScans);
                  const theme = getCategoryTheme(cat);
                  return (
                    <div key={cat} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-tesla-dark uppercase tracking-wider">{cat}</span>
                        <span className="text-tesla-pewter">{count} Scan ({percent}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-tesla-ash rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${theme.color} transition-all duration-tesla ease-tesla`} 
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
          <div className="bg-white border border-tesla-cloud/60 rounded-xl p-6 md:p-8 space-y-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-light tracking-tight text-tesla-dark uppercase">Komunitas SmartSort</h3>
              <p className="text-xs text-tesla-pewter font-light">Kontribusi ekologi kolektif platform.</p>
            </div>

            <div className="space-y-6 py-6 border-y border-tesla-cloud/40">
              <div className="flex justify-between items-center">
                <span className="text-xs text-tesla-pewter font-light">Total Partisipasi Scan</span>
                <span className="text-sm font-semibold text-tesla-dark">{communityStats.totalScans}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-tesla-pewter font-light">Reduksi CO₂ Global</span>
                <span className="text-sm font-semibold text-emerald-500">{communityStats.carbonReduced} Kg CO₂</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-tesla-pewter font-light">Rata-rata Akurasi AI</span>
                <span className="text-sm font-semibold text-tesla-blue">94.8%</span>
              </div>
            </div>

            <Link 
              href="/history"
              className="w-full py-4 text-center bg-tesla-ash hover:bg-tesla-cloud/60 rounded-tesla text-xs font-semibold tracking-widest uppercase transition-colors"
            >
              LIHAT RIWAYAT DETAIL
            </Link>
          </div>
        </div>

        {/* ROW 3: RECENT SCANS LIST */}
        <div className="bg-white border border-tesla-cloud/60 rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-light tracking-tight text-tesla-dark uppercase">5 Scan Terakhir</h3>
              <p className="text-xs text-tesla-pewter font-light">Aktifitas pemilahan sampah terbaru Anda.</p>
            </div>
            <Link href="/history" className="text-xs text-tesla-pewter hover:text-tesla-dark transition-colors flex items-center gap-1.5 font-medium uppercase tracking-wider">
              <span>Semua Riwayat</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {recentScans.length === 0 ? (
            <div className="p-8 text-center text-xs text-tesla-pewter font-light">
              Belum ada riwayat aktivitas scan terbaru.
            </div>
          ) : (
            <div className="divide-y divide-tesla-cloud/40">
              {recentScans.map((scan: any) => {
                const theme = getCategoryTheme(scan.category);
                return (
                  <div key={scan.id} className="py-4 flex justify-between items-center text-xs first:pt-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <span className={`w-3 h-3 rounded-full ${theme.color}`} />
                      <div>
                        <span className="font-semibold text-tesla-dark uppercase tracking-wider block">{scan.category}</span>
                        {scan.brand && (
                          <span className="text-[10px] text-tesla-pewter uppercase tracking-wider leading-none">Merek: {scan.brand}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="font-semibold text-tesla-dark block">Score: {scan.ecoScore}</span>
                        <span className="text-[10px] text-tesla-pewter font-light">
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
