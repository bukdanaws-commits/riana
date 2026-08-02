import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// ============================================================
// Cookie-bound client (used by middleware & auth flows).
// Carries the user's session, so RLS sees them as auth.uid().
// ============================================================
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {}
        },
      },
    }
  );
}

// ============================================================
// PUBLIC client (anon key) — for public API routes that don't
// need to bypass RLS. Used by /api/registrations POST.
//
// RLS policies apply. The "Public can insert" policy on
// registrations table allows anonymous inserts.
// ============================================================
let _publicClient: SupabaseClient | null = null;

export function getSupabasePublic(): SupabaseClient {
  if (_publicClient) return _publicClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }

  _publicClient = createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return _publicClient;
}

// ============================================================
// ADMIN client (service_role key) — bypasses RLS.
// Used by /api/admin/* routes only.
//
// Detection: real service_role keys start with "eyJ" (JWT) or
// "sb_secret_" (new format). If the key starts with "sb_publishable_"
// it's a publishable key (anon equivalent), NOT a service_role —
// throw a clear error so the user knows to fix .env.local.
// ============================================================
let _adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (_adminClient) return _adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase admin env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local"
    );
  }

  // Detect common mistake: publishable key used as service_role
  if (serviceRoleKey.startsWith("sb_publishable_")) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY looks like a publishable key (sb_publishable_*). " +
      "Get the real service_role key from Supabase dashboard → Settings → API → service_role. " +
      "It should start with 'eyJ' or 'sb_secret_'."
    );
  }

  _adminClient = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return _adminClient;
}
