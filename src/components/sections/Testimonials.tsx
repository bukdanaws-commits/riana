"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, Quote, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { TESTIMONIALS } from "@/data/event";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = () => {
    setDirection(1);
    setIndex((i) => (i + 1) % TESTIMONIALS.length);
  };
  const prev = () => {
    setDirection(-1);
    setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[index];

  return (
    <section className="relative py-16 lg:py-24 bg-gradient-to-br from-pink-50 via-pink-50 to-amber-50 overflow-hidden">
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-pink-200/40 blur-3xl -z-10" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-pink-200/40 blur-3xl -z-10" />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-dark border border-magenta/25 mb-4 shadow-sm">
            <Star className="h-3.5 w-3.5 text-pink-500 fill-pink-500" />
            <span className="text-xs font-bold text-pink-800 tracking-wide uppercase">Kata Mereka</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-cream mb-3" style={{ fontFamily: "var(--font-display)" }}>
            Cerita dari <span className="text-gradient-brand">Peserta</span>
          </h2>
          <p className="text-base text-cream/70 max-w-2xl mx-auto">
            Lebih dari 4.500 orang telah merasakan transformasi lewat Riana On The Move. Inilah
            sebagian cerita mereka.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <div className="relative min-h-[22rem] sm:min-h-[20rem]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 80 : -80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -80 : 80 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <div className="relative h-full p-6 lg:p-10 rounded-3xl bg-purple-dark shadow-xl border border-magenta/20 overflow-hidden">
                  <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full opacity-10 blur-2xl" style={{ background: current.avatarColor }} />
                  <Quote className="absolute top-6 right-6 h-16 w-16 text-pink-100" />

                  <div className="relative flex flex-col lg:flex-row gap-6 lg:gap-10 h-full">
                    {/* Left: avatar + info */}
                    <div className="lg:w-1/3 flex flex-col items-center lg:items-start text-center lg:text-left">
                      <div
                        className="h-20 w-20 rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold mb-3 shadow-lg"
                        style={{ background: current.avatarColor }}
                      >
                        {current.name.charAt(0)}
                      </div>
                      <div className="font-extrabold text-cream text-lg">{current.name}</div>
                      <div className="text-sm text-cream/60">{current.role}</div>
                      <div className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-semibold">
                        <MapPin className="h-3 w-3" />
                        {current.city}
                      </div>
                      <div className="flex items-center gap-0.5 mt-3">
                        {Array.from({ length: current.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-pink-400 fill-pink-400" />
                        ))}
                      </div>
                    </div>

                    {/* Right: quote */}
                    <div className="lg:w-2/3 flex items-center">
                      <p className="text-lg lg:text-xl text-cream/80 leading-relaxed italic">
                        &ldquo;{current.quote}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="h-11 w-11 rounded-full border-2 border-magenta/25 hover:border-pink-400 hover:bg-magenta/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-1.5">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-8 bg-pink-600" : "w-2 bg-pink-200 hover:bg-pink-300"
                  }`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="h-11 w-11 rounded-full border-2 border-magenta/25 hover:border-pink-400 hover:bg-magenta/10"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mini stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12"
        >
          {[
            { value: "4.9/5", label: "Rating Rata-rata", color: "text-pink-500" },
            { value: "4.500+", label: "Peserta Puas", color: "text-pink-600" },
            { value: "92%", label: "Kembali Ikut", color: "text-pink-600" },
            { value: "10", label: "Kota Sebelumnya", color: "text-purple-600" },
          ].map((s) => (
            <div key={s.label} className="text-center p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white">
              <div className={`text-3xl font-black ${s.color}`} style={{ fontFamily: "var(--font-display)" }}>{s.value}</div>
              <div className="text-xs text-cream/70 font-semibold mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
