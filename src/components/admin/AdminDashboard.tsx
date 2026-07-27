"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LayoutDashboard,
  MapPin,
  Star,
  Handshake,
  HelpCircle,
  Image,
  User,
  Settings,
  LogOut,
  X,
  Plus,
  Edit2,
  Trash2,
  Save,
  RotateCcw,
  Download,
  Upload,
  Trophy,
  Users,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Search,
} from "lucide-react";
import { useAdminStore, type AdminView } from "@/lib/admin-store";
import { REGIONS, REGION_COLORS, type CityStatus } from "@/data/event";
import { toast } from "sonner";
import { DashboardView } from "./views/DashboardView";
import { RegistrationsView } from "./views/RegistrationsView";
import { RegistrationsByCityView } from "./views/RegistrationsByCityView";
import { RevenueView } from "./views/RevenueView";
import { CitiesView } from "./views/CitiesView";
import { TestimonialsView } from "./views/TestimonialsView";
import { PartnersView } from "./views/PartnersView";
import { FaqView } from "./views/FaqView";
import { GalleryView } from "./views/GalleryView";
import { RianaView } from "./views/RianaView";
import { SettingsView } from "./views/SettingsView";

const NAV_ITEMS: { id: AdminView; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: "dashboard",      label: "Dashboard",         icon: LayoutDashboard },
  { id: "registrations",  label: "Data Peserta",      icon: Users, badge: "100" },
  { id: "by_city",        label: "Peserta per Kota",  icon: MapPin },
  { id: "revenue",        label: "Revenue",           icon: TrendingUp },
  { id: "cities",         label: "20 Kota",           icon: MapPin },
  { id: "testimonials",   label: "Testimoni",         icon: Star },
  { id: "partners",       label: "Partner",           icon: Handshake },
  { id: "faq",            label: "FAQ",               icon: HelpCircle },
  { id: "gallery",        label: "Galeri",            icon: Image },
  { id: "riana",          label: "Profil Riana",      icon: User },
  { id: "settings",       label: "Settings",          icon: Settings },
];

