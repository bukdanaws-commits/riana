"use client";
import { useAdminStore } from "@/lib/admin-store";
import { getCityPricing, formatRupiah } from "@/data/pricing";
import { FileText, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { exportToExcel, exportToPDF } from "@/lib/export-utils";

export default function KotaPage() {
  const cities = useAdminStore((s) => s.cities);
  const EXPORT_COLS = [{ key: "city", label: "Kota" }, { key: "dateLabel", label: "Tanggal" }, { key: "venue", label: "Venue" }, { key: "capacity", label: "Capacity" }, { key: "registered", label: "Registered" }, { key: "status", label: "Status" }];

  return (<div className="space-y-4">
    <div className="flex items-center justify-between">
      <div><h1 className="text-3xl font-black text-[#0E0F14]" style={{ fontFamily: "var(--font-display)" }}>KOTA & HARGA</h1><p className="text-sm text-[#0E0F14]/50">{cities.length} kota tour</p></div>
      <div className="flex gap-2">
        <Button onClick={() => { exportToExcel(cities as unknown as Record<string, unknown>[], EXPORT_COLS, "kota-harga"); toast.success("Export Excel"); }} variant="outline" className="bg-white border-green-500/30 text-green-600"><FileSpreadsheet className="h-4 w-4 mr-1" /> Excel</Button>
        <Button onClick={() => { exportToPDF(cities as unknown as Record<string, unknown>[], EXPORT_COLS, "kota-harga", "Kota & Harga — Riana On The Move"); toast.success("Export PDF"); }} variant="outline" className="bg-white border-red-500/30 text-red-600"><FileText className="h-4 w-4 mr-1" /> PDF</Button>
      </div>
    </div>
    <div className="bg-white rounded-2xl border border-[#FC7166]/15 overflow-hidden">
      <div className="overflow-x-auto"><table className="w-full text-sm">
        <thead><tr className="border-b border-[#FC7166]/15 bg-[#FFF1ED]">
          <th className="text-left p-3 text-[#0E0F14]/60 font-bold uppercase text-[10px]">#</th><th className="text-left p-3 text-[#0E0F14]/60 font-bold uppercase text-[10px]">Kota</th>
          <th className="text-left p-3 text-[#0E0F14]/60 font-bold uppercase text-[10px]">Tanggal</th><th className="text-left p-3 text-[#0E0F14]/60 font-bold uppercase text-[10px] hidden md:table-cell">Venue</th>
          <th className="text-center p-3 text-[#0E0F14]/60 font-bold uppercase text-[10px]">Capacity</th><th className="text-center p-3 text-[#0E0F14]/60 font-bold uppercase text-[10px]">Registered</th>
          <th className="text-center p-3 text-[#0E0F14]/60 font-bold uppercase text-[10px]">VIP Price</th><th className="text-center p-3 text-[#0E0F14]/60 font-bold uppercase text-[10px]">Status</th>
        </tr></thead>
        <tbody>{cities.map((city, idx) => { const p = getCityPricing(city.id, city.date); return (
          <tr key={city.id} className="border-b border-[#FC7166]/8 hover:bg-[#FC7166]/5">
            <td className="p-3 text-[#0E0F14]/40 font-mono">{String(idx + 1).padStart(2, "0")}</td>
            <td className="p-3 font-bold text-[#0E0F14]">{city.city}</td><td className="p-3 text-[#0E0F14]/70 text-xs">{city.dateLabel}</td>
            <td className="p-3 text-[#0E0F14]/60 text-xs hidden md:table-cell">{city.venue}</td>
            <td className="p-3 text-center text-[#0E0F14]/70">{city.capacity}</td><td className="p-3 text-center font-bold text-[#0E0F14]">{city.registered}</td>
            <td className="p-3 text-center font-bold text-[#F39F23] text-xs">{formatRupiah(p.vip.price)}</td>
            <td className="p-3 text-center"><span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${city.status === "completed" ? "bg-[#F39F23]/20 text-[#C97D0E]" : city.status === "open" ? "bg-green-100 text-green-700" : "bg-[#FC7166]/15 text-[#FC7166]"}`}>{city.status === "completed" ? "Selesai" : city.status === "open" ? "Terbuka" : "Segera"}</span></td>
          </tr>); })}</tbody>
      </table></div>
    </div>
    <div className="bg-white rounded-2xl p-5 border border-[#FC7166]/15">
      <h2 className="text-lg font-black text-[#0E0F14] mb-3" style={{ fontFamily: "var(--font-display)" }}>TABEL HARGA VIP</h2>
      <div className="grid sm:grid-cols-3 gap-3">
        {[{ t: "Finale", k: "Jakarta", v: "Rp 350.000", e: "Rp 245.000", c: "from-[#FC7166] to-[#E54B40]" }, { t: "Tier 1", k: "Bandung, Bali, Surabaya, Medan", v: "Rp 250.000", e: "Rp 175.000", c: "from-[#FD8656] to-[#E56A1F]" }, { t: "Tier 2", k: "15 kota lainnya", v: "Rp 175.000", e: "Rp 122.500", c: "from-[#F39F23] to-[#C97D0E]" }].map((t) => (
          <div key={t.t} className={`p-4 rounded-2xl bg-gradient-to-br ${t.c} text-white shadow-md`}><div className="text-xs font-bold uppercase opacity-80">{t.t}</div><div className="text-sm font-bold mb-2">{t.k}</div><div className="space-y-1"><div className="flex justify-between text-xs"><span className="opacity-70">VIP</span><span className="font-bold">{t.v}</span></div><div className="flex justify-between text-xs"><span className="opacity-70">Early Bird</span><span className="font-bold">{t.e}</span></div></div></div>
        ))}
      </div>
    </div>
  </div>);
}
