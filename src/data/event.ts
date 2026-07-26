// ============================================================
// Riana On The Move — Event Data Source (v2 — realistic mockup)
// Timeline reference: hari ini = 26 Juli 2026
// 2 kota selesai (Bandung, Purwokerto), 5 kota open, 13 coming soon
// Total registered: ~1.618 dari target 10.000 (16.2%)
// ============================================================

export type Region = "Jawa Barat" | "Jawa Tengah" | "Jawa Timur" | "Bali & Nusra" | "Sumatera" | "Sulawesi" | "Kalimantan";

export type CityStatus = "completed" | "open" | "soon" | "soldout";

export interface CityEvent {
  id: string;
  date: string; // ISO
  dateLabel: string; // "12 Juli"
  dayLabel: string; // "Minggu"
  city: string;
  venue: string;
  region: Region;
  capacity: number;
  registered: number;
  checkedIn?: number; // for completed events
  status: CityStatus;
  mapX: number; // position on Indonesian map (0-100)
  mapY: number;
  price: string;
  earlyBird?: boolean;
}

// Timeline: hari ini = 26 Juli 2026
// Bandung (12 Jul) - SELESAI - 487 check-in dari 500 capacity
// Purwokerto (19 Jul) - SELESAI - 412 check-in dari 400 capacity (sold out)
// Depok (2 Agt) - H-7, OPEN, 432/600
// Tangerang (9 Agt) - H-14, OPEN, 287/800
// Cirebon (23 Agt) - H-28, OPEN, 145/400
// Semarang (30 Agt) - H-35, OPEN, 89/600
// Yogyakarta (6 Sep) - H-42, OPEN, 42/600
// Malang dst - COMING SOON (pendaftaran belum buka)

