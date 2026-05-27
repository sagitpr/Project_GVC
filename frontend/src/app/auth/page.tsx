'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { authApi } from '../lib/api';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        await authApi.login(email, password);
        setSuccess('Login berhasil! Mengalihkan...');
        setTimeout(() => {
          router.push('/scanner');
        }, 1500);
      } else {
        await authApi.register(username, email, password);
        setSuccess('Pendaftaran berhasil! Mengalihkan...');
        setTimeout(() => {
          router.push('/scanner');
        }, 1500);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-tesla-white flex flex-col justify-center items-center py-12 px-6 relative selection:bg-tesla-blue selection:text-white">
      {/* Back button */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center space-x-2 text-xs font-semibold tracking-wider text-tesla-pewter hover:text-tesla-dark uppercase transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Kembali ke Utama</span>
      </Link>

      <div className="w-full max-w-md bg-white border border-tesla-cloud/50 rounded-xl p-8 md:p-10">
        {/* Title */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold tracking-[0.25em] text-tesla-dark block mb-3">
            SMARTSORT<span className="text-tesla-blue">AI</span>
          </Link>
          <h2 className="text-lg font-light tracking-tight text-tesla-pewter uppercase">
            {isLogin ? 'Masuk ke Akun Anda' : 'Buat Akun Baru'}
          </h2>
        </div>

        {/* Feedback alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-medium rounded-tesla border border-red-100">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-tesla border border-emerald-100">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-[10px] font-semibold tracking-widest text-tesla-pewter uppercase mb-2">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-tesla-silver">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  required
                  placeholder="eko_warrior"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-tesla-cloud/60 rounded-tesla text-sm text-tesla-dark bg-transparent placeholder-tesla-silver focus:outline-none focus:border-tesla-blue focus:ring-1 focus:ring-tesla-blue/20 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-semibold tracking-widest text-tesla-pewter uppercase mb-2">
              Alamat Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-tesla-silver">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                placeholder="warrior@bumisehat.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-tesla-cloud/60 rounded-tesla text-sm text-tesla-dark bg-transparent placeholder-tesla-silver focus:outline-none focus:border-tesla-blue focus:ring-1 focus:ring-tesla-blue/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold tracking-widest text-tesla-pewter uppercase mb-2">
              Kata Sandi
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-tesla-silver">
                <Lock size={16} />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-tesla-cloud/60 rounded-tesla text-sm text-tesla-dark bg-transparent placeholder-tesla-silver focus:outline-none focus:border-tesla-blue focus:ring-1 focus:ring-tesla-blue/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-tesla-blue hover:bg-[#2b56cc] disabled:bg-tesla-blue/50 text-white text-xs font-semibold tracking-widest uppercase py-4 rounded-tesla transition-all duration-tesla flex justify-center items-center gap-2 mt-4"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <span>{isLogin ? 'Masuk Sekarang' : 'Daftar Sekarang'}</span>
            )}
          </button>
        </form>

        {/* Toggle link */}
        <div className="text-center mt-8 pt-6 border-t border-tesla-cloud/40">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-tesla-pewter hover:text-tesla-dark transition-colors font-light"
          >
            {isLogin ? 'Belum punya akun? Daftar Baru' : 'Sudah punya akun? Masuk'}
          </button>
        </div>
      </div>
    </div>
  );
}
