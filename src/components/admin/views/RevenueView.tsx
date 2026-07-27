"use client";

import { useMemo } from "react";
import {
  DollarSign, TrendingUp, TrendingDown, Wallet, PieChart,
  BarChart3, ArrowUpRight, ArrowDownRight, Download,
} from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import { AdminCard, AdminButton } from "../AdminDashboard";
import { formatRupiah } from "@/data/pricing";
import { PARTNERS } from "@/data/event";
import { toast } from "sonner";

export function RevenueView() {
  const registrations = useAdminStore((s) => s.registrations);
  const cities = useAdminStore((s) => s.cities);

  // === CALCULATIONS ===
  const revenue = useMemo(() => {
    // Ticket revenue (from paid VIP registrations)
    const ticketRevenue = registrations
      .filter((r) => r.paymentStatus === "paid" && r.ticketType === "vip")
      .reduce((sum, r) => sum + (r.paymentAmount ?? 0), 0);

    // Merchandise revenue (estimated: 30% of VIP buy merch, 5% of regular)
    const vipMerchBuyers = registrations.filter((r) => r.ticketType === "vip").length * 0.3;
    const regMerchBuyers = registrations.filter((r) => r.ticketType === "regular").length * 0.05;
    const merchRevenue = Math.round((vipMerchBuyers + regMerchBuyers) * 125000); // avg Rp 125K per merch

    // Sponsorship revenue (from partners data)
    const sponsorshipRevenue = PARTNERS.reduce((sum, p) => {
      if (p.tier === "Platinum") return sum + 500_000_000;
      if (p.tier === "Gold") return sum + 175_000_000;
      if (p.tier === "Silver") return sum + 65_000_000;
      return sum; // Media Partner = in-kind, no cash
    }, 0);

    const grossRevenue = ticketRevenue + merchRevenue + sponsorshipRevenue;

    // Payment gateway fee (2.5% of ticket revenue)
    const gatewayFee = Math.round(ticketRevenue * 0.025);
    // PPN 11% (from ticket + merch revenue, sponsorship is tax-inclusive)
    const ppn = Math.round((ticketRevenue + merchRevenue) * 0.11);

    const netRevenue = grossRevenue - gatewayFee - ppn;

    // Costs (estimated)
    const costs = {
      venue: 400_000_000,           // 20 kota venue rental
      soundLighting: 250_000_000,   // sound + lighting system
      stepBoard: 150_000_000,       // step board sewa/beli
      merchandise: 150_000_000,     // merchandise production
      rianaCrew: 300_000_000,       // Riana fee + crew
      marketing: 200_000_000,       // marketing & ads
      muriFee: 25_000_000,          // MURI verification
      photoVideo: 100_000_000,      // photography & video
      insurance: 50_000_000,        // insurance & permit
      gatewayFee,
      ppn,
    };
    const totalCost = Object.values(costs).reduce((s, c) => s + c, 0);

    const netProfit = netRevenue - totalCost;
    const profitMargin = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;

    // Revenue by city
    const byCity = cities.map((city) => {
      const cityRegs = registrations.filter((r) => r.eventCityId === city.id);
      const cityTicketRev = cityRegs
        .filter((r) => r.paymentStatus === "paid" && r.ticketType === "vip")
        .reduce((sum, r) => sum + (r.paymentAmount ?? 0), 0);
      const cityVipCount = cityRegs.filter((r) => r.ticketType === "vip").length;
      const cityMerchRev = Math.round(
        (cityRegs.filter((r) => r.ticketType === "vip").length * 0.3 +
          cityRegs.filter((r) => r.ticketType === "regular").length * 0.05) * 125000
      );
      return {
        city: city.city,
        ticketRevenue: cityTicketRev,
        merchRevenue: cityMerchRev,
        total: cityTicketRev + cityMerchRev,
        vipCount: cityVipCount,
        totalRegs: cityRegs.length,
      };
    }).sort((a, b) => b.total - a.total);

    // Revenue by source
    const bySource = [
      { source: "Tiket VIP", amount: ticketRevenue, color: "bg-[#FC7166]" },
      { source: "Merchandise", amount: merchRevenue, color: "bg-[#FD8656]" },
      { source: "Sponsorship", amount: sponsorshipRevenue, color: "bg-[#F39F23]" },
    ];

    return {
      ticketRevenue,
      merchRevenue,
      sponsorshipRevenue,
      grossRevenue,
      gatewayFee,
      ppn,
      netRevenue,
      costs,
      totalCost,
      netProfit,
      profitMargin,
      byCity,
      bySource,
    };
  }, [registrations, cities]);

  const handleExport = () => {
    const csv = [
      ["REVENUE REPORT - Riana On The Move 2026"],
      [""],
      ["SUMMARY"],
      ["Gross Revenue", revenue.grossRevenue],
      ["Payment Gateway Fee (2.5%)", revenue.gatewayFee],
      ["PPN (11%)", revenue.ppn],
      ["Net Revenue", revenue.netRevenue],
      ["Total Cost", revenue.totalCost],
      ["Net Profit", revenue.netProfit],
      ["Profit Margin %", revenue.profitMargin.toFixed(2) + "%"],
      [""],
      ["REVENUE BY SOURCE"],
      ["Tiket VIP", revenue.ticketRevenue],
      ["Merchandise", revenue.merchRevenue],
      ["Sponsorship", revenue.sponsorshipRevenue],
      [""],
      ["REVENUE BY CITY"],
      ["Kota", "Tiket VIP", "Merchandise", "Total"],
      ...revenue.byCity.map((c) => [c.city, c.ticketRevenue, c.merchRevenue, c.total]),
      [""],
      ["COST BREAKDOWN"],
      ...Object.entries(revenue.costs).map(([k, v]) => [k, v]),
    ];
    const csvText = csv.map((row) => row.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csvText], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revenue-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Revenue report exported ke CSV.");
  };

  const maxCityRevenue = Math.max(...revenue.byCity.map((c) => c.total), 1);

  return (
    <div className="space-y-4">
      {/* === TOP STATS === */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <BigStat
          icon={DollarSign}
          label="Gross Revenue"
          value={formatRupiah(revenue.grossRevenue)}
          color="magenta"
        />
        <BigStat
          icon={Wallet}
          label="Net Revenue"
          value={formatRupiah(revenue.netRevenue)}
          sub={`- ${formatRupiah(revenue.gatewayFee + revenue.ppn)} (fee+PPN)`}
          color="orange"
        />
        <BigStat
          icon={TrendingDown}
          label="Total Cost"
          value={formatRupiah(revenue.totalCost)}
          color="red"
        />
        <BigStat
          icon={TrendingUp}
          label="Net Profit"
          value={formatRupiah(revenue.netProfit)}
          sub={`Margin ${revenue.profitMargin.toFixed(1)}%`}
          color="green"
        />
      </div>

      {/* === REVENUE BY SOURCE === */}
      <div className="grid lg:grid-cols-2 gap-4">
        <AdminCard>
          <h3
            className="text-base font-black text-white mb-3 flex items-center gap-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <PieChart className="h-4 w-4 text-[#FF8A80]" />
            REVENUE BY SOURCE
          </h3>
          <div className="space-y-3">
            {revenue.bySource.map((src) => {
              const pct = (src.amount / revenue.grossRevenue) * 100;
              return (
                <div key={src.source}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white font-bold">{src.source}</span>
                    <span className="text-sm text-white/70 font-mono">
                      {formatRupiah(src.amount)} ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#0E0F14] overflow-hidden">
                    <div
                      className={`h-full ${src.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </AdminCard>

        {/* === COST BREAKDOWN === */}
        <AdminCard>
          <h3
            className="text-base font-black text-white mb-3 flex items-center gap-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <BarChart3 className="h-4 w-4 text-[#FFA577]" />
            COST BREAKDOWN
          </h3>
          <div className="space-y-2">
            {Object.entries(revenue.costs).map(([cat, amount]) => {
              const pct = (amount / revenue.totalCost) * 100;
              return (
                <div key={cat} className="flex items-center justify-between text-xs">
                  <span className="text-white/70 capitalize">{cat.replace(/([A-Z])/g, " $1").trim()}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-[#0E0F14] overflow-hidden">
                      <div
                        className="h-full bg-[#FD8656] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-white font-mono w-24 text-right">{formatRupiah(amount)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </AdminCard>
      </div>

      {/* === REVENUE BY CITY === */}
      <AdminCard>
        <div className="flex items-center justify-between mb-3">
          <h3
            className="text-base font-black text-white flex items-center gap-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <BarChart3 className="h-4 w-4 text-[#FFB938]" />
            REVENUE BY CITY (Top Performing)
          </h3>
          <AdminButton size="sm" onClick={handleExport}>
            <Download className="h-3.5 w-3.5 mr-1" />
            Export Report
          </AdminButton>
        </div>
        <div className="space-y-2">
          {revenue.byCity.slice(0, 10).map((c, idx) => (
            <div key={c.city} className="flex items-center gap-3">
              <div className="text-xs text-white/50 font-mono w-6">{String(idx + 1).padStart(2, "0")}</div>
              <div className="text-sm text-white font-bold w-24 truncate">{c.city}</div>
              <div className="flex-1">
                <div className="h-6 rounded-lg bg-[#0E0F14] overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-magenta to-orange-brand rounded-lg flex items-center justify-end px-2 transition-all duration-500"
                    style={{ width: `${(c.total / maxCityRevenue) * 100}%` }}
                  >
                    <span className="text-[10px] text-white font-bold font-mono">
                      {formatRupiah(c.total)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-white/50 font-mono w-20 text-right">
                {c.vipCount} VIP / {c.totalRegs} reg
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* === DETAILED TABLE === */}
      <AdminCard className="p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-[#FC7166]/20 bg-[#0E0F14]/30">
          <h3
            className="text-sm font-black text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            REVENUE DETAIL PER KOTA
          </h3>
        </div>
        <div className="overflow-x-auto custom-scroll">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#FC7166]/20 bg-[#0E0F14]/50">
                <th className="text-left p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider">Kota</th>
                <th className="text-center p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider">Total Peserta</th>
                <th className="text-center p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider">VIP Count</th>
                <th className="text-right p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider">Tiket Revenue</th>
                <th className="text-right p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider">Merch Revenue</th>
                <th className="text-right p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {revenue.byCity.map((c) => (
                <tr key={c.city} className="border-b border-[#FC7166]/10 hover:bg-[#FC7166]/5">
                  <td className="p-3 font-bold text-white">{c.city}</td>
                  <td className="p-3 text-center text-white/70">{c.totalRegs}</td>
                  <td className="p-3 text-center text-white/70">{c.vipCount}</td>
                  <td className="p-3 text-right text-white/70 font-mono text-xs">{formatRupiah(c.ticketRevenue)}</td>
                  <td className="p-3 text-right text-white/70 font-mono text-xs">{formatRupiah(c.merchRevenue)}</td>
                  <td className="p-3 text-right font-bold text-white font-mono text-xs">{formatRupiah(c.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-[#FC7166]/30 bg-[#FC7166]/5">
                <td colSpan={3} className="p-3 font-bold text-white">TOTAL</td>
                <td className="p-3 text-right font-bold text-white font-mono text-xs">{formatRupiah(revenue.ticketRevenue)}</td>
                <td className="p-3 text-right font-bold text-white font-mono text-xs">{formatRupiah(revenue.merchRevenue)}</td>
                <td className="p-3 text-right font-black text-white font-mono text-xs">
                  {formatRupiah(revenue.ticketRevenue + revenue.merchRevenue)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </AdminCard>

      <div className="text-xs text-white/50 px-2">
        💡 <span className="text-white/70">Catatan:</span> Merchandise revenue adalah estimasi (30% VIP + 5% Regular membeli merch rata-rata Rp 125K). Sponsorship berdasarkan data partner Platinum (Rp 500jt) / Gold (Rp 175jt) / Silver (Rp 65jt). Cost adalah estimasi proyeksi untuk 20 kota.
      </div>
    </div>
  );
}

// ============================================================
// Helper
// ============================================================
function BigStat({
  icon: Icon, label, value, sub, color = "magenta",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color?: "magenta" | "gold" | "green" | "orange" | "red";
}) {
  const colors = {
    magenta: "bg-[#FC7166]/15 text-[#FF8A80] border-[#FC7166]/30",
    gold: "bg-[#F39F23]/15 text-[#FFB938] border-gold/30",
    green: "bg-green-500/15 text-green-400 border-green-500/30",
    orange: "bg-[#FD8656]/15 text-[#FFA577] border-orange-brand/30",
    red: "bg-red-500/15 text-red-400 border-red-500/30",
  };
  return (
    <AdminCard className="relative overflow-hidden">
      <div className="flex items-start justify-between mb-2">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${colors[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div
        className="text-xl lg:text-2xl font-black text-white leading-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
      <div className="text-[10px] text-white/60 font-bold uppercase tracking-wider mt-1">
        {label}
      </div>
      {sub && <div className="text-[10px] text-white/50 mt-0.5 font-mono">{sub}</div>}
    </AdminCard>
  );
}
