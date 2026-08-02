"use client";
import { useState, useEffect, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, Users, CheckCircle2, Star, DollarSign, Edit2, Trash2, Save, X, FileText, FileSpreadsheet } from "lucide-react";
import { formatRupiah } from "@/data/pricing";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { exportToExcel, exportToPDF } from "@/lib/export-utils";

const PAGE_SIZE = 100;
const EXPORT_COLUMNS = [
  { key: "registration_number", label: "ID" }, { key: "full_name", label: "Nama" }, { key: "google_email", label: "Email" },
  { key: "phone", label: "No WA" }, { key: "event_city_name", label: "Kota" }, { key: "ticket_type", label: "Tiket" },
  { key: "ticket_price", label: "Harga" }, { key: "payment_status", label: "Status Bayar" }, { key: "status", label: "Status" }, { key: "created_at", label: "Tgl Daftar" },
];

export default function PesertaPage() {
  const [allData, setAllData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCity, setFilterCity] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/peserta");
      const json = await res.json();
      if (json.error) toast.error("Gagal load: " + json.error);
      else setAllData(json.data || []);
    } catch { toast.error("Gagal connect"); }
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => allData.filter((r: Record<string, unknown>) => {
    if (search) {
      const q = search.toLowerCase();
      if (!String(r.full_name ?? "").toLowerCase().includes(q)
        && !String(r.google_email ?? "").toLowerCase().includes(q)
        && !String(r.phone ?? "").includes(q)) return false;
    }
    if (filterCity !== "all" && r.event_city_id !== filterCity) return false;
    return true;
  }), [allData, search, filterCity]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = useMemo(() => ({
    total: allData.length,
    checkedIn: allData.filter((r) => r.status === "checked_in").length,
    vip: allData.filter((r) => r.ticket_type === "vip").length,
    revenue: allData.filter((r) => r.payment_status === "paid").reduce((s, r) => s + Number(r.ticket_price || 0), 0),
  }), [allData]);

  const handleExportExcel = () => {
    if (!allData.length) return;
    exportToExcel(allData, EXPORT_COLUMNS, `peserta-${allData.length}-rows`);
    toast.success(`Export Excel: ${allData.length} rows`);
  };
  const handleExportPDF = () => {
    if (!allData.length) return;
    exportToPDF(allData, EXPORT_COLUMNS, `peserta-${allData.length}-rows`, "Data Peserta — Riana On The Move", `${allData.length} peserta`);
    toast.success(`Export PDF: ${allData.length} rows`);
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.size) return;
    if (!confirm(`Hapus ${selectedIds.size} peserta?`)) return;
    try {
      const res = await fetch("/api/admin/peserta", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });
      const json = await res.json();
      if (json.error) { toast.error("Gagal hapus"); return; }
      toast.success(`${selectedIds.size} dihapus`);
      setSelectedIds(new Set());
      fetchData();
    } catch { toast.error("Gagal connect"); }
  };

  const handleDelete = async (row: Record<string, unknown>) => {
    if (!confirm(`Hapus ${row.full_name}?`)) return;
    try {
      const res = await fetch("/api/admin/peserta", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [row.id] }),
      });
      const json = await res.json();
      if (json.error) { toast.error("Gagal"); return; }
      toast.success("Dihapus");
      fetchData();
    } catch { toast.error("Gagal"); }
  };

  const handleSave = async () => {
    if (!editing) return;
    try {
      const res = await fetch("/api/admin/peserta", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      const json = await res.json();
      if (json.error) { toast.error("Gagal update"); return; }
      toast.success("Diperbarui");
      setEditing(null);
      fetchData();
    } catch { toast.error("Gagal"); }
  };

  const toggleSelect = (id: string) => setSelectedIds((p) => {
    const n = new Set(p);
    if (n.has(id)) n.delete(id); else n.add(id);
    return n;
  });
  const toggleSelectAll = () => {
    if (selectedIds.size === paged.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(paged.map((r) => String(r.id))));
  };

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
          <h1 className="text-3xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>DATA PESERTA</h1>
          <p className="text-sm text-white/50">{allData.length} peserta di database</p>
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

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FC7166] to-[#E54B40] text-white shadow-lg">
          <Users className="h-5 w-5 mb-2 opacity-80" />
          <div className="text-xl font-black" style={{ fontFamily: "var(--font-display)" }}>{stats.total}</div>
          <div className="text-[10px] uppercase font-bold opacity-80">Total</div>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
          <CheckCircle2 className="h-5 w-5 mb-2 opacity-80" />
          <div className="text-xl font-black" style={{ fontFamily: "var(--font-display)" }}>{stats.checkedIn}</div>
          <div className="text-[10px] uppercase font-bold opacity-80">Checked-in</div>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#F39F23] to-[#C97D0E] text-white shadow-lg">
          <Star className="h-5 w-5 mb-2 opacity-80" />
          <div className="text-xl font-black" style={{ fontFamily: "var(--font-display)" }}>{stats.vip}</div>
          <div className="text-[10px] uppercase font-bold opacity-80">VIP</div>
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FD8656] to-[#E56A1F] text-white shadow-lg">
          <DollarSign className="h-5 w-5 mb-2 opacity-80" />
          <div className="text-sm font-black" style={{ fontFamily: "var(--font-display)" }}>{formatRupiah(stats.revenue)}</div>
          <div className="text-[10px] uppercase font-bold opacity-80">Revenue</div>
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#FC7166]/10 border border-[#FC7166]/30">
          <span className="text-sm font-bold text-white">{selectedIds.size} dipilih</span>
          <div className="flex gap-2">
            <Button size="sm" variant="destructive" onClick={handleBulkDelete} className="bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30">
              <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())} className="text-white/70 hover:text-white">
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Search + filter */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <Input
            placeholder="Cari nama, email, phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 bg-[#0E0F14] border-[#FC7166]/25 text-white placeholder:text-white/30"
          />
        </div>
        <select
          value={filterCity}
          onChange={(e) => { setFilterCity(e.target.value); setPage(1); }}
          className="h-9 px-3 rounded-md bg-[#0E0F14] border border-[#FC7166]/25 text-white text-sm"
        >
          <option value="all">Semua Kota</option>
          {[...new Set(allData.map((r) => String(r.event_city_id)))].map((id) => {
            const c = allData.find((r) => String(r.event_city_id) === id);
            return <option key={id} value={id}>{String(c?.event_city_name ?? id)}</option>;
          })}
        </select>
      </div>

      {/* Table — 1rem padding (p-4) */}
      <div className="bg-[#2A2D38] rounded-2xl border border-[#FC7166]/15 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#FC7166]/15 bg-[#0E0F14]">
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === paged.length && paged.length > 0}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 accent-[#FC7166]"
                  />
                </th>
                <th className="text-left p-4 text-white/40 font-bold uppercase text-[10px]">ID</th>
                <th className="text-left p-4 text-white/60 font-bold uppercase text-[10px]">Nama</th>
                <th className="text-left p-4 text-white/60 font-bold uppercase text-[10px] hidden lg:table-cell">Email</th>
                <th className="text-left p-4 text-white/60 font-bold uppercase text-[10px] hidden md:table-cell">Phone</th>
                <th className="text-left p-4 text-white/60 font-bold uppercase text-[10px]">Kota</th>
                <th className="text-center p-4 text-white/60 font-bold uppercase text-[10px]">Tiket</th>
                <th className="text-center p-4 text-white/60 font-bold uppercase text-[10px]">Status</th>
                <th className="text-right p-4 text-white/60 font-bold uppercase text-[10px]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((r) => (
                <tr
                  key={String(r.id)}
                  className={`border-b border-white/5 hover:bg-[#FC7166]/5 transition-colors ${selectedIds.has(String(r.id)) ? "bg-[#FC7166]/10" : ""}`}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(String(r.id))}
                      onChange={() => toggleSelect(String(r.id))}
                      className="h-4 w-4 accent-[#FC7166]"
                    />
                  </td>
                  <td className="p-4 font-mono text-[10px] text-white/40">{String(r.registration_number ?? "")}</td>
                  <td className="p-4 font-bold text-white">{String(r.full_name ?? "")}</td>
                  <td className="p-4 text-white/60 text-xs hidden lg:table-cell">{String(r.google_email ?? "")}</td>
                  <td className="p-4 text-white/60 text-xs hidden md:table-cell font-mono">{String(r.phone ?? "")}</td>
                  <td className="p-4 text-white/80">{String(r.event_city_name ?? "")}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      r.ticket_type === "vip"
                        ? "bg-[#F39F23]/20 text-[#FFB938]"
                        : "bg-[#FC7166]/15 text-[#FC7166]"
                    }`}>
                      {r.ticket_type === "vip" ? "VIP" : "REG"}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      r.status === "checked_in" ? "bg-green-500/20 text-green-400" :
                      r.status === "registered" ? "bg-blue-500/20 text-blue-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>
                      {String(r.status ?? "")}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setEditing({ ...r })}
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-white/40 hover:text-[#FC7166] hover:bg-[#FC7166]/10 transition-colors"
                        title="Edit peserta"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(r)}
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Hapus peserta"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-white/40">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    Tidak ada data peserta
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-[#FC7166]/10">
          <span className="text-xs text-white/50">
            {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length}
          </span>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="bg-[#0E0F14] border-[#FC7166]/20 text-white hover:bg-[#FC7166]/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 py-1 text-xs text-white/70 font-mono">{page} / {totalPages}</span>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="bg-[#0E0F14] border-[#FC7166]/20 text-white hover:bg-[#FC7166]/10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1F2129] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#FC7166]/30 shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-[#FC7166]/15 sticky top-0 bg-[#1F2129] z-10">
              <h2 className="text-xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>
                EDIT: {String(editing.full_name ?? "").toUpperCase()}
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/80 text-xs font-bold">Nama</Label>
                <Input
                  value={String(editing.full_name ?? "")}
                  onChange={(e) => setEditing({ ...editing, full_name: e.target.value })}
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white"
                />
              </div>
              <div>
                <Label className="text-white/80 text-xs font-bold">No WA</Label>
                <Input
                  value={String(editing.phone ?? "")}
                  onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white font-mono"
                />
              </div>
              <div>
                <Label className="text-white/80 text-xs font-bold">Email</Label>
                <Input
                  value={String(editing.google_email ?? "")}
                  onChange={(e) => setEditing({ ...editing, google_email: e.target.value })}
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white"
                />
              </div>
              <div>
                <Label className="text-white/80 text-xs font-bold">Kota</Label>
                <Input
                  value={String(editing.event_city_name ?? "")}
                  onChange={(e) => setEditing({ ...editing, event_city_name: e.target.value })}
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white"
                />
              </div>
              <div>
                <Label className="text-white/80 text-xs font-bold">Tiket</Label>
                <select
                  value={String(editing.ticket_type ?? "regular")}
                  onChange={(e) => setEditing({ ...editing, ticket_type: e.target.value })}
                  className="w-full h-9 px-3 rounded-md bg-[#0E0F14] border border-[#FC7166]/25 text-white text-sm"
                >
                  <option value="regular">Regular</option>
                  <option value="vip">VIP</option>
                </select>
              </div>
              <div>
                <Label className="text-white/80 text-xs font-bold">Status</Label>
                <select
                  value={String(editing.status ?? "registered")}
                  onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                  className="w-full h-9 px-3 rounded-md bg-[#0E0F14] border border-[#FC7166]/25 text-white text-sm"
                >
                  <option value="registered">Registered</option>
                  <option value="checked_in">Checked-in</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no_show">No Show</option>
                </select>
              </div>
              <div>
                <Label className="text-white/80 text-xs font-bold">Bayar</Label>
                <select
                  value={String(editing.payment_status ?? "free")}
                  onChange={(e) => setEditing({ ...editing, payment_status: e.target.value })}
                  className="w-full h-9 px-3 rounded-md bg-[#0E0F14] border border-[#FC7166]/25 text-white text-sm"
                >
                  <option value="free">Free</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div>
                <Label className="text-white/80 text-xs font-bold">Harga</Label>
                <Input
                  type="number"
                  value={Number(editing.ticket_price ?? 0)}
                  onChange={(e) => setEditing({ ...editing, ticket_price: parseInt(e.target.value) || 0 })}
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 p-5 border-t border-[#FC7166]/15 sticky bottom-0 bg-[#1F2129]">
              <Button
                variant="outline"
                onClick={() => setEditing(null)}
                className="bg-[#0E0F14] border-white/20 text-white hover:bg-white/10"
              >
                <X className="h-4 w-4 mr-1" /> Batal
              </Button>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-[#FC7166] to-[#FD8656] hover:opacity-90 text-white"
              >
                <Save className="h-4 w-4 mr-1" /> Simpan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
