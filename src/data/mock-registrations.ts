// ============================================================
// Mock Data Generator — 100 Peserta Realistic Indonesia
// Untuk demo tab "Data Peserta" sebelum integrate Supabase
// ============================================================

import { CITIES } from "./event";
import { getCityPricing } from "./pricing";

export interface Registration {
  // === IDENTITY ===
  id: string;                          // REG-2026-XXXXX
  registrationDate: string;            // ISO timestamp
  lastUpdate: string;                  // ISO timestamp

  // === GOOGLE AUTH ===
  userId: string;                      // mock UUID
  googleEmail: string;                 // firstname.lastname@gmail.com
  googleName: string;                  // from Google profile
  googleAvatarUrl: string;             // mock avatar URL

  // === DATA PESERTA ===
  fullName: string;
  phone: string;                       // 08xx-xxxx-xxxx
  birthDate: string;                   // YYYY-MM-DD
  age: number;
  gender: "L" | "P" | "other";
  address: string;
  cityDomicile: string;
  province: string;
  postalCode: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;

  // === DATA EVENT ===
  eventCityId: string;
  eventCityName: string;
  eventDate: string;
  ticketType: "regular" | "vip";
  ticketPrice: number;                 // 0 (regular) atau VIP price

  // === PAYMENT ===
  paymentStatus: "free" | "pending" | "paid" | "refunded" | "failed";
  paymentMethod?: "qris" | "transfer" | "ewallet" | "credit_card";
  paymentGateway?: "midtrans" | "xendit";
  paymentId?: string;
  paymentAmount?: number;
  paymentDate?: string;
  invoiceNumber?: string;

  // === STATUS ===
  status: "registered" | "checked_in" | "cancelled" | "no_show" | "refunded";
  checkInTime?: string;
  checkInMethod?: "qr" | "manual" | "self_check_in";
  checkedInBy?: string;

  // === COMMUNICATION ===
  eTicketSent: boolean;
  eTicketSentAt?: string;
  eCertificateSent: boolean;
  eCertificateSentAt?: string;
  whatsappReminderSent: boolean;

  // === MARKETING ===
  referralSource?: "instagram" | "tiktok" | "friend" | "google" | "youtube" | "other";
  referralCode: string;                // FIRSTNAME-2026-XXXXX
  referredBy?: string;
  marketingConsent: boolean;

  // === MURI ===
  isMuriRecord: boolean;
  muriVerified: boolean;

  // === ADMIN ===
  notes?: string;
  tags: string[];

