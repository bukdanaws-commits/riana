"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Sparkles,
  Trophy,
  MapPin,
  Play,
  ArrowRight,
  Users,
  Calendar,
} from "lucide-react";
import Link from "next/link";

interface HeroProps {
  onRegisterClick: () => void;
}

export function Hero({ onRegisterClick }: HeroProps) {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-purpleblack">
      {/* === FULL-WIDTH BACKGROUND IMAGE === */}
      <div className="absolute inset-0">
        <img
          src="/brand/user-hero-processed.jpg"
          alt="Riana On The Move — 10.000 peserta Zumba bersama instruktur Riana"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Dark gradient overlay for content readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,7,16,0.75) 0%, rgba(11,7,16,0.55) 35%, rgba(11,7,16,0.8) 70%, rgba(11,7,16,0.98) 100%), radial-gradient(ellipse at 70% 30%, rgba(223,38,121,0.3) 0%, transparent 60%)",
          }}
        />
        {/* Magenta-orange tint overlay */}
        <div
          className="absolute inset-0 mix-blend-soft-light opacity-40"
          style={{
            background:
              "linear-gradient(135deg, rgba(223,38,121,0.4) 0%, rgba(241,114,56,0.3) 50%, rgba(212,175,55,0.2) 100%)",
          }}
        />
        {/* Tech scanlines subtle */}
        <div className="absolute inset-0 pattern-scanlines opacity-30 pointer-events-none" />
      </div>

      {/* === FLOATING DECORATIVE BLOBS === */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-magenta/20 blur-3xl animate-float-slow pointer-events-none" />
      <div
        className="absolute top-1/4 -right-32 h-[28rem] w-[28rem] rounded-full bg-orange-brand/15 blur-3xl animate-float-slow pointer-events-none"
        style={{ animationDelay: "1s" }}
      />

      {/* === CONTENT === */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top spacer for navbar */}
        <div className="h-16 lg:h-20" />

        {/* Main hero content */}
        <div className="flex-1 flex items-center">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <div className="max-w-3xl">
              {/* Pre-headline badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4 corner-bracket"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-magenta opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-magenta" />
                </span>
                <span
                  className="text-xs sm:text-sm font-bold text-cream tracking-widest uppercase"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  20 Cities • 1 Movement
                </span>
                <span className="text-gold-light text-xs">/</span>
                <span className="text-[10px] font-mono text-gold-light">LIVE</span>
              </motion.div>

              {/* Headline — Bebas Neue huge */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-6xl sm:text-7xl lg:text-[9rem] font-black leading-[0.85] tracking-tight mb-3 text-cream drop-shadow-2xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                RIANA ON
                <br />
                <span className="text-gradient-brand">THE MOVE</span>
              </motion.h1>

              {/* Sub-headline */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="flex flex-wrap items-center gap-3 mb-4"
              >
                <div className="px-4 py-1.5 rounded-full glass-card border-tech-glow font-bold text-sm tracking-widest uppercase text-gold-light">
                  <Trophy className="inline h-4 w-4 mr-1.5 text-gold" />
                  Road to MURI 2026
                </div>
                <div
                  className="font-script text-2xl sm:text-3xl text-gold-light drop-shadow-lg"
                  style={{ fontFamily: "var(--font-script)" }}
                >
                  Move Together, Make History!
                </div>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="text-base sm:text-lg text-cream/90 max-w-xl mb-5 leading-relaxed"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                Riana hadir di{" "}
                <span className="font-bold text-magenta-light">20 kota</span>{" "}
                untuk mengajak ribuan orang bergerak bersama — menuju{" "}
                <span className="font-bold text-gold-light">
                  Rekor MURI Zumba Step Terbesar di Indonesia
                </span>
                .
              </motion.p>

              {/* Mini stats */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="flex flex-wrap items-center gap-3 sm:gap-4 mb-5"
              >
                <Stat icon={MapPin} value="20" label="Kota" />
                <Stat icon={Users} value="10.000+" label="Peserta" />
                <Stat icon={Trophy} value="MURI" label="Rekor" />
                <Stat icon={Calendar} value="2026" label="Tour" />
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
              >
                <Button
                  size="lg"
                  onClick={onRegisterClick}
                  className="bg-magenta hover:bg-magenta-deep text-white font-bold text-base h-14 px-8 rounded-full shadow-glow-pink border border-magenta-light/40"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Daftar Sekarang
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  asChild
                  variant="outline"
                  className="font-bold text-base h-14 px-8 rounded-full glass-card border-tech text-cream hover:bg-magenta/20 hover:text-cream"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <Link href="#jadwal">
                    <Play className="mr-2 h-4 w-4 fill-magenta text-magenta" />
                    Lihat Jadwal Tour
                  </Link>
                </Button>
              </motion.div>

              {/* Trust line */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-4 flex items-center gap-3 text-xs sm:text-sm text-cream/70"
              >
                <div className="flex -space-x-2">
                  {["#FC7166", "#FD8656", "#F39F23", "#884D3E", "#FF8A80"].map((c, i) => (
                    <div
                      key={i}
                      className="h-7 w-7 rounded-full border-2 border-purpleblack"
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <span>
                  <span className="font-bold text-cream">587+</span> peserta sudah mendaftar
                </span>
                <span className="font-mono text-gold-light text-[10px]">[LIVE]</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom data strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="relative border-t border-magenta/20 bg-purpleblack/60 backdrop-blur-sm"
        >
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-2 text-[10px] sm:text-xs">
            <div className="flex items-center gap-2 sm:gap-4 text-cream/60">
              <span className="font-mono text-gold-light">EVENT_ID://RIANA-MURI-2026</span>
              <span className="hidden sm:inline">/</span>
              <span className="hidden sm:inline">ZUMBA STEP • 20 KOTA • 10.000 PESERTA</span>
            </div>
            <div className="flex items-center gap-1.5 text-magenta-light font-bold">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-magenta opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-magenta" />
              </span>
              <span className="font-mono">REGISTRATION_OPEN</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-2xl glass-card">
      <div className="h-9 w-9 rounded-xl bg-magenta/20 flex items-center justify-center border border-magenta/30">
        <Icon className="h-5 w-5 text-magenta-light" />
      </div>
      <div className="leading-tight">
        <div
          className="font-black text-cream text-sm"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "0.02em" }}
        >
          {value}
        </div>
        <div className="text-[10px] text-cream/60 uppercase tracking-wider font-semibold">
          {label}
        </div>
      </div>
    </div>
  );
}
