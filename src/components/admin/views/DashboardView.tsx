"use client";

import {
  MapPin, Users, Trophy, Handshake, Star, Image as ImageIcon,
  CheckCircle2, Clock, TrendingUp, AlertTriangle,
} from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import { AdminCard, StatCard } from "../AdminDashboard";

export function DashboardView() {
  const cities = useAdminStore((s) => s.cities);
  const testimonials = useAdminStore((s) => s.testimonials);
  const partners = useAdminStore((s) => s.partners);
  const faqs = useAdminStore((s) => s.faqs);
  const gallery = useAdminStore((s) => s.gallery);
  const muriTarget = useAdminStore((s) => s.muriTarget);

  const totalRegistered = cities.reduce((sum, c) => sum + c.registered, 0);
  const totalCheckedIn = cities.reduce((sum, c) => sum + (c.checkedIn ?? 0), 0);
  const completedCities = cities.filter((c) => c.status === "completed").length;
  const openCities = cities.filter((c) => c.status === "open").length;
  const pct = ((totalRegistered / muriTarget) * 100).toFixed(1);

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
      {/* === STATS GRID === */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={Users}
          label="Total Registrasi"
          value={totalRegistered.toLocaleString("id-ID")}
          color="magenta"
          trend={`${pct}%`}
        />
        <StatCard
          icon={CheckCircle2}
          label="Check-in Aktual"
          value={totalCheckedIn.toLocaleString("id-ID")}
          color="green"
          trend="100%"
        />
        <StatCard
          icon={MapPin}
          label="Kota Selesai"
          value={`${completedCities}/20`}
          color="gold"
        />
        <StatCard
          icon={Clock}
          label="Pendaftaran Aktif"
          value={openCities}
          color="orange"
        />
      </div>

      {/* === PROGRESS BAR MURI === */}
      <AdminCard>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3
              className="text-lg font-black text-cream"
              style={{ fontFamily: "var(--font-display)" }}
            >
              PROGRESS REKOR MURI
            </h3>
            <p className="text-xs text-cream/60 mt-0.5">
              Target: {muriTarget.toLocaleString("id-ID")} peserta
            </p>
          </div>
          <div className="text-right">
            <div
              className="text-3xl font-black text-gradient-gold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {pct}%
            </div>
            <div className="text-[10px] text-cream/50 font-mono">
              {totalRegistered.toLocaleString("id-ID")} / {muriTarget.toLocaleString("id-ID")}
            </div>
          </div>
        </div>
        <div className="h-4 bg-purpleblack rounded-full overflow-hidden border border-magenta/20">
          <div
            className="h-full bg-brand-energetic rounded-full transition-all duration-1000"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-cream/50">
          <span>Sisa: {(muriTarget - totalRegistered).toLocaleString("id-ID")} slot</span>
          <span className="font-mono text-gold-light">Estimasi Grand Finale: 5 Des 2026</span>
        </div>
      </AdminCard>

      {/* === REGION BREAKDOWN === */}
      <AdminCard>
        <h3
          className="text-lg font-black text-cream mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          PROGRESS PER WILAYAH
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {Object.entries(regionStats).map(([region, stats]) => {
            const rpct = Math.round((stats.reg / stats.total) * 100);
            return (
              <div
                key={region}
                className="p-3 rounded-xl bg-purpleblack border border-magenta/15 text-center"
              >
                <div className="text-[10px] text-cream/60 font-semibold truncate mb-1">
                  {region}
                </div>
                <div
                  className="text-lg font-black text-cream"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {stats.reg}
                </div>
                <div className="text-[9px] text-cream/40 mb-1">/ {stats.total}</div>
                <div className="h-1 rounded-full bg-magenta/15 overflow-hidden">
                  <div
                    className="h-full bg-magenta"
                    style={{ width: `${rpct}%` }}
                  />
                </div>
                <div className="text-[9px] text-gold-light mt-1 font-mono">
                  {stats.completed} selesai
                </div>
              </div>
            );
          })}
        </div>
      </AdminCard>

      {/* === CONTENT STATS GRID === */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Star} label="Testimoni" value={testimonials.length} color="gold" />
        <StatCard icon={Handshake} label="Partner" value={partners.length} color="magenta" />
        <StatCard icon={AlertTriangle} label="FAQ" value={faqs.length} color="orange" />
        <StatCard icon={ImageIcon} label="Galeri" value={gallery.length} color="green" />
      </div>

      {/* === UPCOMING CITIES === */}
      <AdminCard>
        <div className="flex items-center justify-between mb-3">
          <h3
            className="text-lg font-black text-cream"
            style={{ fontFamily: "var(--font-display)" }}
          >
            KOTA BERIKUTNYA
          </h3>
          <span className="text-xs text-cream/50 font-mono">Next 5 events</span>
        </div>
        <div className="space-y-2">
          {cities
            .filter((c) => c.status === "open" || c.status === "soon")
            .slice(0, 5)
            .map((city) => {
              const pct = Math.round((city.registered / city.capacity) * 100);
              return (
                <div
                  key={city.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-purpleblack border border-magenta/15"
                >
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-black text-xs"
                    style={{ background: `#${REGION_COLORS_BY_ID[city.id] ?? "DF2679"}` }}
                  >
                    {city.dateLabel.split(" ")[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-cream text-sm">{city.city}</span>
                      <span className="text-[10px] text-cream/50 font-mono">
                        {city.dateLabel} • {city.dayLabel}
                      </span>
                    </div>
                    <div className="h-1 mt-1 rounded-full bg-magenta/15 overflow-hidden">
                      <div
                        className="h-full bg-magenta"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-cream">
                      {city.registered}/{city.capacity}
                    </div>
                    <div className="text-[9px] text-cream/50 font-mono">{pct}%</div>
                  </div>
                </div>
              );
            })}
        </div>
      </AdminCard>
    </div>
  );
}

// Helper: region color lookup by city id pattern (simplified — just use magenta default)
const REGION_COLORS_BY_ID: Record<string, string> = {};
