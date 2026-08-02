import { NextRequest, NextResponse } from "next/server";
import { getSupabasePublic } from "@/lib/supabase-server";

// ============================================================
// PUBLIC: POST /api/registrations
// Insert new registration from landing page RegisterModal.
//
// Uses anon key (NOT service_role) — RLS applies.
// Requires "Public can insert" policy on registrations table
// (see supabase/schema.sql).
// ============================================================

const ADMIN_EMAIL_FALLBACK = "guest@riana-move.id";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ---- Validation ----
    const required = ["full_name", "phone", "event_city_id", "event_city_name", "event_date"];
    for (const f of required) {
      if (!body[f]) {
        return NextResponse.json(
          { error: `Field wajib hilang: ${f}` },
          { status: 400 }
        );
      }
    }

    // ---- Generate unique registration_number ----
    // Pattern: REG-2026-00001 (zero-padded 5 digits)
    const supabase = getSupabasePublic();

    // Count using service-role-like approach: we can't count exactly with RLS
    // (public has no SELECT policy). Instead, generate a random suffix
    // based on timestamp to avoid collisions. The unique constraint on
    // registration_number will catch any rare duplicate.
    const ts = Date.now().toString().slice(-8); // last 8 digits of timestamp
    const rand = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    const registrationNumber = `REG-2026-${ts}${rand}`;

    // ---- Compute derived fields ----
    const ticketType: "regular" | "vip" = body.ticket_type === "vip" ? "vip" : "regular";
    const ticketPrice: number = Number(body.ticket_price ?? 0);
    const birthDate: string | null = body.birth_date || null;
    const age: number | null = birthDate
      ? new Date().getFullYear() - new Date(birthDate).getFullYear()
      : null;

    const paymentStatus = ticketType === "vip" ? "pending" : "free";

    // ---- Build insert payload ----
    const insertData: Record<string, unknown> = {
      registration_number: registrationNumber,
      google_email: body.google_email || ADMIN_EMAIL_FALLBACK,
      google_name: body.google_name || body.full_name,
      google_avatar_url: body.google_avatar_url || null,
      full_name: body.full_name,
      phone: body.phone,
      birth_date: birthDate,
      age,
      gender: body.gender || "P",
      address: body.address || null,
      city_domicile: body.city_domicile || null,
      event_city_id: body.event_city_id,
      event_city_name: body.event_city_name,
      event_date: body.event_date,
      ticket_type: ticketType,
      ticket_price: ticketPrice,
      payment_status: paymentStatus,
      status: "registered",
      check_in_time: null,
      e_ticket_sent: ticketType === "regular",
      e_certificate_sent: false,
      referral_source: body.referral_source || "instagram",
      marketing_consent: Boolean(body.marketing_consent),
      is_muri_record: true,
      muri_verified: false,
      notes: body.notes || null,
      tags: [],
    };

    // ---- Insert ----
    const { data, error } = await supabase
      .from("registrations")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      // 23505 = unique_violation on registration_number — retry with new ID
      if (error.code === "23505") {
        const retryNum = `REG-2026-${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`;
        const { data: data2, error: error2 } = await supabase
          .from("registrations")
          .insert({ ...insertData, registration_number: retryNum })
          .select()
          .single();

        if (error2) {
          console.error("[registrations] retry insert error:", error2);
          return NextResponse.json(
            { error: `Gagal insert: ${error2.message}` },
            { status: 500 }
          );
        }
        return NextResponse.json({ success: true, data: data2 }, { status: 201 });
      }

      console.error("[registrations] insert error:", error);
      return NextResponse.json(
        { error: `Gagal insert: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    console.error("[registrations] server error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// ============================================================
// GET /api/registrations — public count for landing page live counter.
// Requires "Public read count" policy on registrations table.
// ============================================================
export async function GET() {
  try {
    const supabase = getSupabasePublic();
    const { count, error } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("[registrations] count error:", error);
      return NextResponse.json({ error: error.message, count: 0 }, { status: 200 });
    }

    return NextResponse.json({ count: count ?? 0 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    console.error("[registrations] GET error:", msg);
    return NextResponse.json({ error: msg, count: 0 }, { status: 500 });
  }
}
