"use client";
import { useState, useEffect, useMemo } from "react";
import {
  FileText, FileSpreadsheet, Plus, Edit2, Trash2, Save, X,
  ShoppingBag, Package, Tag, DollarSign, Star, Crown, Box,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { exportToExcel, exportToPDF } from "@/lib/export-utils";
import { formatRupiah } from "@/data/pricing";

// ============================================================
// Type definitions — match Supabase merchandise table
// ============================================================
interface MerchRow {
  id: string;
  name: string;
  description: string | null;
  category: "apparel" | "accessories" | "equipment" | "bundle";
  price: number;
  original_price: number | null;
  image_url: string | null;
  stock: number;
  sold: number;
  status: "active" | "soldout" | "hidden";
  is_exclusive: boolean;
  is_bundle: boolean;
  bundle_items: string | null;
  display_order: number;
}

const CATEGORIES = [
  { value: "apparel", label: "Apparel (Kaos, Jaket)" },
  { value: "accessories", label: "Accessories (Tote, Bottle, dll)" },
  { value: "equipment", label: "Equipment (Step Board)" },
  { value: "bundle", label: "Bundle (Paket)" },
];
const STATUSES = [
  { value: "active", label: "Aktif" },
  { value: "soldout", label: "Sold Out" },
  { value: "hidden", label: "Hidden" },
];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  apparel: Package,
  accessories: Tag,
  equipment: Box,
  bundle: Crown,
};

const CATEGORY_COLORS: Record<string, string> = {
  apparel: "from-[#FC7166] to-[#E54B40]",
  accessories: "from-[#FD8656] to-[#E56A1F]",
  equipment: "from-[#F39F23] to-[#C97D0E]",
  bundle: "from-[#884D3E] to-[#51343F]",
};

const EXPORT_COLS = [
  { key: "name", label: "Nama" },
  { key: "category", label: "Kategori" },
  { key: "price", label: "Harga" },
  { key: "stock", label: "Stock" },
  { key: "sold", label: "Terjual" },
  { key: "status", label: "Status" },
];

