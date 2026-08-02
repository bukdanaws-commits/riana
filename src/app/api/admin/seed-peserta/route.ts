import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

// ============================================================
// POST /api/admin/seed-peserta
// Insert 100 mock registrations for testing/demo.
// Uses service_role (admin only).
//
// Body (optional):
//   { "count": 50 }  // default 100, max 500
//   { "clear": true } // delete existing first
// ============================================================

const CITIES = [
  { id: "bandung",     city: "Bandung",     date: "2026-07-12", status: "completed", tier: "tier1",  vipPrice: 250000, earlyBird: 175000 },
  { id: "purwokerto",  city: "Purwokerto",  date: "2026-07-19", status: "completed", tier: "tier2",  vipPrice: 175000, earlyBird: 122500 },
  { id: "depok",       city: "Depok",       date: "2026-08-02", status: "open",      tier: "tier2",  vipPrice: 175000, earlyBird: 122500 },
  { id: "tangerang",   city: "Tangerang",   date: "2026-08-09", status: "open",      tier: "tier2",  vipPrice: 175000, earlyBird: 122500 },
  { id: "cirebon",     city: "Cirebon",     date: "2026-08-23", status: "open",      tier: "tier2",  vipPrice: 175000, earlyBird: 122500 },
  { id: "semarang",    city: "Semarang",    date: "2026-08-30", status: "open",      tier: "tier2",  vipPrice: 175000, earlyBird: 122500 },
  { id: "yogyakarta",  city: "Yogyakarta",  date: "2026-09-06", status: "open",      tier: "tier2",  vipPrice: 175000, earlyBird: 122500 },
  { id: "jakarta",     city: "Jakarta",     date: "2026-12-05", status: "open",      tier: "finale", vipPrice: 350000, earlyBird: 245000 },
];

const FIRST_NAMES = ["Andi","Budi","Citra","Dewi","Eka","Fajar","Gita","Hadi","Indra","Joko","Kartika","Lina","Maya","Nanda","Oka","Putri","Rizki","Sari","Tono","Umar","Vina","Wawan","Yuni","Zaki","Rina","Doni","Siti","Agus","Yoga","Wati","Bambang","Sri","Eko","Rudi","Endang","Teguh","Lestari","Hendra","Ratna","Jaya"];
const LAST_NAMES = ["Pratama","Wijaya","Saputra","Anggraini","Setiawan","Permana","Wibowo","Kusuma","Maharani","Santoso","Hidayat","Nugroho","Lestari","Permadi","Suryani","Hartono","Gunawan","Puspita","Rahayu","Sutanto","Kurniawan","Fitriani","Maulana","Yulianti"];
const DOMICILES = ["Bandung","Jakarta","Depok","Tangerang","Bekasi","Bogor","Semarang","Yogyakarta","Surabaya","Malang","Cirebon","Purwokerto","Solo","Sukabumi","Garut","Tasikmalaya"];
const REFERRALS = ["instagram", "tiktok", "friend", "google", "youtube", "other"];

const rand = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

