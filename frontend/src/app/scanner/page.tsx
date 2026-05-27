'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Camera as CameraIcon, Upload, ArrowLeft, Loader2, Sparkles, AlertCircle, RefreshCw, BarChart2, Award } from 'lucide-react';
import { scansApi, authApi } from '../../lib/api';

export default function ScannerPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto check auth session
  useEffect(() => {
    const token = authApi.getToken();
    if (!token) {
      router.push('/auth');
    } else {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(false);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn('Camera failed to start, falling back to file uploader:', err);
      setCameraError(true);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw mirror-adjusted image
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const base64 = canvas.toDataURL('image/jpeg', 0.85);
        setImage(base64);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const result = await scansApi.detectWaste(image);
      setScanResult(result);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Gagal memproses gambar sampah.');
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setImage(null);
    setScanResult(null);
    setErrorMsg('');
    startCamera();
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

  return (
    <div className="min-h-screen bg-tesla-white text-tesla-dark selection:bg-tesla-blue selection:text-white pb-24 relative">
      {/* Background visual dots */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#EEEEEE_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-50" />

      {/* Floating Navbar */}
      <header className="fixed top-0 left-0 w-full z-40 frosted-glass border-b border-tesla-cloud/30 py-4 px-6 md:px-12 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 text-xs font-semibold tracking-widest text-tesla-pewter hover:text-tesla-dark uppercase transition-colors">
          <ArrowLeft size={16} />
          <span>Kembali</span>
        </Link>
        <div className="text-sm font-bold tracking-[0.2em] uppercase select-none">
          AI CAMERA SCANNER
        </div>
        <div className="w-16" /> {/* Spacer */}
      </header>

      <main className="max-w-4xl mx-auto pt-24 px-6 relative z-10">
        {!scanResult ? (
          /* SECTION 1: SCANNER SCREEN */
          <div className="flex flex-col items-center">
            {/* Viewport Frame with glowing border */}
            <div className="w-full aspect-[4/3] max-w-2xl bg-tesla-dark rounded-xl overflow-hidden relative border border-tesla-cloud/30 flex items-center justify-center">
              {!image ? (
                !cameraError ? (
                  /* Camera active stream */
                  <>
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-6 flex justify-center w-full z-10">
                      <button 
                        onClick={capturePhoto}
                        className="bg-tesla-blue hover:bg-[#2b56cc] text-white p-5 rounded-full transition-all duration-300 shadow-lg border-4 border-white/20 active:scale-95"
                        title="Ambil Foto"
                      >
                        <CameraIcon size={24} />
                      </button>
                    </div>
                  </>
                ) : (
                  /* File upload fallback UI */
                  <div className="p-8 text-center flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-tesla-ash flex items-center justify-center text-tesla-pewter mb-4">
                      <Upload size={24} />
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-wider">Kamera Tidak Tersedia</h3>
                    <p className="text-xs text-tesla-pewter mb-6 max-w-xs leading-relaxed font-light">
                      Kamera gagal diakses atau perangkat Anda tidak memiliki webcam. Unggah berkas gambar sampah secara manual.
                    </p>
                    <label className="bg-tesla-blue hover:bg-[#2b56cc] text-white text-[10px] font-semibold tracking-widest uppercase px-6 py-4 rounded-tesla cursor-pointer transition-colors block text-center">
                      PILIH FILE GAMBAR
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                )
              ) : (
                /* Snapped preview and active loader */
                <div className="w-full h-full relative">
                  <img src={image} className="w-full h-full object-cover" alt="Captured waste" />
                  
                  {loading && (
                    /* Scanning glowing beam line */
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-10">
                      <div className="w-full h-1 bg-gradient-to-r from-transparent via-tesla-blue to-transparent absolute top-0 animate-scanner-beam shadow-[0_0_10px_#3E6AE1]" />
                      <Loader2 size={36} className="text-tesla-blue animate-spin mb-4" />
                      <span className="text-xs text-white font-medium uppercase tracking-widest">
                        Menganalisis Vision & OCR...
                      </span>
                    </div>
                  )}

                  {!loading && (
                    /* Snap confirmation CTA overlay */
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 px-6 z-10">
                      <button 
                        onClick={resetScanner}
                        className="flex-1 max-w-[180px] border border-white/20 bg-black/40 hover:bg-black/60 text-white text-[10px] font-semibold tracking-widest uppercase py-4 rounded-tesla transition-all flex items-center justify-center gap-2"
                      >
                        <RefreshCw size={12} />
                        <span>Foto Ulang</span>
                      </button>
                      <button 
                        onClick={handleAnalyze}
                        className="flex-1 max-w-[180px] bg-tesla-blue hover:bg-[#2b56cc] text-white text-[10px] font-semibold tracking-widest uppercase py-4 rounded-tesla transition-all flex items-center justify-center gap-2"
                      >
                        <Sparkles size={12} />
                        <span>Analisis AI</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="mt-6 p-4 max-w-2xl w-full bg-red-50 text-red-600 border border-red-100 rounded-tesla text-xs flex items-start gap-3">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Hint */}
            <div className="mt-8 text-center text-xs text-tesla-pewter font-light max-w-sm">
              * Pastikan cahaya ruangan cukup dan sampah berada tepat di tengah frame agar hasil identifikasi YOLO/OCR optimal.
            </div>
          </div>
        ) : (
          /* SECTION 2: SCANNED DAMP & REC RESULTS SCREEN */
          <div className="max-w-3xl mx-auto bg-white border border-tesla-cloud/60 rounded-xl overflow-hidden p-6 md:p-10">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Left Column: Visual Thumbnail proof */}
              <div className="w-full md:w-1/3 aspect-square bg-tesla-ash rounded-xl overflow-hidden border border-tesla-cloud/40">
                <img src={scanResult.data.imageUrl} className="w-full h-full object-cover" alt="Processed thumbnail" />
              </div>

              {/* Right Column: AI Core Outputs */}
              <div className="flex-1 space-y-6">
                <div>
                  <span className="text-[10px] font-semibold tracking-[0.25em] text-tesla-blue uppercase block mb-1">
                    Hasil Deteksi Vision
                  </span>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-light tracking-tight text-tesla-dark uppercase">
                      {scanResult.data.category}
                    </h2>
                    <span className={`text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 border rounded-full ${getCategoryColor(scanResult.data.category)}`}>
                      {Math.round(scanResult.data.confidence * 100)}% Match
                    </span>
                  </div>
                </div>

                {/* Score & Points Double Deck Panel */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-tesla-cloud/40">
                  {/* Eco Score rating */}
                  <div className="flex items-center gap-4 bg-tesla-ash/40 p-4 rounded-tesla border border-tesla-cloud/30">
                    <div className="relative w-12 h-12 flex items-center justify-center bg-white rounded-full border border-tesla-cloud/50 text-tesla-blue font-semibold">
                      {scanResult.data.ecoScore}
                    </div>
                    <div>
                      <span className="text-[9px] font-bold tracking-wider text-tesla-pewter uppercase block">Eco Score</span>
                      <span className="text-xs text-tesla-dark font-medium leading-none">Keberlanjutan</span>
                    </div>
                  </div>

                  {/* Points earned */}
                  <div className="flex items-center gap-4 bg-emerald-50/20 p-4 rounded-tesla border border-emerald-100/30">
                    <div className="w-12 h-12 flex items-center justify-center bg-emerald-50 rounded-full text-emerald-500 font-bold">
                      +{scanResult.pointsEarned}
                    </div>
                    <div>
                      <span className="text-[9px] font-bold tracking-wider text-emerald-600/80 uppercase block">Poin Dapat</span>
                      <span className="text-xs text-tesla-dark font-medium leading-none">Eco Points</span>
                    </div>
                  </div>
                </div>

                {/* OCR dynamic data decks if brand read */}
                {(scanResult.data.brand || scanResult.data.ocrText) && (
                  <div className="p-4 bg-tesla-ash/20 rounded-tesla border border-tesla-cloud/30 space-y-2 text-xs">
                    {scanResult.data.brand && (
                      <div>
                        <span className="font-semibold text-tesla-pewter block uppercase text-[9px] tracking-wider">Merek Hasil OCR</span>
                        <span className="text-tesla-dark font-medium">{scanResult.data.brand}</span>
                      </div>
                    )}
                    {scanResult.data.ocrText && (
                      <div>
                        <span className="font-semibold text-tesla-pewter block uppercase text-[9px] tracking-wider">Teks Kemasan</span>
                        <span className="text-tesla-dark/80 italic line-clamp-2">"{scanResult.data.ocrText}"</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Recommendation Panel */}
                <div className="space-y-3 pt-4 border-t border-tesla-cloud/40">
                  <h3 className="text-xs font-semibold tracking-wider text-tesla-pewter uppercase flex items-center gap-1.5">
                    <Sparkles size={14} className="text-tesla-blue" />
                    <span>Panduan Daur Ulang AI</span>
                  </h3>
                  <div className="text-xs text-tesla-graphite leading-relaxed font-light p-4 bg-blue-50/20 rounded-tesla border border-blue-100/30">
                    {scanResult.data.tips}
                  </div>
                </div>

                {/* Foot CTA action triggers */}
                <div className="flex gap-4 pt-6">
                  <button 
                    onClick={resetScanner}
                    className="flex-1 bg-tesla-dark hover:bg-black text-white text-[10px] font-semibold tracking-widest uppercase py-4 rounded-tesla transition-all duration-300 text-center"
                  >
                    Scan Baru
                  </button>
                  <Link 
                    href="/dashboard"
                    className="flex-1 border border-tesla-dark/20 hover:border-tesla-dark/40 bg-transparent text-tesla-dark text-[10px] font-semibold tracking-widest uppercase py-4 rounded-tesla transition-all duration-300 text-center block"
                  >
                    Buka Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Hidden canvas tool */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Embedded visual scanning beam inline styles */}
      <style>{`
        @keyframes scanner-beam {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .animate-scanner-beam {
          animation: scanner-beam 2.5s infinite linear;
        }
      `}</style>
    </div>
  );
}
