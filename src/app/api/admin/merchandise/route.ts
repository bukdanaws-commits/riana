import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

// ============================================================
// ADMIN: /api/admin/merchandise
//   GET    — list all merchandise (ordered by display_order)
//   POST   — create new merchandise
//   PUT    — update merchandise by id
//   DELETE — delete merchandise by id (single or batch)
// ============================================================

const VALID_CATEGORIES = ["apparel", "accessories", "equipment", "bundle"];
const VALID_STATUSES = ["active", "soldout", "hidden"];

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("merchandise")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[admin/merchandise] GET error:", error);
      return NextResponse.json({ error: error.message, data: [], count: 0 }, { status: 500 });
    }
    return NextResponse.json({ data, count: data.length });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg, data: [], count: 0 }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || body.price === undefined) {
      return NextResponse.json(
        { error: "Field wajib: name, price" },
        { status: 400 }
      );
    }

    const category = VALID_CATEGORIES.includes(body.category) ? body.category : "apparel";
    const status = VALID_STATUSES.includes(body.status) ? body.status : "active";
    const id = body.id?.trim() || slugify(body.name);

    const insertData = {
      id,
      name: body.name,
      description: body.description || "",
      category,
      price: Number(body.price) || 0,
      original_price: body.original_price ? Number(body.original_price) : null,
      image_url: body.image_url || "",
      stock: Number(body.stock) || 0,
      sold: Number(body.sold) || 0,
      status,
      is_exclusive: Boolean(body.is_exclusive),
      is_bundle: Boolean(body.is_bundle),
      bundle_items: body.bundle_items || null,
      display_order: Number(body.display_order) || 0,
    };

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("merchandise")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("[admin/merchandise] POST error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Field wajib: id" }, { status: 400 });
    }

    if (updates.category && !VALID_CATEGORIES.includes(updates.category)) {
      return NextResponse.json({ error: `category must be one of: ${VALID_CATEGORIES.join(", ")}` }, { status: 400 });
    }
    if (updates.status && !VALID_STATUSES.includes(updates.status)) {
      return NextResponse.json({ error: `status must be one of: ${VALID_STATUSES.join(", ")}` }, { status: 400 });
    }

    const numericFields = ["price", "original_price", "stock", "sold", "display_order"];
    for (const f of numericFields) {
      if (updates[f] !== undefined) updates[f] = Number(updates[f]);
    }
    if (updates.is_exclusive !== undefined) updates.is_exclusive = Boolean(updates.is_exclusive);
    if (updates.is_bundle !== undefined) updates.is_bundle = Boolean(updates.is_bundle);

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("merchandise")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[admin/merchandise] PUT error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { ids } = await request.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Field wajib: ids (array)" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("merchandise").delete().in("id", ids);

    if (error) {
      console.error("[admin/merchandise] DELETE error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, deleted: ids.length });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
