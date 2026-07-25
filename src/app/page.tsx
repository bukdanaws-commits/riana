"use client";

import { useState } from "react";
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
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [preselectedCity, setPreselectedCity] = useState<string | null>(null);

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
      <FAQ />

      <FinalCTA onRegisterClick={() => openRegister()} />

      <Footer />

      <RegisterModal
        open={registerOpen}
        onOpenChange={closeRegister}
        preselectedCity={preselectedCity}
      />
    </main>
  );
}
