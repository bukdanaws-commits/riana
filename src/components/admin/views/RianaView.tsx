"use client";

import { useState } from "react";
import { Plus, X, Save, Award } from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import { AdminCard, AdminButton } from "../AdminDashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function RianaView() {
  const rianaBio = useAdminStore((s) => s.rianaBio);
  const rianaStats = useAdminStore((s) => s.rianaStats);
  const rianaCerts = useAdminStore((s) => s.rianaCerts);
  const updateRianaBio = useAdminStore((s) => s.updateRianaBio);
  const updateRianaStats = useAdminStore((s) => s.updateRianaStats);
  const updateRianaCerts = useAdminStore((s) => s.updateRianaCerts);

  const [bio, setBio] = useState(rianaBio);
  const [stats, setStats] = useState(rianaStats);
  const [certs, setCerts] = useState(rianaCerts);
  const [newCert, setNewCert] = useState("");

  const handleSaveBio = () => {
    updateRianaBio(bio);
    toast.success("Bio Riana diperbarui.");
  };

  const handleSaveStats = () => {
    updateRianaStats(stats);
    toast.success("Stats Riana diperbarui.");
  };

  const handleSaveCerts = () => {
    updateRianaCerts(certs);
    toast.success("Sertifikasi diperbarui.");
  };

  const addCert = () => {
    if (newCert && !certs.includes(newCert)) {
      setCerts([...certs, newCert]);
      setNewCert("");
    }
  };

  const removeCert = (cert: string) => {
    setCerts(certs.filter((c) => c !== cert));
  };

  return (
    <div className="space-y-4 max-w-4xl">
      {/* === BIO === */}
      <AdminCard>
        <h3
          className="text-lg font-black text-white mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          BIO RIANA
        </h3>
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={5}
          className="bg-[#0E0F14] border-[#FC7166]/25 text-white resize-none mb-3"
        />
        <div className="flex justify-end">
          <AdminButton onClick={handleSaveBio}>
            <Save className="h-4 w-4 mr-1" /> Simpan Bio
          </AdminButton>
        </div>
      </AdminCard>

      {/* === STATS === */}
      <AdminCard>
        <h3
          className="text-lg font-black text-white mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          STATS RIANA
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-2">
              <Label className="text-white/80 text-xs font-bold uppercase">
                {stat.label}
              </Label>
              <Input
                value={stat.value}
                onChange={(e) => {
                  const newStats = [...stats];
                  newStats[idx] = { ...stat, value: e.target.value };
                  setStats(newStats);
                }}
                className="bg-[#0E0F14] border-[#FC7166]/25 text-white"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <AdminButton onClick={handleSaveStats}>
            <Save className="h-4 w-4 mr-1" /> Simpan Stats
          </AdminButton>
        </div>
      </AdminCard>

      {/* === CERTIFICATIONS === */}
      <AdminCard>
        <h3
          className="text-lg font-black text-white mb-3 flex items-center gap-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <Award className="h-5 w-5 text-[#FFB938]" />
          SERTIFIKASI
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {certs.map((cert) => (
            <div
              key={cert}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FC7166]/15 border border-[#FC7166]/30 text-[#FF8A80] text-xs font-bold"
            >
              {cert}
              <button
                onClick={() => removeCert(cert)}
                className="ml-1 hover:text-red-400 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {certs.length === 0 && (
            <p className="text-white/40 text-sm italic">Belum ada sertifikasi.</p>
          )}
        </div>
        <div className="flex gap-2 mb-3">
          <Input
            value={newCert}
            onChange={(e) => setNewCert(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCert();
              }
            }}
            placeholder="Tambah sertifikasi (mis: Yoga Alliance RYT-500)"
            className="bg-[#0E0F14] border-[#FC7166]/25 text-white"
          />
          <AdminButton variant="outline" onClick={addCert}>
            <Plus className="h-4 w-4" />
          </AdminButton>
        </div>
        <div className="flex justify-end">
          <AdminButton onClick={handleSaveCerts}>
            <Save className="h-4 w-4 mr-1" /> Simpan Sertifikasi
          </AdminButton>
        </div>
      </AdminCard>
    </div>
  );
}