  // === TIMESTAMPS ===
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// REALISTIC INDONESIAN DATA POOLS
// ============================================================

const FIRST_NAMES_F = [
  "Dewi", "Sinta", "Ratna", "Lia", "Sari", "Putri", "Ani", "Wati", "Yuni", "Rina",
  "Maya", "Indah", "Sri", "Endang", "Nur", "Ayu", "Citra", "Fransisca", "Maria", "Tari",
  "Lestari", "Anggraini", "Wulandari", "Safitri", "Lestari", "Permata", "Cahya", "Kusuma",
];

const FIRST_NAMES_M = [
  "Budi", "Michael", "Andi", "Rizki", "Fajar", "Dimas", "Agus", "Dian", "Eko", "Hendra",
  "Joko", "Wahyu", "Rudi", "Bayu", "Yoga", "Reza", "Galih", "Adi", "Sandi", "Bima",
  "Prakoso", "Santoso", "Wibowo", "Saputra", "Permana", "Nugraha", "Hartono", "Kurniawan",
];

const LAST_NAMES = [
  "Anggraini", "Prakoso", "Maharani", "Kusumawardani", "Santoso", "Wibowo", "Saputra",
  "Permana", "Nugraha", "Hartono", "Wijaya", "Halim", "Tan", "Lestari", "Safitri",
  "Permadi", "Suryadi", "Gunawan", "Hidayat", "Setiawan", "Rahmawati", "Handayani",
  "Fatmawati", "Yulianti", "Susanti", "Marlina", "Utami", "Sari", "Pertiwi", "Oktaviani",
];

const PROVINCES_BY_CITY: Record<string, { province: string; addressPrefix: string; postalCodes: string[] }> = {
  bandung:     { province: "Jawa Barat",     addressPrefix: "Jl. Merdeka", postalCodes: ["40123", "40124", "40125", "40161", "40241"] },
  purwokerto:  { province: "Jawa Tengah",    addressPrefix: "Jl. Jend. Sudirman", postalCodes: ["53111", "53112", "53115", "53116"] },
  depok:       { province: "Jawa Barat",     addressPrefix: "Jl. Margonda Raya", postalCodes: "16411|16412|16424|16425".split("|") },
  tangerang:   { province: "Banten",         addressPrefix: "Jl. BSD Boulevard", postalCodes: ["15310", "15311", "15320", "15325"] },
  cirebon:     { province: "Jawa Barat",     addressPrefix: "Jl. Siliwangi", postalCodes: ["45111", "45121", "45123", "45132"] },
  semarang:    { province: "Jawa Tengah",    addressPrefix: "Jl. Pemuda", postalCodes: ["50131", "50132", "50137", "50241"] },
  yogyakarta:  { province: "DI Yogyakarta",  addressPrefix: "Jl. Malioboro", postalCodes: ["55222", "55223", "55241", "55281"] },
  malang:      { province: "Jawa Timur",     addressPrefix: "Jl. Ijen", postalCodes: ["65111", "65112", "65115", "65119"] },
  surabaya:    { province: "Jawa Timur",     addressPrefix: "Jl. Tunjungan", postalCodes: ["60221", "60241", "60271", "60275"] },
  bali:        { province: "Bali",           addressPrefix: "Jl. Sunset Road", postalCodes: ["80361", "80361", "80231", "80232"] },
  lombok:      { province: "NTB",            addressPrefix: "Jl. Pejanggik", postalCodes: ["83111", "83112", "83115", "83116"] },
  lampung:     { province: "Lampung",        addressPrefix: "Jl. Pangeran Antasari", postalCodes: ["35111", "35112", "35115", "35119"] },
  palembang:   { province: "Sumatera Selatan", addressPrefix: "Jl. Jend. Sudirman", postalCodes: ["30111", "30112", "30113", "30114"] },
  medan:       { province: "Sumatera Utara", addressPrefix: "Jl. Gatot Subroto", postalCodes: ["20111", "20112", "20113", "20114"] },
  batam:       { province: "Kepri",          addressPrefix: "Jl. Raja Ali Haji", postalCodes: ["29411", "29412", "29413", "29414"] },
  makassar:    { province: "Sulawesi Selatan", addressPrefix: "Jl. Pettarani", postalCodes: ["90111", "90112", "90113", "90114"] },
  manado:      { province: "Sulawesi Utara", addressPrefix: "Jl. Sam Ratulangi", postalCodes: ["95111", "95112", "95113", "95114"] },
  banjarmasin: { province: "Kalimantan Selatan", addressPrefix: "Jl. Pangeran Antasari", postalCodes: ["70111", "70112", "70113", "70114"] },
  balikpapan:  { province: "Kalimantan Timur", addressPrefix: "Jl. Jend. Sudirman", postalCodes: ["76111", "76112", "76113", "76114"] },
  jakarta:     { province: "DKI Jakarta",    addressPrefix: "Jl. Sudirman", postalCodes: ["12190", "12920", "12950", "12110"] },
};

const REFERRAL_SOURCES = [
  { source: "instagram" as const, weight: 45 },
  { source: "tiktok" as const, weight: 25 },
  { source: "friend" as const, weight: 15 },
  { source: "google" as const, weight: 8 },
  { source: "youtube" as const, weight: 5 },
  { source: "other" as const, weight: 2 },
];

const TAGS_POOL = ["influencer", "vip_guest", "media", "early_adopter", "community_leader", "repeat_attendee", "bandung", "jakarta", "bali"];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickWeighted<T extends { weight: number }>(items: T[]): T {
  const total = items.reduce((s, i) => s + i.weight, 0);
  let r = Math.random() * total;
  for (const item of items) {
    r -= item.weight;
    if (r <= 0) return item;
  }
  return items[0];
}

function generatePhone(): string {
  const prefixes = ["0813", "0812", "0856", "0857", "0821", "0822", "0838", "0811", "0852", "0853"];
  const prefix = randomChoice(prefixes);
  const number = randomInt(10000000, 99999999).toString();
  return `${prefix}-${number.slice(0,4)}-${number.slice(4)}`;
}

function generateBirthDate(): { date: string; age: number } {
  const year = randomInt(1985, 2005);
  const month = randomInt(1, 12);
  const day = randomInt(1, 28);
  const date = `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
  const age = new Date().getFullYear() - year;
  return { date, age };
}

function generateEmail(firstName: string, lastName: string): string {
  const formats = [
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`,
    `${firstName.toLowerCase()}${lastName.toLowerCase().charAt(0)}@gmail.com`,
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}123@gmail.com`,
    `${firstName.toLowerCase()}_${lastName.toLowerCase()}@gmail.com`,
  ];
  return randomChoice(formats);
}

function generateAvatarUrl(name: string): string {
  // Use DiceBear API for mock avatar
  const seed = encodeURIComponent(name);
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=ff6b35,df2679,d4af37`;
}

