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
  Crown,
  Award,
  Star,
  Megaphone,
} from "lucide-react";
import { PARTNER_TYPES, PARTNER_TIERS, PARTNERS, type Partner } from "@/data/event";

const ICONS: Record<string, React.ElementType> = {
  Brand: Sparkles,
  "Gym & Fitness": Dumbbell,
  "Hotel & Venue": Building2,
  Komunitas: Users,
  "Pemerintah Daerah": Landmark,
  "Media Partner": Radio,
};

const TIER_ICONS: Record<Partner["tier"], React.ElementType> = {
  Platinum: Crown,
  Gold: Award,
  Silver: Star,
  "Media Partner": Megaphone,
};

const TIER_COLORS: Record<Partner["tier"], string> = {
  Platinum: "from-violet-500 to-fuchsia-500",
  Gold: "from-amber-400 to-orange-500",
  Silver: "from-zinc-300 to-zinc-500",
  "Media Partner": "from-cyan-400 to-blue-500",
};

export function Partners() {
  // Group partners by tier
  const platinum = PARTNERS.filter((p) => p.tier === "Platinum");
  const gold = PARTNERS.filter((p) => p.tier === "Gold");
  const silver = PARTNERS.filter((p) => p.tier === "Silver");
  const media = PARTNERS.filter((p) => p.tier === "Media Partner");

  return (
    <section id="partner" className="relative py-4 lg:py-6 bg-brand-tech overflow-hidden">
      <div className="absolute inset-0 pattern-grid opacity-40 -z-10" />
      <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-magenta/15 blur-3xl -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-magenta/15 border border-magenta/30 mb-4">
            <Handshake className="h-3.5 w-3.5 text-magenta-light" />
            <span
              className="text-xs font-bold text-magenta-light tracking-wide uppercase"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Trusted by Leading Brands
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-cream mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Partner & <span className="text-gradient-brand">Sponsor</span>
          </h2>
          <p className="text-base text-cream/70">
            13 brand terkemuka Indonesia sudah bergabung menggerakkan masyarakat bersama Riana On The Move.
            Eksposur nasional, audiens aktif, dan dampak sosial yang nyata.
          </p>
        </motion.div>

        {/* === PARTNER LOGOS BY TIER === */}
        <div className="space-y-4 mb-4">
          {/* Platinum */}
          <PartnerTierRow
            tier="Platinum"
            partners={platinum}
            icon={TIER_ICONS.Platinum}
            gradient={TIER_COLORS.Platinum}
          />

          {/* Gold */}
          <PartnerTierRow
            tier="Gold"
            partners={gold}
            icon={TIER_ICONS.Gold}
            gradient={TIER_COLORS.Gold}
          />

          {/* Silver */}
          <PartnerTierRow
            tier="Silver"
            partners={silver}
            icon={TIER_ICONS.Silver}
            gradient={TIER_COLORS.Silver}
          />

          {/* Media Partner */}
          <PartnerTierRow
            tier="Media Partner"
            partners={media}
            icon={TIER_ICONS["Media Partner"]}
            gradient={TIER_COLORS["Media Partner"]}
          />
        </div>

        {/* === PARTNER TYPES (kolaborasi yang dibuka) === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <h3
            className="text-2xl lg:text-3xl font-black text-cream text-center mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Masih Buka <span className="text-gradient-gold">Kolaborasi</span>
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PARTNER_TYPES.map((p, i) => {
              const Icon = ICONS[p.label] ?? Sparkles;
              return (
                <motion.div
                  key={p.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="group p-4 rounded-2xl bg-purple-dark border border-magenta/20 hover:border-magenta/40 hover:shadow-glow-pink transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-11 w-11 rounded-xl bg-brand-gradient flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-cream">{p.label}</h3>
                      <p className="text-xs text-cream/70 mt-1 leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* === TIER SPONSORSHIP CARDS === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-gradient-to-br from-purpleblack via-purple-dark to-plum p-6 lg:p-8 text-cream overflow-hidden relative border border-magenta/20"
        >
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-magenta/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />

          <div className="relative">
            <div className="text-center mb-3">
              <h3
                className="text-2xl lg:text-3xl font-black mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Paket <span className="text-gradient-gold">Sponsorship</span>
              </h3>
              <p className="text-cream/70 text-sm">
                Pilih paket yang sesuai dengan tujuan brand — dari Platinum hingga Silver.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              {PARTNER_TIERS.map((tier, i) => (
                <div
                  key={tier.name}
                  className={`relative p-5 rounded-2xl bg-purple-dark/60 backdrop-blur-md border border-magenta/15 hover:border-magenta/40 transition-all ${
                    i === 0 ? "ring-2 ring-magenta/40" : ""
                  }`}
                >
                  {i === 0 && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gold text-purpleblack text-[10px] font-bold tracking-wider uppercase">
                      Most Popular
                    </div>
                  )}
                  <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${tier.color} text-white text-xs font-bold tracking-wider uppercase mb-2`}>
                    {tier.name}
                  </div>
                  <div className="text-2xl font-black text-gold-light mb-2" style={{ fontFamily: "var(--font-display)" }}>
                    {tier.price}
                  </div>
                  <p className="text-sm text-cream/80 leading-relaxed">{tier.benefit}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-3">
              <Button
                size="lg"
                className="bg-magenta hover:bg-magenta-deep text-white font-bold h-12 px-7 rounded-full shadow-glow-pink"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Request Partnership Deck
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <div className="text-cream/70 text-sm">
                atau WhatsApp:{" "}
                <span className="font-bold text-gold-light">0813-2099-9969</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// === Sub-component: Partner Tier Row ===
function PartnerTierRow({
  tier,
  partners,
  icon: Icon,
  gradient,
}: {
  tier: Partner["tier"];
  partners: Partner[];
  icon: React.ElementType;
  gradient: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      {/* Tier label */}
      <div className="flex items-center gap-3 mb-2">
        <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <h4
          className="text-lg font-black text-cream tracking-wider uppercase"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {tier}
        </h4>
        <div className="flex-1 h-px bg-magenta/20" />
        <span className="text-xs text-cream/50 font-mono">{partners.length} brand</span>
      </div>

      {/* Partner logo grid */}
      <div className={`grid gap-2 ${tier === "Media Partner" ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-3"}`}>
        {partners.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="group relative p-3 rounded-xl bg-purple-dark border border-magenta/15 hover:border-magenta/30 transition-all"
          >
            <div className="flex items-center gap-3">
              {/* Logo placeholder with brand color */}
              <div
                className="flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-md"
                style={{ backgroundColor: p.logoColor }}
              >
                {p.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-cream text-sm leading-tight truncate">{p.name}</div>
                <div className="text-[10px] text-cream/60 truncate">{p.category}</div>
                {p.benefit && (
                  <div className="text-[9px] text-magenta-light mt-0.5 truncate font-mono">{p.benefit}</div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
