"use client";

import { useState, useMemo } from "react";
import {
  Download, MapPin, Users, Star, TrendingUp, ChevronRight, QrCode,
  FileText, MessageSquare, X,
} from "lucide-react";
import { useAdminStore, type Registration } from "@/lib/admin-store";
import { AdminCard, AdminButton } from "../AdminDashboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/data/pricing";
import { toast } from "sonner";

export function RegistrationsByCityView() {
  const registrations = useAdminStore((s) => s.registrations);
  const cities = useAdminStore((s) => s.cities);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Group by city
  const cityStats = useMemo(() => {
    return cities.map((city) => {
      const cityRegs = registrations.filter((r) => r.eventCityId === city.id);
      return {
        city,
        total: cityRegs.length,
        regular: cityRegs.filter((r) => r.ticketType === "regular").length,
        vip: cityRegs.filter((r) => r.ticketType === "vip").length,
        checkedIn: cityRegs.filter((r) => r.status === "checked_in").length,
        revenue: cityRegs
          .filter((r) => r.paymentStatus === "paid")
          .reduce((sum, r) => sum + (r.paymentAmount ?? 0), 0),
        checkInRate: cityRegs.length > 0
          ? Math.round((cityRegs.filter((r) => r.status === "checked_in").length / cityRegs.length) * 100)
          : 0,
      };
    });
  }, [registrations, cities]);

  // If city selected, show detail
  if (selectedCity) {
    const city = cities.find((c) => c.id === selectedCity);
    if (city) {
      return (
        <CityDetail
          cityId={selectedCity}
          cityName={city.city}
          onBack={() => setSelectedCity(null)}
        />
      );
    }
  }

  const totalReg = cityStats.reduce((s, c) => s + c.total, 0);
  const totalCheckedIn = cityStats.reduce((s, c) => s + c.checkedIn, 0);
  const totalVip = cityStats.reduce((s, c) => s + c.vip, 0);
  const totalRevenue = cityStats.reduce((s, c) => s + c.revenue, 0);

  return (
    <div className="space-y-4">
      {/* === STATS === */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Users} label="Total Peserta" value={totalReg} color="magenta" />
        <StatCard icon={TrendingUp} label="Total Checked-in" value={totalCheckedIn} color="green" />
        <StatCard icon={Star} label="Total VIP" value={totalVip} color="gold" />
        <StatCard icon={TrendingUp} label="Total Revenue" value={formatRupiah(totalRevenue)} color="orange" small />
      </div>

      {/* === TABLE PER KOTA === */}
      <AdminCard className="p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-[#FC7166]/20 bg-[#0E0F14]/30">
          <h3
            className="text-base font-black text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            PESERTA PER KOTA ({cities.length} kota)
          </h3>
          <p className="text-xs text-white/60 mt-0.5">
            Klik row untuk detail peserta per kota, atau klik tombol Export untuk download CSV.
          </p>
        </div>
        <div className="overflow-x-auto custom-scroll">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#FC7166]/20 bg-[#0E0F14]/50">
                <th className="text-left p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider">#</th>
                <th className="text-left p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider">Kota</th>
                <th className="text-left p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider hidden md:table-cell">Tanggal Event</th>
                <th className="text-center p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider">Total</th>
                <th className="text-center p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider hidden sm:table-cell">Regular</th>
                <th className="text-center p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider">VIP</th>
                <th className="text-center p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider">Checked-in</th>
                <th className="text-center p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider hidden lg:table-cell">Revenue</th>
                <th className="text-right p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {cityStats.map((stat, idx) => (
                <tr
                  key={stat.city.id}
                  className="border-b border-[#FC7166]/10 hover:bg-[#FC7166]/5 cursor-pointer transition-colors"
                  onClick={() => setSelectedCity(stat.city.id)}
                >
                  <td className="p-3 text-white/50 font-mono text-xs">{String(idx + 1).padStart(2, "0")}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#FC7166]" />
                      <div>
                        <div className="font-bold text-white">{stat.city.city}</div>
                        <div className="text-[10px] text-white/50">{stat.city.venue}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-white/70 text-xs hidden md:table-cell font-mono">
                    {stat.city.dateLabel}
                  </td>
                  <td className="p-3 text-center font-bold text-white">{stat.total}</td>
                  <td className="p-3 text-center text-white/70 hidden sm:table-cell">{stat.regular}</td>
                  <td className="p-3 text-center">
                    <Badge className="bg-[#F39F23]/20 text-[#FFB938] border-gold/30 text-[10px]">{stat.vip}</Badge>
                  </td>
                  <td className="p-3 text-center">
                    <div className="text-white font-bold">{stat.checkedIn}</div>
                    <div className="text-[9px] text-white/50 font-mono">{stat.checkInRate}%</div>
                  </td>
                  <td className="p-3 text-center text-white/70 hidden lg:table-cell font-mono text-xs">
                    {stat.revenue > 0 ? formatRupiah(stat.revenue) : "—"}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-white/60 hover:text-[#FF8A80]"
                        onClick={(e) => {
                          e.stopPropagation();
                          exportCityCSV(stat.city.id, stat.city.city, registrations);
                        }}
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                      <ChevronRight className="h-4 w-4 text-white/40" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-[#FC7166]/30 bg-[#FC7166]/5">
                <td colSpan={3} className="p-3 font-bold text-white">TOTAL</td>
                <td className="p-3 text-center font-black text-white">{totalReg}</td>
                <td className="p-3 text-center font-bold text-white/70 hidden sm:table-cell">
                  {cityStats.reduce((s, c) => s + c.regular, 0)}
                </td>
                <td className="p-3 text-center">
                  <Badge className="bg-[#F39F23]/20 text-[#FFB938] border-gold/30">{totalVip}</Badge>
                </td>
                <td className="p-3 text-center font-black text-white">{totalCheckedIn}</td>
                <td className="p-3 text-center font-black text-white hidden lg:table-cell font-mono text-xs">
                  {formatRupiah(totalRevenue)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </AdminCard>

      <div className="text-xs text-white/50 px-2">
        💡 <span className="text-white/70">Tip:</span> Klik row kota untuk melihat detail peserta + demografi + export QR code PDF + WhatsApp broadcast template.
      </div>
    </div>
  );
}

// ============================================================
// City Detail View
// ============================================================
function CityDetail({
  cityId, cityName, onBack,
}: {
  cityId: string;
  cityName: string;
  onBack: () => void;
}) {
  const registrations = useAdminStore((s) => s.registrations);
  const cityRegs = useMemo(
    () => registrations.filter((r) => r.eventCityId === cityId),
    [registrations, cityId]
  );

  // Demografi
  const demografi = useMemo(() => {
    const total = cityRegs.length;
    const female = cityRegs.filter((r) => r.gender === "P").length;
    const male = cityRegs.filter((r) => r.gender === "L").length;
    const avgAge = total > 0 ? Math.round(cityRegs.reduce((s, r) => s + r.age, 0) / total) : 0;

    const sources = cityRegs.reduce<Record<string, number>>((acc, r) => {
      const src = r.referralSource ?? "other";
      acc[src] = (acc[src] ?? 0) + 1;
      return acc;
    }, {});
    const topSource = Object.entries(sources).sort((a, b) => b[1] - a[1])[0];

    return {
      total, female, male, avgAge,
      femalePct: total > 0 ? Math.round((female / total) * 100) : 0,
      malePct: total > 0 ? Math.round((male / total) * 100) : 0,
      topSource: topSource ? `${topSource[0]} (${topSource[1]})` : "—",
    };
  }, [cityRegs]);

  return (
    <div className="space-y-4">
      {/* === HEADER === */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="bg-[#0E0F14] border-[#FC7166]/30 text-white hover:bg-[#FC7166]/10"
        >
          <X className="h-4 w-4 mr-1" /> Kembali
        </Button>
        <div>
          <h2
            className="text-2xl font-black text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            PESERTA: {cityName.toUpperCase()}
          </h2>
          <p className="text-xs text-white/60">{cityRegs.length} peserta terdaftar</p>
        </div>
      </div>

      {/* === DEMOGRAFI === */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Users} label="Perempuan" value={`${demografi.female} (${demografi.femalePct}%)`} color="magenta" small />
        <StatCard icon={Users} label="Laki-laki" value={`${demografi.male} (${demografi.malePct}%)`} color="orange" small />
        <StatCard icon={TrendingUp} label="Rata-rata Usia" value={`${demografi.avgAge} thn`} color="gold" small />
        <StatCard icon={Star} label="Top Source" value={demografi.topSource} color="green" small />
      </div>

      {/* === EXPORT OPTIONS === */}
      <AdminCard>
        <h3
          className="text-sm font-black text-white mb-3 flex items-center gap-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <Download className="h-4 w-4 text-[#FF8A80]" />
          EXPORT OPTIONS
        </h3>
        <div className="flex flex-wrap gap-2">
          <AdminButton onClick={() => exportCityCSV(cityId, cityName, registrations)}>
            <FileText className="h-4 w-4 mr-1" />
            Export CSV ({cityRegs.length} rows)
          </AdminButton>
          <AdminButton variant="outline" onClick={() => toast.info("QR Code PDF generation akan tersedia di phase 2 (real backend).")}>
            <QrCode className="h-4 w-4 mr-1" />
            Export QR Codes PDF
          </AdminButton>
          <AdminButton variant="outline" onClick={() => toast.info("WhatsApp broadcast template akan tersedia di phase 2.")}>
            <MessageSquare className="h-4 w-4 mr-1" />
            WhatsApp Broadcast Template
          </AdminButton>
        </div>
      </AdminCard>

      {/* === LIST PESERTA === */}
      <AdminCard className="p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-[#FC7166]/20 bg-[#0E0F14]/30">
          <h3
            className="text-sm font-black text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            LIST PESERTA ({cityRegs.length})
          </h3>
        </div>
        <div className="overflow-x-auto custom-scroll max-h-[500px]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[#181A22]">
              <tr className="border-b border-[#FC7166]/20">
                <th className="text-left p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider">ID</th>
                <th className="text-left p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider">Nama</th>
                <th className="text-left p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider hidden md:table-cell">Phone</th>
                <th className="text-center p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider">Tiket</th>
                <th className="text-center p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {cityRegs.map((r) => (
                <tr key={r.id} className="border-b border-[#FC7166]/10 hover:bg-[#FC7166]/5">
                  <td className="p-3 font-mono text-[10px] text-white/60">{r.id}</td>
                  <td className="p-3">
                    <div className="font-bold text-white text-sm">{r.fullName}</div>
                    <div className="text-[10px] text-white/50">{r.googleEmail}</div>
                  </td>
                  <td className="p-3 text-white/70 text-xs hidden md:table-cell font-mono">{r.phone}</td>
                  <td className="p-3 text-center">
                    {r.ticketType === "vip" ? (
                      <Badge className="bg-[#F39F23]/20 text-[#FFB938] border-gold/30 text-[9px]">VIP</Badge>
                    ) : (
                      <Badge className="bg-[#FC7166]/15 text-[#FF8A80] border-[#FC7166]/30 text-[9px]">REG</Badge>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`text-[10px] font-bold ${
                      r.status === "checked_in" ? "text-green-400" :
                      r.status === "registered" ? "text-blue-400" :
                      r.status === "cancelled" ? "text-red-400" :
                      "text-orange-400"
                    }`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
              {cityRegs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-white/40">
                    Belum ada peserta di kota ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}

// ============================================================
// Helper: Export CSV per kota
// ============================================================
function exportCityCSV(cityId: string, cityName: string, registrations: Registration[]) {
  const cityRegs = registrations.filter((r) => r.eventCityId === cityId);
  const headers = [
    "ID", "Tgl Daftar", "Nama", "Email", "Phone", "Gender", "Usia",
    "Alamat", "Tipe Tiket", "Harga", "Status Bayar", "Status Hadir",
    "Referral Code", "Check-in Time",
  ];
  const rows = cityRegs.map((r) => [
    r.id, r.registrationDate, r.fullName, r.googleEmail, r.phone, r.gender, r.age,
    r.address, r.ticketType, r.ticketPrice, r.paymentStatus, r.status,
    r.referralCode, r.checkInTime ?? "",
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `peserta-${cityName.toLowerCase()}-${cityRegs.length}-rows.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success(`Exported ${cityRegs.length} peserta ${cityName} ke CSV.`);
}

// ============================================================
// StatCard helper
// ============================================================
function StatCard({
  icon: Icon, label, value, color = "magenta", small = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color?: "magenta" | "gold" | "green" | "orange";
  small?: boolean;
}) {
  const colors = {
    magenta: "bg-[#FC7166]/15 text-[#FF8A80] border-[#FC7166]/30",
    gold: "bg-[#F39F23]/15 text-[#FFB938] border-gold/30",
    green: "bg-green-500/15 text-green-400 border-green-500/30",
    orange: "bg-[#FD8656]/15 text-[#FFA577] border-orange-brand/30",
  };
  return (
    <AdminCard className="relative overflow-hidden">
      <div className="flex items-start justify-between mb-2">
        <div className={`h-9 w-9 rounded-xl flex items-center justify-center border ${colors[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div
        className={`font-black text-white leading-none ${small ? "text-base" : "text-2xl"}`}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
      <div className="text-[10px] text-white/60 font-bold uppercase tracking-wider mt-1">
        {label}
      </div>
    </AdminCard>
  );
}