export const CITIES: CityEvent[] = [
  { id: "bandung",    date: "2026-07-12", dateLabel: "12 Juli",      dayLabel: "Minggu",  city: "Bandung",     venue: "Saparua Sport Center",          region: "Jawa Barat",    capacity: 500,  registered: 487, checkedIn: 487, status: "completed", mapX: 47, mapY: 60, price: "Gratis" },
  { id: "purwokerto", date: "2026-07-19", dateLabel: "19 Juli",      dayLabel: "Minggu",  city: "Purwokerto",  venue: "GOR Soemardip",                 region: "Jawa Tengah",   capacity: 400,  registered: 412, checkedIn: 412, status: "completed", mapX: 49, mapY: 62, price: "Gratis" },
  { id: "depok",      date: "2026-08-02", dateLabel: "2 Agustus",    dayLabel: "Minggu",  city: "Depok",       venue: "Universitas Indonesia",         region: "Jawa Barat",    capacity: 600,  registered: 432, status: "open",   mapX: 48, mapY: 61, price: "Gratis", earlyBird: true },
  { id: "tangerang",  date: "2026-08-09", dateLabel: "9 Agustus",    dayLabel: "Minggu",  city: "Tangerang",   venue: "ICE BSD City",                   region: "Jawa Barat",    capacity: 800,  registered: 287, status: "open",   mapX: 47, mapY: 60, price: "Gratis", earlyBird: true },
  { id: "cirebon",    date: "2026-08-23", dateLabel: "23 Agustus",   dayLabel: "Minggu",  city: "Cirebon",     venue: "Gelora Bima Krida",             region: "Jawa Barat",    capacity: 400,  registered: 145, status: "open",   mapX: 50, mapY: 60, price: "Gratis" },
  { id: "semarang",   date: "2026-08-30", dateLabel: "30 Agustus",   dayLabel: "Minggu",  city: "Semarang",    venue: "Jatidiri Sport Complex",        region: "Jawa Tengah",   capacity: 600,  registered: 89,  status: "open",   mapX: 52, mapY: 60, price: "Gratis" },
  { id: "yogyakarta", date: "2026-09-06", dateLabel: "6 September",  dayLabel: "Minggu",  city: "Yogyakarta",  venue: "GOR Amongrogo",                 region: "Jawa Tengah",   capacity: 600,  registered: 42,  status: "open",   mapX: 53, mapY: 62, price: "Gratis" },
  { id: "malang",     date: "2026-09-12", dateLabel: "12 September", dayLabel: "Sabtu",   city: "Malang",      venue: "Gajayana Stadium",              region: "Jawa Timur",    capacity: 500,  registered: 0,   status: "soon",   mapX: 58, mapY: 62, price: "Gratis" },
  { id: "surabaya",   date: "2026-09-13", dateLabel: "13 September", dayLabel: "Minggu",  city: "Surabaya",    venue: "DBL Arena",                     region: "Jawa Timur",    capacity: 800,  registered: 0,   status: "soon",   mapX: 59, mapY: 60, price: "Gratis" },
  { id: "bali",       date: "2026-09-20", dateLabel: "20 September", dayLabel: "Minggu",  city: "Bali",        venue: "Bali International Convention",  region: "Bali & Nusra",  capacity: 700,  registered: 0,   status: "soon",   mapX: 64, mapY: 64, price: "Gratis" },
  { id: "lombok",     date: "2026-09-27", dateLabel: "27 September", dayLabel: "Minggu",  city: "Lombok",      venue: "Mataram City Center",           region: "Bali & Nusra",  capacity: 400,  registered: 0,   status: "soon",   mapX: 68, mapY: 64, price: "Gratis" },
  { id: "lampung",    date: "2026-10-11", dateLabel: "11 Oktober",   dayLabel: "Minggu",  city: "Lampung",     venue: "Sport Hall Sumpah Pemuda",      region: "Sumatera",      capacity: 500,  registered: 0,   status: "soon",   mapX: 42, mapY: 64, price: "Gratis" },
  { id: "palembang",  date: "2026-10-18", dateLabel: "18 Oktober",   dayLabel: "Minggu",  city: "Palembang",   venue: "Gelora Sriwijaya",              region: "Sumatera",      capacity: 500,  registered: 0,   status: "soon",   mapX: 38, mapY: 60, price: "Gratis" },
  { id: "medan",      date: "2026-10-25", dateLabel: "25 Oktober",   dayLabel: "Minggu",  city: "Medan",       venue: "Convention Center Madani",      region: "Sumatera",      capacity: 600,  registered: 0,   status: "soon",   mapX: 30, mapY: 48, price: "Gratis" },
  { id: "batam",      date: "2026-11-01", dateLabel: "1 November",   dayLabel: "Minggu",  city: "Batam",       venue: "Engku Concession Hall",         region: "Sumatera",      capacity: 400,  registered: 0,   status: "soon",   mapX: 33, mapY: 50, price: "Gratis" },
  { id: "makassar",   date: "2026-11-08", dateLabel: "8 November",   dayLabel: "Minggu",  city: "Makassar",    venue: "Makassar Sport Center",         region: "Sulawesi",      capacity: 600,  registered: 0,   status: "soon",   mapX: 72, mapY: 62, price: "Gratis" },
  { id: "manado",     date: "2026-11-15", dateLabel: "15 November",  dayLabel: "Minggu",  city: "Manado",      venue: "Mega Mall Convention",          region: "Sulawesi",      capacity: 400,  registered: 0,   status: "soon",   mapX: 77, mapY: 50, price: "Gratis" },
  { id: "banjarmasin",date: "2026-11-22", dateLabel: "22 November",  dayLabel: "Minggu",  city: "Banjarmasin", venue: "Lambung Mangkurat Sport Hall",  region: "Kalimantan",    capacity: 400,  registered: 0,   status: "soon",   mapX: 67, mapY: 60, price: "Gratis" },
  { id: "balikpapan", date: "2026-11-29", dateLabel: "29 November",  dayLabel: "Minggu",  city: "Balikpapan",  venue: "Domine Eduard Sport Hall",      region: "Kalimantan",    capacity: 400,  registered: 0,   status: "soon",   mapX: 72, mapY: 56, price: "Gratis" },
  { id: "jakarta",    date: "2026-12-05", dateLabel: "5 Desember",   dayLabel: "Sabtu",   city: "Jakarta",     venue: "JIS (Jakarta International Stadium)", region: "Jawa Barat", capacity: 3000, registered: 256, status: "open", mapX: 48, mapY: 60, price: "Gratis", earlyBird: true },
];

