import { NextResponse } from "next/server";
import { getSupabasePublic } from "@/lib/supabase-server";

// ============================================================
// PUBLIC: GET /api/cities
// Returns all cities ordered by date (ascending).
// Used by landing page sections (CitySchedule, MuriProgress, etc.)
// to read live data from Supabase instead of hardcoded event.ts.
//
// RLS: "Public read cities" policy allows anonymous SELECT.
// ============================================================

export async function GET() {
  try {
    const supabase = getSupabasePublic();
    const { data, error } = await supabase
      .from("cities")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("[cities] GET error:", error);
      return NextResponse.json({ error: error.message, data: [] }, { status: 200 });
    }
    return NextResponse.json({ data, count: data.length });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    console.error("[cities] GET exception:", msg);
    return NextResponse.json({ error: msg, data: [] }, { status: 500 });
  }
}
