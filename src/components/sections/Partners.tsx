"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Dumbbell,
  Building2,
  Users,
  Landmark,
  Radio,
  ArrowRight,
  Handshake,
} from "lucide-react";
import { PARTNER_TYPES, PARTNER_TIERS } from "@/data/event";

const ICONS: Record<string, React.ElementType> = {
  Brand: Sparkles,
  "Gym & Fitness": Dumbbell,
  "Hotel & Venue": Building2,
  Komunitas: Users,
  "Pemerintah Daerah": Landmark,
  "Media Partner": Radio,
};

export function Partners() {
  return (
    <section id="partner" className="relative py-16 lg:py-24 bg-white overflow-hidden">
      <div className="absolute inset-0 pattern-grid opacity-40 -z-10" />
      <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-stone-200/40 blur-3xl -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 border border-stone-200 mb-4">
            <Handshake className="h-3.5 w-3.5 text-stone-600" />
            <span className="text-xs font-bold text-stone-800 tracking-wide uppercase">Partnership Opportunity</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 mb-3" style={{ fontFamily: "var(--font-display)" }}>
            Mari <span className="text-gradient-magenta">Berkolaborasi</span>
          </h2>
          <p className="text-base text-zinc-600">
            Kami membuka kesempatan kolaborasi bagi brand, venue, komunitas, dan institusi yang ingin
            menggerakkan masyarakat Indonesia bersama Riana On The Move. Exposure nasional, audiens
            aktif, dan dampak sosial yang nyata.
          </p>
        </motion.div>

        {/* Partner type grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {PARTNER_TYPES.map((p, i) => {
            const Icon = ICONS[p.label] ?? Sparkles;
            return (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="group p-5 rounded-2xl bg-gradient-to-br from-zinc-50 to-orange-50/50 border border-zinc-200 hover:border-orange-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-11 w-11 rounded-xl bg-brand-gradient flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-zinc-900">{p.label}</h3>
                    <p className="text-xs text-zinc-600 mt-1 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Sponsor tiers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-gradient-to-br from-zinc-900 via-stone-900 to-orange-900 p-6 lg:p-10 text-white overflow-hidden relative"
        >
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />

          <div className="relative">
            <div className="text-center mb-8">
              <h3 className="text-2xl lg:text-3xl font-black mb-2" style={{ fontFamily: "var(--font-display)" }}>
                Tier Sponsorship
              </h3>
              <p className="text-white/70 text-sm">
                Pilih paket yang sesuai dengan tujuan brand Anda — dari Platinum hingga Silver.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {PARTNER_TIERS.map((tier, i) => (
                <div
                  key={tier.name}
                  className={`relative p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all ${
                    i === 0 ? "ring-2 ring-orange-400/40" : ""
                  }`}
                >
                  {i === 0 && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-orange-400 text-amber-950 text-[10px] font-bold tracking-wider uppercase">
                      Most Popular
                    </div>
                  )}
                  <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${tier.color} text-white text-xs font-bold tracking-wider uppercase mb-3`}>
                    {tier.name}
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">{tier.benefit}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <Button
                size="lg"
                className="bg-white text-zinc-900 hover:bg-white/90 font-bold h-12 px-7 rounded-full"
              >
                <Sparkles className="mr-2 h-4 w-4 text-orange-600" />
                Request Partnership Deck
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <div className="text-white/60 text-sm">
                atau WhatsApp: <span className="font-bold text-white">0813-2099-9969</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
