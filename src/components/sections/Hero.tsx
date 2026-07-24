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
} from "lucide-react";
import Link from "next/link";

interface HeroProps {
  onRegisterClick: () => void;
}

export function Hero({ onRegisterClick }: HeroProps) {
  return (
    <section className="relative pt-20 lg:pt-24 pb-16 lg:pb-24 overflow-hidden bg-white">
      {/* Background blobs */}
      <div className="absolute inset-0 -z-10 pattern-dots opacity-60" />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-br from-orange-300/50 to-orange-300/30 blur-3xl animate-float-slow -z-10" />
      <div className="absolute top-20 -right-32 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-orange-300/50 to-orange-200/30 blur-3xl animate-float-slow -z-10" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-72 w-[40rem] rounded-full bg-gradient-to-r from-orange-200/40 via-orange-200/40 to-orange-200/40 blur-3xl -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 text-center lg:text-left"
          >
            {/* Pre-headline badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-orange-100 border border-orange-200 mb-6"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-600" />
              </span>
              <span className="text-xs sm:text-sm font-bold text-orange-800 tracking-wide">
                AKTIVENATION • ROAD TO MURI 2026
              </span>
            </motion.div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Move Together.
              <br />
              <span className="text-gradient-brand animate-gradient-shift">
                Make History.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg lg:text-xl text-zinc-600 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Bergabung dalam perjalanan{" "}
              <span className="font-bold text-zinc-900">20 kota</span> menuju{" "}
              <span className="font-bold text-orange-600">
                Pemecahan Rekor MURI Zumba Step Terbesar di Indonesia
              </span>{" "}
              bersama Riana dan ribuan insan aktif se-Indonesia.
            </p>

            {/* Mini stats */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-8">
              <Stat icon={MapPin} value="20" label="Kota" color="text-orange-600 bg-orange-50" />
              <Stat icon={Users} value="10.000+" label="Peserta" color="text-orange-600 bg-orange-50" />
              <Stat icon={Trophy} value="MURI" label="Rekor" color="text-stone-600 bg-stone-50" />
              <Stat icon={Calendar} value="2026" label="Tour" color="text-orange-600 bg-orange-50" />
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={onRegisterClick}
                className="bg-brand-gradient text-white font-bold text-base h-14 px-8 shadow-glow-pink hover:opacity-90 rounded-full"
              >
                Daftar Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                asChild
                variant="outline"
                className="font-bold text-base h-14 px-8 rounded-full border-2 border-orange-200 hover:border-orange-400 hover:bg-orange-50 text-zinc-800"
              >
                <Link href="#jadwal">
                  <Play className="mr-2 h-4 w-4 fill-orange-600 text-orange-600" />
                  Lihat Jadwal Tour
                </Link>
              </Button>
            </div>

            {/* Trust line */}
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-3 text-xs sm:text-sm text-zinc-500">
              <div className="flex -space-x-2">
                {["#F77258", "#F86743", "#F77258", "#9A6458", "#E38B96"].map((c, i) => (
                  <div
                    key={i}
                    className="h-7 w-7 rounded-full border-2 border-white"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <span>
                <span className="font-bold text-zinc-700">587+</span> peserta sudah mendaftar
              </span>
            </div>
          </motion.div>

          {/* Right: visual with real photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] sm:aspect-square max-w-md mx-auto">
              {/* Decorative coral gradient frame */}
              <div className="absolute inset-0 rounded-[2.5rem] bg-brand-gradient blur-2xl opacity-50 scale-95" />
              <div className="absolute inset-0 rounded-[2.5rem] bg-brand-gradient" />

              {/* Inner photo content */}
              <div className="relative h-full rounded-[2.5rem] overflow-hidden p-1">
                <div className="relative h-full rounded-[2.25rem] overflow-hidden">
                  {/* Real brand photo */}
                  <img
                    src="/brand/hero-photo.jpg"
                    alt="Riana On The Move — Brand Visual"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {/* Coral-rose gradient overlay for brand consistency */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(20,22,27,0.45) 0%, rgba(247,114,88,0.25) 40%, rgba(20,22,27,0.85) 100%)",
                    }}
                  />
                  {/* Pattern highlight overlay */}
                  <div className="absolute inset-0 opacity-30" style={{
                    backgroundImage: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.25) 0%, transparent 50%)",
                  }} />

                  {/* Top: badge row */}
                  <div className="relative flex items-center justify-between p-5 sm:p-6">
                    <div className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-[10px] font-bold tracking-widest uppercase border border-white/25">
                      <Sparkles className="inline h-3 w-3 mr-1" />
                      MURI 2026
                    </div>
                    <div className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-[10px] font-bold tracking-widest uppercase border border-white/25">
                      Grand Finale
                    </div>
                  </div>

                  {/* Bottom: huge number + caption */}
                  <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 text-white">
                    <div className="flex items-end justify-between">
                      <div>
                        <div
                          className="text-6xl sm:text-7xl font-black leading-none drop-shadow-lg"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          20
                        </div>
                        <div className="text-white/90 text-xs font-bold tracking-[0.3em] uppercase mt-1.5">
                          Kota Tour
                        </div>
                      </div>
                      <div className="text-right text-[10px] text-white/80 max-w-[10rem]">
                        <div className="font-bold text-white">Road to MURI</div>
                        <div className="mt-0.5">Zumba Step Terbesar di Indonesia</div>
                      </div>
                    </div>

                    {/* City chips */}
                    <div className="mt-4 space-y-1.5">
                      {[
                        { city: "Bandung", date: "12 Juli", status: "OPEN" },
                        { city: "Jakarta", date: "5 Desember", status: "FINALE" },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/15 backdrop-blur-md border border-white/20"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-white" />
                            <span className="text-white text-xs font-bold">{item.city}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-white/70 text-[10px]">{item.date}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                              item.status === "FINALE" ? "bg-orange-400 text-stone-900" : "bg-green-400 text-green-950"
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating decoration */}
              <div className="absolute -top-4 -right-4 h-16 w-16 rounded-2xl bg-orange-500 rotate-12 shadow-lg flex items-center justify-center animate-float-slow">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 h-14 w-14 rounded-full bg-coral shadow-glow-pink flex items-center justify-center animate-float-slow" style={{ animationDelay: "0.5s" }}>
                <Sparkles className="h-7 w-7 text-white" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white shadow-sm border border-zinc-100">
      <div className={`h-9 w-9 rounded-xl ${color} flex items-center justify-center`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="leading-tight">
        <div className="font-extrabold text-zinc-900 text-sm">{value}</div>
        <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{label}</div>
      </div>
    </div>
  );
}
