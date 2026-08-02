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
import { type CityEvent } from "@/data/event";
import { useCities, useAdminStore } from "@/lib/admin-store";
import { getCityPricing, formatRupiah, isEarlyBirdActive } from "@/data/pricing";
import type { Registration } from "@/data/mock-registrations";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Ticket,
  Sparkles,
  Loader2,
  Lock,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

type Step = "select" | "google" | "form" | "success";

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
      <DialogContent className="max-w-lg sm:max-w-xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto custom-scroll bg-[#0E0F14] border border-[#FC7166]/30">
        <RegisterModalInner
          key={`${open}-${preselectedCity ?? "none"}`}
          preselectedCity={preselectedCity}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
}

function RegisterModalInner({
  preselectedCity,
  onOpenChange,
}: {
  preselectedCity?: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  // Compute initial state from props once per mount.
  const CITIES = useCities();
  const addRegistration = useAdminStore((s) => s.addRegistration);
  const preselected = preselectedCity
    ? CITIES.find((c) => c.id === preselectedCity) ?? null
    : null;

  const [step, setStep] = useState<Step>(preselected ? "form" : "select");
  const [selectedCity, setSelectedCity] = useState<CityEvent | null>(preselected);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [registeredId, setRegisteredId] = useState<string | null>(null);
  const [googleUser, setGoogleUser] = useState<{
    email: string;
    name: string;
    avatar: string;
    userId: string;
  } | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
    gender: "P" as "L" | "P" | "other",
    address: "",
    cityDomicile: "",
    postalCode: "",
    emergencyName: "",
    emergencyPhone: "",
    ticketType: "regular" as "regular" | "vip",
    referralSource: "instagram" as Registration["referralSource"],
    marketingConsent: false,
  });

  // Get pricing for selected city
  const pricing = selectedCity ? getCityPricing(selectedCity.id, selectedCity.date) : null;
  const earlyBirdActive = selectedCity ? isEarlyBirdActive(selectedCity.date) : false;

  const handleSelect = (city: CityEvent) => {
    setSelectedCity(city);
    setStep("google"); // Now requires Google sign-in first
  };

  // === Mock Google OAuth ===
  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    // Simulate Google OAuth flow (1.5s loading)
    setTimeout(() => {
      // Generate mock Google user
      const firstNames = ["Dewi", "Sinta", "Michael", "Ratna", "Budi", "Lia", "Andi", "Maya"];
      const lastNames = ["Anggraini", "Prakoso", "Santoso", "Wibowo", "Kusumawardani", "Maharani"];
      const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
      const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
      const name = `${fn} ${ln}`;
      const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${Math.floor(Math.random() * 99)}@gmail.com`;
      const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=ff6b35,df2679,d4af37`;

      setGoogleUser({ email, name, avatar, userId: `mock-${Date.now()}` });
      setForm((f) => ({ ...f, name, email }));
      setGoogleLoading(false);
      setStep("form");
      toast.success(`Berhasil login sebagai ${name}`);
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!form.name || !form.email || !form.phone || !form.birthDate || !form.address) {
      const msg = "Lengkapi semua field wajib (nama, email, phone, tanggal lahir, alamat).";
      setSubmitError(msg);
      toast.error(msg);
      return;
    }
    if (!selectedCity || !googleUser) {
      const msg = "Sesi tidak valid. Silakan mulai ulang.";
      setSubmitError(msg);
      toast.error(msg);
      return;
    }

    // Compute ticket price client-side (server will validate)
    const ticketPrice = form.ticketType === "vip"
      ? (earlyBirdActive && pricing ? pricing.vip.earlyBirdPrice : pricing?.vip.price ?? 0)
      : 0;

    // Build API payload (snake_case to match Supabase schema)
    const payload = {
      google_email: googleUser.email,
      google_name: googleUser.name,
      google_avatar_url: googleUser.avatar,
      full_name: form.name,
      phone: form.phone,
      birth_date: form.birthDate,
      gender: form.gender,
      address: form.address,
      city_domicile: form.cityDomicile || selectedCity.city,
      postal_code: form.postalCode,
      emergency_contact_name: form.emergencyName || null,
      emergency_contact_phone: form.emergencyPhone || null,
      event_city_id: selectedCity.id,
      event_city_name: selectedCity.city,
      event_date: selectedCity.date,
      ticket_type: form.ticketType,
      ticket_price: ticketPrice,
      referral_source: form.referralSource,
      marketing_consent: form.marketingConsent,
      notes: null,
    };

    setSubmitting(true);

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok || json.error) {
        const msg = json.error || `HTTP ${res.status}: Gagal mendaftar`;
        setSubmitError(msg);
        toast.error(msg);
        setSubmitting(false);
        return;
      }

      // Success — registration is now in Supabase
      const regNum = json.data?.registration_number || json.data?.id || "REG-2026";
      setRegisteredId(regNum);

      // Also push to local Zustand store for instant UI feedback
      // (dashboard cache; the source of truth is now Supabase)
      const now = new Date().toISOString();
      const optimisticReg: Registration = {
        id: json.data?.id ?? regNum,
        registrationDate: now,
        lastUpdate: now,
        userId: googleUser.userId,
        googleEmail: googleUser.email,
        googleName: googleUser.name,
        googleAvatarUrl: googleUser.avatar,
        fullName: form.name,
        phone: form.phone,
        birthDate: form.birthDate,
        age: new Date().getFullYear() - new Date(form.birthDate).getFullYear(),
        gender: form.gender,
        address: form.address,
        cityDomicile: form.cityDomicile || selectedCity.city,
        province: "",
        postalCode: form.postalCode,
        emergencyContactName: form.emergencyName || undefined,
        emergencyContactPhone: form.emergencyPhone || undefined,
        eventCityId: selectedCity.id,
        eventCityName: selectedCity.city,
        eventDate: selectedCity.date,
        ticketType: form.ticketType,
        ticketPrice,
        paymentStatus: form.ticketType === "vip" ? "pending" : "free",
        paymentAmount: ticketPrice,
        invoiceNumber: form.ticketType === "vip" ? `INV-${regNum}` : undefined,
        status: "registered",
        eTicketSent: form.ticketType === "regular",
        eTicketSentAt: form.ticketType === "regular" ? now : undefined,
        eCertificateSent: false,
        whatsappReminderSent: false,
        referralSource: form.referralSource,
        referralCode: `${form.name.split(" ")[0].toUpperCase()}-${regNum}`,
        marketingConsent: form.marketingConsent,
        isMuriRecord: true,
        muriVerified: false,
        tags: [],
        createdAt: now,
        updatedAt: now,
      };
      addRegistration(optimisticReg);

      setStep("success");
      toast.success(`Pendaftaran berhasil! ID: ${regNum}`);
    } catch (err) {
      console.error("[RegisterModal] submit error:", err);
      const msg = "Gagal terhubung ke server. Cek koneksi internet lalu coba lagi.";
      setSubmitError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Header band */}
      <div className="bg-gradient-to-r from-[#FC7166] to-[#FD8656] px-6 py-5 text-white relative overflow-hidden">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/15" />
        <div className="absolute -right-4 bottom-0 h-20 w-20 rounded-full bg-white/10" />
        <DialogHeader className="relative">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase opacity-90 mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            Pendaftaran Peserta
          </div>
          <DialogTitle className="text-2xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>
            {step === "select" && "Pilih Kota Anda"}
            {step === "google" && "Sign in dengan Google"}
            {step === "form" && "Lengkapi Data Diri"}
            {step === "success" && "Pendaftaran Berhasil!"}
          </DialogTitle>
          <DialogDescription className="text-white/90">
            {step === "select" && "20 kota • 10.000+ peserta • 1 rekor sejarah"}
            {step === "google" && selectedCity ? `Event di ${selectedCity.city} — ${selectedCity.dateLabel} 2026` : ""}
            {step === "form" && googleUser ? `Login sebagai ${googleUser.name}` : ""}
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
                  className="group w-full text-left flex items-center gap-4 p-4 rounded-2xl border border-[#FC7166]/20 hover:border-[#FC7166] hover:bg-[#FC7166]/10 transition-all"
                >
                  <div
                    className={`flex-shrink-0 h-14 w-14 rounded-2xl flex flex-col items-center justify-center text-white font-bold ${
                      isFinale
                        ? "bg-gradient-to-r from-[#FD8656] to-[#FC7166]"
                        : "bg-gradient-to-br from-magenta to-magenta-deep"
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-wider opacity-90">
                      {city.dayLabel.slice(0, 3)}
                    </span>
                    <span className="text-sm leading-tight">{city.dateLabel.split(" ")[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0E0F14]">{city.city}</span>
                      {isFinale && (
                        <Badge className="bg-[#F39F23] text-[#0E0F14] text-[10px] hover:bg-[#F39F23]">
                          GRAND FINALE
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-[#0E0F14]/60 truncate mt-0.5">
                      {city.venue}
                    </div>
                    {city.registered > 0 && (
                      <div className="mt-1.5">
                        <div className="h-1 w-full rounded-full bg-[#0E0F14] overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#FD8656] to-[#FC7166]"
                            style={{ width: `${seatsPct}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-[#0E0F14]/60 mt-0.5">
                          {city.registered}/{city.capacity} terdaftar
                        </div>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="h-5 w-5 text-[#0E0F14]/40 group-hover:text-[#FC7166] transition-colors flex-shrink-0" />
                </button>
              );
            })}
          </div>
        )}

        {step === "google" && selectedCity && (
          <div className="space-y-5">
            {/* Selected city summary */}
            <div className="rounded-2xl border border-[#FC7166]/30 bg-[#FC7166]/10 p-4">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-[#FC7166] to-[#FD8656] flex items-center justify-center text-white">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-[#0E0F14]">{selectedCity.city}</div>
                  <div className="text-xs text-[#0E0F14]/60 mt-0.5 flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {selectedCity.dateLabel} 2026 • {selectedCity.dayLabel}
                  </div>
                  <div className="text-xs text-[#0E0F14]/60 mt-0.5">{selectedCity.venue}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("select")}
                  className="text-xs font-semibold text-[#FC7166] hover:underline"
                >
                  Ubah
                </button>
              </div>

              {/* Pricing preview */}
              {pricing && (
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#FC7166]/20">
                  <div className="p-2 rounded-lg bg-[#0E0F14]/40 border border-[#FC7166]/15">
                    <div className="text-[10px] text-[#0E0F14]/60 uppercase font-bold">Regular</div>
                    <div className="text-[#0E0F14] font-black text-sm">{formatRupiah(pricing.regular.price)}</div>
                    <div className="text-[9px] text-[#0E0F14]/50 mt-0.5">e-Cert + akses sesi</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#F39F23]/10 border border-[#F39F23]/30">
                    <div className="text-[10px] text-[#C97D0E] uppercase font-bold">VIP</div>
                    <div className="text-[#0E0F14] font-black text-sm">
                      {earlyBirdActive ? pricing.vip.earlyBirdLabel : pricing.vip.label}
                    </div>
                    <div className="text-[9px] text-[#C97D0E] mt-0.5">
                      {earlyBirdActive ? "🎁 Early Bird aktif!" : "Merch + front row"}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Google Sign-In button */}
            <div className="text-center py-2">
              <p className="text-xs text-[#0E0F14]/60 mb-4">
                Untuk mendaftar, silakan login dengan akun Google Anda.
                <br />
                <span className="text-[10px] text-[#0E0F14]/40">
                  Data email & nama akan diambil dari Google untuk mempermudah pendaftaran.
                </span>
              </p>
              <button
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-white hover:bg-zinc-100 disabled:opacity-70 text-[#0E0F14] font-bold transition-all shadow-lg"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {googleLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Menghubungkan ke Google...
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in dengan Google
                  </>
                )}
              </button>
              <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-[#0E0F14]/40">
                <Lock className="h-3 w-3" />
                Login aman via Google OAuth 2.0
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("select")}
                className="flex-1 bg-[#0E0F14] border-[#FC7166]/30 text-[#0E0F14] hover:bg-[#FC7166]/10"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Kembali
              </Button>
            </div>
          </div>
        )}

        {step === "form" && selectedCity && googleUser && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Selected city summary */}
            <div className="rounded-2xl border border-[#FC7166]/30 bg-[#FC7166]/10 p-4">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-[#FC7166] to-[#FD8656] flex items-center justify-center text-white">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-[#0E0F14]">{selectedCity.city}</div>
                  <div className="text-xs text-[#0E0F14]/70 mt-0.5 flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {selectedCity.dateLabel} 2026 • {selectedCity.dayLabel}
                  </div>
                  <div className="text-xs text-[#0E0F14]/70 mt-0.5">{selectedCity.venue}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("select")}
                  className="text-xs font-semibold text-[#FC7166] hover:underline"
                >
                  Ubah
                </button>
              </div>
            </div>

            {/* Google user info banner */}
            {googleUser && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/30">
                <img
                  src={googleUser.avatar}
                  alt={googleUser.name}
                  className="h-10 w-10 rounded-full bg-[#0E0F14] flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-green-400 font-bold uppercase">✓ Login Google</div>
                  <div className="text-sm text-[#0E0F14] font-bold truncate">{googleUser.name}</div>
                  <div className="text-[10px] text-[#0E0F14]/60 truncate">{googleUser.email}</div>
                </div>
              </div>
            )}

            {/* Form fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#0E0F14]">Nama Lengkap *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Dari Google"
                  required
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-[#0E0F14]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#0E0F14]">Email Google *</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  disabled
                  className="bg-[#0E0F14]/50 border-[#FC7166]/25 text-[#0E0F14]/70 font-mono text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#0E0F14]">WhatsApp *</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="0813-xxxx-xxxx"
                  required
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-[#0E0F14] font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-[#0E0F14]">Tanggal Lahir *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={form.birthDate}
                  onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                  required
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-[#0E0F14]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-[#0E0F14]">Gender</Label>
                <select
                  id="gender"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value as "L" | "P" | "other" })}
                  className="w-full h-9 px-3 rounded-md bg-[#0E0F14] border border-[#FC7166]/25 text-[#0E0F14] text-sm"
                >
                  <option value="P">Perempuan</option>
                  <option value="L">Laki-laki</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode" className="text-[#0E0F14]">Kode Pos</Label>
                <Input
                  id="postalCode"
                  value={form.postalCode}
                  onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                  placeholder="40123"
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-[#0E0F14] font-mono"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="address" className="text-[#0E0F14]">Alamat Lengkap *</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan"
                  required
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-[#0E0F14]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cityDomicile" className="text-[#0E0F14]">Kota Domisili</Label>
                <Input
                  id="cityDomicile"
                  value={form.cityDomicile}
                  onChange={(e) => setForm({ ...form, cityDomicile: e.target.value })}
                  placeholder={selectedCity.city}
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-[#0E0F14]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="referralSource" className="text-[#0E0F14]">Sumber Info</Label>
                <select
                  id="referralSource"
                  value={form.referralSource}
                  onChange={(e) => setForm({ ...form, referralSource: e.target.value as Registration["referralSource"] })}
                  className="w-full h-9 px-3 rounded-md bg-[#0E0F14] border border-[#FC7166]/25 text-[#0E0F14] text-sm"
                >
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="friend">Teman</option>
                  <option value="google">Google Search</option>
                  <option value="youtube">YouTube</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyName" className="text-[#0E0F14]">Emergency Contact (opsional)</Label>
                <Input
                  id="emergencyName"
                  value={form.emergencyName}
                  onChange={(e) => setForm({ ...form, emergencyName: e.target.value })}
                  placeholder="Nama keluarga"
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-[#0E0F14]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone" className="text-[#0E0F14]">Emergency Phone (opsional)</Label>
                <Input
                  id="emergencyPhone"
                  value={form.emergencyPhone}
                  onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })}
                  placeholder="08xx-xxxx-xxxx"
                  className="bg-[#0E0F14] border-[#FC7166]/25 text-[#0E0F14] font-mono"
                />
              </div>
              <div className="col-span-2 flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="marketingConsent"
                  checked={form.marketingConsent}
                  onChange={(e) => setForm({ ...form, marketingConsent: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="marketingConsent" className="text-[#0E0F14] text-xs cursor-pointer">
                  Saya setuju menerima info promo & update event via WhatsApp/Email
                </Label>
              </div>
            </div>

            {/* Ticket type selection with pricing */}
            <div className="space-y-2">
              <Label className="text-[#0E0F14]">Jenis Tiket</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, ticketType: "regular" })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    form.ticketType === "regular"
                      ? "border-[#FC7166] bg-[#FC7166]/15"
                      : "border-[#FC7166]/20 hover:border-[#FC7166]/40"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Ticket className="h-4 w-4 text-[#FC7166]" />
                    <span className="font-bold text-sm text-[#0E0F14]">Regular</span>
                  </div>
                  <div className="text-xs text-[#0E0F14] font-bold mt-1">{formatRupiah(pricing?.regular.price ?? 0)}</div>
                  <div className="text-[10px] text-[#0E0F14]/60">e-Cert + akses sesi</div>
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, ticketType: "vip" })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    form.ticketType === "vip"
                      ? "border-[#F39F23] bg-[#F39F23]/15"
                      : "border-[#F39F23]/30 hover:border-[#F39F23]/50"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-[#C97D0E]" />
                    <span className="font-bold text-sm text-[#0E0F14]">VIP</span>
                  </div>
                  <div className="text-xs text-[#C97D0E] font-bold mt-1">
                    {earlyBirdActive && pricing ? pricing.vip.earlyBirdLabel : pricing?.vip.label}
                  </div>
                  <div className="text-[10px] text-[#0E0F14]/60">
                    {earlyBirdActive ? "🎁 Early Bird!" : "Merch + Front Row"}
                  </div>
                </button>
              </div>
              {form.ticketType === "vip" && earlyBirdActive && pricing && (
                <div className="text-[10px] text-[#C97D0E] mt-1 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Hemat {formatRupiah(pricing.vip.price - pricing.vip.earlyBirdPrice)} dengan Early Bird!
                </div>
              )}
            </div>

            {/* Error banner (if API failed) */}
            {submitError && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs font-bold text-red-600 uppercase mb-0.5">Gagal Mendaftar</div>
                  <div className="text-xs text-red-700">{submitError}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitError(null)}
                  className="text-red-400 hover:text-red-600 text-xs"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep("select")}
                disabled={submitting}
                className="flex-1"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Kembali
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-[2] bg-gradient-to-r from-[#FC7166] to-[#FD8656] text-white font-bold shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Konfirmasi Pendaftaran"
                )}
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
            <p className="text-sm text-[#0E0F14]/70 mb-4 max-w-sm mx-auto">
              Terima kasih <span className="font-bold">{form.name}</span>! Pendaftaran Anda telah
              tersimpan di database. E-ticket dan QR code akan dikirim ke{" "}
              <span className="font-bold">{form.email}</span> dan WhatsApp Anda dalam 1×24 jam.
            </p>
            <div className="rounded-2xl bg-[#FC7166]/10 border border-[#FC7166]/25 p-4 text-left text-sm space-y-1.5 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-[#0E0F14]/60">Registration ID</span>
                <span className="font-bold font-mono text-[#FC7166]">{registeredId ?? "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#0E0F14]/60">Kota</span>
                <span className="font-bold">{selectedCity.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#0E0F14]/60">Tanggal</span>
                <span className="font-bold">{selectedCity.dateLabel} 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#0E0F14]/60">Tiket</span>
                <span className="font-bold uppercase">{form.ticketType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#0E0F14]/60">Status</span>
                <span className="font-bold text-green-600">
                  {form.ticketType === "vip" ? "Menunggu Pembayaran" : "Terkonfirmasi"}
                </span>
              </div>
            </div>
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full bg-gradient-to-r from-[#FC7166] to-[#FD8656] text-white font-bold shadow-lg"
            >
              Selesai
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
