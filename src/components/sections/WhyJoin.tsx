"use client";

import { motion } from "framer-motion";
import { Trophy, HeartPulse, Users, Award, Gift, Star } from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";

const ICONS: Record<string, React.ElementType> = {
  Trophy,
  HeartPulse,
  Users,
  Award,
  Gift,
  Star,
};

export function WhyJoin() {
  const BENEFITS = useAdminStore((s) => s.benefits);
  return (
    <section id="keuntungan" className="relative py-4 lg:py-6 bg-[#FAEDE9] overflow-hidden">
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#FC7166]/20/40 blur-3xl -z-10" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#FC7166]/20/40 blur-3xl -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F39F23]/15 border border-[#FC7166]/25 mb-4">
            <Star className="h-3.5 w-3.5 text-[#FC7166] fill-[#FC7166]" />
            <span className="text-xs font-bold text-[#FC7166] tracking-wide uppercase">Why You Should Join</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0E0F14] mb-3" style={{ fontFamily: "var(--font-display)" }}>
            6 Alasan Jadi Bagian dari <span className="text-gradient-brand">Sejarah</span>
          </h2>
          <p className="text-base text-[#0E0F14]/70">
            Bukan sekadar ikut kelas Zumba. Ini pengalaman sekali seumur hidup yang akan mengubah cara
            Anda melihat hidup aktif — dan mengabadikan nama Anda dalam sejarah Indonesia.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-3">
          {BENEFITS.map((b, i) => {
            const Icon = ICONS[b.icon];
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="group relative p-6 lg:p-7 rounded-3xl bg-[#181A22] border-2 border-[#FC7166]/15 hover:border-transparent hover:shadow-2xl transition-all overflow-hidden"
              >
                {/* Hover gradient backdrop */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FC7166] to-[#FD8656] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-[#FC7166] to-[#FD8656] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="text-5xl font-black text-[#0E0F14]/30 group-hover:text-[#0E0F14]/30 transition-colors leading-none" style={{ fontFamily: "var(--font-display)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                  </div>
                  <h3 className="text-lg lg:text-xl font-extrabold text-[#0E0F14] group-hover:text-white transition-colors mb-2">
                    {b.title}
                  </h3>
                  <p className="text-sm text-[#0E0F14]/70 group-hover:text-[#0E0F14]/90 transition-colors leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
