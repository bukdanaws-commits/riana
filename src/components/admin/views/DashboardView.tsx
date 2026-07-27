"use client";

import {
  MapPin, Users, Trophy, Handshake, Star, Image as ImageIcon,
  CheckCircle2, Clock, TrendingUp, AlertTriangle, DollarSign,
} from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import { AdminCard, StatCard } from "../AdminDashboard";
import { formatRupiah } from "@/data/pricing";

export function DashboardView() {
  const cities = useAdminStore((s) => s.cities);
  const testimonials = useAdminStore((s) => s.testimonials);
  const partners = useAdminStore((s) => s.partners);
  const faqs = useAdminStore((s) => s.faqs);
  const gallery = useAdminStore((s) => s.gallery);
  const registrations = useAdminStore((s) => s.registrations);
  const muriTarget = useAdminStore((s) => s.muriTarget);

  const totalRegistered = cities.reduce((sum, c) => sum + c.registered, 0);
  const totalCheckedIn = cities.reduce((sum, c) => sum + (c.checkedIn ?? 0), 0);
  const completedCities = cities.filter((c) => c.status === "completed").length;
  const openCities = cities.filter((c) => c.status === "open").length;
  const pct = ((totalRegistered / muriTarget) * 100).toFixed(1);

  // Real registration stats
  const regTotal = registrations.length;
  const regCheckedIn = registrations.filter((r) => r.status === "checked_in").length;
  const regVip = registrations.filter((r) => r.ticketType === "vip").length;
  const revenue = registrations
    .filter((r) => r.paymentStatus === "paid")
    .reduce((sum, r) => sum + (r.paymentAmount ?? 0), 0);

  // Region breakdown
  const regionStats = cities.reduce<Record<string, { total: number; reg: number; completed: number }>>((acc, c) => {
    if (!acc[c.region]) acc[c.region] = { total: 0, reg: 0, completed: 0 };
    acc[c.region].total += c.capacity;
    acc[c.region].reg += c.registered;
    if (c.status === "completed") acc[c.region].completed += 1;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {/* === HERO BANNER === */}
      <AdminCard variant="coral" className="relative overflow-hidden p-6">
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-[#FD8656]/20 blur-3xl pointer-events-none" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">
              Welcome back, Admin 👋
            </div>
            <h2
              className="text-3xl font-black text-white leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              RIANA ON THE MOVE
            </h2>
            <p className="text-sm text-white/80 mt-1">
              Road to MURI 2026 — {regTotal} peserta terdaftar dari target {muriTarget.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="text-right">
            <div
              className="text-5xl font-black text-white leading-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {pct}%
            </div>
            <div className="text-xs text-white/70 mt-1 font-mono">MURI PROGRESS</div>
          </div>
        </div>
      </AdminCard>

      {/* === STATS GRID — warna-warni === */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Users} label="Total Registrasi" value={regTotal.toLocaleString("id-ID")} color="coral" trend={`${pct}%`} />
        <StatCard icon={CheckCircle2} label="Checked-in" value={regCheckedIn} color="success" trend="100%" />
        <StatCard icon={Star} label="VIP Tiket" value={regVip} color="golden" />
        <StatCard icon={DollarSign} label="Revenue" value={formatRupiah(revenue)} color="orange" small />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={MapPin} label="Kota Selesai" value={`${completedCities}/20`} color="terracotta" />
        <StatCard icon={Clock} label="Pendaftaran Aktif" value={openCities} color="peach" />
        <StatCard icon={Handshake} label="Partner Brand" value={partners.length} color="navy" />
        <StatCard icon={ImageIcon} label="Gallery Items" value={gallery.length} color="coral" />
      </div>

      {/* === PROGRESS BAR MURI === */}
      <AdminCard variant="navy">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3
              className="text-lg font-black text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              PROGRESS REKOR MURI
            </h3>
            <p className="text-xs text-white/60 mt-0.5">
              Target: {muriTarget.toLocaleString("id-ID")} peserta
            </p>
          </div>
          <div className="text-right">
            <div
              className="text-3xl font-black text-[#FFB938]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {pct}%
            </div>
            <div className="text-[10px] text-white/50 font-mono">
              {totalRegistered.toLocaleString("id-ID")} / {muriTarget.toLocaleString("id-ID")}
            </div>
          </div>
        </div>
        <div className="h-4 bg-[#0E0F14] rounded-full overflow-hidden border border-[#FC7166]/20">
          <div
            className="h-full bg-gradient-to-r from-[#FC7166] via-[#FD8656] to-[#F39F23] rounded-full transition-all duration-1000"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-white/50">
          <span>Sisa: {(muriTarget - totalRegistered).toLocaleString("id-ID")} slot</span>
          <span className="font-mono text-[#FFB938]">Estimasi Grand Finale: 5 Des 2026</span>
        </div>
      </AdminCard>

      {/* === REGION BREAKDOWN === */}
      <AdminCard variant="default">
        <h3
          className="text-lg font-black text-white mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          PROGRESS PER WILAYAH
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {Object.entries(regionStats).map(([region, stats]) => {
            const rpct = Math.round((stats.reg / stats.total) * 100);
            const variants = ["coral", "orange", "golden", "terracotta", "peach", "navy", "default"] as const;
            const idx = Object.keys(regionStats).indexOf(region) % variants.length;
            return (
              <AdminCard key={region} variant={variants[idx]} className="text-center">
                <div className="text-[10px] text-white/70 font-semibold truncate mb-1">
                  {region}
                </div>
                <div
                  className="text-lg font-black text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {stats.reg}
                </div>
                <div className="text-[9px] text-white/50 mb-1">/ {stats.total}</div>
                <div className="h-1 rounded-full bg-black/30 overflow-hidden">
                  <div
                    className="h-full bg-white/60"
                    style={{ width: `${rpct}%` }}
                  />
                </div>
                <div className="text-[9px] text-white/70 mt-1 font-mono">
                  {stats.completed} selesai
                </div>
              </AdminCard>
            );
          })}
        </div>
      </AdminCard>

      {/* === CONTENT STATS GRID === */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Star} label="Testimoni" value={testimonials.length} color="golden" />
        <StatCard icon={Handshake} label="Partner" value={partners.length} color="coral" />
        <StatCard icon={AlertTriangle} label="FAQ" value={faqs.length} color="orange" />
        <StatCard icon={ImageIcon} label="Galeri" value={gallery.length} color="success" />
      </div>

      {/* === UPCOMING CITIES === */}
      <AdminCard variant="default">
        <div className="flex items-center justify-between mb-3">
          <h3
            className="text-lg font-black text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            KOTA BERIKUTNYA
          </h3>
          <span className="text-xs text-white/50 font-mono">Next 5 events</span>
        </div>
        <div className="space-y-2">
          {cities
            .filter((c) => c.status === "open" || c.status === "soon")
            .slice(0, 5)
            .map((city) => {
              const cpct = Math.round((city.registered / city.capacity) * 100);
              return (
                <div
                  key={city.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-[#0E0F14] border border-[#FC7166]/15"
                >
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-black text-xs bg-gradient-to-br from-[#FC7166] to-[#FD8656]">
                    {city.dateLabel.split(" ")[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{city.city}</span>
                      <span className="text-[10px] text-white/50 font-mono">
                        {city.dateLabel} • {city.dayLabel}
                      </span>
                    </div>
                    <div className="h-1 mt-1 rounded-full bg-[#FC7166]/15 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#FC7166] to-[#FD8656]"
                        style={{ width: `${cpct}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">
                      {city.registered}/{city.capacity}
                    </div>
                    <div className="text-[9px] text-white/50 font-mono">{cpct}%</div>
                  </div>
                </div>
              );
            })}
        </div>
      </AdminCard>
    </div>
  );
}
