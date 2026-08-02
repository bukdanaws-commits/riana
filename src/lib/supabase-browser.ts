import { createBrowserClient, type SupabaseClient } from "@supabase/ssr";

// ============================================================
// Lazy singleton for browser-side Supabase client.
//
// Why lazy? Next.js prerenders client components during build,
// which evaluates this module on the server. If env vars are
// missing, build crashes. Lazy init defers the createBrowserClient
// call to first actual use (in the browser at runtime).
// ============================================================

let _browserClient: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient {
  if (_browserClient) return _browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }

  _browserClient = createBrowserClient(url, anonKey);
  return _browserClient;
}

// Backward-compat: lazily-resolved proxy so existing imports
// `import { supabase } from "@/lib/supabase-browser"` keep working.
// Accessing any property triggers client initialization.
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseBrowser();
    const value = Reflect.get(client, prop);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

export const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "bukdan101@gmail.com";
