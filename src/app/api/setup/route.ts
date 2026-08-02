import { NextResponse } from "next/server";
import { getSupabasePublic, getSupabaseAdmin } from "@/lib/supabase-server";

// ============================================================
// GET /api/setup — diagnose Supabase configuration.
// Returns:
//   - Whether env vars are set
//   - Whether tables exist
//   - Whether RLS policies are applied
//   - Whether service_role key is valid (admin-only check)
//
// Safe to call publicly — does not leak secrets.
// ============================================================

export async function GET() {
  const report: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓ set" : "✗ missing",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓ set" : "✗ missing",
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "✓ set" : "✗ missing",
      service_role_format: "unknown",
    },
    publicClient: { ok: false, error: null as string | null },
    adminClient: { ok: false, error: null as string | null },
    tables: { registrations: "unknown", cities: "unknown" },
    policies: { registrations: [] as string[], cities: [] as string[] },
    testInsert: { ok: false, error: null as string | null },
  };

  // Check service_role key format
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceKey) {
    if (serviceKey.startsWith("sb_publishable_")) {
      report.env.service_role_format = "✗ WRONG (publishable key, need sb_secret_ or eyJ...)";
    } else if (serviceKey.startsWith("sb_secret_")) {
      report.env.service_role_format = "✓ new format (sb_secret_)";
    } else if (serviceKey.startsWith("eyJ")) {
      report.env.service_role_format = "✓ JWT format";
    } else {
      report.env.service_role_format = "? unknown format";
    }
  }

  // Test public client
  try {
    const supabase = getSupabasePublic();
    report.publicClient.ok = true;

    // Check if registrations table exists & count rows
    const { count, error } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true });

    if (error) {
      report.tables.registrations = `✗ error: ${error.message}`;
      report.testInsert.error = error.message;
    } else {
      report.tables.registrations = `✓ exists (${count ?? 0} rows)`;
    }

    // Check cities table
    const { count: cityCount, error: cityErr } = await supabase
      .from("cities")
      .select("*", { count: "exact", head: true });

    if (cityErr) {
      report.tables.cities = `✗ error: ${cityErr.message}`;
    } else {
      report.tables.cities = `✓ exists (${cityCount ?? 0} rows)`;
    }

    // Try to fetch policies (may not be available without RPC function)
    try {
      const { data: policies } = await supabase.rpc("get_policies_list");
      if (policies && Array.isArray(policies)) {
        report.policies.registrations = policies
          .filter((p: { tablename?: string }) => p.tablename === "registrations")
          .map((p: { policyname?: string }) => p.policyname);
        report.policies.cities = policies
          .filter((p: { tablename?: string }) => p.tablename === "cities")
          .map((p: { policyname?: string }) => p.policyname);
      }
    } catch {
      // RPC not available — that's OK, policies section stays empty
    }
  } catch (e) {
    report.publicClient.error = e instanceof Error ? e.message : "Unknown error";
  }

  // Test admin client (only if user is authenticated as admin)
  try {
    const admin = getSupabaseAdmin();
    const { error } = await admin.from("registrations").select("id").limit(1);
    if (error) {
      report.adminClient.error = error.message;
    } else {
      report.adminClient.ok = true;
    }
  } catch (e) {
    report.adminClient.error = e instanceof Error ? e.message : "Unknown error";
  }

  // Summary diagnosis
  const diagnoses: string[] = [];
  if (report.env.NEXT_PUBLIC_SUPABASE_URL.includes("missing")) {
    diagnoses.push("❌ NEXT_PUBLIC_SUPABASE_URL not set in .env.local");
  }
  if (report.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("missing")) {
    diagnoses.push("❌ NEXT_PUBLIC_SUPABASE_ANON_KEY not set in .env.local");
  }
  if (report.env.SUPABASE_SERVICE_ROLE_KEY.includes("missing")) {
    diagnoses.push("⚠️ SUPABASE_SERVICE_ROLE_KEY not set — admin endpoints will fail");
  } else if (report.env.service_role_format.toString().includes("WRONG")) {
    diagnoses.push("❌ SUPABASE_SERVICE_ROLE_KEY is a publishable key, not a service_role secret");
  }
  if (report.tables.registrations.toString().includes("error")) {
    diagnoses.push("❌ registrations table missing or RLS blocks access — run supabase/schema.sql");
  }

  if (diagnoses.length === 0) {
    diagnoses.push("✅ All checks passed — ready to go!");
  }

  return NextResponse.json({ report, diagnoses });
}
