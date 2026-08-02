"use client";
import { useMemo } from "react";
import { useAdminStore, useRegistrations } from "@/lib/admin-store";
import { PARTNERS } from "@/data/event";
import { formatRupiah } from "@/data/pricing";
import { DollarSign, TrendingUp, TrendingDown, Wallet, FileText, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { exportToExcel, exportSummaryPDF } from "@/lib/export-utils";

export default function RevenuePage() {
  const registrations = useRegistrations();
  const cities = useAdminStore((s) => s.cities);

  const revenue = useMemo(() => {
    const ticket = registrations
      .filter((r) => r.paymentStatus === "paid" && r.ticketType === "vip")
      .reduce((s, r) => s + (r.paymentAmount ?? 0), 0);
    const merch = Math.round(
      (registrations.filter((r) => r.ticketType === "vip").length * 0.3 +
        registrations.filter((r) => r.ticketType === "regular").length * 0.05) * 125000
    );
    const sponsor = PARTNERS.reduce(
      (s, p) => s + (p.tier === "Platinum" ? 500000000 : p.tier === "Gold" ? 175000000 : p.tier === "Silver" ? 65000000 : 0),
      0
    );
    const gross = ticket + merch + sponsor;
    const gateway = Math.round(ticket * 0.025);
    const ppn = Math.round((ticket + merch) * 0.11);
    const net = gross - gateway - ppn;
    const cost = 1739675000;
    const profit = net - cost;
    const margin = gross > 0 ? (profit / gross) * 100 : 0;
    return { ticket, merch, sponsor, gross, gateway, ppn, net, cost, profit, margin };
  }, [registrations]);

  const byCity = useMemo(() =>
    cities
      .map((c) => {
        const r = registrations.filter((r) => r.eventCityId === c.id);
        const t = r
          .filter((r) => r.paymentStatus === "paid" && r.ticketType === "vip")
          .reduce((s, r) => s + (r.paymentAmount ?? 0), 0);
        return { city: c.city, ticket: t, total: t };
      })
      .sort((a, b) => b.total - a.total),
    [registrations, cities]
  );

  const handleExportExcel = () => {
    exportToExcel(
      byCity as unknown as Record<string, unknown>[],
      [{ key: "city", label: "Kota" }, { key: "ticket", label: "Revenue" }, { key: "total", label: "Total" }],
      "revenue-by-city"
    );
    toast.success("Export Excel");
  };

  const handleExportPDF = () => {
    exportSummaryPDF(
      [
        { label: "Gross Revenue", value: formatRupiah(revenue.gross) },
        { label: "Net Revenue", value: formatRupiah(revenue.net) },
        { label: "Total Cost", value: formatRupiah(revenue.cost) },
        { label: "Net Profit", value: formatRupiah(revenue.profit) },
        { label: "Margin", value: `${revenue.margin.toFixed(1)}%` },
      ],
      byCity as unknown as Record<string, unknown>[],
      [{ key: "city", label: "Kota" }, { key: "total", label: "Revenue" }],
      "revenue-report",
      "Revenue Report — Riana On The Move"
    );
    toast.success("Export PDF");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>REVENUE</h1>
          <p className="text-sm text-white/50">Pendapatan & profit</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportExcel} variant="outline" className="bg-[#2A2D38] border-green-500/30 text-green-400 hover:bg-green-500/10">
            <FileSpreadsheet className="h-4 w-4 mr-1" /> Excel
          </Button>
          <Button onClick={handleExportPDF} variant="outline" className="bg-[#2A2D38] border-red-500/30 text-red-400 hover:bg-red-500/10">
            <FileText className="h-4 w-4 mr-1" /> PDF
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { i: DollarSign, l: "Gross", v: formatRupiah(revenue.gross), c: "from-[#FC7166] to-[#E54B40]" },
          { i: Wallet, l: "Net", v: formatRupiah(revenue.net), c: "from-[#FD8656] to-[#E56A1F]" },
          { i: TrendingDown, l: "Cost", v: formatRupiah(revenue.cost), c: "from-[#884D3E] to-[#51343F]" },
          { i: TrendingUp, l: "Profit", v: formatRupiah(revenue.profit), c: "from-green-500 to-green-600", s: `Margin ${revenue.margin.toFixed(1)}%` },
        ].map((s) => (
          <div key={s.l} className={`p-4 rounded-2xl bg-gradient-to-br ${s.c} text-white shadow-lg`}>
            <s.i className="h-6 w-6 mb-2 opacity-80" />
            <div className="text-xl font-black" style={{ fontFamily: "var(--font-display)" }}>{s.v}</div>
            <div className="text-xs uppercase font-bold opacity-80">{s.l}</div>
            {s.s && <div className="text-[10px] opacity-60 mt-1">{s.s}</div>}
          </div>
        ))}
      </div>

      {/* Revenue by source */}
      <div className="bg-[#2A2D38] rounded-2xl p-5 shadow-lg border border-[#FC7166]/15">
        <h2 className="text-lg font-black text-white mb-3" style={{ fontFamily: "var(--font-display)" }}>
          REVENUE BY SOURCE
        </h2>
        <div className="space-y-3">
          {[
            { s: "Tiket VIP", a: revenue.ticket, c: "bg-[#FC7166]" },
            { s: "Merchandise", a: revenue.merch, c: "bg-[#FD8656]" },
            { s: "Sponsorship", a: revenue.sponsor, c: "bg-[#F39F23]" },
          ].map((src) => {
            const p = revenue.gross > 0 ? (src.a / revenue.gross) * 100 : 0;
            return (
              <div key={src.s}>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="font-bold text-white">{src.s}</span>
                  <span className="text-white/60 font-mono">{formatRupiah(src.a)} ({p.toFixed(1)}%)</span>
                </div>
                <div className="h-3 bg-[#0E0F14] rounded-full overflow-hidden border border-white/5">
                  <div className={`h-full ${src.c} rounded-full transition-all duration-500`} style={{ width: `${p}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue by city */}
      <div className="bg-[#2A2D38] rounded-2xl p-5 shadow-lg border border-[#FC7166]/15">
        <h2 className="text-lg font-black text-white mb-3" style={{ fontFamily: "var(--font-display)" }}>
          REVENUE BY CITY
        </h2>
        <div className="space-y-2">
          {byCity.filter((c) => c.total > 0).slice(0, 10).map((c, i) => {
            const max = Math.max(...byCity.map((x) => x.total), 1);
            return (
              <div key={c.city} className="flex items-center gap-3">
                <span className="text-xs text-white/30 font-mono w-6">{i + 1}</span>
                <span className="text-sm font-bold text-white w-24">{c.city}</span>
                <div className="flex-1 h-6 bg-[#0E0F14] rounded-lg overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-[#FC7166] to-[#FD8656] flex items-center justify-end px-2 transition-all duration-500"
                    style={{ width: `${(c.total / max) * 100}%` }}
                  >
                    <span className="text-[10px] text-white font-bold font-mono">{formatRupiah(c.total)}</span>
                  </div>
                </div>
              </div>
            );
          })}
          {byCity.every((c) => c.total === 0) && (
            <div className="text-center py-8 text-white/40 text-sm">
              Belum ada revenue tercatat.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
