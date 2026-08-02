// ============================================================
// Seed 100 mock registrations ke Supabase
// Jalankan: node scripts/seed-peserta.mjs
// ============================================================

const SUPABASE_URL = "https://utzwxupemjrwdsemuuib.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  // Coba baca dari .env.local
  const fs = await import("fs");
  const envContent = fs.readFileSync(".env.local", "utf8");
  const match = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);
  if (match) {
    process.env.SUPABASE_SERVICE_ROLE_KEY = match[1].trim();
  } else {
    console.error("❌ SUPABASE_SERVICE_ROLE_KEY tidak ditemukan di .env.local");
    process.exit(1);
  }
}

// 20 kota dengan distribusi peserta realistic
const CITIES = [
  { id: "bandung",     city: "Bandung",     date: "2026-07-12", status: "completed", tier: "tier1", vipPrice: 250000, earlyBird: 175000 },
  { id: "purwokerto",  city: "Purwokerto",  date: "2026-07-19", status: "completed", tier: "tier2", vipPrice: 175000, earlyBird: 122500 },
  { id: "depok",       city: "Depok",       date: "2026-08-02", status: "open",      tier: "tier2", vipPrice: 175000, earlyBird: 122500 },
  { id: "tangerang",   city: "Tangerang",   date: "2026-08-09", status: "open",      tier: "tier2", vipPrice: 175000, earlyBird: 122500 },
  { id: "cirebon",     city: "Cirebon",     date: "2026-08-23", status: "open",      tier: "tier2", vipPrice: 175000, earlyBird: 122500 },
  { id: "semarang",    city: "Semarang",    date: "2026-08-30", status: "open",      tier: "tier2", vipPrice: 175000, earlyBird: 122500 },
  { id: "yogyakarta",  city: "Yogyakarta",  date: "2026-09-06", status: "open",      tier: "tier2", vipPrice: 175000, earlyBird: 122500 },
  { id: "jakarta",     city: "Jakarta",     date: "2026-12-05", status: "open",      tier: "finale", vipPrice: 350000, earlyBird: 245000 },
];

