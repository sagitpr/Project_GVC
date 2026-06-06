'use client';

import React, { useEffect, useState } from 'react';
import {
  Users, MessageSquare, Heart, Share2, Plus,
  Loader2, ArrowLeft, ChevronRight, Clock, Trash2,
  AlertCircle, XCircle, CheckCircle, User, Leaf, Award, Zap,
  Globe, Calendar
} from 'lucide-react';
import Link from 'next/link';
import { communityApi, authApi } from '../../lib/api';

// ─── Sample data for offline/loading state ─────────────────────────────
const SAMPLE_POSTS = [
  {
    id: 's1',
    title: 'Aksi Bersih-Bersih Pantai Kuta',
    content: 'Hari ini komunitas kami berhasil mengumpulkan 250 kg sampah plastik di Pantai Kuta. Terima kasih kepada 50 relawan yang telah berpartisipasi!',
    user: { username: 'EcoWarrior_Bali' },
    likesCount: 42,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 's2',
    title: 'Challenge: Kurangi 1 Plastik Sehari',
    content: 'Mulai minggu ini, mari kita challenge diri sendiri untuk mengurangi penggunaan plastik sekali pakai minimal 1 item per hari. Share progressmu di sini!',
    user: { username: 'GreenLeader' },
    likesCount: 87,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 's3',
    title: 'Bank Sampah Unit Baru di Surabaya',
    content: 'Kabar gembira! Bank Sampah unit ke-15 resmi dibuka di Surabaya Barat. Warga sekitar bisa menyetorkan sampah anorganik setiap hari Sabtu.',
    user: { username: 'SmartCity_SBY' },
    likesCount: 35,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 's4',
    title: 'Tips: Membuat Eco-Enzyme dari Sampah Dapur',
    content: 'Eco-enzyme adalah cairan serbaguna yang dibuat dari fermentasi sampah organik dapur. Sangat mudah dibuat dan bermanfaat untuk rumah tangga!',
    user: { username: 'KomposKu' },
    likesCount: 63,
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
  {
    id: 's5',
    title: 'Sekolah Hijau: SDN 01 Jakarta Juara',
    content: 'SDN 01 Jakarta Pusat berhasil meraih penghargaan Sekolah Hijau tingkat nasional. Program daur ulang mereka berhasil mengurangi sampah sekolah hingga 70%!',
    user: { username: 'EduEco_ID' },
    likesCount: 28,
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
  },
];

const CHALLENGES = [
  { title: 'Kurangi 1 Plastik Sehari', icon: <Zap className="size-4" />, participants: 234, color: 'text-amber-500', bg: 'bg-amber-50' },
  { title: 'Kompos dari Dapur', icon: <Leaf className="size-4" />, participants: 156, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { title: 'Pilah & Setor Pekanan', icon: <Award className="size-4" />, participants: 89, color: 'text-sky-500', bg: 'bg-sky-50' },
  { title: 'Misi 1000 Pohon', icon: <Globe className="size-4" />, participants: 312, color: 'text-teal-500', bg: 'bg-teal-50' },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const currentUser = authApi.getCurrentUser();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await communityApi.listPosts(1, 20);
      setPosts(data?.data || []);
    } catch {
      // Fallback to sample data if API not available
      setPosts(SAMPLE_POSTS);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      setErrorMsg('Judul dan konten harus diisi.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      const result = await communityApi.createPost({ title: newTitle, content: newContent });
      setSuccessMsg('Postingan berhasil dibuat!');
      setNewTitle('');
      setNewContent('');
      setShowCreate(false);
      await fetchPosts();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Gagal membuat postingan. Silakan login terlebih dahulu.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await communityApi.likePost(postId);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, likesCount: (p.likesCount || 0) + 1 } : p,
        ),
      );
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Yakin ingin menghapus postingan ini?')) return;
    try {
      await communityApi.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setSuccessMsg('Postingan berhasil dihapus.');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Gagal menghapus postingan.');
    }
  };

  const formatDate = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Baru saja';
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} hari lalu`;
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  // ─── Loading ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-900 flex flex-col items-center justify-center">
        <div className="size-16 rounded-2xl bg-gradient-to-br from-eco-500 to-teal-500 flex items-center justify-center shadow-lg animate-pulse">
          <Users className="size-8 text-white" />
        </div>
        <p className="mt-6 text-sm font-medium text-slate-500 dark:text-slate-400">Memuat Komunitas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-900 pb-24 md:pb-16">
      {/* Header */}
      <div className="sticky top-0 z-30 eco-glass border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-eco-500 to-teal-500 shadow-sm">
                <Users className="size-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 dark:text-white">Komunitas</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 -mt-0.5">Bersama untuk lingkungan</p>
              </div>
            </div>
            {currentUser && (
              <button
                onClick={() => setShowCreate(!showCreate)}
                className="btn-eco-primary text-xs gap-1.5"
              >
                <Plus className="size-3.5" />
                {showCreate ? 'Tutup' : 'Buat Post'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-6 space-y-6">
        {/* Messages */}
        {successMsg && (
          <div className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl text-sm text-emerald-700 dark:text-emerald-300">
            <CheckCircle className="size-5 shrink-0 text-emerald-500 mt-0.5" />
            <span>{successMsg}</span>
            <button onClick={() => setSuccessMsg('')} className="ml-auto text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-200">
              <XCircle className="size-4" />
            </button>
          </div>
        )}
        {errorMsg && (
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl text-sm text-red-700 dark:text-red-300">
            <AlertCircle className="size-5 shrink-0 text-red-500 mt-0.5" />
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg('')} className="ml-auto text-red-400 hover:text-red-600 dark:hover:text-red-200">
              <XCircle className="size-4" />
            </button>
          </div>
        )}

        {/* Challenges */}
        <div className="bg-gradient-to-br from-eco-500/5 to-teal-500/5 dark:from-eco-500/10 dark:to-teal-500/10 border border-eco-100 dark:border-eco-900/30 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Award className="size-4 text-eco-600" />
            Challenge & Misi Aktif
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CHALLENGES.map((c, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700 hover:border-eco-200 dark:hover:border-eco-700 transition-all">
                <div className={`size-8 rounded-lg ${c.bg} flex items-center justify-center ${c.color} mb-2`}>
                  {c.icon}
                </div>
                <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300">{c.title}</h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{c.participants} peserta</p>
              </div>
            ))}
          </div>
        </div>

        {/* Create Post Form */}
        {showCreate && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="size-4 text-eco-500" />
                Buat Postingan Baru
              </h3>
            </div>
            <form onSubmit={handleCreatePost} className="p-5 space-y-4">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Judul postingan..."
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-500 transition-all"
              />
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Tulis konten Anda di sini..."
                rows={4}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-500 transition-all resize-none"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 btn-eco-ghost text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting || !newTitle.trim() || !newContent.trim()}
                  className="flex-1 btn-eco-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      Mengirim...
                    </span>
                  ) : (
                    'Bagikan'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 px-1 flex items-center gap-2">
            <Globe className="size-4 text-eco-500" />
            Aktivitas Komunitas
          </h2>

          {posts.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-12 text-center">
              <div className="mx-auto size-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                <MessageSquare className="size-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Belum Ada Postingan</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Jadilah yang pertama berbagi cerita tentang aksi lingkungan Anda!
              </p>
              {currentUser && (
                <button
                  onClick={() => setShowCreate(true)}
                  className="mt-6 btn-eco-primary text-xs"
                >
                  <Plus className="size-3.5" />
                  Buat Postingan Pertama
                </button>
              )}
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-gradient-to-br from-eco-400 to-teal-400 flex items-center justify-center text-white text-xs font-bold">
                      {post.user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white block leading-tight">
                        {post.user?.username || 'Pengguna'}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="size-3" />
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                  </div>
                  {currentUser && currentUser.username === post.user?.username && (
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                      title="Hapus postingan"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>

                {/* Content */}
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">{post.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{post.content}</p>

                {/* Actions */}
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 hover:text-rose-500 transition-colors"
                  >
                    <Heart className="size-4" />
                    <span>{post.likesCount || 0}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 hover:text-eco-600 dark:hover:text-eco-400 transition-colors">
                    <Share2 className="size-4" />
                    Bagikan
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
