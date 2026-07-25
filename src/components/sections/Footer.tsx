"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Heart,
  Instagram,
  Facebook,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowUp,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

// TikTok icon (custom SVG since lucide doesn't have it)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
    </svg>
  );
}

const NAV_SECTIONS = [
  {
    title: "Event",
    links: [
      { label: "Tentang", href: "#about" },
      { label: "Jadwal 20 Kota", href: "#jadwal" },
      { label: "Keuntungan", href: "#keuntungan" },
      { label: "Galeri", href: "#galeri" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Partnership",
    links: [
      { label: "Menjadi Partner", href: "#partner" },
      { label: "Sponsorship Deck", href: "#partner" },
      { label: "Media Partner", href: "#partner" },
      { label: "Komunitas Kolaborasi", href: "#partner" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Instagram", href: "#" },
      { label: "TikTok", href: "#" },
      { label: "Facebook", href: "#" },
      { label: "YouTube", href: "#" },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Masukkan email yang valid");
      return;
    }
    toast.success("Berhasil berlangganan! Anda akan menerima update terbaru.");
    setEmail("");
  };

  return (
    <footer className="relative bg-zinc-950 text-white overflow-hidden">
      {/* Top accent */}
      <div className="h-1 bg-brand-gradient" />

      {/* Decorative */}
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-pink-500/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-pink-500/10 blur-3xl" />

      <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Newsletter */}
        <div className="rounded-3xl bg-gradient-to-br from-magenta/20 via-plum/10 to-gold/15 backdrop-blur-md border border-white/10 p-6 lg:p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3
                className="text-3xl lg:text-4xl font-black mb-2 text-white leading-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                JANGAN LEWATKAN UPDATE TERBARU
              </h3>
              <p
                className="text-white/75 text-sm"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                Berlangganan newsletter untuk info pembukaan pendaftaran, event kota
                Anda, dan kesempatan eksklusif lainnya.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="email@anda.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-full"
              />
              <Button
                type="submit"
                size="lg"
                className="bg-magenta hover:bg-magenta-deep text-white font-bold h-12 px-6 rounded-full shadow-glow-pink"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Send className="h-4 w-4 mr-1" />
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Main footer grid */}
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="#" className="flex items-center gap-2 group mb-4">
              <div className="h-11 w-11 rounded-xl bg-magenta flex items-center justify-center shadow-glow-pink">
                <Heart className="h-6 w-6 text-white fill-white" />
              </div>
              <div>
                <div
                  className="text-2xl font-black tracking-wider text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  RIANA ZUMBA
                </div>
                <div
                  className="text-[10px] text-gold-light font-bold tracking-[0.25em] -mt-1"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  ON THE MOVE
                </div>
              </div>
            </Link>
            <p
              className="text-sm text-white/65 leading-relaxed mb-3 max-w-sm"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              Roadshow nasional menuju Pemecahan Rekor MURI Zumba Step Terbesar di
              Indonesia.
            </p>
            <div
              className="font-script text-xl text-gold-light mb-4"
              style={{ fontFamily: "var(--font-script)" }}
            >
              Move Together. Make History.
            </div>

            {/* Contact */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-white/75">
                <Phone className="h-4 w-4 text-gold-light" />
                <span>0813-2099-9969</span>
              </div>
              <div className="flex items-center gap-2 text-white/75">
                <Mail className="h-4 w-4 text-gold-light" />
                <span>partnership@rianaonthemove.id</span>
              </div>
              <div className="flex items-center gap-2 text-white/75">
                <MapPin className="h-4 w-4 text-gold-light" />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>
          </div>

          {/* Nav sections */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {NAV_SECTIONS.map((section) => (
              <div key={section.title}>
                <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
                  {section.title}
                </div>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/70 hover:text-pink-400 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social */}
          <div className="lg:col-span-3">
            <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
              Follow Us
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { icon: Instagram, label: "Instagram", color: "hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500" },
                { icon: TikTokIcon, label: "TikTok", color: "hover:bg-black hover:ring-2 hover:ring-pink-500" },
                { icon: Facebook, label: "Facebook", color: "hover:bg-blue-600" },
                { icon: Youtube, label: "YouTube", color: "hover:bg-red-600" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className={`h-10 w-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all ${s.color}`}
                >
                  <s.icon className="h-5 w-5" />
                </a>
              ))}
            </div>

            {/* Back to top */}
            <a
              href="#"
              className="mt-6 inline-flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              Kembali ke atas
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <div>
            © 2026 Riana On The Move • AktiveNation. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
            <Link href="#" className="hover:text-white transition-colors">Kontak</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
