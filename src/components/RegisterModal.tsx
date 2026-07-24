"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CITIES, type CityEvent } from "@/data/event";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Ticket,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface RegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedCity?: string | null;
}

export function RegisterModal({
  open,
  onOpenChange,
  preselectedCity,
}: RegisterModalProps) {
  // Use a key to remount the inner component each time the modal opens.
  // This guarantees fresh state without calling setState inside effects.
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg sm:max-w-xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto custom-scroll">
        <RegisterModalInner
          key={`${open}-${preselectedCity ?? "none"}`}
          preselectedCity={preselectedCity}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
}

type Step = "select" | "form" | "success";

function RegisterModalInner({
  preselectedCity,
  onOpenChange,
}: {
  preselectedCity?: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  // Compute initial state from props once per mount.
  const preselected = preselectedCity
    ? CITIES.find((c) => c.id === preselectedCity) ?? null
    : null;

  const [step, setStep] = useState<Step>(preselected ? "form" : "select");
  const [selectedCity, setSelectedCity] = useState<CityEvent | null>(preselected);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    ticketType: "regular",
  });

  const handleSelect = (city: CityEvent) => {
    setSelectedCity(city);
    setStep("form");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast.error("Lengkapi semua field terlebih dahulu.");
      return;
    }
    setStep("success");
  };

  return (
    <>
      {/* Header band */}
      <div className="bg-brand-gradient px-6 py-5 text-white relative overflow-hidden">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/15" />
        <div className="absolute -right-4 bottom-0 h-20 w-20 rounded-full bg-white/10" />
        <DialogHeader className="relative">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase opacity-90 mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            Pendaftaran Peserta
          </div>
          <DialogTitle className="text-2xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>
            {step === "select" && "Pilih Kota Anda"}
            {step === "form" && "Lengkapi Data Diri"}
            {step === "success" && "Pendaftaran Berhasil!"}
          </DialogTitle>
          <DialogDescription className="text-white/90">
            {step === "select" && "20 kota • 10.000+ peserta • 1 rekor sejarah"}
            {step === "form" && `Event di ${selectedCity?.city} — ${selectedCity?.dateLabel} 2026`}
            {step === "success" && "Selamat! Anda resmi menjadi bagian dari sejarah MURI."}
          </DialogDescription>
        </DialogHeader>
      </div>

      {/* Step body */}
      <div className="p-6">
        {step === "select" && (
          <div className="space-y-3 max-h-[55vh] overflow-y-auto custom-scroll pr-1">
            {CITIES.map((city) => {
              const isFinale = city.id === "jakarta";
              const seatsPct = Math.round(
                (city.registered / city.capacity) * 100,
              );
              return (
                <button
                  key={city.id}
                  onClick={() => handleSelect(city)}
                  className="group w-full text-left flex items-center gap-4 p-4 rounded-2xl border-2 border-zinc-100 hover:border-orange-300 hover:bg-orange-50/40 transition-all"
                >
                  <div
                    className={`flex-shrink-0 h-14 w-14 rounded-2xl flex flex-col items-center justify-center text-white font-bold ${
                      isFinale
                        ? "bg-brand-warm"
                        : "bg-gradient-to-br from-orange-500 to-orange-600"
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-wider opacity-90">
                      {city.dayLabel.slice(0, 3)}
                    </span>
                    <span className="text-sm leading-tight">{city.dateLabel.split(" ")[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-900">{city.city}</span>
                      {isFinale && (
                        <Badge className="bg-orange-400 text-amber-950 text-[10px] hover:bg-orange-400">
                          GRAND FINALE
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-zinc-500 truncate mt-0.5">
                      {city.venue}
                    </div>
                    {city.registered > 0 && (
                      <div className="mt-1.5">
                        <div className="h-1 w-full rounded-full bg-zinc-100 overflow-hidden">
                          <div
                            className="h-full bg-brand-warm"
                            style={{ width: `${seatsPct}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">
                          {city.registered}/{city.capacity} terdaftar
                        </div>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="h-5 w-5 text-zinc-300 group-hover:text-orange-500 transition-colors flex-shrink-0" />
                </button>
              );
            })}
          </div>
        )}

        {step === "form" && selectedCity && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Selected city summary */}
            <div className="rounded-2xl border-2 border-orange-200 bg-orange-50/50 p-4">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-xl bg-brand-gradient flex items-center justify-center text-white">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-zinc-900">{selectedCity.city}</div>
                  <div className="text-xs text-zinc-600 mt-0.5 flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {selectedCity.dateLabel} 2026 • {selectedCity.dayLabel}
                  </div>
                  <div className="text-xs text-zinc-600 mt-0.5">{selectedCity.venue}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("select")}
                  className="text-xs font-semibold text-orange-600 hover:underline"
                >
                  Ubah
                </button>
              </div>
            </div>

            {/* Form fields */}
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Contoh: Dewi Anggraini"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@contoh.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor WhatsApp</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="0813-xxxx-xxxx"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Jenis Tiket</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, ticketType: "regular" })}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    form.ticketType === "regular"
                      ? "border-orange-500 bg-orange-50"
                      : "border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Ticket className="h-4 w-4 text-orange-500" />
                    <span className="font-bold text-sm">Regular</span>
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">Gratis + e-Cert</div>
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, ticketType: "vip" })}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    form.ticketType === "vip"
                      ? "border-orange-500 bg-orange-50"
                      : "border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-orange-500" />
                    <span className="font-bold text-sm">VIP</span>
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">Merch + Front Row</div>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("select")}
                className="flex-1"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Kembali
              </Button>
              <Button
                type="submit"
                className="flex-[2] bg-brand-gradient text-white font-bold shadow-glow-pink"
              >
                Konfirmasi Pendaftaran
              </Button>
            </div>
          </form>
        )}

        {step === "success" && selectedCity && (
          <div className="text-center py-6">
            <div className="mx-auto h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-extrabold mb-2" style={{ fontFamily: "var(--font-display)" }}>
              Anda Resmi Terdaftar!
            </h3>
            <p className="text-sm text-zinc-600 mb-4 max-w-sm mx-auto">
              Terima kasih <span className="font-bold">{form.name}</span>! E-ticket dan QR code
              akan dikirim ke <span className="font-bold">{form.email}</span> dan WhatsApp Anda
              dalam 1×24 jam.
            </p>
            <div className="rounded-2xl bg-orange-50 border border-orange-200 p-4 text-left text-sm space-y-1.5 mb-4">
              <div className="flex justify-between">
                <span className="text-zinc-500">Kota</span>
                <span className="font-bold">{selectedCity.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Tanggal</span>
                <span className="font-bold">{selectedCity.dateLabel} 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Tiket</span>
                <span className="font-bold uppercase">{form.ticketType}</span>
              </div>
            </div>
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full bg-brand-gradient text-white font-bold shadow-glow-pink"
            >
              Selesai
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
