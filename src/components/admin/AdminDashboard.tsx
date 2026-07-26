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
import { CitiesView } from "./views/CitiesView";
import { TestimonialsView } from "./views/TestimonialsView";
import { PartnersView } from "./views/PartnersView";
import { FaqView } from "./views/FaqView";
import { GalleryView } from "./views/GalleryView";
import { RianaView } from "./views/RianaView";
import { SettingsView } from "./views/SettingsView";

const NAV_ITEMS: { id: AdminView; label: string; icon: React.ElementType }[] = [
  { id: "dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { id: "cities",       label: "20 Kota",      icon: MapPin },
  { id: "testimonials", label: "Testimoni",    icon: Star },
  { id: "partners",     label: "Partner",      icon: Handshake },
  { id: "faq",          label: "FAQ",          icon: HelpCircle },
  { id: "gallery",      label: "Galeri",       icon: Image },
  { id: "riana",        label: "Profil Riana", icon: User },
  { id: "settings",     label: "Settings",     icon: Settings },
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
      <DialogContent className="max-w-[95vw] w-[1400px] max-h-[95vh] h-[95vh] p-0 overflow-hidden bg-purpleblack border border-magenta/30">
        <div className="flex h-full">
          {/* === SIDEBAR === */}
          <aside className="w-64 flex-shrink-0 bg-purple-dark border-r border-magenta/20 flex flex-col">
            {/* Logo */}
            <div className="p-4 border-b border-magenta/20 flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-magenta flex items-center justify-center shadow-glow-pink">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div>
                <div
                  className="text-base font-black tracking-wider text-cream"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  RIANA ADMIN
                </div>
                <div className="text-[9px] text-gold-light font-bold tracking-[0.2em]">
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
                        ? "bg-magenta text-white shadow-glow-pink"
                        : "text-cream/70 hover:text-cream hover:bg-magenta/10"
                    }`}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-magenta/20 space-y-2">
              <Button
                onClick={handleClose}
                variant="outline"
                size="sm"
                className="w-full bg-purpleblack border-magenta/30 text-cream hover:bg-magenta/10 hover:text-cream justify-start"
              >
                <X className="h-4 w-4 mr-2" />
                Tutup Admin
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="w-full bg-purpleblack border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-400 justify-start"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </aside>

          {/* === MAIN CONTENT === */}
          <main className="flex-1 overflow-hidden flex flex-col">
            {/* Header */}
            <header className="px-6 py-3 border-b border-magenta/20 bg-purple-dark flex items-center justify-between flex-shrink-0">
              <div>
                <h1
                  className="text-2xl font-black text-cream leading-none"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {NAV_ITEMS.find((n) => n.id === activeView)?.label.toUpperCase()}
                </h1>
                <p className="text-xs text-cream/50 mt-0.5">
                  Edit data — perubahan langsung reflect ke landing page
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <span className="relative flex h-1.5 w-1.5 mr-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
                  </span>
                  LIVE SYNC
                </Badge>
                <Badge className="bg-gold/20 text-gold-light border-gold/30 font-mono">
                  v2.0
                </Badge>
              </div>
            </header>

            {/* View content */}
            <div className="flex-1 overflow-y-auto custom-scroll p-6">
              {activeView === "dashboard" && <DashboardView />}
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
// Reusable components
// ============================================================
export function AdminCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-purple-dark border border-magenta/20 rounded-2xl p-4 ${className}`}
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
    default: "bg-magenta hover:bg-magenta-deep text-white shadow-glow-pink",
    outline: "bg-purpleblack border-magenta/30 text-cream hover:bg-magenta/10 hover:text-cream",
    ghost: "bg-transparent text-cream/70 hover:text-cream hover:bg-magenta/10",
    destructive: "bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30 hover:text-red-400",
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
      className={`bg-purpleblack border-magenta/25 text-cream placeholder:text-cream/30 ${props.className ?? ""}`}
    />
  );
}

export function AdminLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <Label className={`text-cream/80 text-xs font-bold uppercase tracking-wider ${className}`}>
      {children}
    </Label>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  color = "magenta",
  trend,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color?: "magenta" | "gold" | "green" | "orange";
  trend?: string;
}) {
  const colors = {
    magenta: "bg-magenta/15 text-magenta-light border-magenta/30",
    gold: "bg-gold/15 text-gold-light border-gold/30",
    green: "bg-green-500/15 text-green-400 border-green-500/30",
    orange: "bg-orange-brand/15 text-orange-light border-orange-brand/30",
  };
  return (
    <AdminCard className="relative overflow-hidden">
      <div className="flex items-start justify-between mb-2">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${colors[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <Badge className={`text-[9px] font-mono ${colors[color]} border-0`}>
            <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
            {trend}
          </Badge>
        )}
      </div>
      <div
        className="text-3xl font-black text-cream leading-none"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
      <div className="text-xs text-cream/60 font-bold uppercase tracking-wider mt-1">
        {label}
      </div>
    </AdminCard>
  );
}
