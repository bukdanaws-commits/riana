"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Trophy, Users } from "lucide-react";

interface FinalCTAProps {
  onRegisterClick: () => void;
}

export function FinalCTA({ onRegisterClick }: FinalCTAProps) {
  return (
    <section className="relative py-4 lg:py-6 overflow-hidden bg-brand-dark">
      {/* Crowd blur background */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: "url(/brand/crowd-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(10px)",
        }}
      />
      {/* Animated magenta-orange-gold gradient overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-brand-energetic opacity-40 animate-gradient-shift" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-magenta/40 to-transparent" />
      </div>

      {/* Floating decorations */}
      <div className="absolute top-10 left-10 h-24 w-24 rounded-full bg-gold/20 blur-2xl animate-float-slow" />
      <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full bg-magenta/30 blur-3xl animate-float-slow" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 right-1/4 h-20 w-20 rounded-full bg-orange-brand/20 blur-2xl animate-float-slow" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/15 backdrop-blur-md border border-gold/30 mb-3">
            <Sparkles className="h-4 w-4 text-gold-light" />
            <span
              className="text-xs font-bold text-gold-light tracking-widest uppercase"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Join The Movement
            </span>
          </div>

          <div
            className="font-script text-3xl sm:text-4xl text-gold-light mb-4"
            style={{ fontFamily: "var(--font-script)" }}
          >
            Move Together, Make History!
          </div>
          <h2
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-5 leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            SAATNYA ANDA
            <br />
            <span className="text-gradient-gold">JADI BAGIAN DARI SEJARAH</span>
          </h2>

          <p
            className="text-base sm:text-lg text-white/85 max-w-2xl mx-auto mb-3 leading-relaxed"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            20 kota. 10.000+ peserta. 1 rekor MURI. Jangan lewatkan kesempatan
            sekali seumur hidup untuk mengukir nama Anda dalam sejarah Indonesia.
            Daftar sekarang sebelum kuota penuh!
          </p>

          {/* Mini stats row */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
            <div className="flex items-center gap-2 text-white">
              <Trophy className="h-5 w-5 text-gold-light" />
              <span className="font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                Rekor MURI
              </span>
            </div>
            <div className="h-4 w-px bg-purpleblack/40" />
            <div className="flex items-center gap-2 text-white">
              <Users className="h-5 w-5 text-gold-light" />
              <span className="font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                10.000+ Peserta
              </span>
            </div>
            <div className="h-4 w-px bg-purpleblack/40" />
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="h-5 w-5 text-gold-light" />
              <span className="font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                E-Certificate Resmi
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={onRegisterClick}
              className="bg-white text-magenta-light hover:bg-white/90 font-bold text-base h-14 px-8 shadow-2xl rounded-full group"
            >
              Daftar Sekarang — Gratis
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              asChild
              variant="outline"
              className="glass-card border-tech text-cream hover:bg-white/10 hover:text-white font-bold text-base h-14 px-8 rounded-full"
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
