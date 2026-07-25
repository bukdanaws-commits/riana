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
} from "lucide-react";
import Link from "next/link";

interface HeroProps {
  onRegisterClick: () => void;
}

export function Hero({ onRegisterClick }: HeroProps) {
  return (
    <section className="relative pt-20 lg:pt-24 pb-16 lg:pb-24 overflow-hidden bg-white">
      {/* Crowd blur background layer */}
      <div
        className="absolute inset-0 -z-20 opacity-25"
        style={{
          backgroundImage: "url(/brand/crowd-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px) saturate(1.2)",
        }}
      />
      {/* Magenta-orange gradient overlay on crowd */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, rgba(223,38,121,0.85) 0%, rgba(241,114,56,0.7) 50%, rgba(212,175,55,0.5) 100%)",
        }}
      />
      {/* Floating decorative blobs */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-pink-300/40 blur-3xl animate-float-slow -z-10" />
      <div
        className="absolute top-20 -right-32 h-[28rem] w-[28rem] rounded-full bg-orange-300/40 blur-3xl animate-float-slow -z-10"
        style={{ animationDelay: "1s" }}
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 text-center lg:text-left relative z-10"
          >
            {/* Pre-headline badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/30 mb-6"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
              </span>
              <span
                className="text-xs sm:text-sm font-bold text-white tracking-widest uppercase"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                20 Cities • 1 Movement
              </span>
            </motion.div>

            {/* Headline — Bebas Neue huge */}
            <h1
              className="text-6xl sm:text-7xl lg:text-[8.5rem] font-black leading-[0.9] tracking-tight mb-3 text-white drop-shadow-2xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              RIANA ON
              <br />
              THE MOVE
            </h1>

            {/* Sub-headline — Road to MURI badge style */}
            <div className="flex flex-wrap items-center gap-3 mb-5 justify-center lg:justify-start">
              <div className="px-4 py-1.5 rounded-full bg-purpleblack text-gold-light font-bold text-sm tracking-widest uppercase border-2 border-gold/40">
                <Trophy className="inline h-4 w-4 mr-1.5 text-gold" />
                Road to MURI 2026
              </div>
              <div
                className="font-script text-2xl sm:text-3xl text-white drop-shadow-lg"
                style={{ fontFamily: "var(--font-script)" }}
              >
                Move Together, Make History!
              </div>
            </div>

            {/* Description */}
            <p
              className="text-base sm:text-lg text-white/95 max-w-xl mx-auto lg:mx-0 mb-7 leading-relaxed"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              Riana akan hadir di{" "}
              <span className="font-bold text-white">20 kota</span> di seluruh
              Indonesia untuk mengajak ribuan orang bergerak bersama, hidup lebih
              sehat, dan menjadi bagian dari{" "}
              <span className="font-bold text-gold-light">
                Pemecahan Rekor MURI Zumba Step Terbesar di Indonesia
              </span>
              .
            </p>

            {/* Mini stats */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-7">
              <Stat icon={MapPin} value="20" label="Kota" />
              <Stat icon={Users} value="10.000+" label="Peserta" />
              <Stat icon={Trophy} value="MURI" label="Rekor" />
              <Stat icon={Calendar} value="2026" label="Tour" />
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={onRegisterClick}
                className="bg-magenta hover:bg-magenta-deep text-white font-bold text-base h-14 px-8 rounded-full shadow-glow-pink border-2 border-white/20"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Daftar Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                asChild
                variant="outline"
                className="font-bold text-base h-14 px-8 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/40 text-white hover:bg-white/20 hover:text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Link href="#jadwal">
                  <Play className="mr-2 h-4 w-4 fill-white text-white" />
                  Lihat Jadwal Tour
                </Link>
              </Button>
            </div>

            {/* Trust line */}
            <div className="mt-7 flex items-center justify-center lg:justify-start gap-3 text-xs sm:text-sm text-white/80">
              <div className="flex -space-x-2">
                {["#DF2679", "#F17238", "#D4AF37", "#51343F", "#F04E9A"].map((c, i) => (
                  <div
                    key={i}
                    className="h-7 w-7 rounded-full border-2 border-white"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <span>
                <span className="font-bold text-white">587+</span> peserta sudah mendaftar
              </span>
            </div>
          </motion.div>

          {/* Right: floating cutout photo of Riana */}
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
                  opacity="0.6"
                />
                <defs>
                  <linearGradient id="brushGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#F17238" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#DF2679" stopOpacity="0.7" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Photo container with cutout effect */}
              <div className="relative h-full">
                {/* Photo card */}
                <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-card-float">
                  <img
                    src="/brand/riana-cutout.png"
                    alt="Riana — Zumba Master Trainer"
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ objectPosition: "center top" }}
                  />
                  {/* Magenta-orange gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(21,15,30,0.1) 0%, rgba(21,15,30,0.2) 50%, rgba(21,15,30,0.85) 100%)",
                    }}
                  />
                  {/* Pink tint top corner */}
                  <div
                    className="absolute top-0 left-0 right-0 h-32"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(223,38,121,0.4) 0%, transparent 100%)",
                    }}
                  />

                  {/* Top badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <div className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold tracking-widest uppercase border border-white/30">
                      <Sparkles className="inline h-3 w-3 mr-1" />
                      ZES Certified
                    </div>
                    {/* MURI medali badge */}
                    <div className="relative">
                      <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-gold-light to-gold text-purpleblack text-[10px] font-black tracking-wider uppercase border-2 border-gold/50 shadow-lg">
                        <Trophy className="inline h-3 w-3 mr-1" />
                        MURI 2026
                      </div>
                    </div>
                  </div>

                  {/* Bottom info */}
                  <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                    <div
                      className="text-4xl sm:text-5xl font-black leading-none mb-1"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      20 KOTA
                    </div>
                    <div
                      className="text-sm font-bold tracking-[0.25em] uppercase text-gold-light mb-3"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Roadshow Indonesia
                    </div>

                    {/* City chips */}
                    <div className="space-y-1.5">
                      {[
                        { city: "Bandung", date: "12 Juli", status: "OPEN" },
                        { city: "Jakarta", date: "5 Desember", status: "FINALE" },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/15 backdrop-blur-md border border-white/25"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-gold-light" />
                            <span
                              className="text-white text-xs font-bold"
                              style={{ fontFamily: "var(--font-heading)" }}
                            >
                              {item.city}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-white/80 text-[10px]">{item.date}</span>
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

                {/* Floating MURI medali decoration */}
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: -12 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-gradient-to-br from-gold-light to-gold flex flex-col items-center justify-center shadow-glow-gold border-4 border-white animate-float-slow"
                >
                  <Trophy className="h-6 w-6 text-purpleblack" />
                  <div className="text-[8px] font-black text-purpleblack tracking-wider mt-0.5">
                    MURI
                  </div>
                </motion.div>

                {/* Floating sparkle decoration */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="absolute -bottom-4 -left-4 h-14 w-14 rounded-2xl bg-magenta shadow-glow-pink flex items-center justify-center animate-float-slow"
                  style={{ animationDelay: "0.5s" }}
                >
                  <Star className="h-7 w-7 text-white fill-white" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Brush stroke divider at bottom */}
      <div className="absolute bottom-0 inset-x-0 h-8 brush-divider" />
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
    <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25">
      <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="leading-tight">
        <div
          className="font-black text-white text-sm"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "0.02em" }}
        >
          {value}
        </div>
        <div className="text-[10px] text-white/80 uppercase tracking-wider font-semibold">
          {label}
        </div>
      </div>
    </div>
  );
}
