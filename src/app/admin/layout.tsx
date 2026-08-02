"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAdminAuth } from "@/lib/admin-auth";
import { LayoutDashboard, Users, MapPin, TrendingUp, LogOut, Loader2 } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/peserta", label: "Data Peserta", icon: Users },
  { href: "/admin/kota", label: "Kota & Harga", icon: MapPin },
  { href: "/admin/revenue", label: "Revenue", icon: TrendingUp },
];

// ============================================================
// Dark mode design (Opsi B — Contrasting Sidebar):
//   Sidebar:  #0E0F14 (jet black) — distinct from main
//   Main bg:  #1F2129 (dark slate)
//   Card bg:  #2A2D38
//   Border:   rgba(252,113,102,0.2)
//   Text:     #FAEDE9 (cream) for headings, rgba(255,255,255,0.6) for body
// ============================================================

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, logout, user, checkSession, isDevLogin } = useAdminAuth();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => { setHasHydrated(true); }, []);
  useEffect(() => { if (hasHydrated && !isAuthenticated && !isDevLogin) checkSession(); }, [hasHydrated, isAuthenticated, isDevLogin, checkSession]);
  useEffect(() => { if (hasHydrated && pathname !== "/admin/login" && !isAuthenticated) router.push("/admin/login"); }, [hasHydrated, isAuthenticated, pathname, router]);

  if (!hasHydrated || isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#1F2129]"><Loader2 className="h-8 w-8 animate-spin text-[#FC7166]" /></div>;
  if (pathname === "/admin/login") return <>{children}</>;
  if (!isAuthenticated) return <div className="min-h-screen flex items-center justify-center bg-[#1F2129]"><Loader2 className="h-8 w-8 animate-spin text-[#FC7166]" /></div>;

  return (
    <div className="min-h-screen flex bg-[#1F2129]">
      {/* SIDEBAR — jet black, distinct from main bg */}
      <aside className="w-64 flex-shrink-0 bg-[#0E0F14] border-r border-[#FC7166]/20 flex flex-col fixed h-screen">
        {/* Logo */}
        <div className="p-4 border-b border-[#FC7166]/20">
          <Link href="/admin" className="flex items-center gap-2">
            <img src="/brand/logo-aktivenarion.jpeg" alt="ActiveNation" className="h-10 w-10 rounded-xl object-cover shadow-lg" />
            <div>
              <div className="text-sm font-black tracking-wider text-white" style={{ fontFamily: "var(--font-display)" }}>RIANA ADMIN</div>
              <div className="text-[9px] text-[#F39F23] font-bold tracking-[0.2em]">CONTROL PANEL</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-2">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all mb-1 ${
                  active
                    ? "bg-gradient-to-r from-[#FC7166] to-[#FD8656] text-white shadow-lg shadow-[#FC7166]/20"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div className="p-3 border-t border-[#FC7166]/20 space-y-2">
          <div className="flex items-center gap-2 px-2">
            <img
              src={user?.avatar ?? ""}
              alt={user?.name ?? "Admin"}
              className="h-8 w-8 rounded-full bg-[#FC7166]/20 ring-2 ring-[#FC7166]/30"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">{user?.name}</div>
              <div className="text-[10px] text-white/40 truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={() => { logout(); router.push("/admin/login"); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT — dark slate, distinct from sidebar */}
      <main className="flex-1 ml-64 overflow-y-auto h-screen">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
