"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useAdminStore, type FAQItem } from "@/lib/admin-store";
import { AdminCard, AdminButton } from "../AdminDashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { EditModal } from "./TestimonialsView";
import { toast } from "sonner";

const CATEGORIES: FAQItem["category"][] = ["Pendaftaran", "Teknis", "Hari-H", "Rekor MURI"];

const emptyF: FAQItem = {
  category: "Pendaftaran",
  question: "",
  answer: "",
};

export function FaqView() {
  const faqs = useAdminStore((s) => s.faqs);
  const addFaq = useAdminStore((s) => s.addFaq);
  const updateFaq = useAdminStore((s) => s.updateFaq);
  const deleteFaq = useAdminStore((s) => s.deleteFaq);

  const [editing, setEditing] = useState<FAQItem | null>(null);
  const [editIdx, setEditIdx] = useState<number>(-1);

  const handleSave = () => {
    if (!editing) return;
    if (!editing.question || !editing.answer) {
      toast.error("Pertanyaan dan jawaban wajib diisi.");
      return;
    }
    if (editIdx === -1) {
      addFaq(editing);
      toast.success("FAQ ditambahkan.");
    } else {
      updateFaq(editIdx, editing);
      toast.success("FAQ diperbarui.");
    }
    setEditing(null);
    setEditIdx(-1);
  };

  // Group by category
  const byCategory = CATEGORIES.map((cat) => ({
    category: cat,
    items: faqs.map((f, idx) => ({ ...f, _idx: idx })).filter((f) => f.category === cat),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-white/60 text-sm">{faqs.length} FAQ total</p>
        <AdminButton onClick={() => { setEditing({ ...emptyF }); setEditIdx(-1); }}>
          <Plus className="h-4 w-4 mr-1" />
          Tambah FAQ
        </AdminButton>
      </div>

      {byCategory.map(({ category, items }) => (
        <AdminCard key={category}>
          <h3
            className="text-base font-black text-white mb-3 flex items-center gap-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#FC7166]" />
            {category.toUpperCase()}
            <span className="text-xs text-white/50 font-mono">({items.length})</span>
          </h3>
          {items.length === 0 ? (
            <p className="text-white/40 text-sm italic">Belum ada FAQ di kategori ini.</p>
          ) : (
            <Accordion type="single" collapsible className="space-y-2">
              {items.map((f) => (
                <AccordionItem
                  key={f._idx}
                  value={`item-${f._idx}`}
                  className="rounded-xl bg-[#0E0F14] border border-[#FC7166]/15 px-3 overflow-hidden"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-3 group">
                    <div className="flex items-start justify-between gap-3 pr-2 flex-1">
                      <span className="text-sm font-bold text-white">{f.question}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <Button
                          size="icon" variant="ghost"
                          className="h-7 w-7 text-white/60 hover:text-[#FF8A80]"
                          onClick={(e) => {
                            e.preventDefault();
                            setEditing({ ...f });
                            setEditIdx(f._idx);
                          }}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon" variant="ghost"
                          className="h-7 w-7 text-white/60 hover:text-red-400"
                          onClick={(e) => {
                            e.preventDefault();
                            if (confirm("Hapus FAQ ini?")) {
                              deleteFaq(f._idx);
                              toast.success("FAQ dihapus.");
                            }
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-white/70 text-sm pb-3">
                    {f.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </AdminCard>
      ))}

      {editing && (
        <EditModal
          title={editIdx === -1 ? "TAMBAH FAQ" : "EDIT FAQ"}
          onClose={() => { setEditing(null); setEditIdx(-1); }}
          onSave={handleSave}
        >
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-white/80 text-xs font-bold uppercase">Kategori</Label>
              <Select
                value={editing.category}
                onValueChange={(v) => setEditing({ ...editing, category: v as FAQItem["category"] })}
              >
                <SelectTrigger className="bg-[#0E0F14] border-[#FC7166]/25 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#181A22] border-[#FC7166]/30">
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white/80 text-xs font-bold uppercase">Pertanyaan</Label>
              <Input value={editing.question} onChange={(e) => setEditing({ ...editing, question: e.target.value })}
                className="bg-[#0E0F14] border-[#FC7166]/25 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white/80 text-xs font-bold uppercase">Jawaban</Label>
              <Textarea value={editing.answer} onChange={(e) => setEditing({ ...editing, answer: e.target.value })}
                rows={6}
                className="bg-[#0E0F14] border-[#FC7166]/25 text-white resize-none" />
            </div>
          </div>
        </EditModal>
      )}
    </div>
  );
}
