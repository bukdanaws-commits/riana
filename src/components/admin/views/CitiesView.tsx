"use client";

import { useState } from "react";
import {
  Plus, Edit2, Trash2, Save, X, Search, MapPin, Users, Calendar,
} from "lucide-react";
import { useAdminStore, type CityEvent } from "@/lib/admin-store";
import { REGIONS, REGION_COLORS, type Region, type CityStatus } from "@/data/event";
import { AdminCard, AdminButton, AdminInput, AdminLabel } from "../AdminDashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const STATUS_OPTIONS: CityStatus[] = ["completed", "open", "soon", "soldout"];

const emptyCity: CityEvent = {
  id: "",
  date: "",
  dateLabel: "",
  dayLabel: "Minggu",
  city: "",
  venue: "",
  region: "Jawa Barat",
  capacity: 500,
  registered: 0,
  checkedIn: 0,
  status: "soon",
  mapX: 50,
  mapY: 60,
  price: "Gratis",
};

export function CitiesView() {
  const cities = useAdminStore((s) => s.cities);
  const addCity = useAdminStore((s) => s.addCity);
  const updateCity = useAdminStore((s) => s.updateCity);
  const deleteCity = useAdminStore((s) => s.deleteCity);

  const [editing, setEditing] = useState<CityEvent | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState("");
  const [filterRegion, setFilterRegion] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filtered = cities.filter((c) => {
    const matchSearch = c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.venue.toLowerCase().includes(search.toLowerCase());
    const matchRegion = filterRegion === "all" || c.region === filterRegion;
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    return matchSearch && matchRegion && matchStatus;
  });

  const handleSave = () => {
    if (!editing) return;
    if (!editing.id || !editing.city || !editing.date) {
      toast.error("ID, Kota, dan Tanggal wajib diisi.");
      return;
    }
    if (isAdding) {
      if (cities.find((c) => c.id === editing.id)) {
        toast.error("ID kota sudah ada. Gunakan ID lain.");
        return;
      }
      addCity(editing);
      toast.success(`Kota ${editing.city} ditambahkan.`);
    } else {
      updateCity(editing.id, editing);
      toast.success(`Kota ${editing.city} diperbarui.`);
    }
    setEditing(null);
    setIsAdding(false);
  };

  const handleEdit = (city: CityEvent) => {
    setEditing({ ...city });
    setIsAdding(false);
  };

  const handleDelete = (city: CityEvent) => {
    if (confirm(`Hapus kota ${city.city}? Tindakan ini tidak bisa dibatalkan.`)) {
      deleteCity(city.id);
      toast.success(`Kota ${city.city} dihapus.`);
    }
  };

  const handleAdd = () => {
    setEditing({ ...emptyCity, id: `city-${Date.now()}` });
    setIsAdding(true);
  };

  return (
    <div className="space-y-4">
      {/* === FILTERS === */}
      <AdminCard>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Cari kota atau venue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-[#0E0F14] border-[#FC7166]/25 text-white placeholder:text-white/30"
            />
          </div>
          <Select value={filterRegion} onValueChange={setFilterRegion}>
            <SelectTrigger className="w-[160px] bg-[#0E0F14] border-[#FC7166]/25 text-white">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent className="bg-[#181A22] border-[#FC7166]/30">
              <SelectItem value="all">Semua Region</SelectItem>
              {REGIONS.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px] bg-[#0E0F14] border-[#FC7166]/25 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#181A22] border-[#FC7166]/30">
              <SelectItem value="all">Semua Status</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AdminButton onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-1" />
            Tambah Kota
          </AdminButton>
        </div>
      </AdminCard>

      {/* === CITIES TABLE === */}
      <AdminCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto custom-scroll">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#FC7166]/20 bg-[#0E0F14]/50">
                <th className="text-left p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider">Kota</th>
                <th className="text-left p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider">Tanggal</th>
                <th className="text-left p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider">Region</th>
                <th className="text-center p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider">Registered</th>
                <th className="text-center p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider">Capacity</th>
                <th className="text-center p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider">Status</th>
                <th className="text-right p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((city) => {
                const pct = Math.round((city.registered / city.capacity) * 100);
                const regionColor = REGION_COLORS[city.region as Region] ?? "#FC7166";
                return (
                  <tr
                    key={city.id}
                    className="border-b border-[#FC7166]/10 hover:bg-[#FC7166]/5 transition-colors"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full flex-shrink-0"
                          style={{ background: regionColor }}
                        />
                        <div>
                          <div className="font-bold text-white">{city.city}</div>
                          <div className="text-[10px] text-white/50 truncate max-w-[200px]">{city.venue}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-white/70 font-mono text-xs">
                      {city.dateLabel}<br/>
                      <span className="text-[9px] text-white/40">{city.dayLabel}</span>
                    </td>
                    <td className="p-3 text-white/70 text-xs">{city.region}</td>
                    <td className="p-3 text-center">
                      <div className="font-bold text-white">{city.registered}</div>
                      <div className="h-1 mt-1 rounded-full bg-[#FC7166]/15 overflow-hidden">
                        <div
                          className="h-full bg-[#FC7166]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="text-[9px] text-white/50 mt-0.5 font-mono">{pct}%</div>
                    </td>
                    <td className="p-3 text-center text-white/70">{city.capacity}</td>
                    <td className="p-3 text-center">
                      <StatusBadge status={city.status} />
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-white/60 hover:text-[#FF8A80] hover:bg-[#FC7166]/10"
                          onClick={() => handleEdit(city)}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-white/60 hover:text-red-400 hover:bg-red-500/10"
                          onClick={() => handleDelete(city)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-white/40">
                    Tidak ada kota yang cocok dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>

      {/* === EDIT DIALOG === */}
      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0E0F14]/80 backdrop-blur-md">
          <div className="bg-[#181A22] border border-[#FC7166]/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scroll">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#FC7166]/20 sticky top-0 bg-[#181A22] z-10">
              <div>
                <h3
                  className="text-xl font-black text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {isAdding ? "TAMBAH KOTA" : `EDIT: ${editing.city.toUpperCase()}`}
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  ID: <span className="font-mono text-[#FF8A80]">{editing.id}</span>
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="text-white/60 hover:text-white"
                onClick={() => { setEditing(null); setIsAdding(false); }}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Body */}
            <div className="p-5 grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1 space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">ID Kota</Label>
                <Input
                  value={editing.id}
                  onChange={(e) => setEditing({ ...editing, id: e.target.value })}
                  disabled={!isAdding}
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white font-mono"
                />
              </div>
              <div className="col-span-2 sm:col-span-1 space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">Nama Kota</Label>
                <Input
                  value={editing.city}
                  onChange={(e) => setEditing({ ...editing, city: e.target.value })}
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">Tanggal ISO</Label>
                <Input
                  type="date"
                  value={editing.date}
                  onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">Label Tanggal</Label>
                <Input
                  value={editing.dateLabel}
                  onChange={(e) => setEditing({ ...editing, dateLabel: e.target.value })}
                  placeholder="12 Juli"
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">Hari</Label>
                <Select
                  value={editing.dayLabel}
                  onValueChange={(v) => setEditing({ ...editing, dayLabel: v })}
                >
                  <SelectTrigger className="bg-[#0E0F14] border-[#FC7166]/25 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#181A22] border-[#FC7166]/30">
                    {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">Region</Label>
                <Select
                  value={editing.region}
                  onValueChange={(v) => setEditing({ ...editing, region: v as Region })}
                >
                  <SelectTrigger className="bg-[#0E0F14] border-[#FC7166]/25 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#181A22] border-[#FC7166]/30">
                    {REGIONS.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">Venue</Label>
                <Input
                  value={editing.venue}
                  onChange={(e) => setEditing({ ...editing, venue: e.target.value })}
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">Capacity</Label>
                <Input
                  type="number"
                  value={editing.capacity}
                  onChange={(e) => setEditing({ ...editing, capacity: parseInt(e.target.value) || 0 })}
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">Registered</Label>
                <Input
                  type="number"
                  value={editing.registered}
                  onChange={(e) => setEditing({ ...editing, registered: parseInt(e.target.value) || 0 })}
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">Checked-in</Label>
                <Input
                  type="number"
                  value={editing.checkedIn ?? 0}
                  onChange={(e) => setEditing({ ...editing, checkedIn: parseInt(e.target.value) || 0 })}
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">Status</Label>
                <Select
                  value={editing.status}
                  onValueChange={(v) => setEditing({ ...editing, status: v as CityStatus })}
                >
                  <SelectTrigger className="bg-[#0E0F14] border-[#FC7166]/25 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#181A22] border-[#FC7166]/30">
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">Harga</Label>
                <Input
                  value={editing.price}
                  onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">Map X (0-100)</Label>
                <Input
                  type="number"
                  value={editing.mapX}
                  onChange={(e) => setEditing({ ...editing, mapX: parseInt(e.target.value) || 0 })}
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase tracking-wider">Map Y (0-100)</Label>
                <Input
                  type="number"
                  value={editing.mapY}
                  onChange={(e) => setEditing({ ...editing, mapY: parseInt(e.target.value) || 0 })}
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white"
                />
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="earlyBird"
                  checked={editing.earlyBird ?? false}
                  onChange={(e) => setEditing({ ...editing, earlyBird: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="earlyBird" className="text-white/80 text-sm cursor-pointer">
                  Early Bird Active
                </Label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 p-5 border-t border-[#FC7166]/20 sticky bottom-0 bg-[#181A22]">
              <AdminButton variant="outline" onClick={() => { setEditing(null); setIsAdding(false); }}>
                <X className="h-4 w-4 mr-1" />
                Batal
              </AdminButton>
              <AdminButton onClick={handleSave}>
                <Save className="h-4 w-4 mr-1" />
                Simpan
              </AdminButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: CityStatus }) {
  const styles: Record<CityStatus, string> = {
    completed: "bg-[#F39F23]/20 text-[#FFB938] border-gold/30",
    open: "bg-green-500/20 text-green-400 border-green-500/30",
    soon: "bg-[#FD8656]/20 text-[#FFA577] border-orange-brand/30",
    soldout: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  const labels: Record<CityStatus, string> = {
    completed: "Selesai",
    open: "Terbuka",
    soon: "Segera",
    soldout: "Sold Out",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
