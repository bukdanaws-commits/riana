"use client";

import {
  X, Mail, Phone, MapPin, Calendar, User, Ticket, CreditCard,
  CheckCircle2, Clock, Send, Tag, MessageSquare, Edit2, Trash2,
  QrCode, Award, Users, Heart, FileText,
} from "lucide-react";
import { useAdminStore, type Registration } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/data/pricing";
import { toast } from "sonner";

interface Props {
  registration: Registration;
  onClose: () => void;
}

export function RegistrationDetail({ registration, onClose }: Props) {
  const updateRegistration = useAdminStore((s) => s.updateRegistration);
  const deleteRegistration = useAdminStore((s) => s.deleteRegistration);

  const r = registration;

  const handleCheckIn = () => {
    updateRegistration(r.id, {
      status: "checked_in",
      checkInTime: new Date().toISOString(),
      checkInMethod: "manual",
      checkedInBy: "admin@rianaonthemove.id",
    });
    toast.success(`${r.fullName} berhasil di-check-in.`);
  };

  const handleResendTicket = () => {
    updateRegistration(r.id, {
      eTicketSent: true,
      eTicketSentAt: new Date().toISOString(),
    });
    toast.success(`E-ticket dikirim ulang ke ${r.googleEmail}.`);
  };

  const handleDelete = () => {
    if (confirm(`Hapus pendaftaran ${r.fullName} (${r.id})?`)) {
      deleteRegistration(r.id);
      toast.success("Pendaftaran dihapus.");
      onClose();
    }
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString("id-ID", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0E0F14]/80 backdrop-blur-md">
      <div className="bg-[#181A22] border border-[#FC7166]/30 rounded-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto custom-scroll">
        {/* === HEADER === */}
        <div className="sticky top-0 z-10 bg-[#181A22] border-b border-[#FC7166]/20 p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <img
                src={r.googleAvatarUrl}
                alt={r.fullName}
                className="h-14 w-14 rounded-full bg-[#0E0F14] border-2 border-[#FC7166]/30"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div>
                <div className="font-mono text-[10px] text-[#FF8A80] tracking-wider">{r.id}</div>
                <h2 className="text-xl font-black text-white leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                  {r.fullName}
                </h2>
                <div className="text-xs text-white/60">{r.googleEmail}</div>
                <div className="mt-1">
                  <StatusBadge status={r.status} />
                </div>
              </div>
            </div>
            <Button size="icon" variant="ghost" className="text-white/60 hover:text-white" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* === BODY === */}
        <div className="p-5 space-y-5">
          {/* === DATA PRIBADI === */}
          <Section title="DATA PRIBADI" icon={User}>
            <DetailRow icon={User} label="Nama lengkap" value={r.fullName} />
            <DetailRow icon={Mail} label="Email Google" value={r.googleEmail} mono />
            <DetailRow icon={Phone} label="WhatsApp" value={r.phone} mono />
            <DetailRow icon={Calendar} label="Tanggal lahir" value={`${r.birthDate} (${r.age} tahun)`} />
            <DetailRow icon={Heart} label="Gender" value={r.gender === "P" ? "Perempuan" : r.gender === "L" ? "Laki-laki" : "Other"} />
            <DetailRow icon={MapPin} label="Alamat" value={`${r.address}, ${r.province} ${r.postalCode}`} />
            {r.emergencyContactName && (
              <DetailRow icon={Phone} label="Emergency contact" value={`${r.emergencyContactName} (${r.emergencyContactPhone})`} />
            )}
          </Section>

          {/* === DATA EVENT === */}
          <Section title="DATA EVENT" icon={Ticket}>
            <DetailRow icon={MapPin} label="Kota event" value={`${r.eventCityName} (${r.eventDate})`} />
            <DetailRow
              icon={Ticket}
              label="Tipe tiket"
              value={
                <span className="flex items-center gap-2">
                  <Badge className={r.ticketType === "vip" ? "bg-[#F39F23]/20 text-[#FFB938] border-gold/30" : "bg-[#FC7166]/15 text-[#FF8A80] border-[#FC7166]/30"}>
                    {r.ticketType === "vip" ? "VIP" : "Regular"}
                  </Badge>
                  <span className="text-white">{formatRupiah(r.ticketPrice)}</span>
                </span>
              }
            />
            <DetailRow
              icon={CreditCard}
              label="Payment"
              value={
                <span className="flex items-center gap-2">
                  <PayBadge status={r.paymentStatus} />
                  {r.paymentGateway && <span className="text-xs text-white/60">{r.paymentGateway}</span>}
                  {r.paymentDate && <span className="text-xs text-white/50">• {formatDate(r.paymentDate)}</span>}
                </span>
              }
            />
            {r.invoiceNumber && <DetailRow icon={FileText} label="Invoice" value={r.invoiceNumber} mono />}
            {r.checkInTime && (
              <DetailRow
                icon={CheckCircle2}
                label="Check-in"
                value={`${formatDate(r.checkInTime)} (${r.checkInMethod})`}
              />
            )}
            {r.checkedInBy && <DetailRow icon={User} label="Checked-in by" value={r.checkedInBy} />}
          </Section>

          {/* === TIMELINE === */}
          <Section title="TIMELINE" icon={Clock}>
            <div className="space-y-2 pl-2 border-l-2 border-[#FC7166]/20 ml-2">
              <TimelineItem
                icon={User}
                label="Registered"
                date={r.createdAt}
                color="text-blue-400"
              />
              {(r.paymentStatus === "paid" || r.paymentStatus === "free") && (
                <TimelineItem
                  icon={CreditCard}
                  label={`Payment confirmed (${r.paymentStatus})`}
                  date={r.paymentDate}
                  color="text-green-400"
                />
              )}
              {r.eTicketSent && (
                <TimelineItem
                  icon={Send}
                  label="E-ticket sent via email"
                  date={r.eTicketSentAt}
                  color="text-[#FF8A80]"
                />
              )}
              {r.checkInTime && (
                <TimelineItem
                  icon={CheckCircle2}
                  label="Checked-in at venue"
                  date={r.checkInTime}
                  color="text-green-400"
                />
              )}
              {r.eCertificateSent && (
                <TimelineItem
                  icon={Award}
                  label="E-certificate sent"
                  date={r.eCertificateSentAt}
                  color="text-[#FFB938]"
                />
              )}
            </div>
          </Section>

          {/* === MARKETING === */}
          <Section title="MARKETING" icon={Tag}>
            <DetailRow icon={Tag} label="Referral source" value={r.referralSource ?? "—"} />
            <DetailRow icon={QrCode} label="Referral code" value={r.referralCode} mono />
            {r.referredBy && <DetailRow icon={Users} label="Referred by" value={r.referredBy} mono />}
            <DetailRow
              icon={Heart}
              label="Marketing consent"
              value={r.marketingConsent ? "✓ Yes" : "✗ No"}
            />
          </Section>

          {/* === MURI === */}
          <Section title="REKOR MURI" icon={Award}>
            <DetailRow
              icon={Award}
              label="Masuk hitungan MURI"
              value={r.isMuriRecord ? "✓ Yes" : "✗ No"}
            />
            <DetailRow
              icon={CheckCircle2}
              label="MURI verified"
              value={r.muriVerified ? "✓ Verified" : "Pending"}
            />
          </Section>

          {/* === ADMIN NOTES === */}
          <Section title="ADMIN NOTES" icon={Edit2}>
            {r.notes ? (
              <div className="p-3 rounded-lg bg-[#0E0F14] border border-[#FC7166]/15 text-white/80 text-sm">
                {r.notes}
              </div>
            ) : (
              <div className="text-white/40 text-sm italic">Belum ada catatan.</div>
            )}
            {r.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {r.tags.map((tag) => (
                  <Badge key={tag} className="bg-[#FC7166]/15 text-[#FF8A80] border-[#FC7166]/30 text-[10px]">
                    <Tag className="h-2.5 w-2.5 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </Section>
        </div>

        {/* === FOOTER ACTIONS === */}
        <div className="sticky bottom-0 bg-[#181A22] border-t border-[#FC7166]/20 p-4 flex flex-wrap items-center justify-end gap-2">
          {r.status === "registered" && (
            <Button
              onClick={handleCheckIn}
              className="bg-green-500 hover:bg-green-600 text-white font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              Mark Check-in
            </Button>
          )}
          <Button
            onClick={handleResendTicket}
            variant="outline"
            className="bg-[#0E0F14] border-[#FC7166]/30 text-white hover:bg-[#FC7166]/10"
          >
            <Send className="h-4 w-4 mr-1.5" />
            Resend E-ticket
          </Button>
          <Button
            onClick={handleDelete}
            variant="outline"
            className="bg-[#0E0F14] border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Helper components
// ============================================================
function Section({
  title, icon: Icon, children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3
        className="text-sm font-black text-white mb-2 flex items-center gap-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        <Icon className="h-4 w-4 text-[#FF8A80]" />
        {title}
      </h3>
      <div className="space-y-1.5 pl-1">{children}</div>
    </div>
  );
}

function DetailRow({
  icon: Icon, label, value, mono = false,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-2 text-sm py-1">
      <Icon className="h-3.5 w-3.5 text-white/40 mt-1 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider">{label}</div>
        <div className={`text-white ${mono ? "font-mono text-xs" : ""}`}>{value}</div>
      </div>
    </div>
  );
}

function TimelineItem({
  icon: Icon, label, date, color,
}: {
  icon: React.ElementType;
  label: string;
  date?: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 -ml-[19px] relative">
      <div className={`h-4 w-4 rounded-full bg-[#181A22] border-2 flex items-center justify-center ${color}`}>
        <Icon className="h-2 w-2" />
      </div>
      <div className="flex-1">
        <span className="text-xs text-white/80">{label}</span>
        {date && <span className="text-[10px] text-white/40 ml-2">• {formatDateShort(date)}</span>}
      </div>
    </div>
  );
}

function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
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
    free: "Free", pending: "Pending", paid: "Paid", refunded: "Refund", failed: "Failed",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${styles[status]}`}>
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
    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
