"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
} from "lucide-react";
import {
  REGIONS,
  REGION_COLORS,
  type Region,
  type CityEvent,
} from "@/data/event";
import { useCities } from "@/lib/admin-store";

interface CityScheduleProps {
  onRegisterClick: (cityId?: string) => void;
}

type Filter = "all" | Region;

export function CitySchedule({ onRegisterClick }: CityScheduleProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const CITIES = useCities();

  const filtered = useMemo(() => {
    if (filter === "all") return CITIES;
    return CITIES.filter((c) => c.region === filter);
  }, [filter, CITIES]);

  return (
    <section id="jadwal" className="relative py-4 lg:py-6 bg-white overflow-hidden">
      {/* Tech grid pattern */}
      <div className="absolute inset-0 pattern-tech-grid opacity-50" />
      <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-[#FC7166]/15 blur-3xl -z-10" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FC7166]/15 border border-[#FC7166]/25 mb-4">
            <Calendar className="h-3.5 w-3.5 text-[#FC7166]" />
            <span
              className="text-xs font-bold text-[#B01A62] tracking-wide uppercase"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Tour Schedule 2026
            </span>
          </div>
          <h2
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#0E0F14] mb-3 leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            20 KOTA, <span className="text-gradient-brand">1 PERJALANAN</span>
          </h2>
          <p
            className="text-base text-[#884D3E] max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Pilih kota Anda dan jadilah bagian dari sejarah. Klik pin di peta atau
            kartu kota untuk mendaftar.
          </p>
          <div
            className="font-script text-xl sm:text-2xl text-[#FC7166] mt-3"
            style={{ fontFamily: "var(--font-script)" }}
          >
            Satu Gerakan, Satu Tujuan: Sehat & Bersejarah!
          </div>
        </motion.div>

        {/* Filter pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <FilterPill
            active={filter === "all"}
            onClick={() => setFilter("all")}
            color="#181A22"
            label="Semua Kota"
            count={CITIES.length}
          />
          {REGIONS.map((r) => (
            <FilterPill
              key={r}
              active={filter === r}
              onClick={() => setFilter(r)}
              color={REGION_COLORS[r]}
              label={r}
              count={CITIES.filter((c) => c.region === r).length}
            />
          ))}
        </div>

        {/* Map + Grid layout */}
        <div className="grid lg:grid-cols-12 gap-4">
          {/* Map (left on desktop, hidden on mobile) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 hidden lg:block"
          >
            <div className="sticky top-24">
              <IndonesiaMap
                hoveredCity={hoveredCity}
                onCityHover={setHoveredCity}
                onCityClick={(id) => onRegisterClick(id)}
                filter={filter}
              />
            </div>
          </motion.div>

          {/* City cards grid */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={filter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid sm:grid-cols-2 gap-4"
              >
                {filtered.map((city, i) => (
                  <CityCard
                    key={city.id}
                    city={city}
                    index={i}
                    onHover={setHoveredCity}
                    onClick={() => onRegisterClick(city.id)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterPill({
  active,
  onClick,
  color,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  color: string;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`group inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-semibold text-sm transition-all ${
        active
          ? "text-white border-transparent shadow-md"
          : "text-[#0E0F14]/80 bg-[#FFF1ED] border-[#FC7166]/20 hover:border-[#FC7166]/25"
      }`}
      style={active ? { background: color } : undefined}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ background: active ? "rgba(255,255,255,0.9)" : color }}
      />
      {label}
      <span
        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
          active ? "bg-[#FFF1ED]" : "bg-[#FFF1ED]"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function CityCard({
  city,
  index,
  onHover,
  onClick,
}: {
  city: CityEvent;
  index: number;
  onHover: (id: string | null) => void;
  onClick: () => void;
}) {
  const isFinale = city.id === "jakarta";
  const seatsPct = Math.round((city.registered / city.capacity) * 100);
  const color = REGION_COLORS[city.region];
  // City number 01-20
  const cityNumber = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.4) }}
      onMouseEnter={() => onHover(city.id)}
      onMouseLeave={() => onHover(null)}
      className="group relative p-5 rounded-2xl bg-[#FFF1ED] border border-[#FC7166]/20 hover:border-[#FC7166] hover:shadow-lg transition-all cursor-pointer overflow-hidden "
      onClick={onClick}
    >
      {/* Color accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5"
        style={{ background: color }}
      />

      {/* Big number badge in background */}
      <div
        className="absolute -top-2 -right-2 text-7xl font-black opacity-10 group-hover:opacity-25 transition-opacity leading-none"
        style={{
          fontFamily: "var(--font-display)",
          color: color,
        }}
      >
        {cityNumber}
      </div>

      <div className="flex items-start justify-between mb-3 relative">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-bold uppercase tracking-wider text-[#0E0F14]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {city.dayLabel}, {city.dateLabel}
            </span>
            {isFinale && (
              <Badge className="bg-[#F39F23] text-[#0E0F14] text-[9px] hover:bg-[#F39F23] px-1.5 py-0 font-black">
                <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                FINALE
              </Badge>
            )}
          </div>
          <h3
            className="text-2xl font-black text-[#0E0F14] leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {city.city}
          </h3>
          <div className="text-xs text-[#884D3E] mt-1 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate max-w-[14rem]">{city.venue}</span>
          </div>
        </div>
        <div
          className="flex-shrink-0 h-11 w-11 rounded-xl flex flex-col items-center justify-center text-white shadow-md"
          style={{ background: color }}
        >
          <span
            className="text-[8px] font-bold uppercase opacity-90"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {city.dayLabel.slice(0, 3)}
          </span>
          <span className="text-base font-black leading-none" style={{ fontFamily: "var(--font-display)" }}>
            {city.dateLabel.split(" ")[0]}
          </span>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between mt-3 relative">
        <StatusBadge status={city.status} />
        <div className="flex items-center gap-1.5 text-xs text-[#884D3E]">
          <Users className="h-3.5 w-3.5" />
          <span>
            <span className="font-bold text-[#0E0F14]">{city.registered}</span>/{city.capacity}
          </span>
        </div>
      </div>

      {city.registered > 0 && (
        <div className="mt-2 relative">
          <div className="h-1 w-full rounded-full bg-[#FFE0D6] overflow-hidden">
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${seatsPct}%`, background: color }}
            />
          </div>
        </div>
      )}

      <Button
        size="sm"
        className="w-full mt-4 bg-[#0E0F14] group-hover:bg-[#FC7166] text-white font-bold rounded-xl transition-all relative"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Daftar di {city.city}
        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
      </Button>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: CityEvent["status"] }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F39F23]/20 text-[#C97D0E] text-[10px] font-bold">
        <CheckCircle2 className="h-3 w-3" />
        Selesai
      </span>
    );
  }
  if (status === "open") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold">
        <CheckCircle2 className="h-3 w-3" />
        Terbuka
      </span>
    );
  }
  if (status === "soldout") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold">
        <XCircle className="h-3 w-3" />
        Sold Out
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F39F23]/15 text-[#FC7166] text-[10px] font-bold">
      <Clock className="h-3 w-3" />
      Segera
    </span>
  );
}

// Simplified stylized Indonesia map
function IndonesiaMap({
  hoveredCity,
  onCityHover,
  onCityClick,
  filter,
}: {
  hoveredCity: string | null;
  onCityHover: (id: string | null) => void;
  onCityClick: (id: string) => void;
  filter: Filter;
}) {
  const CITIES = useCities();
  return (
    <div className="relative aspect-[4/3] rounded-3xl bg-gradient-to-br from-purple-50 via-pink-50 to-pink-50 border-2 border-[#FC7166]/20 overflow-hidden p-4">
      <div className="absolute inset-0 pattern-dots opacity-50" />

      {/* Map header */}
      <div className="relative flex items-center justify-between mb-2">
        <div>
          <div className="text-xs text-[#0E0F14]/60 font-bold uppercase tracking-wider">Interactive Map</div>
          <div className="text-sm font-extrabold text-[#0E0F14]">20 Kota di Indonesia</div>
        </div>
        <div className="text-[10px] text-[#0E0F14]/50">Hover • Click to register</div>
      </div>

      {/* SVG-based simplified Indonesia silhouette */}
      <div className="relative h-[calc(100%-3rem)]">
        <svg
          viewBox="0 0 100 75"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Sumatera */}
          <path
            d="M 25 38 L 35 30 L 42 42 L 48 55 L 45 65 L 38 62 L 32 52 L 28 45 Z"
            fill="rgba(236,10,139,0.08)"
            stroke="rgba(236,10,139,0.25)"
            strokeWidth="0.3"
          />
          {/* Jawa */}
          <path
            d="M 44 58 L 62 58 L 64 62 L 60 64 L 48 64 L 44 62 Z"
            fill="rgba(236,10,139,0.08)"
            stroke="rgba(236,10,139,0.25)"
            strokeWidth="0.3"
          />
          {/* Bali & Nusa Tenggara */}
          <path
            d="M 64 60 L 75 60 L 78 64 L 70 66 L 64 64 Z"
            fill="rgba(236,10,139,0.08)"
            stroke="rgba(236,10,139,0.25)"
            strokeWidth="0.3"
          />
          {/* Kalimantan */}
          <path
            d="M 60 38 L 75 38 L 78 50 L 75 60 L 68 62 L 64 55 L 60 45 Z"
            fill="rgba(236,10,139,0.08)"
            stroke="rgba(236,10,139,0.25)"
            strokeWidth="0.3"
          />
          {/* Sulawesi */}
          <path
            d="M 74 44 L 80 40 L 82 50 L 78 56 L 76 50 L 78 44 L 80 48 L 82 52 L 84 46 Z"
            fill="rgba(236,10,139,0.08)"
            stroke="rgba(236,10,139,0.25)"
            strokeWidth="0.3"
          />
          {/* Papua (mini) */}
          <path
            d="M 85 50 L 95 50 L 95 58 L 88 58 L 85 56 Z"
            fill="rgba(236,10,139,0.05)"
            stroke="rgba(236,10,139,0.2)"
            strokeWidth="0.3"
          />
        </svg>

        {/* City pins */}
        {CITIES.map((city) => {
          const isHovered = hoveredCity === city.id;
          const isFinale = city.id === "jakarta";
          const isVisible = filter === "all" || city.region === filter;
          const color = REGION_COLORS[city.region];
          return (
            <button
              key={city.id}
              onClick={() => onCityClick(city.id)}
              onMouseEnter={() => onCityHover(city.id)}
              onMouseLeave={() => onHover(null)}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all"
              style={{
                left: `${city.mapX}%`,
                top: `${city.mapY}%`,
                opacity: isVisible ? 1 : 0.15,
                zIndex: isHovered ? 30 : 10,
              }}
              aria-label={`${city.city} - ${city.dateLabel}`}
            >
              <div className="relative">
                {/* Pulse ring */}
                {(isHovered || isFinale) && (
                  <span
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{ background: color, opacity: 0.4 }}
                  />
                )}
                {/* Pin dot */}
                <div
                  className={`relative rounded-full border-2 border-white shadow-lg transition-all ${
                    isHovered ? "h-5 w-5" : isFinale ? "h-4 w-4" : "h-3 w-3"
                  }`}
                  style={{ background: color }}
                />
                {/* Tooltip on hover */}
                {isHovered && (
                  <div className="absolute left-1/2 -translate-x-1/2 -top-12 whitespace-nowrap px-3 py-1.5 rounded-lg bg-[#0E0F14] text-white text-[10px] font-bold shadow-xl z-40 pointer-events-none">
                    {city.city}
                    <div className="text-[8px] text-[#0E0F14]/70 font-normal">{city.dateLabel} 2026</div>
                  </div>
                )}
              </div>
            </button>
          );
        })}

        {/* Legend */}
        <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1.5">
          {REGIONS.map((r) => (
            <div key={r} className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#FFF1ED]/70 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: REGION_COLORS[r] }} />
              <span className="text-[8px] font-semibold text-[#0E0F14]/70">{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
