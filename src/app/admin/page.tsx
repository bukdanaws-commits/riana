"use client";
import { useEffect, useState } from "react";
import { useAdminStore, useRegistrations } from "@/lib/admin-store";
import { formatRupiah } from "@/data/pricing";
import { Users, CheckCircle2, Star, DollarSign, MapPin, Clock, TrendingUp, Trophy, RefreshCw } from "lucide-react";

interface CityRow {
  id: string;
  city: string;
  capacity: number;
  registered: number;
  checked_in: number;
  status: string;
}

function StatCard({ icon: Icon, label, value, bg }: { icon: React.ElementType; label: string; value: string | number; bg: string }) {
  return (
    <div className={`p-4 rounded-2xl ${bg} shadow-lg`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      <div className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>{value}</div>
      <div className="text-xs text-white/80 uppercase tracking-wider font-bold mt-1">{label}</div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const registrations = useRegistrations();
  const muriTarget = useAdminStore((s) => s.muriTarget);
  const [cities, setCities] = useState<CityRow[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch cities from Supabase
  const fetchCities = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/cities");
      const json = await res.json();
      if (json.data) setCities(json.data);
    } catch {
      // silent fail — fallback to store cities
    }
    setLoadingCities(false);
    setRefreshing(false);
  };

  useEffect(() => { fetchCities(); }, []);

  const totalRegistered = cities.reduce((s, c) => s + c.registered, 0);
  const totalCheckedIn = cities.reduce((s, c) => s + (c.checked_in ?? 0), 0);
  const completedCities = cities.filter((c) => c.status === "completed").length;
  const openCities = cities.filter((c) => c.status === "open").length;
  const pct = muriTarget > 0 ? ((totalRegistered / muriTarget) * 100).toFixed(1) : "0";

  const regTotal = registrations.length;
  const regCheckedIn = registrations.filter((r) => r.status === "checked_in").length;
  const regVip = registrations.filter((r) => r.ticketType === "vip").length;
  const revenue = registrations
    .filter((r) => r.paymentStatus === "paid")
    .reduce((s, r) => s + (r.paymentAmount ?? 0), 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>DASHBOARD</h1>
          <p className="text-sm text-white/50">Overview statistik pendaftaran & revenue</p>
        </div>
        <button
          onClick={fetchCities}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2A2D38] border border-[#FC7166]/20 text-white/70 hover:text-white hover:bg-[#FC7166]/10 transition-colors text-xs font-bold"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stat cards row 1 — registrations */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Users} label="Total Pendaftar" value={regTotal} bg="bg-gradient-to-br from-[#FC7166] to-[#E54B40]" />
        <StatCard icon={CheckCircle2} label="Checked-in" value={regCheckedIn} bg="bg-gradient-to-br from-green-500 to-green-600" />
        <StatCard icon={Star} label="VIP Tiket" value={regVip} bg="bg-gradient-to-br from-[#F39F23] to-[#C97D0E]" />
        <StatCard icon={DollarSign} label="Revenue" value={formatRupiah(revenue)} bg="bg-gradient-to-br from-[#FD8656] to-[#E56A1F]" />
      </div>

      {/* Stat cards row 2 — cities */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={MapPin} label="Kota Selesai" value={loadingCities ? "..." : `${completedCities}/${cities.length}`} bg="bg-gradient-to-br from-[#884D3E] to-[#51343F]" />
        <StatCard icon={Clock} label="Pendaftaran Aktif" value={loadingCities ? "..." : openCities} bg="bg-gradient-to-br from-[#C99789] to-[#AD7868]" />
        <StatCard icon={Trophy} label="Target MURI" value={muriTarget.toLocaleString("id-ID")} bg="bg-gradient-to-br from-[#252D3A] to-[#1F2129]" />
        <StatCard icon={TrendingUp} label="Progress" value={`${pct}%`} bg="bg-gradient-to-br from-[#FC7166] to-[#FD8656]" />
      </div>

      {/* MURI progress bar */}
      <div className="bg-[#2A2D38] rounded-2xl p-5 shadow-lg border border-[#FC7166]/15">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-black text-white" style={{ fontFamily: "var(--font-display)" }}>PROGRESS REKOR MURI</h2>
          <span className="text-2xl font-black text-[#F39F23]" style={{ fontFamily: "var(--font-display)" }}>{pct}%</span>
        </div>
        <div className="h-4 bg-[#0E0F14] rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-[#FC7166] via-[#FD8656] to-[#F39F23] rounded-full transition-all duration-1000"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-white/50">
          <span>{totalRegistered.toLocaleString("id-ID")} terdaftar</span>
          <span>{(muriTarget - totalRegistered).toLocaleString("id-ID")} slot tersisa</span>
        </div>
      </div>

      {/* Recent cities snapshot */}
      <div className="bg-[#2A2D38] rounded-2xl p-5 shadow-lg border border-[#FC7166]/15">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-black text-white" style={{ fontFamily: "var(--font-display)" }}>SNAPSHOT KOTA</h2>
          <a href="/admin/kota" className="text-xs text-[#FC7166] hover:underline font-bold">Lihat semua →</a>
        </div>
        <div className="space-y-2">
          {cities.slice(0, 5).map((c) => {
            const pct = c.capacity > 0 ? Math.round((c.registered / c.capacity) * 100) : 0;
            return (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg bg-[#0E0F14] border border-white/5">
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-sm">{c.city}</div>
                  <div className="text-[10px] text-white/40">
                    {c.registered} / {c.capacity} terdaftar · status: {c.status}
                  </div>
                </div>
                <div className="w-32 h-2 bg-[#1F2129] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FC7166] to-[#FD8656] rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-white/60 w-10 text-right">{pct}%</span>
              </div>
            );
          })}
          {cities.length === 0 && !loadingCities && (
            <div className="text-center py-8 text-white/40 text-sm">
              Belum ada data kota. <a href="/admin/kota" className="text-[#FC7166] hover:underline">Tambah kota →</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
