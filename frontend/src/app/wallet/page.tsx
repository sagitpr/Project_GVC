'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Wallet, Coins, Gift, ArrowUpRight, ArrowDownRight,
  Loader2, RefreshCw, ChevronRight, Award, Clock,
  Ticket, ShoppingBag, CheckCircle, AlertCircle
} from 'lucide-react';
import { authApi, walletApi, rewardsApi } from '../../lib/api';

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  code: string | null;
  stock: number;
  imageUrl: string | null;
}

interface Claim {
  id: string;
  reward: Reward;
  status: string;
  createdAt: string;
}

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
}

export default function WalletPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [myClaims, setMyClaims] = useState<Claim[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const user = authApi.getCurrentUser();

  useEffect(() => {
    if (!authApi.getToken()) {
      router.push('/auth');
    } else {
      fetchAll();
    }
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [walletRes, txRes, rewardsRes, claimsRes] = await Promise.all([
        walletApi.getWallet().catch(() => null),
        walletApi.getTransactions().catch(() => null),
        rewardsApi.listRewards().catch(() => null),
        rewardsApi.getMyClaims().catch(() => null),
      ]);

      setWalletData(walletRes);
      if (txRes?.data) setTransactions(txRes.data);
      if (rewardsRes?.data) setRewards(rewardsRes.data);
      if (claimsRes?.data) setMyClaims(claimsRes.data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Gagal memuat data dompet. Pastikan backend menyala.');
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (rewardId: string) => {
    setClaimingId(rewardId);
    try {
      const result = await rewardsApi.claimReward(rewardId);
      // Refresh data
      await fetchAll();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Gagal mengklaim reward';
      alert(msg);
    } finally {
      setClaimingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return <ArrowDownRight className="size-4 text-emerald-500" />;
      case 'EARN': return <ArrowDownRight className="size-4 text-emerald-500" />;
      case 'WITHDRAWAL': return <ArrowUpRight className="size-4 text-red-500" />;
      default: return <ArrowUpRight className="size-4 text-slate-400" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return 'Setoran';
      case 'EARN': return 'Pendapatan';
      case 'WITHDRAWAL': return 'Penarikan';
      default: return type;
    }
  };

  // ─── Rewards that are not yet claimed ─────────────────────────────────────
  const claimedRewardIds = new Set(myClaims.map((c) => c.reward.id));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-eco-50 dark:from-slate-900 dark:to-slate-900 flex flex-col items-center justify-center">
        <Loader2 className="size-8 text-eco-500 animate-spin mb-4" />
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Memuat Dompet Digital...</span>
      </div>
    );
  }

  if (errorMsg && !walletData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-eco-50 dark:from-slate-900 dark:to-slate-900 flex flex-col items-center justify-center px-6 text-center">
        <AlertCircle className="size-12 text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Gagal Memuat Data</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md">{errorMsg}</p>
        <button onClick={fetchAll} className="btn-eco-primary px-6 py-3">
          Coba Lagi
        </button>
      </div>
    );
  }

  const balance = walletData?.balance ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-eco-50 dark:from-slate-900 dark:to-slate-900 pb-32">
      {/* Header */}
      <header className="bg-gradient-to-br from-eco-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-6 pt-16 pb-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Wallet className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Dompet Digital</h1>
                <p className="text-sm text-white/70">Eco Wallet & Rewards</p>
              </div>
            </div>
            <button
              onClick={fetchAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm text-sm font-medium transition-all"
            >
              <RefreshCw className="size-4" />
              Refresh
            </button>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* IDR Balance */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
              <p className="text-sm text-white/60 mb-1">Saldo IDR</p>
              <p className="text-3xl font-bold">
                Rp {balance.toLocaleString('id-ID', { minimumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-white/40 mt-1">Dompet utama</p>
            </div>

            {/* Eco Coins */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
              <p className="text-sm text-white/60 mb-1">Eco Coins</p>
              <p className="text-3xl font-bold">
                {user?.ecoCoins ?? 0}
              </p>
              <p className="text-xs text-white/40 mt-1">Koin dari scan & aktivitas</p>
            </div>

            {/* Eco Points */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
              <p className="text-sm text-white/60 mb-1">Eco Points</p>
              <p className="text-3xl font-bold">
                {user?.ecoPoints ?? 0}
              </p>
              <p className="text-xs text-white/40 mt-1">Poin kontribusi lingkungan</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 -mt-4 space-y-8">
        {/* ─── Rewards Catalog ───────────────────────────────────────────── */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Gift className="size-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Katalog Rewards</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tukarkan Eco Coins Anda dengan hadiah menarik</p>
            </div>
          </div>

          {rewards.length === 0 ? (
            <div className="text-center py-10 text-sm text-slate-400 dark:text-slate-500">
              <Gift className="size-8 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
              Belum ada rewards tersedia saat ini
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.map((reward) => {
                const isClaimed = claimedRewardIds.has(reward.id);
                const canClaim = (user?.ecoCoins ?? 0) >= reward.pointsRequired && !isClaimed;
                return (
                  <div
                    key={reward.id}
                    className={`relative rounded-xl border p-5 transition-all duration-300 ${
                      isClaimed
                        ? 'border-emerald-200 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-900/10'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-md hover:border-eco-200 dark:hover:border-eco-700'
                    }`}
                  >
                    {/* Reward Icon */}
                    <div className="size-12 rounded-xl bg-gradient-to-br from-eco-400 to-teal-500 flex items-center justify-center mb-4">
                      <Award className="size-6 text-white" />
                    </div>

                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{reward.title}</h3>
                    {reward.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{reward.description}</p>
                    )}

                    <div className="flex items-center gap-1.5 text-amber-600 font-bold text-sm mb-3">
                      <Coins className="size-4" />
                      {reward.pointsRequired} Eco Coins
                    </div>

                    {isClaimed ? (
                      <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-medium">
                        <CheckCircle className="size-4" />
                        Sudah diklaim
                      </div>
                    ) : (
                      <button
                        onClick={() => handleClaim(reward.id)}
                        disabled={!canClaim || claimingId === reward.id}
                        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          canClaim
                            ? 'bg-eco-500 text-white hover:bg-eco-600 active:scale-[0.98]'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {claimingId === reward.id ? (
                          <Loader2 className="size-4 animate-spin mx-auto" />
                        ) : canClaim ? (
                          'Klaim Reward'
                        ) : (
                          'Coins Tidak Cukup'
                        )}
                      </button>
                    )}

                    {/* Stock badge */}
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                      Stok: {reward.stock}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ─── My Claims ─────────────────────────────────────────────────── */}
        {myClaims.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <ShoppingBag className="size-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Rewards Saya</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Rewards yang sudah Anda klaim</p>
              </div>
            </div>

            <div className="space-y-3">
              {myClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-gradient-to-br from-eco-400 to-teal-500 flex items-center justify-center">
                      <Award className="size-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{claim.reward.title}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {claim.reward.code ? `Kode: ${claim.reward.code}` : 'Reward digital'}
                        {' · '}
                        {formatDate(claim.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase ${
                    claim.status === 'CLAIMED'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {claim.status === 'CLAIMED' ? 'Diklaim' : 'Digunakan'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Transaction History ────────────────────────────────────────── */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <Clock className="size-5 text-slate-600 dark:text-slate-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Riwayat Transaksi</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Aktivitas keuangan dompet Anda</p>
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-10 text-sm text-slate-400 dark:text-slate-500">
              <Wallet className="size-8 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
              Belum ada transaksi
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 flex items-center justify-center">
                      {getTypeIcon(tx.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {tx.description || getTypeLabel(tx.type)}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{formatDate(tx.createdAt)}</p>
                    </div>
                  </div>
                  <div className={`text-right font-semibold text-sm ${
                    tx.amount > 0 ? 'text-emerald-600' : 'text-red-500'
                  }`}>
                    {tx.amount > 0 ? '+' : ''}Rp {Math.abs(tx.amount).toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