// Indonesian name pools
const FIRST_NAMES = [
  "Andi","Budi","Citra","Dewi","Eka","Fajar","Gita","Hadi","Indra","Joko",
  "Kartika","Lina","Maya","Nanda","Oka","Putri","Rizki","Sari","Tono","Umar",
  "Vina","Wawan","Yuni","Zaki","Rina","Doni","Siti","Agus","Yoga","Wati",
  "Bambang","Sri","Eko","Rudi","Endang","Teguh","Lestari","Hendra","Ratna","Jaya",
];
const LAST_NAMES = [
  "Pratama","Wijaya","Saputra","Anggraini","Setiawan","Permana","Wibowo","Kusuma",
  "Maharani","Santoso","Hidayat","Nugroho","Lestari","Permadi","Suryani","Hartono",
  "Gunawan","Puspita","Rahayu","Sutanto","Kurniawan","Fitriani","Maulana","Yulianti",
];
const DOMICILES = [
  "Bandung","Jakarta","Depok","Tangerang","Bekasi","Bogor","Semarang","Yogyakarta",
  "Surabaya","Malang","Cirebon","Purwokerto","Solo","Sukabumi","Garut","Tasikmalaya",
];
const VENUES = ["Saparua Sport Center","GOR Soemardip","Universitas Indonesia","ICE BSD City","Jatidiri Sport Complex","GOR Amongrogo","JIS Stadium","Gajayana Stadium"];

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// Generate 100 mock registrations
const registrations = [];
for (let i = 1; i <= 100; i++) {
  const city = randomFrom(CITIES);
  const firstName = randomFrom(FIRST_NAMES);
  const lastName = randomFrom(LAST_NAMES);
  const fullName = `${firstName} ${lastName}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomInt(1, 999)}@gmail.com`;
  const phone = `08${randomInt(11, 89)}${randomInt(10000000, 99999999)}`;
  const birthYear = randomInt(1985, 2005);
  const birthDate = `${birthYear}-${String(randomInt(1, 12)).padStart(2, "0")}-${String(randomInt(1, 28)).padStart(2, "0")}`;
  const age = 2026 - birthYear;
  const gender = Math.random() < 0.7 ? "P" : "L";
  const ticketType = Math.random() < 0.2 ? "vip" : "regular";
  const isEarlyBird = ticketType === "vip" && Math.random() < 0.5;
  const ticketPrice = ticketType === "vip" ? (isEarlyBird ? city.earlyBird : city.vipPrice) : 0;

  // Status logic: kalau kota completed → 90% checked_in, kalau open → registered
  let status, paymentStatus, checkedInTime = null;
  if (city.status === "completed") {
    status = Math.random() < 0.9 ? "checked_in" : "no_show";
    checkedInTime = status === "checked_in" ? `${city.date}T${String(randomInt(8, 11)).padStart(2, "0")}:${String(randomInt(0, 59)).padStart(2, "0")}:00+00:00` : null;
    paymentStatus = ticketType === "vip" ? "paid" : "free";
  } else {
    status = Math.random() < 0.95 ? "registered" : "cancelled";
    paymentStatus = ticketType === "vip" ? (Math.random() < 0.6 ? "paid" : "pending") : "free";
  }

  const referralSources = ["instagram", "tiktok", "friend", "google", "youtube", "other"];
  const registrationNumber = `REG-2026-${String(i).padStart(5, "0")}`;
  const createdDaysAgo = randomInt(1, 60);
  const createdAt = new Date(Date.now() - createdDaysAgo * 86400000).toISOString();

  registrations.push({
    registration_number: registrationNumber,
    google_email: email,
    google_name: fullName,
    google_avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=ff6b35,df2679,d4af37`,
    full_name: fullName,
    phone,
    birth_date: birthDate,
    age,
    gender,
    address: `Jl. ${randomFrom(["Sudirman","Asia Afrika","Diponegoro","Gajah Mada","Ahmad Yani","Merdeka"])} No. ${randomInt(1, 200)}, ${randomFrom(DOMICILES)}`,
    city_domicile: randomFrom(DOMICILES),
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
    referral_source: randomFrom(referralSources),
    marketing_consent: Math.random() < 0.7,
    is_muri_record: true,
    muri_verified: status === "checked_in",
    notes: null,
    tags: [],
    created_at: createdAt,
    updated_at: createdAt,
  });
}

console.log(`📦 Generated ${registrations.length} mock registrations`);
console.log(`📊 Distribution:`);
console.log(`   by ticket: regular=${registrations.filter(r => r.ticket_type === "regular").length}, vip=${registrations.filter(r => r.ticket_type === "vip").length}`);
console.log(`   by status: registered=${registrations.filter(r => r.status === "registered").length}, checked_in=${registrations.filter(r => r.status === "checked_in").length}, cancelled=${registrations.filter(r => r.status === "cancelled").length}, no_show=${registrations.filter(r => r.status === "no_show").length}`);
console.log(`   by payment: free=${registrations.filter(r => r.payment_status === "free").length}, paid=${registrations.filter(r => r.payment_status === "paid").length}, pending=${registrations.filter(r => r.payment_status === "pending").length}`);

// Insert via REST API (batch 25 per request)
console.log(`\n🚀 Inserting to Supabase...`);
const BATCH_SIZE = 25;
let inserted = 0;
let errors = 0;

for (let i = 0; i < registrations.length; i += BATCH_SIZE) {
  const batch = registrations.slice(i, i + BATCH_SIZE);
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/registrations`, {
      method: "POST",
      headers: {
        "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation,resolution=ignore_duplicates",
      },
      body: JSON.stringify(batch),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} failed: HTTP ${res.status}`);
      console.error(`   ${errText.slice(0, 200)}`);
      errors += batch.length;
    } else {
      const data = await res.json();
      inserted += data.length;
      console.log(`✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: inserted ${data.length} rows (total: ${inserted})`);
    }
  } catch (e) {
    console.error(`❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} error:`, e.message);
    errors += batch.length;
  }
}

console.log(`\n🎉 DONE — inserted: ${inserted}, errors: ${errors}`);
console.log(`\n🔗 Verify: https://riana-dnkf.vercel.app/api/admin/peserta`);
