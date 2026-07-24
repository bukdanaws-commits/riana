"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, MapPin, Calendar } from "lucide-react";
import { CITIES } from "@/data/event";

function getNextCity() {
  const now = new Date();
  return CITIES.find((c) => new Date(c.date).getTime() > now.getTime()) ?? CITIES[CITIES.length - 1];
}

function computeTimeLeft(target: string) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function Countdown() {
  const nextCity = getNextCity();
  const finale = CITIES.find((c) => c.id === "jakarta")!;

  const [nextLeft, setNextLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [finaleLeft, setFinaleLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      setNextLeft(computeTimeLeft(nextCity.date));
      setFinaleLeft(computeTimeLeft(finale.date));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [nextCity.date, finale.date]);

  return (
    <section className="relative py-16 lg:py-24 bg-brand-dark overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "radial-gradient(circle at 20% 30%, rgba(236,10,139,0.4) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,106,44,0.3) 0%, transparent 40%)",
      }} />
      <div className="absolute top-10 left-10 h-32 w-32 rounded-full bg-pink-500/20 blur-3xl animate-float-slow" />
      <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-orange-500/20 blur-3xl animate-float-slow" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-300" />
            </span>
            <span className="text-xs font-bold text-white tracking-widest uppercase">Live Countdown</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3" style={{ fontFamily: "var(--font-display)" }}>
            Menuju Sejarah <span className="text-gradient-brand">MURI 2026</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Hitung mundur menuju kota berikutnya dan Grand Finale pemecahan rekor MURI Zumba Step Terbesar di Indonesia.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Next city */}
          <CountdownCard
            label="Kota Berikutnya"
            city={nextCity.city}
            date={nextCity.dateLabel}
            venue={nextCity.venue}
            timeLeft={nextLeft}
            accent="warm"
            icon={MapPin}
          />

          {/* Grand finale */}
          <CountdownCard
            label="Grand Finale MURI"
            city={finale.city}
            date={finale.dateLabel}
            venue={finale.venue}
            timeLeft={finaleLeft}
            accent="magenta"
            icon={Trophy}
          />
        </div>
      </div>
    </section>
  );
}

function CountdownCard({
  label,
  city,
  date,
  venue,
  timeLeft,
  accent,
  icon: Icon,
}: {
  label: string;
  city: string;
  date: string;
  venue: string;
  timeLeft: { days: number; hours: number; minutes: number; seconds: number };
  accent: "warm" | "magenta";
  icon: React.ElementType;
}) {
  const gradient =
    accent === "warm"
      ? "from-orange-500/20 via-amber-500/10 to-transparent"
      : "from-fuchsia-500/20 via-pink-500/10 to-transparent";
  const ringColor = accent === "warm" ? "ring-orange-400/40" : "ring-fuchsia-400/40";
  const iconBg = accent === "warm" ? "bg-gradient-to-br from-orange-400 to-amber-500" : "bg-gradient-to-br from-fuchsia-500 to-pink-600";

  const units = [
    { label: "Hari", value: timeLeft.days },
    { label: "Jam", value: timeLeft.hours },
    { label: "Menit", value: timeLeft.minutes },
    { label: "Detik", value: timeLeft.seconds },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={`relative rounded-3xl p-6 lg:p-8 bg-gradient-to-br ${gradient} ring-1 ${ringColor} backdrop-blur-md`}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`h-12 w-12 rounded-2xl ${iconBg} flex items-center justify-center shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-white/60 font-bold">{label}</div>
            <div className="text-2xl font-extrabold text-white" style={{ fontFamily: "var(--font-display)" }}>
              {city}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/60 flex items-center gap-1 justify-end">
            <Calendar className="h-3 w-3" />
            {date}
          </div>
          <div className="text-xs text-white/40 mt-1 max-w-[12rem] truncate">{venue}</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {units.map((u) => (
          <div
            key={u.label}
            className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-3 sm:p-4 text-center"
          >
            <div className="text-2xl sm:text-4xl font-black text-white tabular-nums leading-none">
              {String(u.value).padStart(2, "0")}
            </div>
            <div className="text-[10px] sm:text-xs text-white/60 uppercase tracking-wider mt-1 font-semibold">
              {u.label}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
