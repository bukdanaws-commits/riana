"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { label: "Tentang", href: "#about" },
  { label: "Jadwal", href: "#jadwal" },
  { label: "Keuntungan", href: "#keuntungan" },
  { label: "Galeri", href: "#galeri" },
  { label: "Partner", href: "#partner" },
  { label: "FAQ", href: "#faq" },
];

interface NavbarProps {
  onRegisterClick: () => void;
}

export function Navbar({ onRegisterClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/85 backdrop-blur-xl shadow-md border-b border-orange-100"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="#" className="flex items-center gap-2 group">
            <div className="relative h-9 w-9 lg:h-10 lg:w-10 rounded-xl bg-brand-gradient flex items-center justify-center shadow-glow-pink transition-transform group-hover:scale-110">
              <Heart className="h-5 w-5 text-white fill-white" />
            </div>
            <div className="leading-tight">
              <div
                className="text-base lg:text-lg font-extrabold tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                RIANA
              </div>
              <div className="text-[10px] lg:text-xs text-orange-600 font-bold tracking-[0.2em] -mt-1">
                ON THE MOVE
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-semibold text-zinc-700 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="font-semibold text-zinc-700 hover:text-orange-600"
            >
              <Link href="#partner">Menjadi Partner</Link>
            </Button>
            <Button
              size="sm"
              onClick={onRegisterClick}
              className="bg-brand-gradient hover:opacity-90 text-white font-bold shadow-glow-pink rounded-full px-5"
            >
              Daftar Sekarang
            </Button>
          </div>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-xl bg-brand-gradient flex items-center justify-center">
                      <Heart className="h-5 w-5 text-white fill-white" />
                    </div>
                    <div>
                      <div className="text-base font-extrabold">RIANA</div>
                      <div className="text-[10px] text-orange-600 font-bold tracking-[0.2em] -mt-1">
                        ON THE MOVE
                      </div>
                    </div>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 mt-8">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="px-4 py-3 text-base font-semibold text-zinc-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="h-px bg-zinc-200 my-3" />
                <Button
                  variant="outline"
                  asChild
                  className="w-full justify-start font-semibold"
                  onClick={() => setOpen(false)}
                >
                  <Link href="#partner">Menjadi Partner</Link>
                </Button>
                <Button
                  className="w-full bg-brand-gradient text-white font-bold shadow-glow-pink rounded-xl mt-2"
                  onClick={() => {
                    setOpen(false);
                    onRegisterClick();
                  }}
                >
                  Daftar Sekarang
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
