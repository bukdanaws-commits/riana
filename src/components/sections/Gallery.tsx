"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Camera, Film, X, Maximize2 } from "lucide-react";
import { GALLERY_ITEMS } from "@/data/event";

export function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [tab, setTab] = useState<"photo" | "video">("photo");

  return (
    <section id="galeri" className="relative py-16 lg:py-24 bg-white overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-100 border border-pink-200 mb-4">
            <Camera className="h-3.5 w-3.5 text-pink-600" />
            <span className="text-xs font-bold text-pink-800 tracking-wide uppercase">Moment Captured</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 mb-3" style={{ fontFamily: "var(--font-display)" }}>
            Galeri & <span className="text-gradient-brand">Video Highlight</span>
          </h2>
          <p className="text-base text-zinc-600 max-w-2xl mx-auto">
            Saksikan energi, keceriaan, dan semangat dari perjalanan roadshow sebelumnya. Ini baru
            permulaan — kota Anda bisa jadi yang berikutnya!
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 rounded-full bg-zinc-100 border border-zinc-200">
            <button
              onClick={() => setTab("photo")}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all ${
                tab === "photo"
                  ? "bg-white text-pink-600 shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Camera className="h-4 w-4" />
              Foto
            </button>
            <button
              onClick={() => setTab("video")}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all ${
                tab === "video"
                  ? "bg-white text-pink-600 shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Film className="h-4 w-4" />
              Video Highlight
            </button>
          </div>
        </div>

        {/* Content */}
        {tab === "photo" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
            {GALLERY_ITEMS.map((item, i) => {
              // Use real photos for first 3 items, gradient for the rest
              const realPhotos = ["/brand/hero-photo.jpg", "/brand/extra-1.jpg", "/brand/extra-2.jpg"];
              const useReal = i < 3;
              const photoSrc = realPhotos[i % 3];
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  onClick={() => setLightbox(item.id)}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer ${
                    i === 0 || i === 5 ? "sm:col-span-2 sm:row-span-2 aspect-square sm:aspect-auto" : "aspect-square"
                  }`}
                >
                  {/* Background image (real photo or gradient) */}
                  {useReal ? (
                    <img
                      src={photoSrc}
                      alt={item.label}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, hsl(${item.hue} 65% 55%) 0%, hsl(${item.hue + 20} 55% 40%) 50%, hsl(${item.hue + 40} 50% 30%) 100%)`,
                      }}
                    />
                  )}
                  {/* Coral-rose tint overlay for brand consistency (only on real photos) */}
                  {useReal && (
                    <div
                      className="absolute inset-0 mix-blend-multiply opacity-30 transition-opacity group-hover:opacity-10"
                      style={{
                        background: "linear-gradient(135deg, rgba(247,114,88,0.6), rgba(227,139,150,0.6))",
                      }}
                    />
                  )}

                  {/* Bottom gradient + label */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-3 lg:p-4 text-left">
                    <div className="text-white font-bold text-sm lg:text-base leading-tight">{item.label}</div>
                    <div className="text-white/70 text-[10px] lg:text-xs mt-0.5">Riana On The Move 2026</div>
                  </div>

                  {/* Hover icon */}
                  <div className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="h-4 w-4 text-white" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-3 gap-4"
          >
            {/* Main video */}
            <div className="lg:col-span-2 relative aspect-video rounded-3xl overflow-hidden bg-gradient-to-br from-pink-600 via-pink-700 to-purple-800 cursor-pointer group">
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(255,203,5,0.3) 0%, transparent 50%)",
              }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Play className="h-10 w-10 text-white fill-white ml-1" />
                </div>
                <div className="text-xl font-extrabold mb-1">Official Highlight 2025</div>
                <div className="text-white/80 text-sm">10 kota • 4.500 peserta • 90 detik inspirasi</div>
              </div>
              <div className="absolute bottom-4 right-4 px-2 py-1 rounded bg-black/60 text-white text-xs font-bold">
                01:32
              </div>
            </div>

            {/* Video list */}
            <div className="space-y-3">
              {[
                { title: "Behind The Scenes Bandung", dur: "03:45" },
                { title: "Interview with Riana", dur: "05:12" },
                { title: "Komunitas Zumba Surabaya", dur: "02:18" },
              ].map((v, i) => (
                <div
                  key={i}
                  className="group flex items-center gap-3 p-3 rounded-2xl bg-zinc-50 hover:bg-pink-50 cursor-pointer transition-colors border border-zinc-100"
                >
                  <div className="relative h-16 w-24 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                    <Play className="h-6 w-6 text-white fill-white" />
                    <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/70 text-white text-[9px] font-bold">
                      {v.dur}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-zinc-900 truncate group-hover:text-pink-600 transition-colors">
                      {v.title}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">Riana On The Move</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <button className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
            <X className="h-5 w-5" />
          </button>
          <div
            className="relative max-w-2xl w-full aspect-video rounded-3xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const item = GALLERY_ITEMS.find((g) => g.id === lightbox)!;
              const realPhotos = ["/brand/hero-photo.jpg", "/brand/extra-1.jpg", "/brand/extra-2.jpg"];
              const useReal = item.id < 3;
              const photoSrc = realPhotos[item.id % 3];
              return (
                <div className="absolute inset-0 bg-charcoal">
                  {useReal ? (
                    <img
                      src={photoSrc}
                      alt={item.label}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg, hsl(${item.hue} 65% 55%) 0%, hsl(${item.hue + 25} 55% 40%) 50%, hsl(${item.hue + 50} 50% 30%) 100%)`,
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
                    <Camera className="h-12 w-12 mb-3 opacity-80" />
                    <div className="text-2xl font-extrabold mb-2">{item.label}</div>
                    <div className="text-white/80">Foto dokumentasi dari event Riana On The Move</div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </section>
  );
}
