"use client";

import { useState, useEffect, useCallback } from "react";
import { useCities as useCitiesStore, useMuriTarget } from "@/lib/admin-store";
import type { CityEvent } from "@/data/event";

// ============================================================
// useCitiesData — fetch cities from Supabase (/api/cities)
// Falls back to Zustand store (hardcoded data) if API fails.
//
// Returns:
//   cities: CityEvent[]      — list of cities (Supabase shape -> CityEvent shape)
//   loading: boolean
//   refetch: () => void      — manual refresh
//   source: "supabase" | "store"
// ============================================================

interface SupabaseCity {
  id: string;
  date: string;
  date_label: string | null;
  day_label: string | null;
  city: string;
  venue: string | null;
  region: string;
  capacity: number;
  registered: number;
  checked_in: number | null;
  status: "completed" | "open" | "soon" | "soldout";
  price: string | null;
  tier: "finale" | "tier1" | "tier2";
  vip_price: number;
  vip_early_bird_price: number;
  early_bird_active: boolean;
  map_x: number | null;
  map_y: number | null;
}

function mapSupabaseCity(c: SupabaseCity): CityEvent {
  return {
    id: c.id,
    date: c.date,
    dateLabel: c.date_label || "",
    dayLabel: c.day_label || "",
    city: c.city,
    venue: c.venue || "",
    region: c.region as CityEvent["region"],
    capacity: c.capacity,
    registered: c.registered,
    checkedIn: c.checked_in ?? 0,
    status: c.status,
    mapX: c.map_x ?? 50,
    mapY: c.map_y ?? 60,
    price: c.price || "Gratis",
    earlyBird: c.early_bird_active,
  };
}

export function useCitiesData() {
  const storeCities = useCitiesStore();
  const [cities, setCities] = useState<CityEvent[]>(storeCities);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"supabase" | "store">("store");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/cities");
      const json = await res.json();
      if (json.error || !json.data) {
        // API returned error — fallback to store
        setCities(storeCities);
        setSource("store");
        return;
      }
      const mapped = (json.data as SupabaseCity[]).map(mapSupabaseCity);
      if (mapped.length === 0) {
        // Empty DB — fallback to store (so landing page still looks good)
        setCities(storeCities);
        setSource("store");
      } else {
        setCities(mapped);
        setSource("supabase");
      }
    } catch {
      // Network error — fallback to store
      setCities(storeCities);
      setSource("store");
    } finally {
      setLoading(false);
    }
  }, [storeCities]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { cities, loading, refetch: fetchData, source };
}

// ============================================================
// useRegistrationCount — fetch total registration count from Supabase
// Used by Hero live counter + MuriProgress
//
// Returns:
//   count: number
//   loading: boolean
//   refetch: () => void
// ============================================================

export function useRegistrationCount() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/registrations");
      const json = await res.json();
      setCount(json.count ?? 0);
    } catch {
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds (live counter)
    const id = setInterval(fetchData, 30000);
    return () => clearInterval(id);
  }, [fetchData]);

  return { count, loading, refetch: fetchData };
}

// ============================================================
// useMuriProgress — combined hook for MuriProgress section
// Returns cities + registration count + computed stats
// ============================================================

export function useMuriProgress() {
  const { cities, loading: citiesLoading, source } = useCitiesData();
  const { count: registrationCount, loading: countLoading } = useRegistrationCount();
  const MURI_TARGET = useMuriTarget();

  // Use max of (cities sum, registration count) for accuracy
  const citiesTotal = cities.reduce((s, c) => s + c.registered, 0);
  const totalRegistered = Math.max(citiesTotal, registrationCount);

  const checkedIn = cities.reduce((s, c) => s + (c.checkedIn ?? 0), 0);
  const completedCities = cities.filter((c) => c.status === "completed").length;
  const openCities = cities.filter((c) => c.status === "open").length;
  const pct = MURI_TARGET > 0 ? Math.min((totalRegistered / MURI_TARGET) * 100, 100) : 0;

  // Regional breakdown
  const regionStats = cities.reduce<Record<string, { total: number; reg: number }>>((acc, c) => {
    if (!acc[c.region]) acc[c.region] = { total: 0, reg: 0 };
    acc[c.region].total += c.capacity;
    acc[c.region].reg += c.registered;
    return acc;
  }, {});

  return {
    cities,
    totalRegistered,
    checkedIn,
    completedCities,
    openCities,
    pct,
    regionStats,
    MURI_TARGET,
    loading: citiesLoading || countLoading,
    source,
  };
}