export const REGIONS: Region[] = [
  "Jawa Barat",
  "Jawa Tengah",
  "Jawa Timur",
  "Bali & Nusra",
  "Sumatera",
  "Sulawesi",
  "Kalimantan",
];

export const REGION_COLORS: Record<Region, string> = {
  "Jawa Barat":    "#DF2679", // magenta primary
  "Jawa Tengah":   "#F17238", // orange secondary
  "Jawa Timur":    "#F04E9A", // magenta light
  "Bali & Nusra":  "#D4AF37", // gold accent
  "Sumatera":      "#51343F", // plum
  "Sulawesi":      "#B01A62", // magenta deep
  "Kalimantan":    "#E8948F", // coral accent
};

export const MURI_TARGET = 10000;

export function getRegisteredTotal() {
  return CITIES.reduce((sum, c) => sum + c.registered, 0);
}

export function getCheckedInTotal() {
  return CITIES.reduce((sum, c) => sum + (c.checkedIn ?? 0), 0);
}

export function getCompletedCitiesCount() {
  return CITIES.filter((c) => c.status === "completed").length;
}

export function getOpenCitiesCount() {
  return CITIES.filter((c) => c.status === "open").length;
}

// ============================================================
// FAQ
// ============================================================

export interface FAQItem {
  question: string;
  answer: string;
  category: "Pendaftaran" | "Teknis" | "Hari-H" | "Rekor MURI";
}

