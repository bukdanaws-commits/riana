"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useAdminStore, type Partner } from "@/lib/admin-store";
import { AdminCard, AdminButton } from "../AdminDashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { EditModal } from "./TestimonialsView";
import { toast } from "sonner";

const TIERS = ["Platinum", "Gold", "Silver", "Media Partner"] as const;

const emptyP: Partner = {
  name: "", tier: "Silver", category: "", logoColor: "#FC7166", benefit: "",
};

export function PartnersView() {
  const partners = useAdminStore((s) => s.partners);
  const addPartner = useAdminStore((s) => s.addPartner);
  const updatePartner = useAdminStore((s) => s.updatePartner);
  const deletePartner = useAdminStore((s) => s.deletePartner);

  const [editing, setEditing] = useState<Partner | null>(null);
  const [editIdx, setEditIdx] = useState<number>(-1);

  const handleSave = () => {
    if (!editing) return;
    if (!editing.name || !editing.category) {
      toast.error("Nama dan kategori wajib diisi.");
      return;
    }
    if (editIdx === -1) {
      addPartner(editing);
      toast.success("Partner ditambahkan.");
    } else {
      updatePartner(editIdx, editing);
      toast.success("Partner diperbarui.");
    }
    setEditing(null);
    setEditIdx(-1);
  };

  // Group by tier
  const byTier = TIERS.map((tier) => ({
    tier,
    items: partners.map((p, idx) => ({ ...p, _idx: idx })).filter((p) => p.tier === tier),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-white/60 text-sm">{partners.length} partner total</p>
        <AdminButton onClick={() => { setEditing({ ...emptyP }); setEditIdx(-1); }}>
          <Plus className="h-4 w-4 mr-1" />
          Tambah Partner
        </AdminButton>
      </div>

      {byTier.map(({ tier, items }) => (
        <AdminCard key={tier}>
          <h3
            className="text-lg font-black text-white mb-3 flex items-center gap-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className={`inline-block h-3 w-3 rounded-full ${
              tier === "Platinum" ? "bg-violet-400" :
              tier === "Gold" ? "bg-[#F39F23]" :
              tier === "Silver" ? "bg-zinc-400" : "bg-cyan-400"
            }`} />
            {tier.toUpperCase()}
            <span className="text-xs text-white/50 font-mono">({items.length})</span>
          </h3>
          {items.length === 0 ? (
            <p className="text-white/40 text-sm italic">Belum ada partner di tier ini.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {items.map((p) => (
                <div
                  key={p._idx}
                  className="p-3 rounded-xl bg-[#0E0F14] border border-[#FC7166]/15 group"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                      style={{ background: p.logoColor }}
                    >
                      {p.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white text-sm">{p.name}</div>
                      <div className="text-[10px] text-white/60">{p.category}</div>
                      {p.benefit && (
                        <div className="text-[9px] text-[#FF8A80] mt-1 font-mono truncate">
                          {p.benefit}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-2 pt-2 border-t border-[#FC7166]/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon" variant="ghost"
                      className="h-7 w-7 text-white/60 hover:text-[#FF8A80]"
                      onClick={() => { setEditing({ ...p }); setEditIdx(p._idx); }}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon" variant="ghost"
                      className="h-7 w-7 text-white/60 hover:text-red-400"
                      onClick={() => {
                        if (confirm(`Hapus partner ${p.name}?`)) {
                          deletePartner(p._idx);
                          toast.success("Partner dihapus.");
                        }
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      ))}

      {editing && (
        <EditModal
          title={editIdx === -1 ? "TAMBAH PARTNER" : "EDIT PARTNER"}
          onClose={() => { setEditing(null); setEditIdx(-1); }}
          onSave={handleSave}
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-2">
              <Label className="text-white/80 text-xs font-bold uppercase">Nama Brand</Label>
              <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="bg-[#0E0F14] border-[#FC7166]/25 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80 text-xs font-bold uppercase">Tier</Label>
              <Select
                value={editing.tier}
                onValueChange={(v) => setEditing({ ...editing, tier: v as Partner["tier"] })}
              >
                <SelectTrigger className="bg-[#0E0F14] border-[#FC7166]/25 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#181A22] border-[#FC7166]/30">
                  {TIERS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white/80 text-xs font-bold uppercase">Kategori</Label>
              <Input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                placeholder="Beverage / Apparel / Retail"
                className="bg-[#0E0F14] border-[#FC7166]/25 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80 text-xs font-bold uppercase">Logo Color (hex)</Label>
              <div className="flex gap-2">
                <Input value={editing.logoColor} onChange={(e) => setEditing({ ...editing, logoColor: e.target.value })}
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white font-mono" />
                <div className="h-9 w-9 rounded-lg border border-[#FC7166]/30 flex-shrink-0"
                  style={{ background: editing.logoColor }} />
              </div>
            </div>
            <div className="col-span-2 space-y-2">
              <Label className="text-white/80 text-xs font-bold uppercase">Benefit (opsional)</Label>
              <Textarea value={editing.benefit ?? ""} onChange={(e) => setEditing({ ...editing, benefit: e.target.value })}
                rows={2}
                placeholder="Sponsor kota tunggal, booth standar..."
                className="bg-[#0E0F14] border-[#FC7166]/25 text-white resize-none" />
            </div>
          </div>
        </EditModal>
      )}
    </div>
  );
}
