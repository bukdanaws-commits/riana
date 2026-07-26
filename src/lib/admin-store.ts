"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CITIES as DEFAULT_CITIES,
  TESTIMONIALS as DEFAULT_TESTIMONIALS,
  PARTNERS as DEFAULT_PARTNERS,
  FAQS as DEFAULT_FAQS,
  GALLERY_ITEMS as DEFAULT_GALLERY,
  RIANA_STATS as DEFAULT_RIANA_STATS,
  RIANA_CERTIFICATIONS as DEFAULT_RIANA_CERTS,
  BENEFITS as DEFAULT_BENEFITS,
  MILESTONES as DEFAULT_MILESTONES,
  MURI_TARGET as DEFAULT_MURI_TARGET,
  type CityEvent,
  type Testimonial,
  type Partner,
  type FAQItem,
  type GalleryItem,
  type Region,
  type CityStatus,
} from "@/data/event";

// ============================================================
// ADMIN AUTH
// ============================================================
interface AdminAuth {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const ADMIN_PASSWORD = "admin123"; // default — change in production

// ============================================================
// ADMIN STORE
// ============================================================
interface AdminState extends AdminAuth {
  // Editable data
  cities: CityEvent[];
  testimonials: Testimonial[];
  partners: Partner[];
  faqs: FAQItem[];
  gallery: GalleryItem[];
  rianaStats: typeof DEFAULT_RIANA_STATS;
  rianaCerts: string[];
  rianaBio: string;
  benefits: typeof DEFAULT_BENEFITS;
  muriTarget: number;

  // UI state (not persisted)
  isAdminOpen: boolean;
  activeView: AdminView;
  editingItem: Record<string, unknown> | null;

  // Actions
  setAdminOpen: (open: boolean) => void;
  setActiveView: (view: AdminView) => void;

  // Cities
  addCity: (city: CityEvent) => void;
  updateCity: (id: string, updates: Partial<CityEvent>) => void;
  deleteCity: (id: string) => void;
  reorderCities: (newOrder: CityEvent[]) => void;

  // Testimonials
  addTestimonial: (t: Testimonial) => void;
  updateTestimonial: (idx: number, updates: Partial<Testimonial>) => void;
  deleteTestimonial: (idx: number) => void;

  // Partners
  addPartner: (p: Partner) => void;
  updatePartner: (idx: number, updates: Partial<Partner>) => void;
  deletePartner: (idx: number) => void;

  // FAQs
  addFaq: (f: FAQItem) => void;
  updateFaq: (idx: number, updates: Partial<FAQItem>) => void;
  deleteFaq: (idx: number) => void;

  // Gallery
  addGalleryItem: (g: GalleryItem) => void;
  updateGalleryItem: (idx: number, updates: Partial<GalleryItem>) => void;
  deleteGalleryItem: (idx: number) => void;

  // Riana
  updateRianaBio: (bio: string) => void;
  updateRianaStats: (stats: typeof DEFAULT_RIANA_STATS) => void;
  updateRianaCerts: (certs: string[]) => void;

  // Settings
  resetAll: () => void;
  exportData: () => string;
  importData: (json: string) => boolean;
}

export type AdminView =
  | "dashboard"
  | "cities"
  | "testimonials"
  | "partners"
  | "faq"
  | "gallery"
  | "riana"
  | "settings";

const initialState = {
  cities: DEFAULT_CITIES,
  testimonials: DEFAULT_TESTIMONIALS,
  partners: DEFAULT_PARTNERS,
  faqs: DEFAULT_FAQS,
  gallery: DEFAULT_GALLERY,
  rianaStats: DEFAULT_RIANA_STATS,
  rianaCerts: DEFAULT_RIANA_CERTS,
  rianaBio:
    "Riana Bismarak (@rianaree) adalah instruktur fitness bersertifikasi dengan 8 lisensi internasional — Zumba, Zumba Toning, Zumba Step, Strong Nation, Barre Intensity, Inferno Hot Pilates, Pound, dan Pound Unplugged. Dengan pengalaman 8+ tahun, Riana telah mengajar di 20+ kota dan membangun komunitas 126K pengikut di Instagram.",
  benefits: DEFAULT_BENEFITS,
  muriTarget: DEFAULT_MURI_TARGET,
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      // Auth
      isAuthenticated: false,
      login: (password: string) => {
        if (password === ADMIN_PASSWORD) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false, isAdminOpen: false }),

      // Data
      ...initialState,

      // UI
      isAdminOpen: false,
      activeView: "dashboard",
      editingItem: null,

      setAdminOpen: (open) => set({ isAdminOpen: open }),
      setActiveView: (view) => set({ activeView: view }),

