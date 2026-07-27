"use client";

import { useState, useRef } from "react";
import {
  RotateCcw, Download, Upload, AlertTriangle, Save,
} from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import { AdminCard, AdminButton } from "../AdminDashboard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function SettingsView() {
  const resetAll = useAdminStore((s) => s.resetAll);
  const exportData = useAdminStore((s) => s.exportData);
  const importData = useAdminStore((s) => s.importData);
  const muriTarget = useAdminStore((s) => s.muriTarget);

  const [targetInput, setTargetInput] = useState(muriTarget.toString());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    if (confirm("Reset SEMUA data ke default? Semua perubahan akan hilang.")) {
      resetAll();
      toast.success("Semua data direset ke default.");
    }
  };

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `riana-admin-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported ke file JSON.");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (importData(text)) {
        toast.success("Data berhasil diimport.");
      } else {
        toast.error("File JSON tidak valid.");
      }
    };
    reader.readAsText(file);
  };

  const handleSaveTarget = () => {
    const newTarget = parseInt(targetInput) || 10000;
    useAdminStore.setState({ muriTarget: newTarget });
    toast.success(`Target MURI diperbarui ke ${newTarget.toLocaleString("id-ID")}.`);
  };

  return (
    <div className="space-y-4 max-w-3xl">
      {/* === MURI TARGET === */}
      <AdminCard>
        <h3
          className="text-lg font-black text-white mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          TARGET MURI
        </h3>
        <p className="text-xs text-white/60 mb-3">
          Jumlah peserta target untuk pemecahan rekor MURI. Default: 10.000.
        </p>
        <div className="flex gap-2">
          <Input
            type="number"
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
            className="bg-[#0E0F14] border-[#FC7166]/25 text-white"
          />
          <AdminButton onClick={handleSaveTarget}>
            <Save className="h-4 w-4 mr-1" /> Simpan
          </AdminButton>
        </div>
      </AdminCard>

      {/* === BACKUP & RESTORE === */}
      <AdminCard>
        <h3
          className="text-lg font-black text-white mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          BACKUP & RESTORE
        </h3>
        <p className="text-xs text-white/60 mb-3">
          Export semua data ke file JSON untuk backup, atau import dari file untuk restore.
        </p>
        <div className="flex flex-wrap gap-2">
          <AdminButton onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" /> Export JSON
          </AdminButton>
          <AdminButton variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-1" /> Import JSON
          </AdminButton>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </AdminCard>

      {/* === DANGER ZONE === */}
      <AdminCard className="border-red-500/30">
        <div className="flex items-start gap-3 mb-3">
          <div className="h-10 w-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h3
              className="text-lg font-black text-red-400"
              style={{ fontFamily: "var(--font-display)" }}
            >
              DANGER ZONE
            </h3>
            <p className="text-xs text-white/60">
              Reset semua data ke nilai default. Tindakan ini tidak bisa dibatalkan.
            </p>
          </div>
        </div>
        <AdminButton variant="destructive" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-1" /> Reset Semua Data
        </AdminButton>
      </AdminCard>

      {/* === INFO === */}
      <AdminCard>
        <h3
          className="text-base font-black text-white mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          INFORMASI
        </h3>
        <div className="space-y-1 text-xs text-white/70">
          <div className="flex justify-between">
            <span>Versi:</span>
            <span className="font-mono text-[#FFB938]">v2.0</span>
          </div>
          <div className="flex justify-between">
            <span>Storage:</span>
            <span className="font-mono text-[#FF8A80]">localStorage</span>
          </div>
          <div className="flex justify-between">
            <span>Sync:</span>
            <span className="font-mono text-green-400">Real-time</span>
          </div>
          <div className="flex justify-between">
            <span>Default Password:</span>
            <span className="font-mono text-[#FF8A80]">admin123</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-[#FC7166]/15 text-[10px] text-white/40">
          Data tersimpan di browser (localStorage). Untuk production, integrate dengan
          backend API untuk multi-user & persistence server-side.
        </div>
      </AdminCard>
    </div>
  );
}
