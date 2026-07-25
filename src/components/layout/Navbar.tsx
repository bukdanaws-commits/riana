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
  { label: "Beranda", href: "#" },
  { label: "Tentang", href: "#about" },
  { label: "Jadwal", href: "#jadwal" },
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
          ? "bg-white/90 backdrop-blur-xl shadow-md border-b border-pink-100"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="#" className="flex items-center gap-2 group">
            <div className="relative h-10 w-10 lg:h-11 lg:w-11 rounded-xl bg-magenta flex items-center justify-center shadow-glow-pink transition-transform group-hover:scale-110">
              <Heart className="h-5 w-5 lg:h-6 lg:w-6 text-white fill-white" />
            </div>
            <div className="leading-tight">
              <div
                className="text-xl lg:text-2xl font-black tracking-wider text-purpleblack"
                style={{ fontFamily: "var(--font-display)" }}
              >
                RIANA ZUMBA
              </div>
              <div
                className="text-[9px] lg:text-[10px] text-magenta font-bold tracking-[0.25em] -mt-1"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                ON THE MOVE
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-bold text-purpleblack hover:text-magenta hover:bg-pink-50 rounded-full transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              size="sm"
              onClick={onRegisterClick}
              className="bg-magenta hover:bg-magenta-deep text-white font-bold shadow-glow-pink rounded-full px-5"
              style={{ fontFamily: "var(--font-heading)" }}
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
                    <div className="h-10 w-10 rounded-xl bg-magenta flex items-center justify-center">
                      <Heart className="h-5 w-5 text-white fill-white" />
                    </div>
                    <div>
                      <div
                        className="text-xl font-black tracking-wider"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        RIANA ZUMBA
                      </div>
                      <div
                        className="text-[10px] text-magenta font-bold tracking-[0.25em] -mt-1"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
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
                    className="px-4 py-3 text-base font-bold text-purpleblack hover:text-magenta hover:bg-pink-50 rounded-xl transition-colors"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="h-px bg-pink-100 my-3" />
                <Button
                  className="w-full bg-magenta text-white font-bold shadow-glow-pink rounded-xl mt-2"
                  style={{ fontFamily: "var(--font-heading)" }}
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
