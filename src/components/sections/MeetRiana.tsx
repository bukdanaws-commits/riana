"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles, Instagram, Music2 } from "lucide-react";
import { RIANA_STATS } from "@/data/event";

export function MeetRiana() {
  return (
    <section id="about" className="relative py-16 lg:py-24 bg-white overflow-hidden">
      <div className="absolute inset-0 pattern-dots opacity-40 -z-10" />
      <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-orange-200/40 blur-3xl -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: portrait */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative max-w-sm mx-auto">
              {/* Decorative frame */}
              <div className="absolute -inset-3 rounded-[2.5rem] bg-brand-gradient opacity-20 blur-2xl" />
              <div className="absolute -inset-1 rounded-[2.25rem] bg-brand-gradient" />

              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-charcoal">
                {/* Real photo of Riana */}
                <img
                  src="/brand/extra-2.jpg"
                  alt="Riana — Zumba Education Specialist"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {/* Warm coral overlay for brand cohesion */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(20,22,27,0.1) 0%, rgba(20,22,27,0.2) 50%, rgba(20,22,27,0.8) 100%)",
                  }}
                />

                {/* Floating badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold tracking-widest uppercase">
                  <Sparkles className="inline h-3 w-3 mr-1" />
                  Founder & Master Trainer
                </div>

                {/* Bottom name plate */}
                <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                  <div className="text-white font-extrabold text-2xl" style={{ fontFamily: "var(--font-display)" }}>
                    Riana
                  </div>
                  <div className="text-white/85 text-xs">Zumba Education Specialist (ZES)</div>
                </div>
              </div>

              {/* Floating chips */}
              <div className="absolute -top-3 -right-3 px-3 py-2 rounded-2xl bg-white shadow-lg flex items-center gap-2">
                <Instagram className="h-4 w-4 text-orange-600" />
                <div className="leading-tight">
                  <div className="text-xs font-extrabold">850K</div>
                  <div className="text-[9px] text-zinc-500">Followers</div>
                </div>
              </div>
              <div className="absolute -bottom-3 -left-3 px-3 py-2 rounded-2xl bg-white shadow-lg flex items-center gap-2">
                <Music2 className="h-4 w-4 text-orange-600" />
                <div className="leading-tight">
                  <div className="text-xs font-extrabold">10+ Years</div>
                  <div className="text-[9px] text-zinc-500">Experience</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: bio */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 mb-4">
              <Heart className="h-3.5 w-3.5 text-orange-600 fill-orange-600" />
              <span className="text-xs font-bold text-orange-800 tracking-wide uppercase">Meet The Master</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Kenali <span className="text-gradient-magenta">Riana</span>, Sang Master di Balik Gerakan Ini
            </h2>
            <div className="space-y-4 text-base text-zinc-600 leading-relaxed">
              <p>
                Riana adalah Zumba Education Specialist (ZES) bersertifikasi resmi dari Zumba Fitness LLC —
                salah satu dari sedikit instruktur berlisensi ZES di Indonesia. Dengan lebih dari satu dekade
                pengalaman mengajar di 120+ kota, Riana telah membangun komunitas aktif berkapasitas 850.000+
                pengikut di seluruh platform sosial media.
              </p>
              <p>
                Lewat program <span className="font-bold text-zinc-900">AktiveNation</span>, Riana berkomitmen
                menggerakkan masyarakat Indonesia menuju gaya hidup aktif dan sehat. Roadshow{" "}
                <span className="font-bold text-zinc-900">Riana On The Move</span> adalah mahakarya terbesarnya:
                20 kota, 10.000+ peserta target, dan satu rekor MURI sebagai bukti bahwa Indonesia bisa hidup
                lebih sehat bersama-sama.
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
              {RIANA_STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-50 border border-orange-100 text-center"
                >
                  <div className="text-2xl lg:text-3xl font-black text-gradient-magenta" style={{ fontFamily: "var(--font-display)" }}>
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-zinc-600 font-semibold mt-1 leading-tight">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