export const FAQS: FAQItem[] = [
  {
    category: "Pendaftaran",
    question: "Siapa saja yang boleh ikut Riana On The Move?",
    answer:
      "Event ini terbuka untuk semua kalangan — pemula, penggemar fitness, instruktur Zumba, hingga komunitas dance. Tidak ada batasan latar belakang. Anak-anak usia 12 tahun ke atas diperkenankan ikut dengan pendampingan orang tua. Untuk peserta di bawah usia 17 tahun, wajib mengisi formulir persetujuan orang tua saat pendaftaran.",
  },
  {
    category: "Pendaftaran",
    question: "Apakah pendaftaran berbayar?",
    answer:
      "Tersedia dua jenis tiket: Regular (gratis, termasuk e-Certificate partisipasi) dan VIP (berbayar Rp 150.000 – Rp 350.000 tergantung kota, termasuk merchandise eksklusif, akses front-row, dan sesi foto bersama Riana). Pendaftaran dibuka 30 hari sebelum tanggal event.",
  },
  {
    category: "Pendaftaran",
    question: "Bagaimana cara mendaftar?",
    answer:
      "Klik tombol 'Daftar Sekarang' di halaman utama, pilih kota tujuan Anda, lalu lengkapi form (nama, email, nomor WhatsApp, tanggal lahir). Anda akan menerima e-ticket dan QR code melalui email serta WhatsApp dalam 1×24 jam. Tunjukkan QR code saat check-in di lokasi event.",
  },
  {
    category: "Pendaftaran",
    question: "Apakah bisa membatalkan atau mengubah pilihan kota?",
    answer:
      "Untuk tiket Regular, perubahan kota dapat dilakukan maksimal H-7 sebelum tanggal event kota asal, selama kuota kota tujuan masih tersedia. Tiket VIP tidak dapat di-refund, namun dapat dialihkan ke peserta lain dengan konfirmasi minimal H-3 sebelum event. Hubungi tim panitia via WhatsApp resmi 0813-2099-9969 untuk proses perubahan.",
  },
  {
    category: "Teknis",
    question: "Apakah saya harus membawa Step Board sendiri?",
    answer:
      "Untuk kota-kota besar (Bandung, Jakarta, Surabaya, Bali, Medan), panitia menyediakan Step Board gratis untuk dipinjam selama sesi berlangsung. Untuk kota lainnya, peserta dianjurkan membawa Step Board sendiri. Anda juga dapat membeli merchandise Step Board resmi Riana On The Move saat check-in dengan harga khusus peserta Rp 185.000.",
  },
  {
    category: "Teknis",
    question: "Pakaian apa yang sebaiknya saya kenakan?",
    answer:
      "Kenakan pakaian olahraga yang nyaman, menyerap keringat, dan memungkinkan gerakan bebas. Sepatu sport dengan sol empuk wajib dipakai untuk menghindari cedera. Hindari sandal atau sepatu flat. Peserta dianjurkan mengenakan outfit berwarna magenta-orange untuk mendukung visual rekaman MURI. Merchandise kaos resmi tersedia dalam paket VIP.",
  },
  {
    category: "Teknis",
    question: "Apakah ada batasan kapasitas per kota?",
    answer:
      "Ya, setiap kota memiliki kapasitas terbatas mulai dari 400 hingga 3.000 peserta. Jakarta sebagai Grand Finale memiliki kapasitas terbesar yakni 3.000 peserta. Status kuota (Tersedia / Hampir Penuh / Sold Out) ditampilkan real-time pada halaman setiap kota. Pastikan mendaftar sedini mungkin untuk mengamankan posisi.",
  },
  {
    category: "Hari-H",
    question: "Pukul berapa saya harus hadir di lokasi?",
    answer:
      "Gates dibuka pukul 06.30 WIB. Check-in ditutup pukul 07.45 WIB. Sesi warm-up dimulai pukul 07.30 WIB, dan Zumba Step Class utama berlangsung pukul 08.00 – 10.00 WIB. Hadirlah minimal 45 menit sebelum sesi dimulai untuk menghindari antrean check-in dan mendapatkan spot terbaik.",
  },
  {
    category: "Hari-H",
    question: "Apakah tersedia fasilitas parkir dan loker?",
    answer:
      "Parkir tersedia di setiap venue dengan kapasitas terbatas — peserta disarankan carpool atau transportasi online. Loker gratis disediakan untuk menyimpan barang bawaan, namun panitia tidak bertanggung jawab atas barang berharga. Toilet, mushola, area breastfeeding, dan stan P3K tersedia di setiap lokasi.",
  },
  {
    category: "Hari-H",
    question: "Bagaimana jika cuaca tidak mendukung (hujan)?",
    answer:
      "Untuk venue outdoor, panitia telah menyiapkan tenda cadangan. Jika kondisi cuaca sangat buruk dan membahayakan, event akan diundur maksimal 2 jam atau dipindahkan ke venue alternatif yang akan diumumkan via WhatsApp dan Instagram. Keputusan final ada pada panitia dan diumumkan minimal H-1.",
  },
  {
    category: "Rekor MURI",
    question: "Bagaimana cara partisipasi saya dihitung untuk Rekor MURI?",
    answer:
      "Setiap peserta yang terdaftar dan check-in di salah satu dari 20 kota otomatis tercatat dalam database rekor MURI. Pada Grand Finale Jakarta, total akumulasi peserta unik dari seluruh kota akan diverifikasi oleh tim MURI. Nama Anda akan tercatat dalam Museum Rekor Indonesia sebagai bagian dari sejarah Zumba Step terbesar di Indonesia.",
  },
  {
    category: "Rekor MURI",
    question: "Apakah saya akan mendapatkan bukti partisipasi rekor MURI?",
    answer:
      "Ya, setiap peserta akan menerima: (1) e-Certificate partisipasi dalam 7 hari setelah event kota, (2) e-Certificate Rekor MURI setelah verifikasi total peserta selesai (estimasi Januari 2027), dan (3) akses digital untuk mengunduh foto dan video dokumentasi event. Sertifikat cetak tersedia untuk peserta VIP.",
  },
];

// ============================================================
// Testimonials (dengan rating variatif 4-5 bintang)
// ============================================================

