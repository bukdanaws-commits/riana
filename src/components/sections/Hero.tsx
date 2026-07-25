"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Sparkles,
  Calendar,
  Trophy,
  MapPin,
  Play,
  ArrowRight,
  Users,
  Star,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface HeroProps {
  onRegisterClick: () => void;
}

export function Hero({ onRegisterClick }: HeroProps) {
  return (
    <section className="relative pt-20 lg:pt-24 pb-16 lg:pb-24 overflow-hidden bg-purpleblack">
      {/* Tech grid background */}
      <div className="absolute inset-0 pattern-tech-grid opacity-60" />
      {/* Scanlines subtle overlay */}
      <div className="absolute inset-0 pattern-scanlines opacity-50" />
      {/* Crowd blur background layer */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: "url(/brand/crowd-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(12px) saturate(1.3)",
        }}
      />
      {/* Magenta-orange radial overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(223,38,121,0.35) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(241,114,56,0.25) 0%, transparent 50%)",
        }}
      />
      {/* Floating decorative blobs */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-magenta/20 blur-3xl animate-float-slow" />
      <div
        className="absolute top-20 -right-32 h-[28rem] w-[28rem] rounded-full bg-orange-brand/20 blur-3xl animate-float-slow"
        style={{ animationDelay: "1s" }}
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 text-center lg:text-left relative"
          >
            {/* Pre-headline badge with tech corner accents */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card corner-bracket mb-6"
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
              <span className="text-[10px] font-mono text-gold-light">SYS.READY</span>
            </motion.div>

            {/* Headline — Bebas Neue huge */}
            <h1
              className="text-6xl sm:text-7xl lg:text-[8.5rem] font-black leading-[0.9] tracking-tight mb-3 text-cream drop-shadow-2xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              RIANA ON
              <br />
              <span className="text-gradient-brand">THE MOVE</span>
            </h1>

            {/* Sub-headline */}
            <div className="flex flex-wrap items-center gap-3 mb-5 justify-center lg:justify-start">
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
            </div>

            {/* Description */}
            <p
              className="text-base sm:text-lg text-cream/80 max-w-xl mx-auto lg:mx-0 mb-7 leading-relaxed"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              Riana akan hadir di{" "}
              <span className="font-bold text-magenta-light">20 kota</span> di
              seluruh Indonesia untuk mengajak ribuan orang bergerak bersama,
              hidup lebih sehat, dan menjadi bagian dari{" "}
              <span className="font-bold text-gold-light">
                Pemecahan Rekor MURI Zumba Step Terbesar di Indonesia
              </span>
              .
            </p>

            {/* Mini stats — tech card style */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-7">
              <Stat icon={MapPin} value="20" label="Kota" />
              <Stat icon={Users} value="10.000+" label="Peserta" />
              <Stat icon={Trophy} value="MURI" label="Rekor" />
              <Stat icon={Calendar} value="2026" label="Tour" />
            </div>

            {/* CTAs — pill with tech glow */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 justify-center lg:justify-start">
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
            </div>

            {/* Trust line */}
            <div className="mt-7 flex items-center justify-center lg:justify-start gap-3 text-xs sm:text-sm text-cream/60">
              <div className="flex -space-x-2">
                {["#DF2679", "#F17238", "#D4AF37", "#51343F", "#F04E9A"].map((c, i) => (
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
            </div>
          </motion.div>

          {/* Right: AI-generated Riana + cutout blend, with tech frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[3/4] max-w-md mx-auto">
              {/* Brush stroke behind photo */}
              <svg
                className="absolute -inset-8 -z-10 w-[calc(100%+4rem)] h-[calc(100%+4rem)]"
                viewBox="0 0 400 500"
                preserveAspectRatio="none"
              >
                <path
                  d="M 50 100 Q 100 50, 200 80 T 380 120 L 380 400 Q 300 450, 200 430 T 50 400 Z"
                  fill="url(#brushGradient)"
                  opacity="0.5"
                />
                <defs>
                  <linearGradient id="brushGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.7" />
                    <stop offset="50%" stopColor="#F17238" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#DF2679" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Tech frame with corner brackets */}
              <div className="relative h-full">
                {/* Photo card with tech border */}
                <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-card-float corner-bracket border-tech-glow">
                  {/* Real AI-generated photo of Riana */}
                  <img
                    src="/brand/ai-riana-hero.png"
                    alt="Riana — Zumba Master Trainer"
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ objectPosition: "center top" }}
                  />
                  {/* Dark gradient overlay for readability */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(11,7,16,0.1) 0%, rgba(11,7,16,0.3) 50%, rgba(11,7,16,0.9) 100%)",
                    }}
                  />
                  {/* Magenta tint top corner */}
                  <div
                    className="absolute top-0 left-0 right-0 h-32"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(223,38,121,0.3) 0%, transparent 100%)",
                    }}
                  />
                  {/* Scan line overlay */}
                  <div className="absolute inset-0 pattern-scanlines opacity-30" />

                  {/* Top badges with tech style */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <div className="px-3 py-1.5 rounded-full glass-card text-cream text-[10px] font-bold tracking-widest uppercase">
                      <Sparkles className="inline h-3 w-3 mr-1 text-magenta-light" />
                      ZES Certified
                    </div>
                    {/* MURI medali badge — GOLD */}
                    <div className="relative">
                      <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-gold-light to-gold text-purpleblack text-[10px] font-black tracking-wider uppercase border border-gold-deep shadow-glow-gold">
                        <Trophy className="inline h-3 w-3 mr-1" />
                        MURI 2026
                      </div>
                    </div>
                  </div>

                  {/* Bottom info */}
                  <div className="absolute bottom-0 inset-x-0 p-5 text-cream">
                    <div className="flex items-end justify-between mb-3">
                      <div>
                        <div
                          className="text-5xl sm:text-6xl font-black leading-none text-gradient-gold"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          20
                        </div>
                        <div
                          className="text-sm font-bold tracking-[0.25em] uppercase text-gold-light"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          Kota Tour
                        </div>
                      </div>
                      <div className="text-right text-[10px] text-cream/70">
                        <div className="font-bold text-cream">Road to MURI</div>
                        <div className="mt-0.5 font-mono text-gold-light">v2026.11</div>
                      </div>
                    </div>

                    {/* City chips */}
                    <div className="space-y-1.5">
                      {[
                        { city: "Bandung", date: "12 Juli", status: "OPEN" },
                        { city: "Jakarta", date: "5 Desember", status: "FINALE" },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between px-3 py-2 rounded-xl glass-card"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-gold-light" />
                            <span
                              className="text-cream text-xs font-bold"
                              style={{ fontFamily: "var(--font-heading)" }}
                            >
                              {item.city}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-cream/70 text-[10px] font-mono">{item.date}</span>
                            <span
                              className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                                item.status === "FINALE"
                                  ? "bg-gold text-purpleblack"
                                  : "bg-magenta text-white"
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating MURI medali — GOLD */}
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: -12 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-gradient-to-br from-gold-light to-gold flex flex-col items-center justify-center shadow-glow-gold border-4 border-purpleblack animate-float-slow"
                >
                  <Trophy className="h-6 w-6 text-purpleblack" />
                  <div className="text-[8px] font-black text-purpleblack tracking-wider mt-0.5">
                    MURI
                  </div>
                </motion.div>

                {/* Floating sparkle decoration — magenta */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="absolute -bottom-4 -left-4 h-14 w-14 rounded-2xl bg-magenta shadow-glow-pink flex items-center justify-center animate-float-slow border border-magenta-light/40"
                  style={{ animationDelay: "0.5s" }}
                >
                  <Star className="h-7 w-7 text-white fill-white" />
                </motion.div>

                {/* Tech data label bottom-left */}
                <div className="absolute -bottom-8 left-4 px-2 py-1 rounded glass-card font-mono text-[9px] text-gold-light tracking-wider">
                  ID://RIANA-01
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom tech divider */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-magenta to-transparent" />
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
