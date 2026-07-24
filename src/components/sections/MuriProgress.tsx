"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Users, TrendingUp, Sparkles } from "lucide-react";
import { MURI_TARGET, getRegisteredTotal, CITIES } from "@/data/event";

export function MuriProgress() {
  const baseTotal = getRegisteredTotal();
  const [count, setCount] = useState(0);

  // Animate count from 0 -> baseTotal on mount, then keep ticking slowly
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = 1800;
    const animate = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * baseTotal));
      if (p < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [baseTotal]);

  // Live ticker — increment slowly
  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= baseTotal + 12) return c;
        return c + 1;
      });
    }, 4000);
    return () => clearInterval(id);
  }, [baseTotal]);

  const pct = Math.min((count / MURI_TARGET) * 100, 100);

  // Stats per region
  const regionStats = CITIES.reduce<Record<string, { total: number; reg: number }>>((acc, c) => {
    if (!acc[c.region]) acc[c.region] = { total: 0, reg: 0 };
    acc[c.region].total += c.capacity;
    acc[c.region].reg += c.registered;
    return acc;
  }, {});

  return (
    <section className="relative py-16 lg:py-24 bg-brand-dark overflow-hidden">
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage:
          "radial-gradient(circle at 20% 30%, rgba(236,10,139,0.5) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,106,44,0.4) 0%, transparent 40%)",
      }} />

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/20 backdrop-blur-md border border-amber-300/30 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span className="text-xs font-bold text-amber-200 tracking-wide uppercase">Live Progress</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3" style={{ fontFamily: "var(--font-display)" }}>
            Menuju Rekor <span className="text-gradient-brand">MURI</span>
          </h2>
          <p className="text-base text-white/70 max-w-2xl mx-auto">
            Setiap pendaftaran membawa kita selangkah lebih dekat ke rekor sejarah. Pantau progress
            real-time dan ajak teman Anda ikut bergerak!
          </p>
        </motion.div>

        {/* Big counter card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 lg:p-10 overflow-hidden"
        >
          {/* Decorative blob */}
          <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-pink-500/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl" />

          <div className="relative">
            {/* Numbers row */}
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 mb-8">
              <div className="text-center sm:text-left">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-widest mb-1">
                  <Users className="h-4 w-4" />
                  Peserta Terdaftar
                </div>
                <div className="text-5xl lg:text-7xl font-black text-white tabular-nums leading-none" style={{ fontFamily: "var(--font-display)" }}>
                  {count.toLocaleString("id-ID")}
                </div>
              </div>

              <div className="text-4xl lg:text-5xl text-white/30 font-black">/</div>

              <div className="text-center sm:text-right">
                <div className="flex items-center gap-2 text-pink-300 text-xs font-bold uppercase tracking-widest mb-1 justify-center sm:justify-end">
                  <Trophy className="h-4 w-4" />
                  Target MURI
                </div>
                <div className="text-5xl lg:text-7xl font-black text-gradient-brand tabular-nums leading-none" style={{ fontFamily: "var(--font-display)" }}>
                  {MURI_TARGET.toLocaleString("id-ID")}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative">
              <div className="h-6 lg:h-8 w-full rounded-full bg-white/10 overflow-hidden border border-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                  className="relative h-full bg-brand-energetic rounded-full overflow-hidden"
                >
                  {/* Shimmer effect */}
                  <div
                    className="absolute inset-0 opacity-50"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 2s linear infinite",
                    }}
                  />
                </motion.div>
              </div>
              {/* Percentage label */}
              <div className="flex items-center justify-between mt-2 text-xs text-white/60">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-green-400" />
                  {pct.toFixed(1)}% tercapai
                </span>
                <span>
                  {Math.max(MURI_TARGET - count, 0).toLocaleString("id-ID")} slot tersisa
                </span>
              </div>
            </div>

            {/* Regional breakdown */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="text-xs text-white/60 font-bold uppercase tracking-widest mb-3">
                Progress per Wilayah
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {Object.entries(regionStats).map(([region, stats]) => {
                  const rpct = Math.round((stats.reg / stats.total) * 100);
                  return (
                    <div
                      key={region}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center"
                    >
                      <div className="text-[10px] text-white/60 font-semibold truncate">{region}</div>
                      <div className="text-base font-black text-white tabular-nums mt-0.5">
                        {stats.reg}
                      </div>
                      <div className="text-[9px] text-white/40">/{stats.total}</div>
                      <div className="mt-1 h-0.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-brand-warm"
                          style={{ width: `${rpct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
