"use client";

import { useState } from "react";
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
import { Lock, AlertCircle, KeyRound } from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import { toast } from "sonner";

interface AdminLoginProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function LoginForm({ onClose }: { onClose: () => void }) {
  const login = useAdminStore((s) => s.login);
  const setAdminOpen = useAdminStore((s) => s.setAdminOpen);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      toast.success("Login berhasil! Selamat datang di Admin Dashboard.");
      setAdminOpen(true);
      onClose();
    } else {
      setError(true);
      setAttempts((a) => a + 1);
      if (attempts >= 2) {
        toast.error("Password salah 3x. Coba lagi nanti.");
        onClose();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="admin-password" className="text-cream">
          Password
        </Label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-magenta-light" />
          <Input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="••••••••"
            autoFocus
            className="pl-9 bg-purple-dark border-magenta/30 text-cream placeholder:text-cream/30"
          />
        </div>
        {error && (
          <div className="flex items-center gap-1.5 text-xs text-red-400 mt-1">
            <AlertCircle className="h-3 w-3" />
            Password salah. Sisa percobaan: {3 - attempts - 1}
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-magenta hover:bg-magenta-deep text-white font-bold shadow-glow-pink"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        <Lock className="mr-2 h-4 w-4" />
        Masuk ke Dashboard
      </Button>

      <div className="text-center pt-2 border-t border-magenta/15">
        <p className="text-[10px] text-cream/40 font-mono">
          Default password: <span className="text-magenta-light">admin123</span>
        </p>
        <p className="text-[9px] text-cream/30 mt-1">
          Ubah password di production via environment variable.
        </p>
      </div>
    </form>
  );
}

export function AdminLogin({ open, onOpenChange }: AdminLoginProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-purpleblack border border-magenta/40">
        {/* Header */}
        <div className="bg-brand-gradient px-6 py-5 text-white relative overflow-hidden">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/15" />
          <DialogHeader className="relative">
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase opacity-90 mb-1">
              <Lock className="h-3.5 w-3.5" />
              Admin Access
            </div>
            <DialogTitle
              className="text-2xl font-extrabold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              RIANA ADMIN
            </DialogTitle>
            <DialogDescription className="text-white/90">
              Masukkan password untuk mengakses dashboard admin.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Body — key={open} ensures fresh state each time modal opens */}
        {open && <LoginForm key="login-form" onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}
