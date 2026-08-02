import { NextResponse } from "next/server";
import { getSupabasePublic } from "@/lib/supabase-server";

// ============================================================
// PUBLIC: GET /api/merchandise
// Returns all active merchandise ordered by display_order.
// Used by landing page Merchandise section.
// ============================================================

export async function GET() {
  try {
    const supabase = getSupabasePublic();
    const { data, error } = await supabase
      .from("merchandise")
      .select("*")
      .eq("status", "active")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[merchandise] GET error:", error);
      return NextResponse.json({ error: error.message, data: [] }, { status: 200 });
    }
    return NextResponse.json({ data, count: data.length });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg, data: [] }, { status: 500 });
  }
}