      // Cities
      addCity: (city) => set((s) => ({ cities: [...s.cities, city] })),
      updateCity: (id, updates) =>
        set((s) => ({
          cities: s.cities.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      deleteCity: (id) =>
        set((s) => ({ cities: s.cities.filter((c) => c.id !== id) })),
      reorderCities: (newOrder) => set({ cities: newOrder }),

      // Testimonials
      addTestimonial: (t) =>
        set((s) => ({ testimonials: [...s.testimonials, t] })),
      updateTestimonial: (idx, updates) =>
        set((s) => ({
          testimonials: s.testimonials.map((t, i) =>
            i === idx ? { ...t, ...updates } : t
          ),
        })),
      deleteTestimonial: (idx) =>
        set((s) => ({
          testimonials: s.testimonials.filter((_, i) => i !== idx),
        })),

      // Partners
      addPartner: (p) => set((s) => ({ partners: [...s.partners, p] })),
      updatePartner: (idx, updates) =>
        set((s) => ({
          partners: s.partners.map((p, i) =>
            i === idx ? { ...p, ...updates } : p
          ),
        })),
      deletePartner: (idx) =>
        set((s) => ({ partners: s.partners.filter((_, i) => i !== idx) })),

      // FAQs
      addFaq: (f) => set((s) => ({ faqs: [...s.faqs, f] })),
      updateFaq: (idx, updates) =>
        set((s) => ({
          faqs: s.faqs.map((f, i) => (i === idx ? { ...f, ...updates } : f)),
        })),
      deleteFaq: (idx) =>
        set((s) => ({ faqs: s.faqs.filter((_, i) => i !== idx) })),

      // Gallery
      addGalleryItem: (g) => set((s) => ({ gallery: [...s.gallery, g] })),
      updateGalleryItem: (idx, updates) =>
        set((s) => ({
          gallery: s.gallery.map((g, i) =>
            i === idx ? { ...g, ...updates } : g
          ),
        })),
      deleteGalleryItem: (idx) =>
        set((s) => ({ gallery: s.gallery.filter((_, i) => i !== idx) })),

      // Riana
      updateRianaBio: (bio) => set({ rianaBio: bio }),
      updateRianaStats: (stats) => set({ rianaStats: stats }),
      updateRianaCerts: (certs) => set({ rianaCerts: certs }),

      // Settings
      resetAll: () => set({ ...initialState }),
      exportData: () => {
        const state = get();
        const exportable = {
          cities: state.cities,
          testimonials: state.testimonials,
          partners: state.partners,
          faqs: state.faqs,
          gallery: state.gallery,
          rianaStats: state.rianaStats,
          rianaCerts: state.rianaCerts,
          rianaBio: state.rianaBio,
          benefits: state.benefits,
          muriTarget: state.muriTarget,
          exportedAt: new Date().toISOString(),
        };
        return JSON.stringify(exportable, null, 2);
      },
      importData: (json: string) => {
        try {
          const data = JSON.parse(json);
          set({
            cities: data.cities ?? DEFAULT_CITIES,
            testimonials: data.testimonials ?? DEFAULT_TESTIMONIALS,
            partners: data.partners ?? DEFAULT_PARTNERS,
            faqs: data.faqs ?? DEFAULT_FAQS,
            gallery: data.gallery ?? DEFAULT_GALLERY,
            rianaStats: data.rianaStats ?? DEFAULT_RIANA_STATS,
            rianaCerts: data.rianaCerts ?? DEFAULT_RIANA_CERTS,
            rianaBio: data.rianaBio ?? "",
            benefits: data.benefits ?? DEFAULT_BENEFITS,
            muriTarget: data.muriTarget ?? DEFAULT_MURI_TARGET,
          });
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: "riana-admin-store",
      // Only persist data, not UI state
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        cities: state.cities,
        testimonials: state.testimonials,
        partners: state.partners,
        faqs: state.faqs,
        gallery: state.gallery,
        rianaStats: state.rianaStats,
        rianaCerts: state.rianaCerts,
        rianaBio: state.rianaBio,
        benefits: state.benefits,
        muriTarget: state.muriTarget,
      }),
    }
  )
);

// ============================================================
// Helper hooks (for sections to read data with store override)
// ============================================================
export function useCities() {
  return useAdminStore((s) => s.cities);
}
export function useTestimonials() {
  return useAdminStore((s) => s.testimonials);
}
export function usePartners() {
  return useAdminStore((s) => s.partners);
}
export function useFaqs() {
  return useAdminStore((s) => s.faqs);
}
export function useGallery() {
  return useAdminStore((s) => s.gallery);
}
export function useRianaStats() {
  return useAdminStore((s) => s.rianaStats);
}
export function useRianaCerts() {
  return useAdminStore((s) => s.rianaCerts);
}
export function useRianaBio() {
  return useAdminStore((s) => s.rianaBio);
}
export function useMuriTarget() {
  return useAdminStore((s) => s.muriTarget);
}

// Re-export types
export type { CityEvent, Testimonial, Partner, FAQItem, GalleryItem, Region, CityStatus };