export function AdminDashboard() {
  const isAdminOpen = useAdminStore((s) => s.isAdminOpen);
  const setAdminOpen = useAdminStore((s) => s.setAdminOpen);
  const activeView = useAdminStore((s) => s.activeView);
  const setActiveView = useAdminStore((s) => s.setActiveView);
  const logout = useAdminStore((s) => s.logout);

  if (!isAdminOpen) return null;

  const handleClose = () => setAdminOpen(false);

  const handleLogout = () => {
    logout();
    toast.success("Anda telah logout dari admin.");
  };

  return (
    <Dialog open={isAdminOpen} onOpenChange={setAdminOpen}>
      <DialogContent className="max-w-[95vw] w-[1400px] max-h-[95vh] h-[95vh] p-0 overflow-hidden bg-[#0E0F14] border border-[#FC7166]/30">
        <div className="flex h-full">
          {/* === SIDEBAR === */}
          <aside className="w-64 flex-shrink-0 bg-gradient-to-b from-[#181A22] to-[#0E0F14] border-r border-[#FC7166]/20 flex flex-col">
            {/* Logo */}
            <div className="p-4 border-b border-[#FC7166]/20 flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#FC7166] to-[#FD8656] flex items-center justify-center shadow-[0_8px_24px_-8px_rgba(252,113,102,0.6)]">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div>
                <div
                  className="text-base font-black tracking-wider text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  RIANA ADMIN
                </div>
                <div className="text-[9px] text-[#F39F23] font-bold tracking-[0.2em]">
                  CONTROL PANEL
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto p-2 custom-scroll">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all mb-1 ${
                      active
                        ? "bg-gradient-to-r from-[#FC7166] to-[#FD8656] text-white shadow-[0_8px_24px_-8px_rgba(252,113,102,0.6)]"
                        : "text-white/70 hover:text-white hover:bg-[#FC7166]/10"
                    }`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${
                        active ? "bg-white/20" : "bg-[#FC7166]/20 text-[#FF8A80]"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-[#FC7166]/20 space-y-2">
              <Button
                onClick={handleClose}
                variant="outline"
                size="sm"
                className="w-full bg-[#0E0F14] border-[#FC7166]/30 text-white hover:bg-[#FC7166]/10 hover:text-white justify-start"
              >
                <X className="h-4 w-4 mr-2" />
                Tutup Admin
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="w-full bg-[#0E0F14] border-red-500/40 text-red-400 hover:bg-red-500/10 hover:text-red-400 justify-start"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </aside>

          {/* === MAIN CONTENT === */}
          <main className="flex-1 overflow-hidden flex flex-col">
            {/* Header */}
            <header className="px-6 py-3 border-b border-[#FC7166]/20 bg-gradient-to-r from-[#181A22] to-[#0E0F14] flex items-center justify-between flex-shrink-0">
              <div>
                <h1
                  className="text-2xl font-black text-white leading-none"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {NAV_ITEMS.find((n) => n.id === activeView)?.label.toUpperCase()}
                </h1>
                <p className="text-xs text-white/50 mt-0.5">
                  Edit data — perubahan langsung reflect ke landing page
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/40">
                  <span className="relative flex h-1.5 w-1.5 mr-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
                  </span>
                  LIVE SYNC
                </Badge>
                <Badge className="bg-[#F39F23]/20 text-[#FFB938] border-[#F39F23]/40 font-mono">
                  v2.0
                </Badge>
              </div>
            </header>

            {/* View content */}
            <div className="flex-1 overflow-y-auto custom-scroll p-6">
              {activeView === "dashboard" && <DashboardView />}
              {activeView === "registrations" && <RegistrationsView />}
              {activeView === "by_city" && <RegistrationsByCityView />}
              {activeView === "revenue" && <RevenueView />}
              {activeView === "cities" && <CitiesView />}
              {activeView === "testimonials" && <TestimonialsView />}
              {activeView === "partners" && <PartnersView />}
              {activeView === "faq" && <FaqView />}
              {activeView === "gallery" && <GalleryView />}
              {activeView === "riana" && <RianaView />}
              {activeView === "settings" && <SettingsView />}
            </div>
          </main>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// Reusable components — Dark mode + colorful gradient cards
// ============================================================

type CardVariant = "default" | "coral" | "orange" | "golden" | "terracotta" | "peach" | "navy" | "success" | "danger";

const CARD_VARIANTS: Record<CardVariant, { gradient: string; border: string; glow?: string }> = {
  default:    { gradient: "bg-gradient-to-br from-[#1F2129] to-[#181A22]",            border: "border-[#FC7166]/15" },
  coral:      { gradient: "bg-gradient-to-br from-[#FC7166]/20 to-[#FC7166]/5",       border: "border-[#FC7166]/40",  glow: "shadow-[0_8px_32px_-12px_rgba(252,113,102,0.4)]" },
  orange:     { gradient: "bg-gradient-to-br from-[#FD8656]/20 to-[#FD8656]/5",       border: "border-[#FD8656]/40",  glow: "shadow-[0_8px_32px_-12px_rgba(253,134,86,0.4)]" },
  golden:     { gradient: "bg-gradient-to-br from-[#F39F23]/20 to-[#F39F23]/5",       border: "border-[#F39F23]/40",  glow: "shadow-[0_8px_32px_-12px_rgba(243,159,35,0.4)]" },
  terracotta: { gradient: "bg-gradient-to-br from-[#884D3E]/25 to-[#884D3E]/5",       border: "border-[#884D3E]/40",  glow: "shadow-[0_8px_32px_-12px_rgba(136,77,62,0.4)]" },
  peach:      { gradient: "bg-gradient-to-br from-[#C99789]/20 to-[#C99789]/5",       border: "border-[#C99789]/40",  glow: "shadow-[0_8px_32px_-12px_rgba(201,151,137,0.4)]" },
  navy:       { gradient: "bg-gradient-to-br from-[#252D3A]/40 to-[#252D3A]/10",      border: "border-[#252D3A]/60",  glow: "shadow-[0_8px_32px_-12px_rgba(37,45,58,0.5)]" },
  success:    { gradient: "bg-gradient-to-br from-green-500/20 to-green-500/5",       border: "border-green-500/40",  glow: "shadow-[0_8px_32px_-12px_rgba(34,197,94,0.4)]" },
  danger:     { gradient: "bg-gradient-to-br from-red-500/20 to-red-500/5",            border: "border-red-500/40",    glow: "shadow-[0_8px_32px_-12px_rgba(239,68,68,0.4)]" },
};

export function AdminCard({
  children,
  className = "",
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: CardVariant;
}) {
  const v = CARD_VARIANTS[variant];
  return (
    <div
      className={`${v.gradient} ${v.border} ${v.glow ?? ""} border rounded-2xl p-4 ${className}`}
    >
      {children}
    </div>
  );
}

export function AdminButton({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}: React.ComponentProps<typeof Button> & { variant?: "default" | "outline" | "ghost" | "destructive" }) {
  const variants = {
    default:     "bg-gradient-to-r from-[#FC7166] to-[#FD8656] hover:opacity-90 text-white shadow-[0_8px_24px_-8px_rgba(252,113,102,0.6)]",
    outline:     "bg-[#0E0F14] border-[#FC7166]/30 text-white hover:bg-[#FC7166]/10 hover:text-white",
    ghost:       "bg-transparent text-white/70 hover:text-white hover:bg-[#FC7166]/10",
    destructive: "bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30 hover:text-red-400",
  };
  return (
    <Button
      size={size}
      className={`${variants[variant]} ${className}`}
      style={{ fontFamily: "var(--font-heading)" }}
      {...props}
    >
      {children}
    </Button>
  );
}

export function AdminInput(props: React.ComponentProps<typeof Input>) {
  return (
    <Input
      {...props}
      className={`bg-[#0E0F14] border-[#FC7166]/25 text-white placeholder:text-white/30 ${props.className ?? ""}`}
    />
  );
}

export function AdminLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <Label className={`text-white/80 text-xs font-bold uppercase tracking-wider ${className}`}>
      {children}
    </Label>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  color = "coral",
  trend,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color?: CardVariant;
  trend?: string;
}) {
  return (
    <AdminCard variant={color} className="relative overflow-hidden">
      {/* Decorative blob */}
      <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/5 blur-2xl pointer-events-none" />

      <div className="flex items-start justify-between mb-2 relative">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 text-white">
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <Badge className="text-[9px] font-mono bg-white/10 text-white border border-white/20">
            <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
            {trend}
          </Badge>
        )}
      </div>
      <div
        className="text-3xl font-black text-white leading-none"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
      <div className="text-xs text-white/70 font-bold uppercase tracking-wider mt-1">
        {label}
      </div>
    </AdminCard>
  );
}