export interface Testimonial {
  name: string;
  role: string;
  city: string;
  quote: string;
  rating: number; // 4 atau 5
  avatarColor: string;
  event: string; // kota event yang diikuti
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Dewi Anggraini",
    role: "Instruktur Zumba",
    city: "Bandung",
    quote:
      "Pengalaman terbaik dalam karier saya mengajar Zumba selama 8 tahun. Energinya gila, komunitasnya solid, dan Riana benar-benar inspiratif. Anak-anak murid saya yang ikut langsung ketagihan sampai sekarang rutin latihan.",
    rating: 5,
    avatarColor: "#DF2679",
    event: "Bandung 12 Juli 2026",
  },
  {
    name: "Ratna Sari",
    role: "Ibu Rumah Tangga",
    city: "Yogyakarta",
    quote:
      "Saya awalnya minder karena baru pertama kali ikut Zumba. Tapi semua orang sangat welcome, instruktur sabar, dan musiknya bikin semangat. Sekarang saya rutin latihan tiap minggu di komunitas lokal.",
    rating: 5,
    avatarColor: "#F17238",
    event: "Bandung 12 Juli 2026",
  },
  {
    name: "Michael Tandean",
    role: "Karyawan Swasta",
    city: "Surabaya",
    quote:
      "Berkat Riana On The Move, saya turun 5 kg dalam 3 bulan setelah rutin latihan Zumba Step. Yang paling saya suka: community-nya bukan cuma soal olahraga, tapi soal support system antar peserta.",
    rating: 5,
    avatarColor: "#51343F",
    event: "Purwokerto 19 Juli 2026",
  },
  {
    name: "Sinta Maharani",
    role: "Mahasiswa",
    city: "Jakarta",
    quote:
      "Event-nya well-organized. Dari check-in, sesi Zumba, sampai doorprize semua smooth. Fotografernya profesional, foto-fotonya bagus banget buat update sosmed. Next kota aku pasti ikut lagi!",
    rating: 4,
    avatarColor: "#F04E9A",
    event: "Purwokerto 19 Juli 2026",
  },
  {
    name: "Budi Prakoso",
    role: "Fitness Enthusiast",
    city: "Semarang",
    quote:
      "Zumba Step ini beda dengan Zumba biasa — lebih challenging, lebih banyak lower body, dan cardio-nya lebih intense. Cocok buat yang mauvariin rutinitas gym. Recommended banget!",
    rating: 5,
    avatarColor: "#D4AF37",
    event: "Bandung 12 Juli 2026",
  },
  {
    name: "Lia Kusumawardani",
    role: "Dokter Umum",
    city: "Bali",
    quote:
      "Sebagai dokter, saya rekomendasiin Zumba Step ke pasien saya yang butuh aktivitas kardio low-impact tapi efektif. Riana On The Move jadi trigger banyak pasien saya mulai hidup aktif. E-Certificate MURI juga jadi motivasi tersendiri.",
    rating: 5,
    avatarColor: "#B01A62",
    event: "Bandung 12 Juli 2026",
  },
];

// ============================================================
// Partners (brand real Indonesia)
// ============================================================

export interface Partner {
  name: string;
  tier: "Platinum" | "Gold" | "Silver" | "Media Partner";
  category: string; // "Beverage" / "Apparel" / dll
  logoColor: string; // hex untuk placeholder logo
  benefit?: string; // partner-specific benefit
}

export const PARTNERS: Partner[] = [
  // Platinum (3)
  { name: "Enervon Active", tier: "Platinum", category: "Suplemen & Vitamin", logoColor: "#FF6B00", benefit: "Title sponsor seluruh 20 kota" },
  { name: "Pocari Sweat", tier: "Platinum", category: "Isotonik Drink", logoColor: "#0099CC", benefit: "Minuman resmi hydration station" },
  { name: "Adidas Indonesia", tier: "Platinum", category: "Sport Apparel", logoColor: "#000000", benefit: "Apparel resmi instruktur" },

  // Gold (3)
  { name: "Yogya Group", tier: "Gold", category: "Retail", logoColor: "#E11B22", benefit: "Co-sponsor regional Jawa Barat" },
  { name: "Nutrifood", tier: "Gold", category: "Nutrisi & Healthy Food", logoColor: "#00A651", benefit: "Co-sponsor regional Jawa Timur" },
  { name: "Beyoutiful Sport", tier: "Gold", category: "Activewear", logoColor: "#9B59B6", benefit: "Co-sponsor regional Bali & Nusra" },

  // Silver (3)
  { name: "AktiveNation", tier: "Silver", category: "Fitness Community", logoColor: "#DF2679", benefit: "Sponsor kota — Bandung" },
  { name: "The Park Mall", tier: "Silver", category: "Venue Partner", logoColor: "#34495E", benefit: "Venue host Solo & Bekasi" },
  { name: "Zumba Indonesia", tier: "Silver", category: "Komunitas ZIN", logoColor: "#FF6B35", benefit: "Official ZIN community partner" },

  // Media Partner (4)
  { name: "Kompas TV", tier: "Media Partner", category: "TV Broadcast", logoColor: "#00529B" },
  { name: "Detik.com", tier: "Media Partner", category: "Online News", logoColor: "#003D79" },
  { name: "IDN Times", tier: "Media Partner", category: "Digital Media", logoColor: "#F39200" },
  { name: "Radio Prambors", tier: "Media Partner", category: "Radio Broadcast", logoColor: "#ED1C24" },
];

