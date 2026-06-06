'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Truck, MapPin, Calendar, Weight, Plus, Clock, 
  CheckCircle, XCircle, Loader2, AlertCircle, 
  Hourglass, ClipboardList, ArrowLeft, Leaf,
  ChevronRight
} from 'lucide-react';
import { pickupApi, authApi } from '../../lib/api';

const CATEGORIES = [
  { value: 'PLASTIC', label: 'Plastik', color: 'bg-sky-500', textColor: 'text-sky-600', bgColor: 'bg-sky-50' },
  { value: 'ORGANIC', label: 'Organik', color: 'bg-emerald-500', textColor: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  { value: 'PAPER', label: 'Kertas', color: 'bg-amber-500', textColor: 'text-amber-600', bgColor: 'bg-amber-50' },
  { value: 'GLASS', label: 'Kaca', color: 'bg-teal-500', textColor: 'text-teal-600', bgColor: 'bg-teal-50' },
  { value: 'METAL', label: 'Logam', color: 'bg-indigo-500', textColor: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  { value: 'ELECTRONIC', label: 'Elektronik', color: 'bg-purple-500', textColor: 'text-purple-600', bgColor: 'bg-purple-50' },
  { value: 'OTHERS', label: 'Lainnya', color: 'bg-slate-500', textColor: 'text-slate-600', bgColor: 'bg-slate-50' },
];

const STATUS_STYLES: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  PENDING:    { label: 'Menunggu',    icon: Hourglass,   color: 'text-amber-600', bg: 'bg-amber-50' },
  ASSIGNED:   { label: 'Dijemput',    icon: Truck,       color: 'text-blue-600',  bg: 'bg-blue-50' },
  COMPLETED:  { label: 'Selesai',     icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  CANCELLED:  { label: 'Dibatalkan',  icon: XCircle,     color: 'text-red-600',   bg: 'bg-red-50' },
};

export default function PickupPage() {
  const router = useRouter();
  const [pickups, setPickups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState('');
  const [weight, setWeight] = useState('');
  const [address, setAddress] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');

  useEffect(() => {
    const token = authApi.getToken();
    const currentUser = authApi.getCurrentUser();
    if (!token) {
      router.push('/auth');
      return;
    }
    fetchPickups();
  }, []);

  const fetchPickups = async () => {
    try {
      const data = await pickupApi.getMyPickups();
      setPickups(Array.isArray(data) ? data : data?.data || []);
    } catch (err: any) {
      console.error('Failed to fetch pickups:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !weight || !address) {
      setErrorMsg('Harap lengkapi semua field yang wajib diisi.');
      return;
    }

    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      setErrorMsg('Berat harus lebih dari 0 kg.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const pickupDateTime = pickupDate && pickupTime
        ? `${pickupDate}T${pickupTime}:00`
        : undefined;

      const result = await pickupApi.createPickup({
        wasteCategory: category,
        weight: weightNum,
        address,
        pickupTime: pickupDateTime,
      });

      setSuccessMsg(`Pickup ${category.toLowerCase()} seberat ${weight} kg berhasil diajukan!`);
      
      // Reset form
      setCategory('');
      setWeight('');
      setAddress('');
      setPickupDate('');
      setPickupTime('');
      setShowForm(false);

      // Refresh list
      await fetchPickups();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Gagal mengajukan pickup. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (pickupId: string) => {
    if (!confirm('Yakin ingin membatalkan pickup ini?')) return;
    
    try {
      await pickupApi.cancelPickup(pickupId);
      setSuccessMsg('Pickup berhasil dibatalkan.');
      await fetchPickups();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Gagal membatalkan pickup.');
    }
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryInfo = (cat: string) => {
    return CATEGORIES.find(c => c.value === cat) || CATEGORIES[6];
  };

  const getStatusInfo = (status: string) => {
    return STATUS_STYLES[status] || STATUS_STYLES.PENDING;
  };

  // ─── Loading State ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-900 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="size-16 rounded-2xl bg-gradient-to-br from-eco-500 to-teal-500 flex items-center justify-center shadow-lg animate-pulse">
            <Truck className="size-8 text-white" />
          </div>
        </div>
        <p className="mt-6 text-sm font-medium text-slate-500 dark:text-slate-400">Memuat data pickup...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-900 pb-32 md:pb-16">
      {/* Header */}
      <div className="sticky top-0 z-30 eco-glass border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-eco-500 to-teal-500 shadow-sm">
                <Truck className="size-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 dark:text-white">Jadwal Pickup</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 -mt-0.5">Penjemputan sampah</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-eco-primary text-xs gap-1.5"
            >
              <Plus className="size-3.5" />
              {showForm ? 'Tutup' : 'Buat Pickup'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-6 space-y-6">
        {/* Success / Error Messages */}
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

        {/* ─── Create Pickup Form ───────────────────────────────────── */}
        {showForm && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="size-4 text-eco-500" />
                Ajukan Penjemputan
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Isi detail sampah yang akan dijemput
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
              {/* Category Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Kategori Sampah <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`
                        flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all duration-200
                        ${category === cat.value
                          ? `${cat.bgColor} ${cat.textColor} border-${cat.value === 'PLASTIC' ? 'sky' : cat.value === 'ORGANIC' ? 'emerald' : cat.value === 'PAPER' ? 'amber' : cat.value === 'GLASS' ? 'teal' : cat.value === 'METAL' ? 'indigo' : cat.value === 'ELECTRONIC' ? 'purple' : 'slate'}-300 shadow-sm`
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }
                      `}
                    >
                      <span className={`size-2.5 rounded-full ${cat.color}`} />
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Berat (kg) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 dark:text-slate-500" />
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Contoh: 2.5"
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-500 transition-all"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Alamat Penjemputan <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 size-4 text-slate-400 dark:text-slate-500" />
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Contoh: Jl. Merdeka No. 123, RT 01/RW 02, Kelurahan..."
                    rows={3}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-500 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Pickup Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Tanggal
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 dark:text-slate-500" />
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-500 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Waktu
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 dark:text-slate-500" />
                    <input
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 btn-eco-ghost text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting || !category || !weight || !address}
                  className="flex-1 btn-eco-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      Mengirim...
                    </span>
                  ) : (
                    'Ajukan Pickup'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ─── Pickup History List ──────────────────────────────────── */}
        <div className="space-y-1">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 px-1">
            Riwayat Pickup
            <span className="ml-2 text-xs font-normal text-slate-400 dark:text-slate-500">({pickups.length})</span>
          </h2>

          {pickups.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-12 text-center">
              <div className="mx-auto size-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
                <Truck className="size-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Belum Ada Pickup</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Anda belum memiliki jadwal penjemputan sampah. Klik tombol &quot;Buat Pickup&quot; untuk memulai.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-6 btn-eco-primary text-xs"
              >
                <Plus className="size-3.5" />
                Buat Pickup Sekarang
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {pickups.map((pickup: any) => {
                const cat = getCategoryInfo(pickup.wasteCategory);
                const status = getStatusInfo(pickup.status);
                const StatusIcon = status.icon;

                return (
                  <div
                    key={pickup.id}
                    className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Left: Category + Details */}
                      <div className="flex items-start gap-4 min-w-0">
                        <div className={`size-12 rounded-xl ${cat.bgColor} flex items-center justify-center shrink-0`}>
                          <span className={`size-3 rounded-full ${cat.color}`} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">{cat.label}</span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${status.bg} ${status.color}`}>
                              <StatusIcon className="size-3" />
                              {status.label}
                            </span>
                          </div>
                          <div className="mt-1.5 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                            <p className="flex items-center gap-1.5">
                              <Weight className="size-3.5 shrink-0" />
                              {pickup.weight} kg
                            </p>
                            <p className="flex items-start gap-1.5">
                              <MapPin className="size-3.5 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{pickup.address}</span>
                            </p>
                            <p className="flex items-center gap-1.5">
                              <Calendar className="size-3.5 shrink-0" />
                              {pickup.pickupTime ? formatDate(pickup.pickupTime) : formatDate(pickup.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {pickup.status === 'PENDING' && (
                          <button
                            onClick={() => handleCancel(pickup.id)}
                            className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                            title="Batalkan pickup"
                          >
                            <XCircle className="size-4" />
                          </button>
                        )}
                        <ChevronRight className="size-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-500 transition-colors" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
