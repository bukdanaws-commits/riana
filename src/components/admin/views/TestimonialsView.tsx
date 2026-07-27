"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Star } from "lucide-react";
import { useAdminStore, type Testimonial } from "@/lib/admin-store";
import { AdminCard, AdminButton } from "../AdminDashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const emptyT: Testimonial = {
  name: "", role: "", city: "", quote: "", rating: 5,
  avatarColor: "#FC7166", event: "",
};

export function TestimonialsView() {
  const testimonials = useAdminStore((s) => s.testimonials);
  const addTestimonial = useAdminStore((s) => s.addTestimonial);
  const updateTestimonial = useAdminStore((s) => s.updateTestimonial);
  const deleteTestimonial = useAdminStore((s) => s.deleteTestimonial);

  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [editIdx, setEditIdx] = useState<number>(-1);

  const handleSave = () => {
    if (!editing) return;
    if (!editing.name || !editing.quote) {
      toast.error("Nama dan quote wajib diisi.");
      return;
    }
    if (editIdx === -1) {
      addTestimonial(editing);
      toast.success("Testimoni ditambahkan.");
    } else {
      updateTestimonial(editIdx, editing);
      toast.success("Testimoni diperbarui.");
    }
    setEditing(null);
    setEditIdx(-1);
  };

  const handleEdit = (t: Testimonial, idx: number) => {
    setEditing({ ...t });
    setEditIdx(idx);
  };

  const handleDelete = (idx: number) => {
    if (confirm("Hapus testimoni ini?")) {
      deleteTestimonial(idx);
      toast.success("Testimoni dihapus.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-white/60 text-sm">{testimonials.length} testimoni</p>
        <AdminButton onClick={() => { setEditing({ ...emptyT }); setEditIdx(-1); }}>
          <Plus className="h-4 w-4 mr-1" />
          Tambah Testimoni
        </AdminButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {testimonials.map((t, idx) => (
          <AdminCard key={idx}>
            <div className="flex items-start gap-3">
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
                style={{ background: t.avatarColor }}
              >
                {t.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">{t.name}</div>
                    <div className="text-xs text-white/60">{t.role} • {t.city}</div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < t.rating
                            ? "text-[#FFB938] fill-[#F39F23]"
                            : "text-white/20 fill-cream/10"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-white/70 italic mt-2 line-clamp-3">"{t.quote}"</p>
                <div className="text-[10px] text-[#FF8A80] mt-2 font-mono">{t.event}</div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-[#FC7166]/15">
              <Button
                size="icon" variant="ghost"
                className="h-8 w-8 text-white/60 hover:text-[#FF8A80]"
                onClick={() => handleEdit(t, idx)}
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon" variant="ghost"
                className="h-8 w-8 text-white/60 hover:text-red-400"
                onClick={() => handleDelete(idx)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </AdminCard>
        ))}
      </div>

      {editing && (
        <EditModal
          title={editIdx === -1 ? "TAMBAH TESTIMONI" : "EDIT TESTIMONI"}
          onClose={() => { setEditing(null); setEditIdx(-1); }}
          onSave={handleSave}
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-white/80 text-xs font-bold uppercase">Nama</Label>
              <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="bg-[#0E0F14] border-[#FC7166]/25 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80 text-xs font-bold uppercase">Role</Label>
              <Input value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                className="bg-[#0E0F14] border-[#FC7166]/25 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80 text-xs font-bold uppercase">Kota</Label>
              <Input value={editing.city} onChange={(e) => setEditing({ ...editing, city: e.target.value })}
                className="bg-[#0E0F14] border-[#FC7166]/25 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80 text-xs font-bold uppercase">Event</Label>
              <Input value={editing.event} onChange={(e) => setEditing({ ...editing, event: e.target.value })}
                placeholder="Bandung 12 Juli 2026"
                className="bg-[#0E0F14] border-[#FC7166]/25 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80 text-xs font-bold uppercase">Rating (1-5)</Label>
              <Input
                type="number" min={1} max={5}
                value={editing.rating}
                onChange={(e) => setEditing({ ...editing, rating: Math.max(1, Math.min(5, parseInt(e.target.value) || 5)) })}
                className="bg-[#0E0F14] border-[#FC7166]/25 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80 text-xs font-bold uppercase">Avatar Color (hex)</Label>
              <Input value={editing.avatarColor} onChange={(e) => setEditing({ ...editing, avatarColor: e.target.value })}
                className="bg-[#0E0F14] border-[#FC7166]/25 text-white font-mono" />
            </div>
            <div className="col-span-2 space-y-2">
              <Label className="text-white/80 text-xs font-bold uppercase">Quote</Label>
              <Textarea
                value={editing.quote}
                onChange={(e) => setEditing({ ...editing, quote: e.target.value })}
                rows={4}
                className="bg-[#0E0F14] border-[#FC7166]/25 text-white resize-none"
              />
            </div>
          </div>
        </EditModal>
      )}
    </div>
  );
}

// Shared edit modal
export function EditModal({
  title, onClose, onSave, children,
}: {
  title: string;
  onClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0E0F14]/80 backdrop-blur-md">
      <div className="bg-[#181A22] border border-[#FC7166]/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scroll">
        <div className="flex items-center justify-between p-5 border-b border-[#FC7166]/20 sticky top-0 bg-[#181A22] z-10">
          <h3
            className="text-xl font-black text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h3>
          <Button size="icon" variant="ghost" className="text-white/60 hover:text-white" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-5">{children}</div>
        <div className="flex items-center justify-end gap-2 p-5 border-t border-[#FC7166]/20 sticky bottom-0 bg-[#181A22]">
          <AdminButton variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-1" /> Batal
          </AdminButton>
          <AdminButton onClick={onSave}>
            <Save className="h-4 w-4 mr-1" /> Simpan
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
