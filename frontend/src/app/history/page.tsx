'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Calendar, FileText, X, Sparkles, Award, Search, Trash2 } from 'lucide-react';
import { scansApi, authApi } from '../../lib/api';

export default function HistoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [scans, setScans] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedScan, setSelectedScan] = useState<any | null>(null);

  useEffect(() => {
    const token = authApi.getToken();
    if (!token) {
      router.push('/auth');
    } else {
      fetchHistory();
    }
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await scansApi.getHistory();
      setScans(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Gagal mengambil histori scan. Pastikan backend server menyala.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat?.toUpperCase()) {
      case 'PLASTIC': return 'text-sky-500 bg-sky-50 border-sky-100';
      case 'ORGANIC': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'PAPER': return 'text-amber-500 bg-amber-50 border-amber-100';
      case 'GLASS': return 'text-teal-500 bg-teal-50 border-teal-100';
      case 'METAL': return 'text-indigo-500 bg-indigo-50 border-indigo-100';
      case 'ELECTRONIC': return 'text-purple-500 bg-purple-50 border-purple-100';
      default: return 'text-gray-500 bg-gray-50 border-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-tesla-white flex flex-col justify-center items-center">
        <Loader2 size={36} className="text-tesla-blue animate-spin mb-4" />
        <span className="text-xs font-semibold tracking-widest text-tesla-pewter uppercase">Memuat Histori Daur Ulang...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tesla-white text-tesla-dark selection:bg-tesla-blue selection:text-white pb-24 relative">
      {/* Background grid details */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#EEEEEE_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

      {/* Floating Navbar */}
      <header className="fixed top-0 left-0 w-full z-45 frosted-glass border-b border-tesla-cloud/30 py-4 px-6 md:px-12 flex justify-between items-center">
        <Link href="/dashboard" className="flex items-center space-x-2 text-xs font-semibold tracking-widest text-tesla-pewter hover:text-tesla-dark uppercase transition-colors">
          <ArrowLeft size={16} />
          <span>Dashboard</span>
        </Link>
        <div className="text-sm font-bold tracking-[0.2em] uppercase select-none">
          RIWAYAT PEMILAHAN SAMPAH
        </div>
        <Link href="/scanner" className="text-xs font-semibold tracking-widest text-tesla-blue hover:underline uppercase">
          Scan Baru
        </Link>
      </header>

      <main className="max-w-5xl mx-auto pt-24 px-6 relative z-10">
        {errorMsg && (
          <div className="p-4 bg-red-50 text-red-600 text-xs font-medium rounded-tesla border border-red-100 mb-6">
            {errorMsg}
          </div>
        )}

        {scans.length === 0 ? (
          /* Empty state view */
          <div className="text-center py-20 bg-white border border-tesla-cloud/60 rounded-xl p-8 max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-tesla-ash flex items-center justify-center text-tesla-pewter mx-auto mb-6">
              <FileText size={24} />
            </div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-2">Belum Ada Histori Scan</h3>
            <p className="text-xs text-tesla-pewter leading-relaxed font-light mb-8 max-w-xs mx-auto">
              Anda belum melakukan klasifikasi sampah. Gunakan AI Camera Scanner untuk mendeteksi material dan memperoleh Eco-Points perdana!
            </p>
            <Link 
              href="/scanner"
              className="bg-tesla-blue hover:bg-[#2b56cc] text-white text-xs font-semibold tracking-widest uppercase px-6 py-4 rounded-tesla transition-colors"
            >
              MULAI SCAN
            </Link>
          </div>
        ) : (
          /* Grid view of past scans */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {scans.map((scan: any) => (
              <div 
                key={scan.id} 
                onClick={() => setSelectedScan(scan)}
                className="bg-white border border-tesla-cloud/60 hover:border-tesla-blue/40 rounded-xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 flex flex-col justify-between"
              >
                {/* Thumbnail */}
                <div className="aspect-[4/3] bg-tesla-ash relative">
                  <img src={scan.imageUrl} className="w-full h-full object-cover" alt="Captured waste" />
                  
                  {/* Category overlay */}
                  <span className={`absolute top-3 left-3 text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 border rounded-full ${getCategoryColor(scan.category)}`}>
                    {scan.category}
                  </span>

                  {/* Date overlay */}
                  <span className="absolute bottom-3 right-3 text-[9px] font-medium bg-black/60 text-white px-2 py-0.5 rounded backdrop-blur-sm">
                    {new Date(scan.createdAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                {/* Meta details */}
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      {scan.brand ? (
                        <span className="text-xs font-semibold text-tesla-dark block leading-tight">{scan.brand}</span>
                      ) : (
                        <span className="text-xs text-tesla-pewter italic block leading-tight">No Brand OCR</span>
                      )}
                      <span className="text-[9px] text-tesla-pewter font-medium uppercase tracking-wider">Akurasi: {Math.round(scan.confidence * 100)}%</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-tesla-blue block">Score: {scan.ecoScore}</span>
                      <span className="text-[9px] text-tesla-pewter uppercase tracking-wider">Eco Score</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 4. Sleek Interactive Detail Overlay (Slide out/Modal) */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white max-w-xl w-full rounded-xl overflow-hidden border border-tesla-cloud/60 shadow-2xl relative flex flex-col">
            
            {/* Header */}
            <div className="p-5 border-b border-tesla-cloud/40 flex justify-between items-center">
              <span className="text-[10px] font-bold tracking-[0.2em] text-tesla-pewter uppercase block">Detil Pemilahan Sampah</span>
              <button 
                onClick={() => setSelectedScan(null)}
                className="text-tesla-pewter hover:text-tesla-dark transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
              {/* Photo thumbnail */}
              <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-tesla-ash border border-tesla-cloud/40">
                <img src={selectedScan.imageUrl} className="w-full h-full object-cover" alt="Captured item" />
              </div>

              {/* Identity Row */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-light text-tesla-dark uppercase tracking-tight leading-none">{selectedScan.category}</h3>
                    <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 border rounded-full ${getCategoryColor(selectedScan.category)}`}>
                      {Math.round(selectedScan.confidence * 100)}% Match
                    </span>
                  </div>
                  <span className="text-[10px] text-tesla-pewter font-light">
                    Discan pada {new Date(selectedScan.createdAt).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="text-right flex items-center gap-3 bg-tesla-ash/40 px-4 py-2 rounded-tesla border border-tesla-cloud/40">
                  <Award size={18} className="text-tesla-blue" />
                  <div className="text-left">
                    <span className="text-[9px] text-tesla-pewter uppercase tracking-wider block font-bold leading-none">Eco Score</span>
                    <span className="text-sm font-semibold text-tesla-dark">{selectedScan.ecoScore}/100</span>
                  </div>
                </div>
              </div>

              {/* OCR Decks if valid */}
              {(selectedScan.brand || selectedScan.ocrText) && (
                <div className="p-4 bg-tesla-ash/25 border border-tesla-cloud/30 rounded-tesla space-y-3 text-xs leading-relaxed">
                  {selectedScan.brand && (
                    <div>
                      <span className="font-semibold text-tesla-pewter block uppercase text-[9px] tracking-widest mb-0.5">Merek Label Terbaca</span>
                      <span className="text-tesla-dark font-medium text-sm">{selectedScan.brand}</span>
                    </div>
                  )}
                  {selectedScan.ocrText && (
                    <div>
                      <span className="font-semibold text-tesla-pewter block uppercase text-[9px] tracking-widest mb-0.5">Teks Kemasan (OCR)</span>
                      <span className="text-tesla-dark/80 italic font-light">"{selectedScan.ocrText}"</span>
                    </div>
                  )}
                </div>
              )}

              {/* Tips */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold tracking-wider text-tesla-pewter uppercase flex items-center gap-1.5">
                  <Sparkles size={14} className="text-tesla-blue" />
                  <span>Panduan Daur Ulang AI</span>
                </h4>
                <div className="text-xs text-tesla-graphite leading-relaxed font-light p-4 bg-blue-50/20 border border-blue-100/30 rounded-tesla">
                  {selectedScan.tips}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-tesla-cloud/40 bg-tesla-ash/20 text-center">
              <button 
                onClick={() => setSelectedScan(null)}
                className="w-full bg-tesla-dark hover:bg-black text-white text-[10px] font-semibold tracking-widest uppercase py-3 rounded-tesla transition-all"
              >
                Tutup Rincian
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