export const PARTNER_TYPES = [
  { label: "Brand",             desc: "Brand apparel, minuman, nutrisi, atau lifestyle yang ingin ekspos ke komunitas aktif Indonesia." },
  { label: "Gym & Fitness",     desc: "Pusat kebugaran yang ingin memperluas jangkauan dan rekrut member baru." },
  { label: "Hotel & Venue",     desc: "Penyedia venue atau hotel untuk hosting event di kota Anda." },
  { label: "Komunitas",         desc: "Komunitas Zumba, running, atau fitness yang ingin kolaborasi nationwide." },
  { label: "Pemerintah Daerah", desc: "Dinas Pemuda & Olahraga, Pariwisata, atau Bappeda yang mendukung gerakan hidup aktif." },
  { label: "Media Partner",     desc: "Media cetak, online, TV, atau influencer untuk amplifikasi campaign." },
];

export const PARTNER_TIERS = [
  {
    name: "Platinum",
    color: "from-violet-600 to-fuchsia-600",
    benefit: "Title sponsor seluruh 20 kota, branding stage utama, 50 slot VIP per kota, sesi meet-and-greet dengan Riana, integrasi brand di seluruh konten digital, headline press release.",
    price: "Rp 500 jt+",
  },
  {
    name: "Gold",
    color: "from-amber-400 to-orange-500",
    benefit: "Co-sponsor regional (5 kota), booth eksklusif di venue, 25 slot VIP per kota, logo di backdrop utama, konten co-branded di sosmed Riana.",
    price: "Rp 175 jt+",
  },
  {
    name: "Silver",
    color: "from-zinc-300 to-zinc-500",
    benefit: "Sponsor kota tunggal, booth standar di venue, 10 slot VIP, logo di banner event kota, mention di sosmed lokal.",
    price: "Rp 65 jt+",
  },
];

// ============================================================
// Riana Profile
// ============================================================

export const RIANA_STATS = [
  { label: "Tahun Mengajar Zumba", value: "8+" },
  { label: "Sertifikasi Internasional", value: "8" },
  { label: "Pengikut Sosmed", value: "126K" },
  { label: "Kota Sudah Dikunjungi", value: "20+" },
];

export const RIANA_CERTIFICATIONS = [
  "Zumba (ZES)",
  "Zumba Toning",
  "Zumba Step",
  "Strong Nation",
  "Barre Intensity",
  "Inferno Hot Pilates",
  "Pound Ambassador",
  "Pound Unplugged",
];

// ============================================================
// Why Join — 6 Benefits
// ============================================================