export default function MerchandisePage() {
  const [items, setItems] = useState<MerchRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<MerchRow> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");

  // ---------- Fetch ----------
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/merchandise");
      const json = await res.json();
      if (json.error) {
        toast.error("Gagal load: " + json.error);
      } else {
        setItems(json.data || []);
      }
    } catch {
      toast.error("Gagal connect ke server");
    }
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  // ---------- Stats ----------
  const stats = useMemo(() => ({
    total: items.length,
    active: items.filter(i => i.status === "active").length,
    soldout: items.filter(i => i.status === "soldout").length,
    totalStock: items.reduce((s, i) => s + i.stock, 0),
    totalSold: items.reduce((s, i) => s + i.sold, 0),
    revenue: items.reduce((s, i) => s + (i.sold * i.price), 0),
  }), [items]);

  // ---------- Filter ----------
  const filtered = useMemo(() => {
    if (filterCategory === "all") return items;
    return items.filter(i => i.category === filterCategory);
  }, [items, filterCategory]);

  // ---------- Handlers ----------
  const handleAddNew = () => {
    setIsNew(true);
    setEditing({
      id: "",
      name: "",
      description: "",
      category: "apparel",
      price: 0,
      original_price: null,
      image_url: "",
      stock: 0,
      sold: 0,
      status: "active",
      is_exclusive: false,
      is_bundle: false,
      bundle_items: null,
      display_order: items.length + 1,
    });
  };

  const handleEdit = (item: MerchRow) => {
    setIsNew(false);
    setEditing({ ...item });
  };

  const handleDelete = async (item: MerchRow) => {
    if (!confirm(`Hapus merchandise "${item.name}"?`)) return;
    try {
      const res = await fetch("/api/admin/merchandise", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [item.id] }),
      });
      const json = await res.json();
      if (json.error) {
        toast.error("Gagal hapus: " + json.error);
        return;
      }
      toast.success(`Merchandise "${item.name}" dihapus`);
      fetchItems();
    } catch {
      toast.error("Gagal connect ke server");
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.name || editing.price === undefined) {
      toast.error("Nama dan harga wajib diisi");
      return;
    }

    setSaving(true);
    try {
      const method = isNew ? "POST" : "PUT";
      const body = isNew ? editing : { id: editing.id, ...editing };
      delete (body as Record<string, unknown>).created_at;
      delete (body as Record<string, unknown>).updated_at;

      const res = await fetch("/api/admin/merchandise", {
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

      toast.success(isNew ? `Merchandise "${editing.name}" ditambahkan` : `Merchandise "${editing.name}" diperbarui`);
      setEditing(null);
      setIsNew(false);
      fetchItems();
    } catch {
      toast.error("Gagal connect ke server");
    }
    setSaving(false);
  };

  const handleExportExcel = () => {
    if (!items.length) return;
    exportToExcel(items as unknown as Record<string, unknown>[], EXPORT_COLS, "merchandise");
    toast.success(`Export Excel: ${items.length} items`);
  };

  const handleExportPDF = () => {
    if (!items.length) return;
    exportToPDF(items as unknown as Record<string, unknown>[], EXPORT_COLS, "merchandise", "Merchandise — Riana On The Move", `${items.length} produk`);
    toast.success(`Export PDF: ${items.length} items`);
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
          <h1 className="text-3xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>MERCHANDISE</h1>
          <p className="text-sm text-white/50">{items.length} produk · CRUD via Supabase</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAddNew} className="bg-gradient-to-r from-[#FC7166] to-[#FD8656] hover:opacity-90 text-white border-0">
            <Plus className="h-4 w-4 mr-1" /> Tambah Produk
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
          { icon: Package, label: "Total Produk", value: stats.total, color: "from-[#FC7166] to-[#E54B40]" },
          { icon: Star, label: "Aktif / Soldout", value: `${stats.active} / ${stats.soldout}`, color: "from-[#F39F23] to-[#C97D0E]" },
          { icon: Box, label: "Total Stock", value: stats.totalStock.toLocaleString("id-ID"), color: "from-[#FD8656] to-[#E56A1F]" },
          { icon: DollarSign, label: "Revenue (sold)", value: formatRupiah(stats.revenue), color: "from-[#884D3E] to-[#51343F]" },
        ].map((s) => (
          <div key={s.label} className={`p-4 rounded-2xl bg-gradient-to-br ${s.color} shadow-lg`}>
            <s.icon className="h-5 w-5 mb-2 text-white/80" />
            <div className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>{s.value}</div>
            <div className="text-[10px] uppercase font-bold text-white/80 tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter + Table */}
      <div className="bg-[#2A2D38] rounded-2xl border border-[#FC7166]/15 overflow-hidden">
        {/* Filter bar */}
        <div className="p-2.5 border-b border-[#FC7166]/10 bg-[#0E0F14]">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterCategory("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterCategory === "all"
                  ? "bg-gradient-to-r from-[#FC7166] to-[#FD8656] text-white"
                  : "bg-[#2A2D38] text-white/60 hover:text-white"
              }`}
            >
              Semua ({items.length})
            </button>
            {CATEGORIES.map((c) => {
              const count = items.filter(i => i.category === c.value).length;
              return (
                <button
                  key={c.value}
                  onClick={() => setFilterCategory(c.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filterCategory === c.value
                      ? "bg-gradient-to-r from-[#FC7166] to-[#FD8656] text-white"
                      : "bg-[#2A2D38] text-white/60 hover:text-white"
                  }`}
                >
                  {c.label.split(" ")[0]} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#FC7166]/15 bg-[#0E0F14]">
                <th className="text-left p-2.5 text-white/40 font-bold uppercase text-[10px]">#</th>
                <th className="text-left p-2.5 text-white/60 font-bold uppercase text-[10px]">Produk</th>
                <th className="text-left p-2.5 text-white/60 font-bold uppercase text-[10px] hidden md:table-cell">Kategori</th>
                <th className="text-center p-2.5 text-white/60 font-bold uppercase text-[10px]">Harga</th>
                <th className="text-center p-2.5 text-white/60 font-bold uppercase text-[10px]">Original</th>
                <th className="text-center p-2.5 text-white/60 font-bold uppercase text-[10px]">Stock</th>
                <th className="text-center p-2.5 text-white/60 font-bold uppercase text-[10px]">Sold</th>
                <th className="text-center p-2.5 text-white/60 font-bold uppercase text-[10px]">Tags</th>
                <th className="text-center p-2.5 text-white/60 font-bold uppercase text-[10px]">Status</th>
                <th className="text-right p-2.5 text-white/60 font-bold uppercase text-[10px]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => {
                const CatIcon = CATEGORY_ICONS[item.category] || Package;
                const discount = item.original_price && item.original_price > item.price
                  ? Math.round(((item.original_price - item.price) / item.original_price) * 100)
                  : 0;
                return (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-[#FC7166]/5 transition-colors">
                    <td className="p-2.5 text-white/30 font-mono">{String(idx + 1).padStart(2, "0")}</td>
                    <td className="p-2.5">
                      <div className="flex items-center gap-2">
                        <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${CATEGORY_COLORS[item.category]} flex items-center justify-center flex-shrink-0`}>
                          <CatIcon className="h-4 w-4 text-white" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-white truncate">{item.name}</div>
                          <div className="text-[10px] text-white/40 font-mono truncate max-w-[200px]">{item.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-2.5 hidden md:table-cell">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold bg-gradient-to-r ${CATEGORY_COLORS[item.category]} text-white`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="p-2.5 text-center font-bold text-[#F39F23]">
                      {formatRupiah(item.price)}
                      {discount > 0 && (
                        <div className="text-[9px] text-green-400 font-normal">-{discount}%</div>
                      )}
                    </td>
                    <td className="p-2.5 text-center text-white/40 text-xs">
                      {item.original_price ? (
                        <span className="line-through">{formatRupiah(item.original_price)}</span>
                      ) : "-"}
                    </td>
                    <td className="p-2.5 text-center">
                      <span className={`font-bold ${item.stock === 0 ? "text-red-400" : "text-white"}`}>{item.stock}</span>
                    </td>
                    <td className="p-2.5 text-center text-white/70">{item.sold}</td>
                    <td className="p-2.5 text-center">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {item.is_exclusive && (
                          <span className="px-1.5 py-0.5 rounded-full bg-[#FC7166]/20 text-[#FC7166] text-[8px] font-bold uppercase">VIP</span>
                        )}
                        {item.is_bundle && (
                          <span className="px-1.5 py-0.5 rounded-full bg-[#F39F23]/20 text-[#FFB938] text-[8px] font-bold uppercase">Bundle</span>
                        )}
                        {!item.is_exclusive && !item.is_bundle && (
                          <span className="text-white/20 text-[10px]">-</span>
                        )}
                      </div>
                    </td>
                    <td className="p-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        item.status === "active" ? "bg-green-500/20 text-green-400" :
                        item.status === "soldout" ? "bg-red-500/20 text-red-400" :
                        "bg-white/10 text-white/40"
                      }`}>
                        {STATUSES.find(s => s.value === item.status)?.label || item.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleEdit(item)}
                          className="h-7 w-7 rounded-lg flex items-center justify-center text-white/40 hover:text-[#FC7166] hover:bg-[#FC7166]/10 transition-colors"
                          title="Edit produk"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="h-7 w-7 rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Hapus produk"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-white/40">
                    <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    Belum ada merchandise. Klik "Tambah Produk" untuk mulai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== EDIT/CREATE MODAL ===== */}
      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1F2129] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#FC7166]/30 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#FC7166]/15 sticky top-0 bg-[#1F2129] z-10">
              <div>
                <h2 className="text-xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>
                  {isNew ? "TAMBAH MERCHANDISE BARU" : `EDIT: ${String(editing.name ?? "").toUpperCase()}`}
                </h2>
                <p className="text-xs text-white/40 mt-0.5">
                  {isNew ? "Tambah produk merchandise baru" : `ID: ${editing.id}`}
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
              {/* Name */}
              <div className="space-y-2 col-span-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">
                  <ShoppingBag className="inline h-3 w-3 mr-1" /> Nama Produk *
                </Label>
                <Input
                  value={String(editing.name ?? "")}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="Contoh: Kaos Official Riana On The Move"
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white placeholder:text-white/30"
                />
              </div>

              {/* Description */}
              <div className="space-y-2 col-span-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">Deskripsi</Label>
                <textarea
                  value={String(editing.description ?? "")}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  placeholder="Deskripsi produk..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-md bg-[#0E0F14] border border-[#FC7166]/25 text-white text-sm placeholder:text-white/30 resize-none"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">Kategori</Label>
                <select
                  value={String(editing.category ?? "apparel")}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value as MerchRow["category"] })}
                  className="w-full h-9 px-3 rounded-md bg-[#0E0F14] border border-[#FC7166]/25 text-white text-sm"
                >
                  {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">Status</Label>
                <select
                  value={String(editing.status ?? "active")}
                  onChange={(e) => setEditing({ ...editing, status: e.target.value as MerchRow["status"] })}
                  className="w-full h-9 px-3 rounded-md bg-[#0E0F14] border border-[#FC7166]/25 text-white text-sm"
                >
                  {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">Harga (Rp) *</Label>
                <Input
                  type="number"
                  value={Number(editing.price ?? 0)}
                  onChange={(e) => setEditing({ ...editing, price: parseInt(e.target.value) || 0 })}
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white font-mono"
                />
                <p className="text-[10px] text-[#F39F23]">{formatRupiah(Number(editing.price ?? 0))}</p>
              </div>

              {/* Original Price */}
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">Harga Asli (Rp) — untuk diskon</Label>
                <Input
                  type="number"
                  value={Number(editing.original_price ?? 0) || ""}
                  onChange={(e) => setEditing({ ...editing, original_price: e.target.value ? parseInt(e.target.value) : null })}
                  placeholder="Opsional"
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white font-mono"
                />
                {editing.original_price && editing.original_price > Number(editing.price ?? 0) && (
                  <p className="text-[10px] text-green-400">
                    Diskon {Math.round(((Number(editing.original_price) - Number(editing.price)) / Number(editing.original_price)) * 100)}%
                  </p>
                )}
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">Stock</Label>
                <Input
                  type="number"
                  value={Number(editing.stock ?? 0)}
                  onChange={(e) => setEditing({ ...editing, stock: parseInt(e.target.value) || 0 })}
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white"
                />
              </div>

              {/* Sold */}
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">Terjual</Label>
                <Input
                  type="number"
                  value={Number(editing.sold ?? 0)}
                  onChange={(e) => setEditing({ ...editing, sold: parseInt(e.target.value) || 0 })}
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white"
                />
              </div>

              {/* Image URL */}
              <div className="space-y-2 col-span-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">Image URL</Label>
                <Input
                  value={String(editing.image_url ?? "")}
                  onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                  placeholder="/brand/merch-xxx.jpg atau https://..."
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white font-mono text-xs"
                />
              </div>

              {/* Display Order */}
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">Display Order</Label>
                <Input
                  type="number"
                  value={Number(editing.display_order ?? 0)}
                  onChange={(e) => setEditing({ ...editing, display_order: parseInt(e.target.value) || 0 })}
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white"
                />
                <p className="text-[10px] text-white/40">Urutan tampil di landing page (kecil → besar)</p>
              </div>

              {/* Toggle: Exclusive */}
              <div className="space-y-2 flex items-end pb-2">
                <label className="flex items-center gap-3 p-3 rounded-lg bg-[#0E0F14] border border-[#FC7166]/15 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={Boolean(editing.is_exclusive)}
                    onChange={(e) => setEditing({ ...editing, is_exclusive: e.target.checked })}
                    className="h-4 w-4 accent-[#FC7166]"
                  />
                  <div>
                    <div className="text-white text-xs font-bold flex items-center gap-1">
                      <Crown className="h-3 w-3 text-[#FC7166]" /> VIP Exclusive
                    </div>
                    <div className="text-[10px] text-white/40">Hanya untuk peserta VIP</div>
                  </div>
                </label>
              </div>

              {/* Toggle: Bundle */}
              <div className="space-y-2 flex items-end pb-2">
                <label className="flex items-center gap-3 p-3 rounded-lg bg-[#0E0F14] border border-[#FC7166]/15 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={Boolean(editing.is_bundle)}
                    onChange={(e) => setEditing({ ...editing, is_bundle: e.target.checked })}
                    className="h-4 w-4 accent-[#F39F23]"
                  />
                  <div>
                    <div className="text-white text-xs font-bold flex items-center gap-1">
                      <Package className="h-3 w-3 text-[#F39F23]" /> Bundle Paket
                    </div>
                    <div className="text-[10px] text-white/40">Produk paket (gabungan)</div>
                  </div>
                </label>
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
                    <Save className="h-4 w-4 mr-1" /> {isNew ? "Tambah Produk" : "Simpan Perubahan"}
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