function generateRegistration(i: number) {
  const city = rand(CITIES);
  const firstName = rand(FIRST_NAMES);
  const lastName = rand(LAST_NAMES);
  const fullName = `${firstName} ${lastName}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randInt(1, 999)}@gmail.com`;
  const phone = `08${randInt(11, 89)}${randInt(10000000, 99999999)}`;
  const birthYear = randInt(1985, 2005);
  const birthDate = `${birthYear}-${String(randInt(1, 12)).padStart(2, "0")}-${String(randInt(1, 28)).padStart(2, "0")}`;
  const age = 2026 - birthYear;
  const gender = Math.random() < 0.7 ? "P" : "L";
  const ticketType = Math.random() < 0.2 ? "vip" : "regular";
  const isEarlyBird = ticketType === "vip" && Math.random() < 0.5;
  const ticketPrice = ticketType === "vip" ? (isEarlyBird ? city.earlyBird : city.vipPrice) : 0;

  let status: string, paymentStatus: string, checkedInTime: string | null = null;
  if (city.status === "completed") {
    status = Math.random() < 0.9 ? "checked_in" : "no_show";
    checkedInTime = status === "checked_in"
      ? `${city.date}T${String(randInt(8, 11)).padStart(2, "0")}:${String(randInt(0, 59)).padStart(2, "0")}:00+00:00`
      : null;
    paymentStatus = ticketType === "vip" ? "paid" : "free";
  } else {
    status = Math.random() < 0.95 ? "registered" : "cancelled";
    paymentStatus = ticketType === "vip" ? (Math.random() < 0.6 ? "paid" : "pending") : "free";
  }

  const createdDaysAgo = randInt(1, 60);
  const createdAt = new Date(Date.now() - createdDaysAgo * 86400000).toISOString();

  return {
    registration_number: `REG-2026-${Date.now().toString().slice(-8)}${String(i).padStart(3, "0")}`,
    google_email: email,
    google_name: fullName,
    google_avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=ff6b35,df2679,d4af37`,
    full_name: fullName,
    phone,
    birth_date: birthDate,
    age,
    gender,
    address: `Jl. ${rand(["Sudirman","Asia Afrika","Diponegoro","Gajah Mada","Ahmad Yani","Merdeka"])} No. ${randInt(1, 200)}, ${rand(DOMICILES)}`,
    city_domicile: rand(DOMICILES),
    event_city_id: city.id,
    event_city_name: city.city,
    event_date: city.date,
    ticket_type: ticketType,
    ticket_price: ticketPrice,
    payment_status: paymentStatus,
    status,
    check_in_time: checkedInTime,
    e_ticket_sent: ticketType === "regular" || paymentStatus === "paid",
    e_certificate_sent: status === "checked_in",
    referral_source: rand(REFERRALS),
    marketing_consent: Math.random() < 0.7,
    is_muri_record: true,
    muri_verified: status === "checked_in",
    notes: null,
    tags: [],
    created_at: createdAt,
    updated_at: createdAt,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const count = Math.min(Math.max(Number(body.count) || 100, 1), 500);
    const clearFirst = Boolean(body.clear);

    const supabase = getSupabaseAdmin();

    // Optional: clear existing
    if (clearFirst) {
      const { error: delErr } = await supabase
        .from("registrations")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // delete all
      if (delErr) {
        return NextResponse.json({ error: `Gagal clear: ${delErr.message}` }, { status: 500 });
      }
    }

    // Generate registrations
    const registrations = Array.from({ length: count }, (_, i) => generateRegistration(i + 1));

    // Insert in batches of 25
    const BATCH_SIZE = 25;
    let inserted = 0;
    let errors = 0;

    for (let i = 0; i < registrations.length; i += BATCH_SIZE) {
      const batch = registrations.slice(i, i + BATCH_SIZE);
      const { data, error } = await supabase
        .from("registrations")
        .insert(batch)
        .select("id");

      if (error) {
        console.error(`[seed-peserta] batch ${i / BATCH_SIZE + 1} error:`, error.message);
        errors += batch.length;
      } else {
        inserted += data?.length ?? 0;
      }
    }

    return NextResponse.json({
      success: true,
      inserted,
      errors,
      requested: count,
      distribution: {
        regular: registrations.filter(r => r.ticket_type === "regular").length,
        vip: registrations.filter(r => r.ticket_type === "vip").length,
        registered: registrations.filter(r => r.status === "registered").length,
        checked_in: registrations.filter(r => r.status === "checked_in").length,
        cancelled: registrations.filter(r => r.status === "cancelled").length,
        no_show: registrations.filter(r => r.status === "no_show").length,
        free: registrations.filter(r => r.payment_status === "free").length,
        paid: registrations.filter(r => r.payment_status === "paid").length,
        pending: registrations.filter(r => r.payment_status === "pending").length,
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    console.error("[seed-peserta] error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
