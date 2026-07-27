"use client";

import { useState, useMemo } from "react";
import {
  Search, Filter, Download, Trash2, Users, CheckCircle2, Star, DollarSign,
  Eye, ChevronLeft, ChevronRight, X, RefreshCw,
} from "lucide-react";
import { useAdminStore, type Registration } from "@/lib/admin-store";
import { AdminCard, AdminButton } from "../AdminDashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { formatRupiah } from "@/data/pricing";
import { toast } from "sonner";
import { RegistrationDetail } from "./RegistrationDetail";

const PAGE_SIZE = 50;

type StatusFilter = "all" | "registered" | "checked_in" | "cancelled" | "no_show" | "refunded";
type TicketFilter = "all" | "regular" | "vip";
type PayFilter = "all" | "free" | "pending" | "paid" | "refunded";

export function RegistrationsView() {
  const registrations = useAdminStore((s) => s.registrations);
  const deleteRegistration = useAdminStore((s) => s.deleteRegistration);
  const bulkDeleteRegistrations = useAdminStore((s) => s.bulkDeleteRegistrations);
  const bulkUpdateRegistrations = useAdminStore((s) => s.bulkUpdateRegistrations);
  const resetRegistrations = useAdminStore((s) => s.resetRegistrations);

  const [search, setSearch] = useState("");
  const [filterCity, setFilterCity] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<StatusFilter>("all");
  const [filterTicket, setFilterTicket] = useState<TicketFilter>("all");
  const [filterPay, setFilterPay] = useState<PayFilter>("all");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailReg, setDetailReg] = useState<Registration | null>(null);

  // Apply filters
  const filtered = useMemo(() => {
    return registrations.filter((r) => {
      // Search
      if (search) {
        const q = search.toLowerCase();
        if (
          !r.fullName.toLowerCase().includes(q) &&
          !r.googleEmail.toLowerCase().includes(q) &&
          !r.phone.toLowerCase().includes(q) &&
          !r.id.toLowerCase().includes(q)
        )
          return false;
      }
      if (filterCity !== "all" && r.eventCityId !== filterCity) return false;
      if (filterStatus !== "all" && r.status !== filterStatus) return false;
      if (filterTicket !== "all" && r.ticketType !== filterTicket) return false;
      if (filterPay !== "all" && r.paymentStatus !== filterPay) return false;
      return true;
    });
  }, [registrations, search, filterCity, filterStatus, filterTicket, filterPay]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset page when filter changes
  const onFilterChange = (fn: () => void) => {
    fn();
    setPage(1);
    setSelectedIds(new Set());
  };

  // Stats
  const stats = useMemo(() => {
    const total = registrations.length;
    const checkedIn = registrations.filter((r) => r.status === "checked_in").length;
    const vip = registrations.filter((r) => r.ticketType === "vip").length;
    const revenue = registrations
      .filter((r) => r.paymentStatus === "paid")
      .reduce((sum, r) => sum + (r.paymentAmount ?? 0), 0);
    return { total, checkedIn, vip, revenue };
  }, [registrations]);

  // Bulk actions
  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (confirm(`Hapus ${selectedIds.size} peserta terpilih?`)) {
      bulkDeleteRegistrations(Array.from(selectedIds));
      toast.success(`${selectedIds.size} peserta dihapus.`);
      setSelectedIds(new Set());
    }
  };

  const handleBulkCheckIn = () => {
    if (selectedIds.size === 0) return;
    bulkUpdateRegistrations(Array.from(selectedIds), {
      status: "checked_in",
      checkInTime: new Date().toISOString(),
      checkInMethod: "manual",
      checkedInBy: "admin@rianaonthemove.id",
    });
    toast.success(`${selectedIds.size} peserta di-check-in.`);
    setSelectedIds(new Set());
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "ID", "Tgl Daftar", "Nama", "Email", "Phone", "Gender", "Usia",
      "Kota Event", "Tgl Event", "Tipe Tiket", "Harga", "Status Bayar",
      "Status Hadir", "Sumber Referral", "Referral Code", "Marketing Consent",
    ];
    const rows = filtered.map((r) => [
      r.id, r.registrationDate, r.fullName, r.googleEmail, r.phone, r.gender, r.age,
      r.eventCityName, r.eventDate, r.ticketType, r.ticketPrice,
      r.paymentStatus, r.status, r.referralSource ?? "", r.referralCode,
      r.marketingConsent ? "Yes" : "No",
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `peserta-${new Date().toISOString().split("T")[0]}-${filtered.length}-rows.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} peserta ke CSV.`);
  };

  // Selection
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paged.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paged.map((r) => r.id)));
    }
  };

  const activeFilters = [
    filterCity !== "all" && { label: `Kota: ${filterCity}`, clear: () => onFilterChange(() => setFilterCity("all")) },
    filterStatus !== "all" && { label: `Status: ${filterStatus}`, clear: () => onFilterChange(() => setFilterStatus("all")) },
    filterTicket !== "all" && { label: `Tiket: ${filterTicket}`, clear: () => onFilterChange(() => setFilterTicket("all")) },
    filterPay !== "all" && { label: `Bayar: ${filterPay}`, clear: () => onFilterChange(() => setFilterPay("all")) },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  return (
    <div className="space-y-4">
      {/* === STATS CARDS === */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Users} label="Total Pendaftar" value={stats.total} color="magenta" />
        <StatCard icon={CheckCircle2} label="Checked-in" value={stats.checkedIn} color="green" />
        <StatCard icon={Star} label="VIP Tiket" value={stats.vip} color="gold" />
        <StatCard icon={DollarSign} label="Revenue" value={formatRupiah(stats.revenue)} color="orange" small />
      </div>

      {/* === FILTERS === */}
      <AdminCard>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Cari nama, email, phone, ID..."
              value={search}
              onChange={(e) => onFilterChange(() => setSearch(e.target.value))}
              className="pl-9 bg-[#0E0F14] border-[#FC7166]/25 text-white placeholder:text-white/30"
            />
          </div>
          <Select value={filterCity} onValueChange={(v) => onFilterChange(() => setFilterCity(v))}>
            <SelectTrigger className="w-[140px] bg-[#0E0F14] border-[#FC7166]/25 text-white">
              <SelectValue placeholder="Kota" />
            </SelectTrigger>
            <SelectContent className="bg-[#181A22] border-[#FC7166]/30">
              <SelectItem value="all">Semua Kota</SelectItem>
              {useAdminStore.getState().cities.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={(v) => onFilterChange(() => setFilterStatus(v as StatusFilter))}>
            <SelectTrigger className="w-[140px] bg-[#0E0F14] border-[#FC7166]/25 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#181A22] border-[#FC7166]/30">
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="registered">Registered</SelectItem>
              <SelectItem value="checked_in">Checked-in</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="no_show">No Show</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterTicket} onValueChange={(v) => onFilterChange(() => setFilterTicket(v as TicketFilter))}>
            <SelectTrigger className="w-[120px] bg-[#0E0F14] border-[#FC7166]/25 text-white">
              <SelectValue placeholder="Tiket" />
            </SelectTrigger>
            <SelectContent className="bg-[#181A22] border-[#FC7166]/30">
              <SelectItem value="all">Semua Tiket</SelectItem>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPay} onValueChange={(v) => onFilterChange(() => setFilterPay(v as PayFilter))}>
            <SelectTrigger className="w-[140px] bg-[#0E0F14] border-[#FC7166]/25 text-white">
              <SelectValue placeholder="Pembayaran" />
            </SelectTrigger>
            <SelectContent className="bg-[#181A22] border-[#FC7166]/30">
              <SelectItem value="all">Semua Bayar</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
          <AdminButton onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-1" />
            Export CSV
          </AdminButton>
          <AdminButton variant="outline" onClick={() => { if (confirm("Reset data peserta ke mock default?")) { resetRegistrations(); toast.success("Data peserta direset."); } }}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Reset
          </AdminButton>
        </div>

        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-[#FC7166]/15">
            <span className="text-xs text-white/50 font-bold uppercase">Filter aktif:</span>
            {activeFilters.map((f, i) => (
              <button
                key={i}
                onClick={f.clear}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FC7166]/15 border border-[#FC7166]/30 text-[#FF8A80] text-xs font-bold hover:bg-[#FC7166]/25"
              >
                {f.label}
                <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        )}
      </AdminCard>

      {/* === BULK ACTIONS (when selected) === */}
      {selectedIds.size > 0 && (
        <AdminCard className="border-[#FC7166]/40 bg-[#FC7166]/5">
          <div className="flex items-center justify-between">
            <span className="text-white font-bold">
              {selectedIds.size} peserta dipilih
            </span>
            <div className="flex items-center gap-2">
              <AdminButton size="sm" onClick={handleBulkCheckIn}>
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                Check-in Massal
              </AdminButton>
              <AdminButton size="sm" onClick={handleExportCSV}>
                <Download className="h-3.5 w-3.5 mr-1" />
                Export Selected
              </AdminButton>
              <AdminButton size="sm" variant="destructive" onClick={handleBulkDelete}>
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Delete ({selectedIds.size})
              </AdminButton>
              <AdminButton size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>
                <X className="h-3.5 w-3.5" />
              </AdminButton>
            </div>
          </div>
        </AdminCard>
      )}

      {/* === TABLE === */}
      <AdminCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto custom-scroll">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#FC7166]/20 bg-[#0E0F14]/50">
                <th className="p-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === paged.length && paged.length > 0}
                    onChange={toggleSelectAll}
                    className="h-4 w-4"
                  />
                </th>
                <th className="text-left p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider">ID</th>
                <th className="text-left p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider">Nama</th>
                <th className="text-left p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider hidden lg:table-cell">Google Email</th>
                <th className="text-left p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider hidden md:table-cell">Phone</th>
                <th className="text-left p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider">Kota Event</th>
                <th className="text-center p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider">Tiket</th>
                <th className="text-center p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider hidden lg:table-cell">Bayar</th>
                <th className="text-center p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider">Status</th>
                <th className="text-right p-3 text-white/60 font-bold uppercase text-[10px] tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((r) => (
                <tr
                  key={r.id}
                  className={`border-b border-[#FC7166]/10 hover:bg-[#FC7166]/5 transition-colors ${
                    selectedIds.has(r.id) ? "bg-[#FC7166]/10" : ""
                  }`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(r.id)}
                      onChange={() => toggleSelect(r.id)}
                      className="h-4 w-4"
                    />
                  </td>
                  <td className="p-3 font-mono text-[10px] text-white/70">{r.id}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={r.googleAvatarUrl}
                        alt={r.fullName}
                        className="h-7 w-7 rounded-full bg-[#0E0F14] flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <div>
                        <div className="font-bold text-white text-sm">{r.fullName}</div>
                        <div className="text-[10px] text-white/50">{r.gender === "P" ? "Perempuan" : "Laki-laki"} • {r.age} thn</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-white/70 text-xs hidden lg:table-cell">{r.googleEmail}</td>
                  <td className="p-3 text-white/70 text-xs hidden md:table-cell font-mono">{r.phone}</td>
                  <td className="p-3">
                    <div className="text-white text-sm font-semibold">{r.eventCityName}</div>
                    <div className="text-[10px] text-white/50">{r.eventDate}</div>
                  </td>
                  <td className="p-3 text-center">
                    {r.ticketType === "vip" ? (
                      <Badge className="bg-[#F39F23]/20 text-[#FFB938] border-gold/30 text-[9px]">VIP</Badge>
                    ) : (
                      <Badge className="bg-[#FC7166]/15 text-[#FF8A80] border-[#FC7166]/30 text-[9px]">REG</Badge>
                    )}
                  </td>
                  <td className="p-3 text-center hidden lg:table-cell">
                    <PayBadge status={r.paymentStatus} />
                  </td>
                  <td className="p-3 text-center">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-white/60 hover:text-[#FF8A80]"
                        onClick={() => setDetailReg(r)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-white/60 hover:text-red-400"
                        onClick={() => {
                          if (confirm(`Hapus peserta ${r.fullName}?`)) {
                            deleteRegistration(r.id);
                            toast.success("Peserta dihapus.");
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-white/40">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    Tidak ada peserta yang cocok dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between p-3 border-t border-[#FC7166]/20 bg-[#0E0F14]/30">
            <div className="text-xs text-white/60">
              Menampilkan {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length} peserta
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="bg-[#0E0F14] border-[#FC7166]/25 text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs text-white/70 px-2 font-mono">
                {page} / {totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="bg-[#0E0F14] border-[#FC7166]/25 text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </AdminCard>

      {/* === DETAIL MODAL === */}
      {detailReg && (
        <RegistrationDetail
          registration={detailReg}
          onClose={() => setDetailReg(null)}
        />
      )}
    </div>
  );
}

// ============================================================
// Helper components
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
        className={`font-black text-white leading-none ${small ? "text-lg" : "text-2xl"}`}
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

function PayBadge({ status }: { status: Registration["paymentStatus"] }) {
  const styles = {
    free: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
    pending: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    paid: "bg-green-500/20 text-green-400 border-green-500/30",
    refunded: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    failed: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  const labels = {
    free: "Free",
    pending: "Pending",
    paid: "Paid",
    refunded: "Refund",
    failed: "Failed",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function StatusBadge({ status }: { status: Registration["status"] }) {
  const styles = {
    registered: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    checked_in: "bg-green-500/20 text-green-400 border-green-500/30",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
    no_show: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    refunded: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
  };
  const labels = {
    registered: "Registered",
    checked_in: "Checked-in",
    cancelled: "Cancelled",
    no_show: "No Show",
    refunded: "Refunded",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
