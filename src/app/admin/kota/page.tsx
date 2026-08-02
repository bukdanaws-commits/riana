"use client";
import { useState, useEffect, useMemo } from "react";
import {
  FileText, FileSpreadsheet, Plus, Edit2, Trash2, Save, X,
  MapPin, Calendar, Building2, Users, Trophy, Tag, DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { exportToExcel, exportToPDF } from "@/lib/export-utils";
import { formatRupiah } from "@/data/pricing";

// ============================================================
// Type definitions — match Supabase cities table
// ============================================================
interface CityRow {
  id: string;
  date: string;
  date_label: string | null;
  day_label: string | null;
  city: string;
  venue: string | null;
  region: string | null;
  capacity: number;
  registered: number;
  checked_in: number | null;
  status: "completed" | "open" | "soon" | "soldout";
  price: string | null;
  tier: "finale" | "tier1" | "tier2";
  vip_price: number;
  vip_early_bird_price: number;
  early_bird_active: boolean;
  map_x: number | null;
  map_y: number | null;
}

const REGIONS = [
  "Jawa Barat", "Jawa Tengah", "Jawa Timur",
  "Bali & Nusra", "Sumatera", "Sulawesi", "Kalimantan",
];
const STATUSES = [
  { value: "completed", label: "Selesai" },
  { value: "open", label: "Terbuka" },
  { value: "soon", label: "Segera" },
  { value: "soldout", label: "Sold Out" },
];
const TIERS = [
  { value: "finale", label: "Finale (Jakarta)" },
  { value: "tier1", label: "Tier 1 (Bandung, Bali, Surabaya, Medan)" },
  { value: "tier2", label: "Tier 2 (kota lainnya)" },
];

// Tier default prices (used when tier changes)
const TIER_DEFAULTS = {
  finale: { vip: 350000, early: 245000 },
  tier1: { vip: 250000, early: 175000 },
  tier2: { vip: 175000, early: 122500 },
};

const EXPORT_COLS = [
  { key: "city", label: "Kota" },
  { key: "date_label", label: "Tanggal" },
  { key: "venue", label: "Venue" },
  { key: "region", label: "Region" },
  { key: "capacity", label: "Capacity" },
  { key: "registered", label: "Registered" },
  { key: "vip_price", label: "VIP Price" },
  { key: "status", label: "Status" },
  { key: "tier", label: "Tier" },
];

export default function KotaPage() {
  const [cities, setCities] = useState<CityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<CityRow> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  // ---------- Fetch cities from Supabase ----------
  const fetchCities = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/cities");
      const json = await res.json();
      if (json.error) {
        toast.error("Gagal load: " + json.error);
      } else {
        setCities(json.data || []);
      }
    } catch {
      toast.error("Gagal connect ke server");
    }
    setLoading(false);
  };

  useEffect(() => { fetchCities(); }, []);

  // ---------- Stats ----------
  const stats = useMemo(() => ({
    total: cities.length,
    completed: cities.filter(c => c.status === "completed").length,
    open: cities.filter(c => c.status === "open").length,
    soon: cities.filter(c => c.status === "soon").length,
    totalCapacity: cities.reduce((s, c) => s + c.capacity, 0),
    totalRegistered: cities.reduce((s, c) => s + c.registered, 0),
  }), [cities]);

  // ---------- Handlers ----------
  const handleAddNew = () => {
    setIsNew(true);
    setEditing({
      id: "",
      date: new Date().toISOString().slice(0, 10),
      date_label: "",
      day_label: "Minggu",
      city: "",
      venue: "",
      region: "Jawa Barat",
      capacity: 500,
      registered: 0,
      checked_in: 0,
      status: "soon",
      price: "Gratis",
      tier: "tier2",
      vip_price: 175000,
      vip_early_bird_price: 122500,
      early_bird_active: false,
      map_x: 50,
      map_y: 60,
    });
  };

  const handleEdit = (city: CityRow) => {
    setIsNew(false);
    setEditing({ ...city });
  };

  const handleDelete = async (city: CityRow) => {
    if (!confirm(`Hapus kota "${city.city}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      const res = await fetch("/api/admin/cities", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [city.id] }),
      });
      const json = await res.json();
      if (json.error) {
        toast.error("Gagal hapus: " + json.error);
        return;
      }
      toast.success(`Kota ${city.city} dihapus`);
      fetchCities();
    } catch {
      toast.error("Gagal connect ke server");
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.city || !editing.date) {
      toast.error("Nama kota dan tanggal wajib diisi");
      return;
    }

    setSaving(true);
    try {
      // If tier changed, auto-update prices to tier defaults (unless user customized)
      const method = isNew ? "POST" : "PUT";
      const body = isNew ? editing : { id: editing.id, ...editing };
      delete (body as Record<string, unknown>).created_at;
      delete (body as Record<string, unknown>).updated_at;

      const res = await fetch("/api/admin/cities", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();

      if (json.error) {
        toast.error("Gagal simpan: " + json.error);
        setSaving(false);
        return;
      }

      toast.success(isNew ? `Kota ${editing.city} ditambahkan` : `Kota ${editing.city} diperbarui`);
      setEditing(null);
      setIsNew(false);
      fetchCities();
    } catch {
      toast.error("Gagal connect ke server");
    }
    setSaving(false);
  };

  const handleTierChange = (tier: "finale" | "tier1" | "tier2") => {
    if (!editing) return;
    const defaults = TIER_DEFAULTS[tier];
    setEditing({
      ...editing,
      tier,
      vip_price: defaults.vip,
      vip_early_bird_price: defaults.early,
    });
  };

  const handleExportExcel = () => {
    if (!cities.length) return;
    exportToExcel(cities as unknown as Record<string, unknown>[], EXPORT_COLS, "kota-harga");
    toast.success(`Export Excel: ${cities.length} kota`);
  };

  const handleExportPDF = () => {
    if (!cities.length) return;
    exportToPDF(cities as unknown as Record<string, unknown>[], EXPORT_COLS, "kota-harga", "Kota & Harga — Riana On The Move", `${cities.length} kota tour`);
    toast.success(`Export PDF: ${cities.length} kota`);
  };

  // ---------- Render ----------
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-[#FC7166] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>KOTA & HARGA</h1>
          <p className="text-sm text-white/50">{cities.length} kota tour · CRUD via Supabase</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAddNew} className="bg-gradient-to-r from-[#FC7166] to-[#FD8656] hover:opacity-90 text-white border-0">
            <Plus className="h-4 w-4 mr-1" /> Tambah Kota
          </Button>
          <Button onClick={handleExportExcel} variant="outline" className="bg-[#2A2D38] border-green-500/30 text-green-400 hover:bg-green-500/10">
            <FileSpreadsheet className="h-4 w-4 mr-1" /> Excel
          </Button>
          <Button onClick={handleExportPDF} variant="outline" className="bg-[#2A2D38] border-red-500/30 text-red-400 hover:bg-red-500/10">
            <FileText className="h-4 w-4 mr-1" /> PDF
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: MapPin, label: "Total Kota", value: stats.total, color: "from-[#FC7166] to-[#E54B40]" },
          { icon: Trophy, label: "Selesai", value: stats.completed, color: "from-[#F39F23] to-[#C97D0E]" },
          { icon: Calendar, label: "Aktif / Segera", value: `${stats.open} / ${stats.soon}`, color: "from-[#FD8656] to-[#E56A1F]" },
          { icon: Users, label: "Total Pendaftar", value: stats.totalRegistered.toLocaleString("id-ID"), color: "from-[#884D3E] to-[#51343F]" },
        ].map((s) => (
          <div key={s.label} className={`p-4 rounded-2xl bg-gradient-to-br ${s.color} shadow-lg`}>
            <s.icon className="h-5 w-5 mb-2 text-white/80" />
            <div className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>{s.value}</div>
            <div className="text-[10px] uppercase font-bold text-white/80 tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#2A2D38] rounded-2xl border border-[#FC7166]/15 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#FC7166]/15 bg-[#0E0F14]">
                <th className="text-left p-2.5 text-white/40 font-bold uppercase text-[10px]">#</th>
                <th className="text-left p-2.5 text-white/60 font-bold uppercase text-[10px]">Kota</th>
                <th className="text-left p-2.5 text-white/60 font-bold uppercase text-[10px] hidden md:table-cell">Tanggal</th>
                <th className="text-left p-2.5 text-white/60 font-bold uppercase text-[10px] hidden lg:table-cell">Venue</th>
                <th className="text-center p-2.5 text-white/60 font-bold uppercase text-[10px]">Cap</th>
                <th className="text-center p-2.5 text-white/60 font-bold uppercase text-[10px]">Reg</th>
                <th className="text-center p-2.5 text-white/60 font-bold uppercase text-[10px]">VIP Price</th>
                <th className="text-center p-2.5 text-white/60 font-bold uppercase text-[10px]">Early Bird</th>
                <th className="text-center p-2.5 text-white/60 font-bold uppercase text-[10px]">Tier</th>
                <th className="text-center p-2.5 text-white/60 font-bold uppercase text-[10px]">Status</th>
                <th className="text-right p-2.5 text-white/60 font-bold uppercase text-[10px]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((city, idx) => (
                <tr key={city.id} className="border-b border-white/5 hover:bg-[#FC7166]/5 transition-colors">
                  <td className="p-2.5 text-white/30 font-mono">{String(idx + 1).padStart(2, "0")}</td>
                  <td className="p-2.5">
                    <div className="font-bold text-white">{city.city}</div>
                    <div className="text-[10px] text-white/40 font-mono">{city.id}</div>
                  </td>
                  <td className="p-2.5 text-white/70 text-xs hidden md:table-cell">
                    <div>{city.date_label || city.date}</div>
                    <div className="text-[10px] text-white/40">{city.day_label}</div>
                  </td>
                  <td className="p-2.5 text-white/60 text-xs hidden lg:table-cell">
                    <div className="truncate max-w-[180px]">{city.venue}</div>
                    <div className="text-[10px] text-white/40">{city.region}</div>
                  </td>
                  <td className="p-2.5 text-center text-white/70">{city.capacity}</td>
                  <td className="p-2.5 text-center">
                    <div className="font-bold text-white">{city.registered}</div>
                    <div className="text-[9px] text-white/40">{Math.round((city.registered / city.capacity) * 100)}%</div>
                  </td>
                  <td className="p-2.5 text-center font-bold text-[#F39F23]">
                    {formatRupiah(city.vip_price)}
                  </td>
                  <td className="p-2.5 text-center">
                    <div className="text-[#FC7166] font-bold">{formatRupiah(city.vip_early_bird_price)}</div>
                    {city.early_bird_active && (
                      <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[8px] font-bold uppercase">Active</span>
                    )}
                  </td>
                  <td className="p-2.5 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      city.tier === "finale" ? "bg-[#FC7166]/20 text-[#FC7166]" :
                      city.tier === "tier1" ? "bg-[#FD8656]/20 text-[#FD8656]" :
                      "bg-[#F39F23]/20 text-[#F39F23]"
                    }`}>
                      {city.tier}
                    </span>
                  </td>
                  <td className="p-2.5 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      city.status === "completed" ? "bg-[#F39F23]/20 text-[#FFB938]" :
                      city.status === "open" ? "bg-green-500/20 text-green-400" :
                      city.status === "soldout" ? "bg-red-500/20 text-red-400" :
                      "bg-[#FC7166]/15 text-[#FC7166]"
                    }`}>
                      {STATUSES.find(s => s.value === city.status)?.label || city.status}
                    </span>
                  </td>
                  <td className="p-2.5 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => handleEdit(city)}
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-white/40 hover:text-[#FC7166] hover:bg-[#FC7166]/10 transition-colors"
                        title="Edit kota"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(city)}
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Hapus kota"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {cities.length === 0 && (
                <tr>
                  <td colSpan={11} className="p-12 text-center text-white/40">
                    <MapPin className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    Belum ada kota. Klik "Tambah Kota" untuk mulai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tier pricing summary */}
      <div className="bg-[#2A2D38] rounded-2xl p-5 border border-[#FC7166]/15">
        <h2 className="text-lg font-black text-white mb-3" style={{ fontFamily: "var(--font-display)" }}>
          RINGKASAN TIER HARGA VIP
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { t: "Finale", k: "Jakarta", v: TIER_DEFAULTS.finale.vip, e: TIER_DEFAULTS.finale.early, c: "from-[#FC7166] to-[#E54B40]" },
            { t: "Tier 1", k: "Bandung, Bali, Surabaya, Medan", v: TIER_DEFAULTS.tier1.vip, e: TIER_DEFAULTS.tier1.early, c: "from-[#FD8656] to-[#E56A1F]" },
            { t: "Tier 2", k: "15 kota lainnya", v: TIER_DEFAULTS.tier2.vip, e: TIER_DEFAULTS.tier2.early, c: "from-[#F39F23] to-[#C97D0E]" },
          ].map((t) => (
            <div key={t.t} className={`p-4 rounded-2xl bg-gradient-to-br ${t.c} text-white shadow-lg`}>
              <div className="text-xs font-bold uppercase opacity-80">{t.t}</div>
              <div className="text-sm font-bold mb-2">{t.k}</div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="opacity-70">VIP</span>
                  <span className="font-bold">{formatRupiah(t.v)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="opacity-70">Early Bird</span>
                  <span className="font-bold">{formatRupiah(t.e)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-white/40 mt-3">
          * Mengubah tier pada suatu kota akan auto-set harga ke default tier tersebut.
          Anda bisa override harga manual di modal edit setelah memilih tier.
        </p>
      </div>

      {/* ===== EDIT/CREATE MODAL ===== */}
      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1F2129] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#FC7166]/30 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#FC7166]/15 sticky top-0 bg-[#1F2129] z-10">
              <div>
                <h2 className="text-xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>
                  {isNew ? "TAMBAH KOTA BARU" : `EDIT: ${String(editing.city ?? "").toUpperCase()}`}
                </h2>
                <p className="text-xs text-white/40 mt-0.5">
                  {isNew ? "Tambah kota baru ke tour" : `ID: ${editing.id}`}
                </p>
              </div>
              <button
                onClick={() => { setEditing(null); setIsNew(false); }}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 grid grid-cols-2 gap-4">
              {/* City name */}
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">
                  <MapPin className="inline h-3 w-3 mr-1" /> Nama Kota *
                </Label>
                <Input
                  value={String(editing.city ?? "")}
                  onChange={(e) => setEditing({ ...editing, city: e.target.value })}
                  placeholder="Contoh: Bandung"
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white placeholder:text-white/30"
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">
                  <Calendar className="inline h-3 w-3 mr-1" /> Tanggal Event *
                </Label>
                <Input
                  type="date"
                  value={String(editing.date ?? "").slice(0, 10)}
                  onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white"
                />
              </div>

              {/* Date label */}
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">Label Tanggal</Label>
                <Input
                  value={String(editing.date_label ?? "")}
                  onChange={(e) => setEditing({ ...editing, date_label: e.target.value })}
                  placeholder="Contoh: 12 Juli"
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white placeholder:text-white/30"
                />
              </div>

              {/* Day label */}
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">Hari</Label>
                <select
                  value={String(editing.day_label ?? "Minggu")}
                  onChange={(e) => setEditing({ ...editing, day_label: e.target.value })}
                  className="w-full h-9 px-3 rounded-md bg-[#0E0F14] border border-[#FC7166]/25 text-white text-sm"
                >
                  <option value="Senin">Senin</option>
                  <option value="Selasa">Selasa</option>
                  <option value="Rabu">Rabu</option>
                  <option value="Kamis">Kamis</option>
                  <option value="Jumat">Jumat</option>
                  <option value="Sabtu">Sabtu</option>
                  <option value="Minggu">Minggu</option>
                </select>
              </div>

              {/* Venue */}
              <div className="space-y-2 col-span-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">
                  <Building2 className="inline h-3 w-3 mr-1" /> Venue
                </Label>
                <Input
                  value={String(editing.venue ?? "")}
                  onChange={(e) => setEditing({ ...editing, venue: e.target.value })}
                  placeholder="Contoh: Saparua Sport Center"
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white placeholder:text-white/30"
                />
              </div>

              {/* Region */}
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">Region</Label>
                <select
                  value={String(editing.region ?? "Jawa Barat")}
                  onChange={(e) => setEditing({ ...editing, region: e.target.value })}
                  className="w-full h-9 px-3 rounded-md bg-[#0E0F14] border border-[#FC7166]/25 text-white text-sm"
                >
                  {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">Status</Label>
                <select
                  value={String(editing.status ?? "soon")}
                  onChange={(e) => setEditing({ ...editing, status: e.target.value as CityRow["status"] })}
                  className="w-full h-9 px-3 rounded-md bg-[#0E0F14] border border-[#FC7166]/25 text-white text-sm"
                >
                  {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>

              {/* Capacity */}
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">Kapasitas</Label>
                <Input
                  type="number"
                  value={Number(editing.capacity ?? 500)}
                  onChange={(e) => setEditing({ ...editing, capacity: parseInt(e.target.value) || 0 })}
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white"
                />
              </div>

              {/* Registered */}
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">Sudah Terdaftar</Label>
                <Input
                  type="number"
                  value={Number(editing.registered ?? 0)}
                  onChange={(e) => setEditing({ ...editing, registered: parseInt(e.target.value) || 0 })}
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white"
                />
              </div>

              {/* Divider — Pricing */}
              <div className="col-span-2 mt-3 mb-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F39F23]">
                  <DollarSign className="h-4 w-4" /> Pricing
                </div>
                <div className="h-px bg-[#FC7166]/15 mt-2" />
              </div>

              {/* Tier */}
              <div className="space-y-2 col-span-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">
                  <Tag className="inline h-3 w-3 mr-1" /> Tier (menentukan harga default)
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {TIERS.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => handleTierChange(t.value as "finale" | "tier1" | "tier2")}
                      className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                        editing.tier === t.value
                          ? "border-[#FC7166] bg-[#FC7166]/15 text-white"
                          : "border-[#FC7166]/20 text-white/60 hover:border-[#FC7166]/40"
                      }`}
                    >
                      <div className="uppercase">{t.value}</div>
                      <div className="text-[9px] font-normal opacity-70 mt-0.5">{t.label.split("(")[1]?.replace(")", "") || ""}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* VIP Price */}
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">VIP Price (Rp)</Label>
                <Input
                  type="number"
                  value={Number(editing.vip_price ?? 0)}
                  onChange={(e) => setEditing({ ...editing, vip_price: parseInt(e.target.value) || 0 })}
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white font-mono"
                />
                <p className="text-[10px] text-[#F39F23]">{formatRupiah(Number(editing.vip_price ?? 0))}</p>
              </div>

              {/* Early Bird Price */}
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">Early Bird (Rp)</Label>
                <Input
                  type="number"
                  value={Number(editing.vip_early_bird_price ?? 0)}
                  onChange={(e) => setEditing({ ...editing, vip_early_bird_price: parseInt(e.target.value) || 0 })}
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white font-mono"
                />
                <p className="text-[10px] text-[#FC7166]">{formatRupiah(Number(editing.vip_early_bird_price ?? 0))}</p>
              </div>

              {/* Early bird active toggle */}
              <div className="col-span-2 flex items-center gap-3 p-3 rounded-lg bg-[#0E0F14] border border-[#FC7166]/15">
                <input
                  type="checkbox"
                  id="early_bird_active"
                  checked={Boolean(editing.early_bird_active)}
                  onChange={(e) => setEditing({ ...editing, early_bird_active: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="early_bird_active" className="text-white text-xs cursor-pointer flex-1">
                  Early Bird Aktif
                  <span className="block text-[10px] text-white/40 mt-0.5">
                    Centang jika promo early bird sedang berjalan untuk kota ini
                  </span>
                </Label>
              </div>

              {/* Display price text */}
              <div className="space-y-2 col-span-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">
                  Teks Harga (untuk display di landing page)
                </Label>
                <Input
                  value={String(editing.price ?? "Gratis")}
                  onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                  placeholder="Contoh: Gratis, Rp 250.000"
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 p-5 border-t border-[#FC7166]/15 sticky bottom-0 bg-[#1F2129]">
              <Button
                variant="outline"
                onClick={() => { setEditing(null); setIsNew(false); }}
                disabled={saving}
                className="bg-[#0E0F14] border-white/20 text-white hover:bg-white/10"
              >
                <X className="h-4 w-4 mr-1" /> Batal
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-gradient-to-r from-[#FC7166] to-[#FD8656] hover:opacity-90 text-white disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" /> {isNew ? "Tambah Kota" : "Simpan Perubahan"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
