"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, MapPin, Calendar } from "lucide-react";
import { useCities } from "@/lib/admin-store";

function getNextCity(cities: { date: string }[]) {
  const now = new Date();
  return cities.find((c) => new Date(c.date).getTime() > now.getTime()) ?? cities[cities.length - 1];
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
  const CITIES = useCities();
  const nextCity = getNextCity(CITIES) ?? CITIES[0];
  const finale = CITIES.find((c) => c.id === "jakarta") ?? CITIES[CITIES.length - 1];

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
    <section className="relative py-4 lg:py-6 bg-brand-dark overflow-hidden">
      {/* Crowd blur background */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: "url(/brand/crowd-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(12px)",
        }}
      />
      {/* Decorative magenta-orange blobs */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: "radial-gradient(circle at 20% 30%, rgba(223,38,121,0.5) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(241,114,56,0.4) 0%, transparent 40%)",
      }} />
      <div className="absolute top-10 left-10 h-32 w-32 rounded-full bg-magenta/30 blur-3xl animate-float-slow" />
      <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-orange-brand/30 blur-3xl animate-float-slow" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 backdrop-blur-md border border-gold/30 mb-4">
            <Trophy className="h-4 w-4 text-gold-light" />
            <span
              className="text-xs font-bold text-gold-light tracking-widest uppercase"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Live Countdown
            </span>
          </div>
          <h2
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-3 leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            MENUJU PEMECAHAN REKOR <span className="text-gradient-gold">MURI</span>
          </h2>
          <p
            className="text-white/75 max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Hitung mundur menuju kota berikutnya dan Grand Finale pemecahan rekor
            MURI Zumba Step Terbesar di Indonesia.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-3 lg:gap-4">
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
  const isFinale = accent === "magenta";
  const gradient = isFinale
    ? "from-gold/20 via-gold/10 to-transparent"
    : "from-magenta/20 via-magenta/10 to-transparent";
  const ringColor = isFinale ? "ring-gold/40" : "ring-magenta/40";
  const iconBg = isFinale
    ? "bg-gradient-to-br from-gold-light to-gold"
    : "bg-gradient-to-br from-magenta to-magenta-deep";

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
      className={`relative rounded-3xl p-6 lg:p-8 bg-gradient-to-br ${gradient} ring-1 ${ringColor} backdrop-blur-md overflow-hidden`}
    >
      {isFinale && (
        <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gold/20 blur-2xl" />
      )}
      <div className="flex items-start justify-between mb-3 relative">
        <div className="flex items-center gap-3">
          <div className={`h-12 w-12 rounded-2xl ${iconBg} flex items-center justify-center shadow-lg`}>
            <Icon className={`h-6 w-6 ${isFinale ? "text-purpleblack" : "text-white"}`} />
          </div>
          <div>
            <div
              className="text-xs uppercase tracking-widest text-white/70 font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {label}
            </div>
            <div
              className="text-3xl font-black text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {city}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/70 flex items-center gap-1 justify-end">
            <Calendar className="h-3 w-3" />
            {date}
          </div>
          <div className="text-xs text-white/50 mt-1 max-w-[12rem] truncate">{venue}</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3 relative">
        {units.map((u) => (
          <div
            key={u.label}
            className="rounded-2xl bg-purple-dark/40 backdrop-blur-md border border-magenta/15 p-3 sm:p-4 text-center"
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
