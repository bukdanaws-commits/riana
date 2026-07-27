"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import { useAdminStore, type GalleryItem } from "@/lib/admin-store";
import { AdminCard, AdminButton } from "../AdminDashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EditModal } from "./TestimonialsView";
import { toast } from "sonner";

const emptyG: GalleryItem = {
  id: 0,
  hue: 320,
  label: "",
  caption: "",
  city: "",
  date: "",
  participants: 0,
  isRealPhoto: false,
  photoUrl: "",
};

export function GalleryView() {
  const gallery = useAdminStore((s) => s.gallery);
  const addGalleryItem = useAdminStore((s) => s.addGalleryItem);
  const updateGalleryItem = useAdminStore((s) => s.updateGalleryItem);
  const deleteGalleryItem = useAdminStore((s) => s.deleteGalleryItem);

  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [editIdx, setEditIdx] = useState<number>(-1);

  const handleSave = () => {
    if (!editing) return;
    if (!editing.label) {
      toast.error("Label wajib diisi.");
      return;
    }
    const item = { ...editing, id: editing.id || Date.now() };
    if (editIdx === -1) {
      addGalleryItem(item);
      toast.success("Item galeri ditambahkan.");
    } else {
      updateGalleryItem(editIdx, item);
      toast.success("Item galeri diperbarui.");
    }
    setEditing(null);
    setEditIdx(-1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-white/60 text-sm">{gallery.length} item galeri</p>
        <AdminButton onClick={() => { setEditing({ ...emptyG }); setEditIdx(-1); }}>
          <Plus className="h-4 w-4 mr-1" />
          Tambah Item
        </AdminButton>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {gallery.map((g, idx) => (
          <AdminCard key={idx} className="p-0 overflow-hidden group">
            <div className="aspect-square relative overflow-hidden">
              {g.isRealPhoto && g.photoUrl ? (
                <img src={g.photoUrl} alt={g.label} className="h-full w-full object-cover" />
              ) : (
                <div
                  className="h-full w-full"
                  style={{
                    background: `linear-gradient(135deg, hsl(${g.hue} 55% 35%) 0%, hsl(${g.hue + 20} 45% 25%) 50%, hsl(${g.hue + 40} 40% 18%) 100%)`,
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-purpleblack/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-2">
                <div className="text-white font-bold text-xs">{g.label}</div>
                <div className="text-white/60 text-[9px] truncate">{g.caption}</div>
                <div className="text-[8px] text-[#FF8A80] mt-0.5 font-mono">
                  {g.city} • {g.participants} pax
                </div>
              </div>
              <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon" variant="ghost"
                  className="h-7 w-7 bg-[#0E0F14]/60 backdrop-blur-md text-white hover:text-[#FF8A80]"
                  onClick={() => { setEditing({ ...g }); setEditIdx(idx); }}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  size="icon" variant="ghost"
                  className="h-7 w-7 bg-[#0E0F14]/60 backdrop-blur-md text-white hover:text-red-400"
                  onClick={() => {
                    if (confirm("Hapus item ini?")) {
                      deleteGalleryItem(idx);
                      toast.success("Item dihapus.");
                    }
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </AdminCard>
        ))}
        {gallery.length === 0 && (
          <div className="col-span-full text-center py-12 text-white/40">
            <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
            Belum ada item galeri.
          </div>
        )}
      </div>

      {editing && (
        <EditModal
          title={editIdx === -1 ? "TAMBAH ITEM GALERI" : "EDIT ITEM GALERI"}
          onClose={() => { setEditing(null); setEditIdx(-1); }}
          onSave={handleSave}
        >
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-white/80 text-xs font-bold uppercase">Label</Label>
              <Input value={editing.label} onChange={(e) => setEditing({ ...editing, label: e.target.value })}
                className="bg-[#0E0F14] border-[#FC7166]/25 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80 text-xs font-bold uppercase">Caption</Label>
              <Input value={editing.caption} onChange={(e) => setEditing({ ...editing, caption: e.target.value })}
                className="bg-[#0E0F14] border-[#FC7166]/25 text-white" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase">Kota</Label>
                <Input value={editing.city} onChange={(e) => setEditing({ ...editing, city: e.target.value })}
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase">Tanggal</Label>
                <Input value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                  placeholder="12 Juli 2026"
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase">Pax</Label>
                <Input
                  type="number"
                  value={editing.participants}
                  onChange={(e) => setEditing({ ...editing, participants: parseInt(e.target.value) || 0 })}
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase">Photo URL</Label>
                <Input
                  value={editing.photoUrl ?? ""}
                  onChange={(e) => setEditing({ ...editing, photoUrl: e.target.value })}
                  placeholder="/brand/photo.jpg atau https://..."
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white font-mono text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80 text-xs font-bold uppercase">Hue (gradient fallback)</Label>
                <Input
                  type="number" min={0} max={360}
                  value={editing.hue}
                  onChange={(e) => setEditing({ ...editing, hue: parseInt(e.target.value) || 0 })}
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isRealPhoto"
                checked={editing.isRealPhoto ?? false}
                onChange={(e) => setEditing({ ...editing, isRealPhoto: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="isRealPhoto" className="text-white/80 text-sm cursor-pointer">
                Pakai foto asli (bukan gradient)
              </Label>
            </div>
          </div>
        </EditModal>
      )}
    </div>
  );
}
