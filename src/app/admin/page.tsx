"use client";
import { useAdminStore, useRegistrations } from "@/lib/admin-store";
import { formatRupiah } from "@/data/pricing";
import { Users, CheckCircle2, Star, DollarSign, MapPin, Clock, TrendingUp, Trophy } from "lucide-react";

function StatCard({ icon: Icon, label, value, bg }: { icon: React.ElementType; label: string; value: string | number; bg: string }) {
  return (<div className={`p-4 rounded-2xl ${bg} shadow-md`}><div className="flex items-center gap-2 mb-2"><div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center"><Icon className="h-5 w-5 text-white" /></div></div><div className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>{value}</div><div className="text-xs text-white/80 uppercase tracking-wider font-bold mt-1">{label}</div></div>);
}

export default function AdminDashboardPage() {
  const cities = useAdminStore((s) => s.cities);
  const registrations = useRegistrations();
  const muriTarget = useAdminStore((s) => s.muriTarget);
  const totalRegistered = cities.reduce((s, c) => s + c.registered, 0);
  const totalCheckedIn = cities.reduce((s, c) => s + (c.checkedIn ?? 0), 0);
  const completedCities = cities.filter((c) => c.status === "completed").length;
  const openCities = cities.filter((c) => c.status === "open").length;
  const pct = ((totalRegistered / muriTarget) * 100).toFixed(1);
  const regTotal = registrations.length;
  const regCheckedIn = registrations.filter((r) => r.status === "checked_in").length;
  const regVip = registrations.filter((r) => r.ticketType === "vip").length;
  const revenue = registrations.filter((r) => r.paymentStatus === "paid").reduce((s, r) => s + (r.paymentAmount ?? 0), 0);

  return (<div className="space-y-4">
    <div><h1 className="text-3xl font-black text-[#0E0F14]" style={{ fontFamily: "var(--font-display)" }}>DASHBOARD</h1><p className="text-sm text-[#0E0F14]/50">Overview statistik pendaftaran & revenue</p></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard icon={Users} label="Total Pendaftar" value={regTotal} bg="bg-gradient-to-br from-[#FC7166] to-[#E54B40]" />
      <StatCard icon={CheckCircle2} label="Checked-in" value={regCheckedIn} bg="bg-gradient-to-br from-green-500 to-green-600" />
      <StatCard icon={Star} label="VIP Tiket" value={regVip} bg="bg-gradient-to-br from-[#F39F23] to-[#C97D0E]" />
      <StatCard icon={DollarSign} label="Revenue" value={formatRupiah(revenue)} bg="bg-gradient-to-br from-[#FD8656] to-[#E56A1F]" />
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard icon={MapPin} label="Kota Selesai" value={`${completedCities}/20`} bg="bg-gradient-to-br from-[#884D3E] to-[#51343F]" />
      <StatCard icon={Clock} label="Pendaftaran Aktif" value={openCities} bg="bg-gradient-to-br from-[#C99789] to-[#AD7868]" />
      <StatCard icon={Trophy} label="Target MURI" value={muriTarget.toLocaleString("id-ID")} bg="bg-gradient-to-br from-[#252D3A] to-[#1F2129]" />
      <StatCard icon={TrendingUp} label="Progress" value={`${pct}%`} bg="bg-gradient-to-br from-[#FC7166] to-[#FD8656]" />
    </div>
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#FC7166]/15">
      <div className="flex items-center justify-between mb-3"><h2 className="text-lg font-black text-[#0E0F14]" style={{ fontFamily: "var(--font-display)" }}>PROGRESS REKOR MURI</h2><span className="text-2xl font-black text-[#F39F23]" style={{ fontFamily: "var(--font-display)" }}>{pct}%</span></div>
      <div className="h-4 bg-[#FFE0D6] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#FC7166] via-[#FD8656] to-[#F39F23] rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} /></div>
      <div className="flex justify-between mt-2 text-xs text-[#0E0F14]/50"><span>{totalRegistered.toLocaleString("id-ID")} terdaftar</span><span>{(muriTarget - totalRegistered).toLocaleString("id-ID")} slot tersisa</span></div>
    </div>
  </div>);
}
