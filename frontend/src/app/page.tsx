'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Camera, BarChart2, Shield, Leaf, ChevronDown, User, LogOut } from 'lucide-react';
import { authApi } from '../lib/api';

export default function LandingPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    setCurrentUser(authApi.getCurrentUser());
  }, []);

  const handleLogout = () => {
    authApi.logout();
    setCurrentUser(null);
    window.location.reload();
  };

  return (
    <div className="relative min-h-screen bg-tesla-white overflow-x-hidden text-tesla-dark selection:bg-tesla-blue selection:text-white">
      {/* 1. Frosted Glass Floating Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 frosted-glass border-b border-tesla-cloud/30 transition-all duration-tesla ease-tesla py-4 px-6 md:px-12 flex justify-between items-center">
        {/* Logo with spaced uppercase design */}
        <Link href="/" className="text-xl md:text-2xl font-bold tracking-[0.25em] text-tesla-dark select-none">
          SMARTSORT<span className="text-tesla-blue">AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 text-sm font-medium tracking-wide">
          <Link href="/scanner" className="text-tesla-pewter hover:text-tesla-dark transition-all duration-300">
            Scanner
          </Link>
          <Link href="/dashboard" className="text-tesla-pewter hover:text-tesla-dark transition-all duration-300">
            Dampak Lingkungan
          </Link>
          <Link href="/history" className="text-tesla-pewter hover:text-tesla-dark transition-all duration-300">
            Riwayat
          </Link>
        </nav>

        {/* Auth / Account Trigger */}
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <div className="flex items-center space-x-3 bg-tesla-ash/80 px-4 py-2 rounded-tesla">
              <User size={16} className="text-tesla-pewter" />
              <span className="text-xs font-semibold tracking-wider text-tesla-dark uppercase">{currentUser.username}</span>
              <button 
                onClick={handleLogout}
                className="text-tesla-pewter hover:text-red-500 transition-colors ml-2"
                title="Keluar"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link 
              href="/auth" 
              className="text-xs font-semibold tracking-widest text-tesla-pewter hover:text-tesla-dark uppercase transition-colors"
            >
              Masuk / Daftar
            </Link>
          )}
        </div>
      </header>

      {/* 2. Full Viewport (100vh) Hero Section */}
      <section className="relative h-screen w-full flex flex-col justify-between items-center pt-24 pb-12 px-6">
        {/* Background Visual Element: Sleek Geometric Eco-Shapes (radical subtraction layout) */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#f8faf9] to-[#ffffff] flex items-center justify-center opacity-70">
          <div className="w-[40rem] h-[40rem] rounded-full bg-[#10b981]/5 filter blur-[100px] animate-pulse" />
          <div className="w-[30rem] h-[30rem] rounded-full bg-[#3b82f6]/5 filter blur-[100px] animate-pulse delay-700 ml-40" />
        </div>

        {/* Hero Headline Overlay */}
        <div className="z-10 text-center max-w-4xl mt-16 md:mt-24">
          <p className="text-xs md:text-sm font-semibold tracking-[0.3em] text-tesla-blue uppercase mb-4 animate-fade-in">
            Ecosystem Pemilahan Sampah Masa Depan
          </p>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-tesla-dark leading-tight mb-6">
            Ubah Sampah Jadi <br className="hidden md:inline" />
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-tesla-dark to-tesla-blue">
              Eco-Points & Keberlanjutan
            </span>
          </h1>
          <p className="text-sm md:text-base text-tesla-pewter max-w-xl mx-auto leading-relaxed font-light mb-8">
            Gunakan kamera pintar AI Vision untuk mengklasifikasikan 6 material sampah utama, membaca label kemasan via OCR, dan menerima saran daur ulang premium dalam 1 detik.
          </p>

          {/* CTA Buttons in exact Tesla styling (4px border-radius, transparent options) */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              href="/scanner" 
              className="w-full sm:w-56 bg-tesla-blue hover:bg-[#2b56cc] text-white text-xs font-semibold tracking-widest uppercase py-4 rounded-tesla transition-all duration-tesla ease-tesla text-center"
            >
              Buka AI Scanner
            </Link>
            <Link 
              href="/dashboard" 
              className="w-full sm:w-56 border-2 border-tesla-dark/10 hover:border-tesla-dark/30 bg-transparent text-tesla-dark text-xs font-semibold tracking-widest uppercase py-4 rounded-tesla transition-all duration-tesla ease-tesla text-center"
            >
              Lihat Dampak Sosial
            </Link>
          </div>
        </div>

        {/* Floating Indicator */}
        <div className="z-10 flex flex-col items-center cursor-pointer animate-bounce text-tesla-pewter">
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-1">Pelajari Selengkapnya</span>
          <ChevronDown size={16} />
        </div>
      </section>

      {/* 3. Three-Column Technical Specifications & Features Block */}
      <section className="bg-tesla-ash/40 py-24 px-6 md:px-12 relative z-10 border-t border-tesla-cloud/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-light tracking-tight text-tesla-dark mb-4">
              Teknologi Core AI Vision & Dampak Real
            </h2>
            <div className="w-16 h-[2px] bg-tesla-blue mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-tesla border border-tesla-cloud/30">
              <div className="w-12 h-12 rounded-tesla bg-tesla-blue/5 flex items-center justify-center text-tesla-blue mb-6">
                <Camera size={24} />
              </div>
              <h3 className="text-lg font-medium text-tesla-dark mb-3">AI Image Recognition</h3>
              <p className="text-xs text-tesla-pewter leading-relaxed font-light">
                Klasifikasi material sampah secara instan untuk Plastik, Organik, Kertas, Kaca, Elektronik, dan Logam dengan persentase keyakinan presisi tinggi.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-tesla border border-tesla-cloud/30">
              <div className="w-12 h-12 rounded-tesla bg-emerald-500/5 flex items-center justify-center text-emerald-500 mb-6">
                <Leaf size={24} />
              </div>
              <h3 className="text-lg font-medium text-tesla-dark mb-3">Sistem Eco-Score</h3>
              <p className="text-xs text-tesla-pewter leading-relaxed font-light">
                Kalkulasi dampak lingkungan dan perolehan Eco-Points sebagai bentuk apresiasi bagi kontribusi pemilahan sampah yang benar.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-tesla border border-tesla-cloud/30">
              <div className="w-12 h-12 rounded-tesla bg-purple-500/5 flex items-center justify-center text-purple-500 mb-6">
                <BarChart2 size={24} />
              </div>
              <h3 className="text-lg font-medium text-tesla-dark mb-3">OCR Brand & Label Extraction</h3>
              <p className="text-xs text-tesla-pewter leading-relaxed font-light">
                Membaca dan menganalisis teks kemasan serta merek produk untuk mencocokkan simbol daur ulang kimiawi secara cerdas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Bottom Sticky Question Input bar (Representing environmental helper) */}
      <footer className="bg-tesla-dark text-white py-12 px-6 md:px-12 border-t border-white/5 relative z-10 text-center">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-left">
            <h3 className="text-lg font-semibold tracking-widest uppercase text-white mb-2">SMARTSORT AI</h3>
            <p className="text-xs text-tesla-pewter font-light">Ecosystem Cerdas Pelindung Bumi © 2026. Made with Google Gemini.</p>
          </div>
          <div className="flex space-x-6 text-xs text-tesla-pewter font-light">
            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-white transition-colors">Panduan Hijau</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
