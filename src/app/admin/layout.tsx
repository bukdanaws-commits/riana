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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, logout, user, checkSession, isDevLogin } = useAdminAuth();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => { setHasHydrated(true); }, []);
  useEffect(() => { if (hasHydrated && !isAuthenticated && !isDevLogin) checkSession(); }, [hasHydrated, isAuthenticated, isDevLogin, checkSession]);
  useEffect(() => { if (hasHydrated && pathname !== "/admin/login" && !isAuthenticated) router.push("/admin/login"); }, [hasHydrated, isAuthenticated, pathname, router]);

  if (!hasHydrated || isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#0E0F14]"><Loader2 className="h-8 w-8 animate-spin text-[#FC7166]" /></div>;
  if (pathname === "/admin/login") return <>{children}</>;
  if (!isAuthenticated) return <div className="min-h-screen flex items-center justify-center bg-[#0E0F14]"><Loader2 className="h-8 w-8 animate-spin text-[#FC7166]" /></div>;

  return (
    <div className="min-h-screen flex bg-[#FAEDE9]">
      <aside className="w-64 flex-shrink-0 bg-gradient-to-b from-white to-[#FFF1ED] border-r border-[#FC7166]/20 flex flex-col fixed h-screen">
        <div className="p-4 border-b border-[#FC7166]/20">
          <Link href="/admin" className="flex items-center gap-2">
            <img src="/brand/logo-aktivenarion.jpeg" alt="ActiveNation" className="h-10 w-10 rounded-xl object-cover shadow" />
            <div><div className="text-sm font-black tracking-wider text-[#0E0F14]" style={{ fontFamily: "var(--font-display)" }}>RIANA ADMIN</div><div className="text-[9px] text-[#F39F23] font-bold tracking-[0.2em]">CONTROL PANEL</div></div>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {NAV_ITEMS.map((item) => { const active = pathname === item.href; const Icon = item.icon; return (
            <Link key={item.href} href={item.href} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all mb-1 ${active ? "bg-gradient-to-r from-[#FC7166] to-[#FD8656] text-white shadow-md" : "text-[#0E0F14]/70 hover:text-[#0E0F14] hover:bg-[#FC7166]/10"}`} style={{ fontFamily: "var(--font-heading)" }}>
              <Icon className="h-4 w-4 flex-shrink-0" />{item.label}
            </Link>
          ); })}
        </nav>
        <div className="p-3 border-t border-[#FC7166]/20 space-y-2">
          <div className="flex items-center gap-2 px-2">
            <img src={user?.avatar ?? ""} alt={user?.name ?? "Admin"} className="h-8 w-8 rounded-full bg-[#FC7166]/20" />
            <div className="flex-1 min-w-0"><div className="text-xs font-bold text-[#0E0F14] truncate">{user?.name}</div><div className="text-[10px] text-[#0E0F14]/50 truncate">{user?.email}</div></div>
          </div>
          <button onClick={() => { logout(); router.push("/admin/login"); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold bg-white border border-red-500/30 text-red-600 hover:bg-red-500/10 transition-colors">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-64 overflow-y-auto h-screen"><div className="p-6">{children}</div></main>
    </div>
  );
}
