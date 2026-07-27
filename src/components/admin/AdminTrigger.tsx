"use client";

import { useEffect, useState } from "react";
import { Settings, X } from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import { AdminLogin } from "./AdminLogin";
import { AdminDashboard } from "./AdminDashboard";

export function AdminTrigger() {
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated);
  const isAdminOpen = useAdminStore((s) => s.isAdminOpen);
  const setAdminOpen = useAdminStore((s) => s.setAdminOpen);
  const [showLogin, setShowLogin] = useState(false);

  // Keyboard shortcut: Ctrl+Shift+A
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        if (isAuthenticated) {
          setAdminOpen(!isAdminOpen);
        } else {
          setShowLogin(true);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isAuthenticated, isAdminOpen, setAdminOpen]);

  const handleClick = () => {
    if (isAuthenticated) {
      setAdminOpen(true);
    } else {
      setShowLogin(true);
    }
  };

  return (
    <>
      {/* Floating button bottom-right */}
      {!isAdminOpen && (
        <button
          onClick={handleClick}
          className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-[#FC7166] hover:bg-[#FC7166]-deep text-white shadow-[0_8px_24px_-8px_rgba(252,113,102,0.6)] flex items-center justify-center transition-all hover:scale-110 group border-2 border-[#FC7166]-light/40"
          aria-label="Open Admin Dashboard"
          title="Admin Dashboard (Ctrl+Shift+A)"
        >
          <Settings className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-[#FC7166] animate-ping opacity-20" />
          {/* Tooltip */}
          <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-[#0E0F14] text-white text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-[#FC7166]/30">
            Admin Dashboard
            <span className="block text-[9px] text-white/50 font-mono">Ctrl+Shift+A</span>
          </span>
        </button>
      )}

      {/* Login modal */}
      <AdminLogin open={showLogin} onOpenChange={setShowLogin} />

      {/* Admin dashboard */}
      <AdminDashboard />
    </>
  );
}
