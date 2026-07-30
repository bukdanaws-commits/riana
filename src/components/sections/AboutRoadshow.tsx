"use client";

import { motion } from "framer-motion";
import { Target, Compass, Flag } from "lucide-react";

export function AboutRoadshow() {
  return (
    <section className="relative py-4 lg:py-6 bg-[#FAEDE9] overflow-hidden">
      <div className="absolute inset-0 pattern-grid opacity-50 -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 border border-purple-200 mb-4">
            <Flag className="h-3.5 w-3.5 text-purple-600" />
            <span className="text-xs font-bold text-purple-800 tracking-wide uppercase">The Big Picture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0E0F14] mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Visi <span className="text-gradient-magenta">Roadshow 20 Kota</span>
          </h2>
          <p className="text-base text-[#0E0F14]/70 leading-relaxed">
            Roadshow Riana On The Move bukan sekadar rangkaian kelas Zumba. Ini adalah gerakan nasional
            untuk mengajak masyarakat Indonesia bergerak bersama, membangun komunitas sehat yang
            berkelanjutan, dan mengukir rekor MURI sebagai bukti bahwa bersama kita bisa melakukan
            hal-hal besar.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-3">
          <Pillar
            icon={Target}
            title="Misi Utama"
            desc="Mengumpulkan 10.000+ peserta unik di 20 kota untuk memecahkan rekor MURI sebagai Zumba Step terbesar di Indonesia. Setiap peserta yang hadir akan tercatat namanya dalam Museum Rekor Indonesia."
            color="bg-gradient-to-br from-magenta to-magenta-deep"
            delay={0}
          />
          <Pillar
            icon={Compass}
            title="Jangkauan Nasional"
            desc="Dari Bandung di ujung barat hingga Manado di utara, dari Medan hingga Bali — roadshow ini menjangkau 7 wilayah besar Indonesia: Jawa, Bali-Nusra, Sumatera, Sulawesi, dan Kalimantan dalam 6 bulan perjalanan."
            color="bg-gradient-to-br from-pink-500 to-pink-500"
            delay={0.1}
          />
          <Pillar
            icon={Flag}
            title="Grand Finale Jakarta"
            desc="Seluruh perjalanan akan berakhir pada 5 Desember 2026 di Jakarta International Stadium dengan 3.000 peserta pada satu venue — momen peneguhan rekor MURI yang akan diabadikan dalam sejarah olahraga Indonesia."
            color="bg-gradient-to-br from-purple-600 to-pink-700"
            delay={0.2}
          />
        </div>
      </div>
    </section>
  );
}

function Pillar({
  icon: Icon,
  title,
  desc,
  color,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay }}
      className="group relative p-7 rounded-3xl bg-white border-2 border-[#FC7166]/15 hover:border-[#FC7166]/25 hover:shadow-xl transition-all overflow-hidden"
    >
      <div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full ${color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
      <div className={`relative h-14 w-14 rounded-2xl ${color} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="h-7 w-7 text-white" />
      </div>
      <h3 className="relative text-xl font-extrabold text-[#0E0F14] mb-2">{title}</h3>
      <p className="relative text-sm text-[#0E0F14]/70 leading-relaxed">{desc}</p>
    </motion.div>
  );
}
