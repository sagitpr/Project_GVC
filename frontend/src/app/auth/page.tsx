'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { authApi } from '../../lib/api';

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
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col justify-center items-center py-12 px-6 relative selection:bg-eco-500 selection:text-white">
      {/* Back button */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center space-x-2 text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white uppercase transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Kembali ke Utama</span>
      </Link>

      <div className="w-full max-w-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 md:p-10">
        {/* Title */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold tracking-[0.25em] text-slate-900 dark:text-white block mb-3">
            SMARTSORT<span className="text-eco-600">AI</span>
          </Link>
          <h2 className="text-lg font-light tracking-tight text-slate-500 dark:text-slate-400 uppercase">
            {isLogin ? 'Masuk ke Akun Anda' : 'Buat Akun Baru'}
          </h2>
        </div>

        {/* Feedback alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium rounded-xl border border-red-100 dark:border-red-800/30">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium rounded-xl border border-emerald-100 dark:border-emerald-800/30">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-[10px] font-semibold tracking-widest text-slate-500 dark:text-slate-400 uppercase mb-2">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 dark:text-slate-500">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  required
                  placeholder="eko_warrior"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-slate-100 bg-transparent dark:bg-slate-700/50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-eco-500 focus:ring-1 focus:ring-eco-500/20 transition-all"
                />
              </div>
            </div>
          )}

          <div>              <label className="block text-[10px] font-semibold tracking-widest text-slate-500 dark:text-slate-400 uppercase mb-2">
              Alamat Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                placeholder="warrior@bumisehat.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-900 bg-transparent placeholder-slate-400 focus:outline-none focus:border-eco-500 focus:ring-1 focus:ring-eco-500/20 transition-all"
              />
            </div>
          </div>

          <div>              <label className="block text-[10px] font-semibold tracking-widest text-slate-500 dark:text-slate-400 uppercase mb-2">
              Kata Sandi
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Lock size={16} />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-900 bg-transparent placeholder-slate-400 focus:outline-none focus:border-eco-500 focus:ring-1 focus:ring-eco-500/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-eco-600 hover:bg-eco-700 disabled:bg-eco-600/50 text-white text-xs font-semibold tracking-widest uppercase py-4 rounded-xl transition-all duration-300 flex justify-center items-center gap-2 mt-4"
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
        <div className="text-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-light"
          >
            {isLogin ? 'Belum punya akun? Daftar Baru' : 'Sudah punya akun? Masuk'}
          </button>
        </div>
      </div>
    </div>
  );
}