export const BENEFITS = [
  {
    icon: "Trophy",
    title: "Bagian dari Sejarah",
    desc: "Nama Anda tercatat di Museum Rekor Indonesia sebagai peserta Zumba Step terbesar yang pernah ada di tanah air.",
  },
  {
    icon: "HeartPulse",
    title: "Hidup Lebih Aktif",
    desc: "Zumba Step membakar 500-700 kalori per sesi, memperkuat otot kaki, dan meningkatkan kesehatan jantung secara menyenangkan.",
  },
  {
    icon: "Users",
    title: "Komunitas Nasional",
    desc: "Terhubung dengan ribuan penggiat Zumba dari 20 kota. Berteman, berbagi tips, dan saling memotivasi untuk hidup sehat.",
  },
  {
    icon: "Award",
    title: "E-Certificate Resmi",
    desc: "Dapatkan e-Certificate partisipasi dan e-Certificate Rekor MURI sebagai bukti resmi Anda bagian dari sejarah.",
  },
  {
    icon: "Gift",
    title: "Doorprize & Merchandise",
    desc: "Setiap kota menghadirkan doorprize menarik — dari paket gym, smartwatch, hingga vacation. Peserta VIP dapat merchandise eksklusif.",
  },
  {
    icon: "Star",
    title: "Dipandu Langsung oleh Riana",
    desc: "Belajar choreography Zumba Step langsung dari sang master, dengan koreografi khusus yang dirancang untuk roadshow MURI 2026.",
  },
];

// ============================================================
// Gallery (dengan caption detail)
// ============================================================

export interface GalleryItem {
  id: number;
  hue: number;
  label: string;
  caption: string;
  city: string;
  date: string;
  participants: number;
  isRealPhoto?: boolean;
  photoUrl?: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 0,
    hue: 320,
    label: "Warm-up Session",
    caption: "Riana memimpin warm-up bersama 487 peserta",
    city: "Bandung",
    date: "12 Juli 2026",
    participants: 487,
    isRealPhoto: true,
    photoUrl: "/brand/hero-crowd-2.png",
  },
  {
    id: 1,
    hue: 25,
    label: "Grand Squad Action",
    caption: "Sinkronisasi gerakan Step Board",
    city: "Bandung",
    date: "12 Juli 2026",
    participants: 487,
    isRealPhoto: true,
    photoUrl: "/brand/ai-zumba-class.png",
  },
  {
    id: 2,
    hue: 280,
    label: "Riana Showcase",
    caption: "Solo performance koreografi MURI",
    city: "Purwokerto",
    date: "19 Juli 2026",
    participants: 412,
    isRealPhoto: true,
    photoUrl: "/brand/ai-riana-portrait.png",
  },
  {
    id: 3,
    hue: 340,
    label: "Komunitas Gathering",
    caption: "Peserta dari berbagai komunitas ZIN berkumpul",
    city: "Bandung",
    date: "12 Juli 2026",
    participants: 487,
    isRealPhoto: true,
    photoUrl: "/brand/hero-crowd.png",
  },
  {
    id: 4,
    hue: 15,
    label: "Step Board Action",
    caption: "Koreografi step intens — pembakaran 600+ kalori",
    city: "Purwokerto",
    date: "19 Juli 2026",
    participants: 412,
    isRealPhoto: true,
    photoUrl: "/brand/hero-wide.png",
  },
  {
    id: 5,
    hue: 50,
    label: "Doorprize Giveaway",
    caption: "Smartwatch & merchandise dari sponsor",
    city: "Bandung",
    date: "12 Juli 2026",
    participants: 487,
    hue2: 50,
  },
  {
    id: 6,
    hue: 300,
    label: "Group Photo Finale",
    caption: "Foto bersama 487 peserta Bandung",
    city: "Bandung",
    date: "12 Juli 2026",
    participants: 487,
  },
  {
    id: 7,
    hue: 200,
    label: "Energy Boost",
    caption: "Atmosfer konser + workout dalam satu event",
    city: "Purwokerto",
    date: "19 Juli 2026",
    participants: 412,
  },
];

// ============================================================
// Event Milestones (untuk visualisasi progress)
// ============================================================

export const MILESTONES = [
  { city: "Bandung",    date: "12 Jul", registered: 487, status: "completed" as const },
  { city: "Purwokerto", date: "19 Jul", registered: 412, status: "completed" as const },
  { city: "Depok",      date: "2 Agt",  registered: 432, status: "open" as const },
  { city: "Tangerang",  date: "9 Agt",  registered: 287, status: "open" as const },
  { city: "Cirebon",    date: "23 Agt", registered: 145, status: "open" as const },
];
