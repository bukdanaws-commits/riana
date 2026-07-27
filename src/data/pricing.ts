// ============================================================
// Pricing Tier Logic — Skenario A (Regular Gratis, VIP Berbayar)
// ============================================================

export type CityTier = "finale" | "tier1" | "tier2";

export interface CityPricing {
  tier: CityTier;
  regular: {
    price: number;
    label: string;
    benefits: string[];
  };
  vip: {
    price: number;
    earlyBirdPrice: number;
    label: string;
    earlyBirdLabel: string;
    capacity: number;
    benefits: string[];
  };
  earlyBirdEndDays: number; // days before event (H-30)
}

// Tier classification per kota
export const CITY_TIERS: Record<string, CityTier> = {
  jakarta: "finale",
  bandung: "tier1",
  bali: "tier1",
  surabaya: "tier1",
  medan: "tier1",
  // all others default to tier2
};

export function getCityTier(cityId: string): CityTier {
  return CITY_TIERS[cityId] ?? "tier2";
}

export function getCityPricing(cityId: string, eventDate: string): CityPricing {
  const tier = getCityTier(cityId);

  const tierPrices = {
    finale: { vip: 350000, earlyBird: 245000 },
    tier1: { vip: 250000, earlyBird: 175000 },
    tier2: { vip: 175000, earlyBird: 122500 },
  };

  const prices = tierPrices[tier];

  return {
    tier,
    regular: {
      price: 0,
      label: "Gratis",
      benefits: [
        "Akses sesi Zumba Step",
        "e-Certificate partisipasi",
        "Nama tercatat di MURI",
      ],
    },
    vip: {
      price: prices.vip,
      earlyBirdPrice: prices.earlyBird,
      label: `Rp ${prices.vip.toLocaleString("id-ID")}`,
      earlyBirdLabel: `Rp ${prices.earlyBird.toLocaleString("id-ID")}`,
      capacity: 50,
      benefits: [
        "Semua benefit Regular",
        "Merchandise eksklusif (kaos + step board)",
        "Akses front-row zone",
        "Sesi foto bersama Riana",
        "e-Certificate cetak premium",
        "Doorprize prioritas",
      ],
    },
    earlyBirdEndDays: 30,
  };
}

// Check if early bird is still active for a city
export function isEarlyBirdActive(eventDate: string): boolean {
  const event = new Date(eventDate);
  const now = new Date();
  const diffDays = Math.ceil((event.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays > 30;
}

// Get days until early bird ends
export function getEarlyBirdDaysLeft(eventDate: string): number {
  const event = new Date(eventDate);
  const now = new Date();
  const earlyBirdEnd = new Date(event);
  earlyBirdEnd.setDate(earlyBirdEnd.getDate() - 30);
  const diffDays = Math.ceil((earlyBirdEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

// Format price to Rupiah
export function formatRupiah(amount: number): string {
  if (amount === 0) return "Gratis";
  return `Rp ${amount.toLocaleString("id-ID")}`;
}
