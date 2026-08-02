import { NextResponse } from "next/server";

// ============================================================
// DEBUG: tampilkan env vars yang terbaca oleh Next.js server
// Hapus endpoint ini sebelum production!
// ============================================================

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return NextResponse.json({
    url: url ? {
      value: url,
      length: url.length,
      hasTrailingWhitespace: /\s$/.test(url),
      hasInternalWhitespace: /\s/.test(url.trim()),
    } : "MISSING",
    anon: anon ? {
      length: anon.length,
      prefix: anon.slice(0, 30),
      suffix: anon.slice(-10),
      hasTrailingWhitespace: /\s$/.test(anon),
      hasInternalWhitespace: /\s/.test(anon.trim()),
      // Decode JWT payload untuk lihat role
      jwtPayload: (() => {
        try {
          const parts = anon.split(".");
          if (parts.length !== 3) return "not a JWT";
          const payload = Buffer.from(parts[1], "base64").toString();
          return JSON.parse(payload);
        } catch (e) {
          return `decode error: ${e instanceof Error ? e.message : "?"}`;
        }
      })(),
    } : "MISSING",
    service: service ? {
      length: service.length,
      prefix: service.slice(0, 15),
      hasTrailingWhitespace: /\s$/.test(service),
    } : "MISSING",
  });
}
