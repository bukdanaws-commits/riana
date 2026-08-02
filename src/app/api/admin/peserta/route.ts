import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

// ============================================================
// ADMIN: GET/PUT/DELETE /api/admin/peserta
// Uses service_role key to bypass RLS (admin-only).
//
// If SUPABASE_SERVICE_ROLE_KEY is missing or is actually a
// publishable key, getSupabaseAdmin() throws a clear error
// that gets returned to the client.
// ============================================================

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data, count: data.length });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    console.error("[admin/peserta] GET error:", msg);
    return NextResponse.json({ error: msg, data: [], count: 0 }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { ids } = await request.json();
    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
    }
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin.from("registrations").delete().in("id", ids);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, deleted: ids.length });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    console.error("[admin/peserta] DELETE error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json();
    if (!id) return NextResponse.json({ error: "No ID provided" }, { status: 400 });

    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from("registrations")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    console.error("[admin/peserta] PUT error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
