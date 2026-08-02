import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

// ============================================================
// PUBLIC: POST /api/registrations
// Insert new registration from landing page RegisterModal.
// Bypasses RLS via service role (public INSERT policy also exists,
// but service role guarantees the write succeeds even if policy changes).
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
    // Count existing rows then +1; retry on race-condition duplicate.
    const supabaseAdmin = getSupabaseAdmin();
    const { count, error: countErr } = await supabaseAdmin
      .from("registrations")
      .select("*", { count: "exact", head: true });

    if (countErr) {
      console.error("[registrations] count error:", countErr);
      return NextResponse.json(
        { error: "Gagal generate registration number" },
        { status: 500 }
      );
    }

    const baseNum = (count ?? 0) + 1;

    // ---- Compute derived fields ----
    const ticketType: "regular" | "vip" = body.ticket_type === "vip" ? "vip" : "regular";
    const ticketPrice: number = Number(body.ticket_price ?? 0);
    const birthDate: string | null = body.birth_date || null;
    const age: number | null = birthDate
      ? new Date().getFullYear() - new Date(birthDate).getFullYear()
      : null;

    const paymentStatus = ticketType === "vip" ? "pending" : "free";

    // ---- Build insert payload (camelCase -> snake_case) ----
    const insertData: Record<string, unknown> = {
      registration_number: `REG-2026-${String(baseNum).padStart(5, "0")}`,
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

    // ---- Insert with retry on duplicate registration_number ----
    const { data, error } = await supabaseAdmin
      .from("registrations")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      // 23505 = unique_violation (race condition on registration_number)
      if (error.code === "23505") {
        const retryNum = baseNum + 1;
        const retryNumStr = `REG-2026-${String(retryNum).padStart(5, "0")}`;
        const { data: data2, error: error2 } = await supabaseAdmin
          .from("registrations")
          .insert({ ...insertData, registration_number: retryNumStr })
          .select()
          .single();

        if (error2) {
          console.error("[registrations] retry insert error:", error2);
          return NextResponse.json(
            { error: "Gagal mendaftar (duplicate). Silakan coba lagi." },
            { status: 500 }
          );
        }
        return NextResponse.json({ success: true, data: data2 }, { status: 201 });
      }

      console.error("[registrations] insert error:", error);
      return NextResponse.json(
        { error: error.message || "Gagal insert ke database" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (e) {
    console.error("[registrations] server error:", e);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to count registrations (for live counter on landing)
export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { count, error } = await supabaseAdmin
      .from("registrations")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ count: count ?? 0 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
