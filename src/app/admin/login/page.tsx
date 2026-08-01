"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth";
import { Loader2, Shield, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginWithGoogle, isAuthenticated, isLoading, checkSession, devLogin } = useAdminAuth();
  const [error, setError] = useState("");

  useEffect(() => { checkSession(); }, [checkSession]);
  useEffect(() => { if (isAuthenticated) router.push("/admin"); }, [isAuthenticated, router]);

  const handleLogin = async () => { setError(""); const result = await loginWithGoogle(); if (!result.success) setError(result.error || "Login gagal"); };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0E0F14] px-4">
      <div className="absolute inset-0 overflow-hidden"><div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#FC7166]/15 blur-3xl" /><div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#FD8656]/10 blur-3xl" /></div>
      <div className="relative w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-sm mb-8"><ArrowLeft className="h-4 w-4" /> Kembali</Link>
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-[#FC7166]/20">
          <div className="text-center mb-6">
            <img src="/brand/logo-aktivenarion.jpeg" alt="ActiveNation" className="h-16 w-16 rounded-2xl object-cover mx-auto shadow-lg mb-3" />
            <h1 className="text-2xl font-black text-[#0E0F14]" style={{ fontFamily: "var(--font-display)" }}>ADMIN PANEL</h1>
            <p className="text-sm text-[#0E0F14]/50 mt-1">Riana On The Move</p>
          </div>
          <div className="flex items-center justify-center gap-2 mb-6 px-3 py-2 rounded-full bg-[#FC7166]/10 border border-[#FC7166]/20"><Shield className="h-4 w-4 text-[#FC7166]" /><span className="text-xs font-bold text-[#FC7166]">Restricted Access</span></div>
          <button onClick={handleLogin} disabled={isLoading} className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-white hover:bg-zinc-50 disabled:opacity-60 text-[#0E0F14] font-bold transition-all shadow-md border border-zinc-200">
            {isLoading ? <><Loader2 className="h-5 w-5 animate-spin" /> Connecting...</> : <>
              <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Sign in dengan Google
            </>}
          </button>
          {error && <div className="flex items-center gap-2 mt-4 px-3 py-2 rounded-lg bg-red-50 border border-red-200"><AlertCircle className="h-4 w-4 text-red-500" /><span className="text-xs text-red-600">{error}</span></div>}
          <div className="mt-4 text-center"><button onClick={() => { devLogin(); router.push("/admin"); }} className="text-xs text-[#0E0F14]/40 hover:text-[#FC7166] underline">Dev Login (bypass Google)</button></div>
          <div className="mt-6 pt-6 border-t border-zinc-100 text-center"><p className="text-xs text-[#0E0F14]/40">Hanya <span className="font-bold text-[#FC7166]">bukdan101@gmail.com</span></p></div>
        </div>
      </div>
    </div>
  );
}
