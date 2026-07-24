"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Trophy, Users } from "lucide-react";

interface FinalCTAProps {
  onRegisterClick: () => void;
}

export function FinalCTA({ onRegisterClick }: FinalCTAProps) {
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden bg-brand-dark">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-brand-energetic opacity-30 animate-gradient-shift" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-pink-600/40 to-transparent" />
      </div>

      {/* Floating decorations */}
      <div className="absolute top-10 left-10 h-24 w-24 rounded-full bg-amber-400/20 blur-2xl animate-float-slow" />
      <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full bg-pink-500/30 blur-3xl animate-float-slow" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 right-1/4 h-20 w-20 rounded-full bg-orange-400/20 blur-2xl animate-float-slow" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span className="text-xs font-bold text-white tracking-widest uppercase">Join The Movement</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-5 leading-[1.05]" style={{ fontFamily: "var(--font-display)" }}>
            Saatnya Anda
            <br />
            <span className="text-gradient-brand">Jadi Bagian dari Sejarah</span>
          </h2>

          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
            20 kota. 10.000+ peserta. 1 rekor MURI. Jangan lewatkan kesempatan sekali seumur hidup
            untuk mengukir nama Anda dalam sejarah Indonesia. Daftar sekarang sebelum kuota penuh!
          </p>

          {/* Mini stats row */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-white">
              <Trophy className="h-5 w-5 text-amber-300" />
              <span className="font-bold">Rekor MURI</span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <div className="flex items-center gap-2 text-white">
              <Users className="h-5 w-5 text-pink-300" />
              <span className="font-bold">10.000+ Peserta</span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="h-5 w-5 text-orange-300" />
              <span className="font-bold">E-Certificate Resmi</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={onRegisterClick}
              className="bg-white text-pink-600 hover:bg-white/90 font-bold text-base h-14 px-8 shadow-2xl rounded-full group"
            >
              Daftar Sekarang — Gratis
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              asChild
              variant="outline"
              className="bg-white/5 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/10 hover:text-white font-bold text-base h-14 px-8 rounded-full"
            >
              <a href="#jadwal">Lihat Jadwal Lengkap</a>
            </Button>
          </div>

          {/* Trust line */}
          <p className="text-xs text-white/60 mt-6">
            Pendaftaran gratis • e-Certificate • Nama tercatat di Museum Rekor Indonesia
          </p>
        </motion.div>
      </div>
    </section>
  );
}
