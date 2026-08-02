"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Settings } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { RegisterModal } from "@/components/RegisterModal";
import { Hero } from "@/components/sections/Hero";
import { Countdown } from "@/components/sections/Countdown";
import { MeetRiana } from "@/components/sections/MeetRiana";
import { ZumbaStep } from "@/components/sections/ZumbaStep";
import { AboutRoadshow } from "@/components/sections/AboutRoadshow";
import { CitySchedule } from "@/components/sections/CitySchedule";
import { WhyJoin } from "@/components/sections/WhyJoin";
import { MuriProgress } from "@/components/sections/MuriProgress";
import { Gallery } from "@/components/sections/Gallery";
import { Testimonials } from "@/components/sections/Testimonials";
import { Partners } from "@/components/sections/Partners";
import { Merchandise } from "@/components/sections/Merchandise";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [preselectedCity, setPreselectedCity] = useState<string | null>(null);

  // Auto-open modal if returning from OAuth redirect (?register=1 in URL)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("register")) {
      // Modal akan auto-restore selectedCity dari sessionStorage
      setRegisterOpen(true);
    }
  }, []);

  const openRegister = (cityId?: string) => {
    setPreselectedCity(cityId ?? null);
    setRegisterOpen(true);
  };

  const closeRegister = () => {
    setRegisterOpen(false);
    setTimeout(() => setPreselectedCity(null), 200);
  };

  return (
    <main className="min-h-screen flex flex-col bg-purpleblack gap-4">
      <Navbar onRegisterClick={() => openRegister()} />

      <Hero onRegisterClick={() => openRegister()} />

      <Countdown />

      <MeetRiana />
      <ZumbaStep />
      <AboutRoadshow />
      <CitySchedule onRegisterClick={openRegister} />
      <WhyJoin />
      <MuriProgress />

      <Gallery />
      <Testimonials />
      <Partners />
      <Merchandise />
      <FAQ />

      <FinalCTA onRegisterClick={() => openRegister()} />

      <Footer />

      <RegisterModal
        open={registerOpen}
        onOpenChange={closeRegister}
        preselectedCity={preselectedCity}
      />

      {/* Admin access — link to /admin route (Google OAuth protected).
          Legacy AdminTrigger (modal-based, password "admin123") was removed
          because /admin/* routes are the canonical admin now. */}
      <Link
        href="/admin"
        className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full bg-[#0E0F14]/80 hover:bg-[#0E0F14] text-[#FC7166] shadow-lg flex items-center justify-center transition-all hover:scale-110 border border-[#FC7166]/30 backdrop-blur-sm group"
        aria-label="Admin Panel"
        title="Admin Panel (Google OAuth)"
      >
        <Settings className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
      </Link>
    </main>
  );
}
