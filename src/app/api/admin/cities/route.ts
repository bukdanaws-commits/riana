import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

// ============================================================
// ADMIN: /api/admin/cities
//   GET    — list all cities (admin, ordered by date)
//   POST   — create new city
//   PUT    — update city by id
//   DELETE — delete city by id (single or batch)
//
// Uses service_role key (bypass RLS).
// ============================================================

const VALID_TIERS = ["finale", "tier1", "tier2"];
const VALID_STATUSES = ["completed", "open", "soon", "soldout"];

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// ---------------- GET ----------------
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("cities")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("[admin/cities] GET error:", error);
      return NextResponse.json({ error: error.message, data: [], count: 0 }, { status: 500 });
    }
    return NextResponse.json({ data, count: data.length });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    console.error("[admin/cities] GET exception:", msg);
    return NextResponse.json({ error: msg, data: [], count: 0 }, { status: 500 });
  }
}

// ---------------- POST (create) ----------------
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    if (!body.city || !body.date) {
      return NextResponse.json(
        { error: "Field wajib: city, date" },
        { status: 400 }
      );
    }

    const tier = VALID_TIERS.includes(body.tier) ? body.tier : "tier2";
    const status = VALID_STATUSES.includes(body.status) ? body.status : "soon";

    // Auto-generate id from city name if not provided
    const id = body.id?.trim() || slugify(body.city);

    const insertData = {
      id,
      date: body.date,
      date_label: body.date_label || "",
      day_label: body.day_label || "",
      city: body.city,
      venue: body.venue || "",
      region: body.region || "",
      capacity: Number(body.capacity) || 500,
      registered: Number(body.registered) || 0,
      checked_in: Number(body.checked_in) || 0,
      status,
      price: body.price || "Gratis",
      tier,
      vip_price: Number(body.vip_price) || (tier === "finale" ? 350000 : tier === "tier1" ? 250000 : 175000),
      vip_early_bird_price: Number(body.vip_early_bird_price) || (tier === "finale" ? 245000 : tier === "tier1" ? 175000 : 122500),
      early_bird_active: Boolean(body.early_bird_active),
      map_x: Number(body.map_x) || 50,
      map_y: Number(body.map_y) || 60,
    };

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("cities")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("[admin/cities] POST error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    console.error("[admin/cities] POST exception:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// ---------------- PUT (update) ----------------
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Field wajib: id" }, { status: 400 });
    }

    // Validate enum fields if provided
    if (updates.tier && !VALID_TIERS.includes(updates.tier)) {
      return NextResponse.json({ error: `tier must be one of: ${VALID_TIERS.join(", ")}` }, { status: 400 });
    }
    if (updates.status && !VALID_STATUSES.includes(updates.status)) {
      return NextResponse.json({ error: `status must be one of: ${VALID_STATUSES.join(", ")}` }, { status: 400 });
    }

    // Coerce numeric fields
    const numericFields = ["capacity", "registered", "checked_in", "vip_price", "vip_early_bird_price", "map_x", "map_y"];
    for (const f of numericFields) {
      if (updates[f] !== undefined) updates[f] = Number(updates[f]);
    }
    if (updates.early_bird_active !== undefined) {
      updates.early_bird_active = Boolean(updates.early_bird_active);
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("cities")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[admin/cities] PUT error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    console.error("[admin/cities] PUT exception:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// ---------------- DELETE ----------------
export async function DELETE(request: NextRequest) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Field wajib: ids (array)" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("cities").delete().in("id", ids);

    if (error) {
      console.error("[admin/cities] DELETE error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, deleted: ids.length });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    console.error("[admin/cities] DELETE exception:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
