"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase-browser";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "bukdan101@gmail.com";

interface AdminUser { email: string; name: string; avatar: string; userId: string; }

interface AdminAuthState {
  isAuthenticated: boolean;
  isDevLogin: boolean;
  user: AdminUser | null;
  isLoading: boolean;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  devLogin: () => void;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAdminAuth = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isDevLogin: false,
      user: null,
      isLoading: false,

      loginWithGoogle: async () => {
        set({ isLoading: true });
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/admin` },
          });
          if (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
          }
          set({ isLoading: false });
          return { success: true };
        } catch {
          set({ isLoading: false });
          return { success: false, error: "Login gagal" };
        }
      },

      devLogin: () => {
        set({
          isAuthenticated: true,
          isDevLogin: true,
          user: { email: ADMIN_EMAIL, name: "Bukdan Admin", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bukdan&backgroundColor=FC7166", userId: "mock-admin" },
          isLoading: false,
        });
      },

      checkSession: async () => {
        if (get().isDevLogin) return;
        const { data } = await supabase.auth.getSession();
        if (!data.session) { set({ isAuthenticated: false, user: null }); return; }
        const email = data.session.user.email ?? "";
        if (email === ADMIN_EMAIL) {
          set({ isAuthenticated: true, user: { email, name: data.session.user.user_metadata?.full_name ?? "Admin", avatar: data.session.user.user_metadata?.avatar_url ?? "", userId: data.session.user.id } });
        } else {
          await supabase.auth.signOut();
          set({ isAuthenticated: false, user: null });
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ isAuthenticated: false, isDevLogin: false, user: null });
      },
    }),
    { name: "riana-admin-auth", partialize: (s) => ({ isAuthenticated: s.isAuthenticated, isDevLogin: s.isDevLogin, user: s.user }) }
  )
);