function generateReferralCode(name: string, id: string): string {
  const firstName = name.split(" ")[0].toUpperCase();
  const num = id.split("-").pop();
  return `${firstName}-${num}`;
}

function generateInvoiceNumber(id: string): string {
  const num = id.split("-").pop();
  return `INV-2026-${num}`;
}

// ============================================================
// GENERATE 100 MOCK REGISTRATIONS
// ============================================================

export function generateMockRegistrations(): Registration[] {
  const registrations: Registration[] = [];

  // Distribution: 100 peserta across cities
  // 2 cities completed (Bandung, Purwokerto) - mostly checked_in
  // 5 cities open (Depok, Tangerang, Cirebon, Semarang, Yogyakarta) - registered
  // Jakarta finale - registered
  const distribution: { cityId: string; count: number; mostlyCheckedIn: boolean }[] = [
    { cityId: "bandung",     count: 25, mostlyCheckedIn: true },
    { cityId: "purwokerto",  count: 20, mostlyCheckedIn: true },
    { cityId: "depok",       count: 15, mostlyCheckedIn: false },
    { cityId: "tangerang",   count: 10, mostlyCheckedIn: false },
    { cityId: "cirebon",     count: 8,  mostlyCheckedIn: false },
    { cityId: "semarang",    count: 7,  mostlyCheckedIn: false },
    { cityId: "yogyakarta",  count: 5,  mostlyCheckedIn: false },
    { cityId: "jakarta",     count: 10, mostlyCheckedIn: false },
  ];

  let counter = 1;

  for (const { cityId, count, mostlyCheckedIn } of distribution) {
    const city = CITIES.find((c) => c.id === cityId);
    if (!city) continue;

    const pricing = getCityPricing(cityId, city.date);
    const cityInfo = PROVINCES_BY_CITY[cityId] ?? { province: "Indonesia", addressPrefix: "Jl. Sample", postalCodes: ["00000"] };

    for (let i = 0; i < count; i++) {
      const isFemale = Math.random() > 0.4; // 60% female (Zumba typical)
      const firstName = isFemale ? randomChoice(FIRST_NAMES_F) : randomChoice(FIRST_NAMES_M);
      const lastName = randomChoice(LAST_NAMES);
      const fullName = `${firstName} ${lastName}`;
      const { date: birthDate, age } = generateBirthDate();
      const gender: Registration["gender"] = isFemale ? "P" : "L";
      const email = generateEmail(firstName, lastName);

      // Ticket type: 85% regular, 15% VIP
      const ticketType: Registration["ticketType"] = Math.random() < 0.15 ? "vip" : "regular";
      const ticketPrice = ticketType === "vip" ? pricing.vip.price : 0;

      // Payment
      const isVip = ticketType === "vip";
      const paymentStatus: Registration["paymentStatus"] = isVip
        ? (Math.random() < 0.9 ? "paid" : "pending")
        : "free";
      const paymentMethod = isVip ? randomChoice(["qris", "transfer", "ewallet", "credit_card"] as const) : undefined;
      const paymentGateway = isVip ? randomChoice(["midtrans", "xendit"] as const) : undefined;

      // Status
      let status: Registration["status"];
      if (mostlyCheckedIn) {
        // 90% checked_in, 5% no_show, 5% cancelled
        const r = Math.random();
        if (r < 0.9) status = "checked_in";
        else if (r < 0.95) status = "no_show";
        else status = "cancelled";
      } else {
        // 95% registered, 3% cancelled, 2% refunded
        const r = Math.random();
        if (r < 0.95) status = "registered";
        else if (r < 0.98) status = "cancelled";
        else status = "refunded";
      }

      // Registration date: 1-30 days ago (for completed) or 1-7 days ago (for open)
      const regDaysAgo = mostlyCheckedIn ? randomInt(15, 30) : randomInt(1, 7);
      const regDate = new Date();
      regDate.setDate(regDate.getDate() - regDaysAgo);
      regDate.setHours(randomInt(8, 22), randomInt(0, 59), 0, 0);
      const registrationDate = regDate.toISOString();

      // Payment date (5 min after registration)
      let paymentDate: string | undefined;
      if (paymentStatus === "paid" || paymentStatus === "free") {
        const payDate = new Date(regDate);
        payDate.setMinutes(payDate.getMinutes() + randomInt(1, 30));
        paymentDate = payDate.toISOString();
      }

      // Check-in time (for completed cities)
      let checkInTime: string | undefined;
      if (status === "checked_in") {
        const ciDate = new Date(city.date + "T07:00:00+07:00");
        ciDate.setMinutes(ciDate.getMinutes() + randomInt(0, 120));
        checkInTime = ciDate.toISOString();
      }

      // E-ticket sent
      const eTicketSent = paymentStatus === "paid" || paymentStatus === "free";
      let eTicketSentAt: string | undefined;
      if (eTicketSent && paymentDate) {
        const etDate = new Date(paymentDate);
        etDate.setMinutes(etDate.getMinutes() + randomInt(1, 10));
        eTicketSentAt = etDate.toISOString();
      }

      // E-certificate sent (only for checked_in)
      const eCertificateSent = status === "checked_in";
      let eCertificateSentAt: string | undefined;
      if (eCertificateSent && checkInTime) {
        const ecDate = new Date(checkInTime);
        ecDate.setDate(ecDate.getDate() + randomInt(1, 7));
        eCertificateSentAt = ecDate.toISOString();
      }

      // Referral
      const referral = pickWeighted(REFERRAL_SOURCES);
      const id = `REG-2026-${String(counter).padStart(5, "0")}`;
      const referralCode = generateReferralCode(firstName, id);

      // Tags (10% chance of having tags)
      const tags: string[] = [];
      if (Math.random() < 0.1) {
        tags.push(randomChoice(TAGS_POOL));
        if (Math.random() < 0.3) tags.push(randomChoice(TAGS_POOL));
      }

      // Notes (5% chance)
      const notes = Math.random() < 0.05 ? randomChoice([
        "Influencer lokal, 50K followers",
        "VIP guest dari sponsor",
        "Media partner representative",
        "Komunitas ZIN lokal",
        "Request front-row spot",
      ]) : undefined;

      const reg: Registration = {
        id,
        registrationDate,
        lastUpdate: registrationDate,

        userId: `mock-user-${counter}`,
        googleEmail: email,
        googleName: fullName,
        googleAvatarUrl: generateAvatarUrl(fullName),

        fullName,
        phone: generatePhone(),
        birthDate,
        age,
        gender,
        address: `${cityInfo.addressPrefix} No. ${randomInt(1, 200)}, ${city.city}`,
        cityDomicile: city.city,
        province: cityInfo.province,
        postalCode: randomChoice(cityInfo.postalCodes),
        emergencyContactName: Math.random() < 0.7 ? randomChoice(FIRST_NAMES_M) + " " + lastName : undefined,
        emergencyContactPhone: Math.random() < 0.7 ? generatePhone() : undefined,

        eventCityId: cityId,
        eventCityName: city.city,
        eventDate: city.date,
        ticketType,
        ticketPrice,

        paymentStatus,
        paymentMethod,
        paymentGateway,
        paymentId: isVip ? `TXN-${counter}-${randomInt(1000, 9999)}` : undefined,
        paymentAmount: ticketPrice,
        paymentDate,
        invoiceNumber: isVip ? generateInvoiceNumber(id) : undefined,

        status,
        checkInTime,
        checkInMethod: status === "checked_in" ? randomChoice(["qr", "manual", "self_check_in"] as const) : undefined,
        checkedInBy: status === "checked_in" ? "admin@rianaonthemove.id" : undefined,

        eTicketSent,
        eTicketSentAt,
        eCertificateSent,
        eCertificateSentAt,
        whatsappReminderSent: mostlyCheckedIn && Math.random() < 0.8,

        referralSource: referral.source,
        referralCode,
        referredBy: Math.random() < 0.2 ? registrations[randomInt(0, Math.max(0, registrations.length - 1))]?.referralCode : undefined,
        marketingConsent: Math.random() < 0.75,

        isMuriRecord: status !== "cancelled" && status !== "refunded",
        muriVerified: status === "checked_in",

        notes,
        tags,

        createdAt: registrationDate,
        updatedAt: registrationDate,
      };

      registrations.push(reg);
      counter++;
    }
  }

  return registrations;
}
