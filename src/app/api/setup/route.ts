import { NextResponse } from "next/server";
import { getSupabasePublic, getSupabaseAdmin } from "@/lib/supabase-server";

// ============================================================
// GET /api/setup — diagnose Supabase configuration
//
// Returns comprehensive report:
//   - env vars status
//   - public/admin client connectivity
//   - table existence + row counts
//   - cities schema validation (pricing columns)
//   - sample data preview
//   - actionable diagnoses
// ============================================================

interface CheckResult {
  ok: boolean;
  error: string | null;
}

interface TableInfo {
  exists: boolean;
  rowCount: number;
  hasAllColumns: boolean;
  missingColumns: string[];
  error?: string;
}

export async function GET() {
  const report: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓ set" : "✗ missing",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓ set" : "✗ missing",
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "✓ set" : "✗ missing",
      service_role_format: "unknown",
    },
    publicClient: { ok: false, error: null } as CheckResult,
    adminClient: { ok: false, error: null } as CheckResult,
    tables: {
      registrations: { exists: false, rowCount: 0 } as TableInfo,
      cities: { exists: false, rowCount: 0, hasAllColumns: false, missingColumns: [] } as TableInfo,
    },
    citiesPreview: [] as Array<{ id: string; city: string; tier: string; vip_price: number; status: string }>,
    diagnoses: [] as string[],
  };

  // ---------- Check service_role key format ----------
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

  // ---------- Test public client ----------
  try {
    const supabase = getSupabasePublic();
    report.publicClient.ok = true;

    // Check registrations
    const { count: regCount, error: regErr } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true });

    if (regErr) {
      (report.tables.registrations as TableInfo).exists = false;
      (report.tables.registrations as TableInfo).error = regErr.message;
    } else {
      (report.tables.registrations as TableInfo).exists = true;
      (report.tables.registrations as TableInfo).rowCount = regCount ?? 0;
    }

    // Check cities — full row fetch (to verify pricing columns)
    const { data: citiesData, error: citiesErr } = await supabase
      .from("cities")
      .select("*")
      .order("date", { ascending: true })
      .limit(50);

    if (citiesErr) {
      (report.tables.cities as TableInfo).exists = false;
      (report.tables.cities as TableInfo).error = citiesErr.message;
    } else {
      const cities = citiesData ?? [];
      (report.tables.cities as TableInfo).exists = true;
      (report.tables.cities as TableInfo).rowCount = cities.length;

      // Verify pricing columns exist (sample first row)
      const requiredCols = ["tier", "vip_price", "vip_early_bird_price", "early_bird_active", "checked_in"];
      if (cities.length > 0) {
        const sample = cities[0] as Record<string, unknown>;
        const missing = requiredCols.filter(c => !(c in sample));
        (report.tables.cities as TableInfo).missingColumns = missing;
        (report.tables.cities as TableInfo).hasAllColumns = missing.length === 0;
      }

      // Preview first 5 cities
      report.citiesPreview = cities.slice(0, 5).map((c: Record<string, unknown>) => ({
        id: String(c.id ?? ""),
        city: String(c.city ?? ""),
        tier: String(c.tier ?? ""),
        vip_price: Number(c.vip_price ?? 0),
        status: String(c.status ?? ""),
      }));
    }
  } catch (e) {
    report.publicClient.error = e instanceof Error ? e.message : "Unknown error";
  }

  // ---------- Test admin client ----------
  try {
    const admin = getSupabaseAdmin();
    const { error } = await admin.from("cities").select("id").limit(1);
    if (error) {
      report.adminClient.error = error.message;
    } else {
      report.adminClient.ok = true;
    }
  } catch (e) {
    report.adminClient.error = e instanceof Error ? e.message : "Unknown error";
  }

  // ---------- Build diagnoses ----------
  const diagnoses: string[] = [];

  if (report.env.NEXT_PUBLIC_SUPABASE_URL.includes("missing")) {
    diagnoses.push("❌ NEXT_PUBLIC_SUPABASE_URL not set");
  }
  if (report.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("missing")) {
    diagnoses.push("❌ NEXT_PUBLIC_SUPABASE_ANON_KEY not set");
  }
  if (report.env.SUPABASE_SERVICE_ROLE_KEY.includes("missing")) {
    diagnoses.push("⚠️ SUPABASE_SERVICE_ROLE_KEY not set — admin endpoints will fail");
  } else if (report.env.service_role_format.toString().includes("WRONG")) {
    diagnoses.push("❌ SUPABASE_SERVICE_ROLE_KEY is publishable key, not service_role secret");
  }

  if (!report.publicClient.ok) {
    diagnoses.push(`❌ Public client error: ${report.publicClient.error}`);
  }

  if (!(report.tables.registrations as TableInfo).exists) {
    diagnoses.push("❌ registrations table missing — run schema.sql in Supabase SQL Editor");
  } else {
    const rc = (report.tables.registrations as TableInfo).rowCount;
    diagnoses.push(`✅ registrations: ${rc} rows`);
  }

  if (!(report.tables.cities as TableInfo).exists) {
    diagnoses.push("❌ cities table missing — run schema.sql");
  } else {
    const ct = report.tables.cities as TableInfo;
    if (ct.rowCount === 0) {
      diagnoses.push("⚠️ cities table empty — seed data missing, run full schema.sql");
    } else if (ct.rowCount < 20) {
      diagnoses.push(`⚠️ cities: only ${ct.rowCount}/20 rows — re-run schema.sql to seed all 20`);
    } else {
      diagnoses.push(`✅ cities: ${ct.rowCount} rows`);
    }
    if (!ct.hasAllColumns) {
      diagnoses.push(`❌ cities missing pricing columns: ${ct.missingColumns.join(", ")} — run full schema.sql (DROP + CREATE)`);
    }
  }

  if (report.adminClient.ok) {
    diagnoses.push("✅ Admin client (service_role) working");
  } else if (report.adminClient.error) {
    diagnoses.push(`❌ Admin client error: ${report.adminClient.error}`);
  }

  if (diagnoses.length === 0) {
    diagnoses.push("✅ All checks passed — ready to go!");
  }

  report.diagnoses = diagnoses;
  return NextResponse.json(report);
}
