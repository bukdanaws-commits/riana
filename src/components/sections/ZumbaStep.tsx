"use client";

import { motion } from "framer-motion";
import { Footprints, Flame, HeartPulse, Music } from "lucide-react";

const POINTS = [
  {
    icon: Footprints,
    title: "Step-Based Choreography",
    desc: "Menggunakan step board sebagai platform utama, setiap gerakan dirancang untuk memaksimalkan aktivasi otot kaki, glute, dan core.",
  },
  {
    icon: Flame,
    title: "Kalori Lebih Tinggi",
    desc: "Membakar 500-700 kalori per sesi — 30% lebih tinggi dari Zumba tradisional berkat elemen step yang menambah beban.",
  },
  {
    icon: HeartPulse,
    title: "Low-Impact, High-Result",
    desc: "Ramah sendi tapi tetap intense. Cocok untuk pemula hingga atlet. Mengurangi risiko cedera dibanding lompatan tinggi.",
  },
  {
    icon: Music,
    title: "Beat International",
    desc: "Koreografi disinkronkan dengan mix musik Latin, EDM, dan pop Indonesia khusus untuk roadshow MURI 2026.",
  },
];

export function ZumbaStep() {
  return (
    <section className="relative py-16 lg:py-24 bg-gradient-to-br from-pink-50 via-white to-pink-50 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left: explanation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 lg:sticky lg:top-24"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-100 border border-magenta/25 mb-4">
              <Footprints className="h-3.5 w-3.5 text-pink-600" />
              <span className="text-xs font-bold text-pink-800 tracking-wide uppercase">Step by Step</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-cream mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Apa Itu <span className="text-gradient-brand">Zumba Step</span>?
            </h2>
            <p className="text-base text-cream/70 leading-relaxed mb-4">
              <span className="font-bold text-cream">Zumba Step</span> adalah evolusi dari Zumba
              tradisional yang mengintegrasikan penggunaan <span className="font-bold text-cream">step board</span>{" "}
              dalam setiap koreografi. Inilah yang membuatnya spesial — dan inilah yang akan memecahkan
              rekor MURI sebagai Zumba Step terbesar yang pernah digelar di Indonesia.
            </p>
            <p className="text-base text-cream/70 leading-relaxed">
              Berbeda dari Zumba biasa yang berfokus pada gerakan dance full-body, Zumba Step menambahkan
              dimensi <span className="font-bold text-cream">vertical movement</span> yang menantang
              keseimbangan, kekuatan kaki, dan kardio secara simultan. Hasilnya: workout yang lebih efektif,
              lebih seru, dan lebih inklusif untuk semua level kebugaran.
            </p>

            {/* Illustration */}
            <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-zinc-900 to-purple-900 text-white relative overflow-hidden">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-pink-500/30 blur-2xl" />
              <div className="absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-pink-500/30 blur-2xl" />
              <div className="relative flex items-center gap-4">
                <div className="text-5xl font-black text-gradient-brand" style={{ fontFamily: "var(--font-display)" }}>
                  +30%
                </div>
                <div className="text-sm text-white/80">
                  Lebih banyak kalori dibakar
                  <br />
                  dibanding Zumba tradisional
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: 4 points grid */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4 lg:gap-5">
            {POINTS.map((point, i) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group relative p-6 rounded-3xl bg-purple-dark border-2 border-magenta/15 hover:border-magenta/30 hover:shadow-glow-pink transition-all"
              >
                <div className="absolute -top-3 -right-3 h-12 w-12 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <point.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-5xl font-black text-pink-100 leading-none mb-3" style={{ fontFamily: "var(--font-display)" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-lg font-extrabold text-cream mb-2">{point.title}</h3>
                <p className="text-sm text-cream/70 leading-relaxed">{point.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
