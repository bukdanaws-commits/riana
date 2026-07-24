// ============================================================
// Riana On The Move — Event Data Source
// ============================================================

export type Region = "Jawa Barat" | "Jawa Tengah" | "Jawa Timur" | "Bali & Nusra" | "Sumatera" | "Sulawesi" | "Kalimantan";

export type CityStatus = "open" | "soon" | "soldout";

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
  status: CityStatus;
  mapX: number; // position on Indonesian map (0-100)
  mapY: number;
}

export const CITIES: CityEvent[] = [
  { id: "bandung",   date: "2026-07-12", dateLabel: "12 Juli",      dayLabel: "Minggu",  city: "Bandung",     venue: "Saparua Sport Center",         region: "Jawa Barat",   capacity: 500, registered: 312, status: "open",   mapX: 47, mapY: 60 },
  { id: "purwokerto",date: "2026-07-19", dateLabel: "19 Juli",      dayLabel: "Minggu",  city: "Purwokerto",  venue: "GOR Soemardip",                region: "Jawa Tengah",  capacity: 400, registered: 180, status: "open",   mapX: 49, mapY: 62 },
  { id: "depok",     date: "2026-08-02", dateLabel: "2 Agustus",    dayLabel: "Minggu",  city: "Depok",       venue: "Universitas Indonesia",        region: "Jawa Barat",   capacity: 600, registered: 95,  status: "soon",   mapX: 48, mapY: 61 },
  { id: "tangerang", date: "2026-08-09", dateLabel: "9 Agustus",    dayLabel: "Minggu",  city: "Tangerang",   venue: "ICE BSD City",                  region: "Jawa Barat",   capacity: 800, registered: 0,   status: "soon",   mapX: 47, mapY: 60 },
  { id: "cirebon",   date: "2026-08-23", dateLabel: "23 Agustus",   dayLabel: "Minggu",  city: "Cirebon",     venue: "Gelora Bima Krida",            region: "Jawa Barat",   capacity: 400, registered: 0,   status: "soon",   mapX: 50, mapY: 60 },
  { id: "semarang",  date: "2026-08-30", dateLabel: "30 Agustus",   dayLabel: "Minggu",  city: "Semarang",    venue: "Jatidiri Sport Complex",       region: "Jawa Tengah",  capacity: 600, registered: 0,   status: "soon",   mapX: 52, mapY: 60 },
  { id: "yogyakarta",date: "2026-09-06", dateLabel: "6 September",  dayLabel: "Minggu",  city: "Yogyakarta",  venue: "GOR Amongrogo",                region: "Jawa Tengah",  capacity: 600, registered: 0,   status: "soon",   mapX: 53, mapY: 62 },
  { id: "malang",    date: "2026-09-12", dateLabel: "12 September", dayLabel: "Sabtu",   city: "Malang",      venue: "Gajayana Stadium",             region: "Jawa Timur",   capacity: 500, registered: 0,   status: "soon",   mapX: 58, mapY: 62 },
  { id: "surabaya",  date: "2026-09-13", dateLabel: "13 September", dayLabel: "Minggu",  city: "Surabaya",    venue: "DBL Arena",                    region: "Jawa Timur",   capacity: 800, registered: 0,   status: "soon",   mapX: 59, mapY: 60 },
  { id: "bali",      date: "2026-09-20", dateLabel: "20 September", dayLabel: "Minggu",  city: "Bali",        venue: "Bali International Convention", region: "Bali & Nusra", capacity: 700, registered: 0,   status: "soon",   mapX: 64, mapY: 64 },
  { id: "lombok",    date: "2026-09-27", dateLabel: "27 September", dayLabel: "Minggu",  city: "Lombok",      venue: "Mataram City Center",          region: "Bali & Nusra", capacity: 400, registered: 0,   status: "soon",   mapX: 68, mapY: 64 },
  { id: "lampung",   date: "2026-10-11", dateLabel: "11 Oktober",   dayLabel: "Minggu",  city: "Lampung",     venue: "Sport Hall Sumpah Pemuda",     region: "Sumatera",     capacity: 500, registered: 0,   status: "soon",   mapX: 42, mapY: 64 },
  { id: "palembang", date: "2026-10-18", dateLabel: "18 Oktober",   dayLabel: "Minggu",  city: "Palembang",   venue: "Gelora Sriwijaya",             region: "Sumatera",     capacity: 500, registered: 0,   status: "soon",   mapX: 38, mapY: 60 },
  { id: "medan",     date: "2026-10-25", dateLabel: "25 Oktober",   dayLabel: "Minggu",  city: "Medan",       venue: "Convention Center Madani",     region: "Sumatera",     capacity: 600, registered: 0,   status: "soon",   mapX: 30, mapY: 48 },
  { id: "batam",     date: "2026-11-01", dateLabel: "1 November",   dayLabel: "Minggu",  city: "Batam",       venue: "Engku Concession Hall",        region: "Sumatera",     capacity: 400, registered: 0,   status: "soon",   mapX: 33, mapY: 50 },
  { id: "makassar",  date: "2026-11-08", dateLabel: "8 November",   dayLabel: "Minggu",  city: "Makassar",    venue: "Makassar Sport Center",        region: "Sulawesi",     capacity: 600, registered: 0,   status: "soon",   mapX: 72, mapY: 62 },
  { id: "manado",    date: "2026-11-15", dateLabel: "15 November",  dayLabel: "Minggu",  city: "Manado",      venue: "Mega Mall Convention",         region: "Sulawesi",     capacity: 400, registered: 0,   status: "soon",   mapX: 77, mapY: 50 },
  { id: "banjarmasin",date:"2026-11-22", dateLabel: "22 November",  dayLabel: "Minggu",  city: "Banjarmasin", venue: "Lambung Mangkurat Sport Hall", region: "Kalimantan",   capacity: 400, registered: 0,   status: "soon",   mapX: 67, mapY: 60 },
  { id: "balikpapan",date: "2026-11-29", dateLabel: "29 November",  dayLabel: "Minggu",  city: "Balikpapan",  venue: "Domine Eduard Sport Hall",     region: "Kalimantan",   capacity: 400, registered: 0,   status: "soon",   mapX: 72, mapY: 56 },
  { id: "jakarta",   date: "2026-12-05", dateLabel: "5 Desember",   dayLabel: "Sabtu",   city: "Jakarta",     venue: "JIS (Jakarta International Stadium)", region: "Jawa Barat", capacity: 3000, registered: 0, status: "soon", mapX: 48, mapY: 60 },
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
  "Jawa Barat":    "#F77258", // coral
  "Jawa Tengah":   "#E38B96", // dusty rose
  "Jawa Timur":    "#F86743", // flame
  "Bali & Nusra":  "#E7C7BE", // blush
  "Sumatera":      "#9A6458", // terracotta
  "Sulawesi":      "#C26873", // rose deep
  "Kalimantan":    "#563E3D", // terra deep
};

export const MURI_TARGET = 10000;

export function getRegisteredTotal() {
  return CITIES.reduce((sum, c) => sum + c.registered, 0);
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
      "Tersedia dua jenis tiket: Regular (gratis, termasuk e-Certificate partisipasi) dan VIP (berbayar, termasuk merchandise eksklusif, akses front-row, dan sesi foto bersama Riana). Harga tiket VIP bervariasi per kota dan akan diumumkan pada halaman detail masing-masing kota. Pendaftaran dibuka 30 hari sebelum tanggal event.",
  },
  {
    category: "Pendaftaran",
    question: "Bagaimana cara mendaftar?",
    answer:
      "Klik tombol 'Daftar Sekarang' di halaman utama, pilih kota tujuan Anda, lalu lengkapi form (nama, email, nomor WhatsApp, tanggal lahir). Anda akan menerima e-ticket dan QR code melalui email serta WhatsApp dalam 1x24 jam. Tunjukkan QR code saat check-in di lokasi event.",
  },
  {
    category: "Pendaftaran",
    question: "Apakah bisa membatalkan atau mengubah pilihan kota?",
    answer:
      "Untuk tiket Regular, perubahan kota dapat dilakukan maksimal H-7 sebelum tanggal event kota asal, selama kuota kota tujuan masih tersedia. Tiket VIP tidak dapat di-refund, namun dapat dialihkan ke peserta lain dengan konfirmasi minimal H-3 sebelum event. Hubungi tim panitia via WhatsApp resmi untuk proses perubahan.",
  },
  {
    category: "Teknis",
    question: "Apakah saya harus membawa Step Board sendiri?",
    answer:
      "Untuk kota-kota besar (Bandung, Jakarta, Surabaya, Bali, Medan), panitia menyediakan Step Board gratis untuk dipinjam selama sesi berlangsung. Untuk kota lainnya, peserta dianjurkan membawa Step Board sendiri. Anda juga dapat membeli merchandise Step Board resmi Riana On The Move saat check-in dengan harga khusus peserta.",
  },
  {
    category: "Teknis",
    question: "Pakaian apa yang sebaiknya saya kenakan?",
    answer:
      "Kenakan pakaian olahraga yang nyaman, menyerap keringat, dan memungkinkan gerakan bebas. Sepatu sport dengan sol empuk wajib dipakai untuk menghindari cedera. Hindari sandal atau sepatu flat. Peserta dianjurkan mengenakan outfit berwarna pink oranye untuk mendukung visual rekaman MURI. Merchandise kaos resmi tersedia dalam paket VIP.",
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
      "Gates dibuka pukul 06.30 WIB. Check-in ditutup pukul 07.45 WIB. Sesi warm-up dimulai pukul 07.30 WIB, dan Zumba Step Class utama berlangsung pukul 08.00 - 10.00 WIB. Hadirlah minimal 45 menit sebelum sesi dimulai untuk menghindari antrean check-in dan mendapatkan spot terbaik.",
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
// Testimonials
// ============================================================

export interface Testimonial {
  name: string;
  role: string;
  city: string;
  quote: string;
  rating: number;
  avatarColor: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Dewi Anggraini",
    role: "Instruktur Zumba",
    city: "Bandung",
    quote:
      "Pengalaman terbaik dalam karier saya mengajar Zumba selama 8 tahun. Energinya gila, komunitasnya solid, dan Riana benar-benar inspiratif. Anak-anak murid saya yang ikut langsung ketagihan.",
    rating: 5,
    avatarColor: "#F77258",
  },
  {
    name: "Ratna Sari",
    role: "Ibu Rumah Tangga",
    city: "Yogyakarta",
    quote:
      "Saya awalnya minder karena baru pertama kali ikut Zumba. Tapi semua orang sangat welcome, instruktur sabar, dan musiknya bikin semangat. Sekarang saya rutin latihan tiap minggu.",
    rating: 5,
    avatarColor: "#F86743",
  },
  {
    name: "Michael Tandean",
    role: "Karyawan Swasta",
    city: "Surabaya",
    quote:
      "Berkat Riana On The Move, saya turun 5 kg dalam 3 bulan setelah rutin latihan Zumba Step. Yang paling saya suka: community-nya bukan cuma soal olahraga, tapi soal support system.",
    rating: 5,
    avatarColor: "#9A6458",
  },
  {
    name: "Sinta Maharani",
    role: "Mahasiswa",
    city: "Jakarta",
    quote:
      "Event-nya super well-organized. Dari check-in, sesi Zumba, sampai doorprize semua smooth. Fotografernya juga profesional, foto-fotonya bagus banget buat update sosmed!",
    rating: 5,
    avatarColor: "#E38B96",
  },
  {
    name: "Budi Prakoso",
    role: "Fitness Enthusiast",
    city: "Semarang",
    quote:
      "Zumba Step ini beda dengan Zumba biasa — lebih challenging, lebih banyak lower body, dan cardio-nya lebih intense. Cocok buat yang mauvariin rutinitas gym. Recommended banget!",
    rating: 5,
    avatarColor: "#F77258",
  },
  {
    name: "Lia Kusumawardani",
    role: "Dokter Umum",
    city: "Bali",
    quote:
      "Sebagai dokter, saya rekomendasiin Zumba Step ke pasien saya yang butuh aktivitas kardio low-impact tapi efektif. Riana On The Move jadi trigger banyak pasien saya mulai hidup aktif.",
    rating: 5,
    avatarColor: "#C26873",
  },
];

// ============================================================
// Partners
// ============================================================

export const PARTNER_TYPES = [
  { label: "Brand",            desc: "Brand apparel, minuman, nutrisi, atau lifestyle yang ingin ekspos ke komunitas aktif Indonesia." },
  { label: "Gym & Fitness",    desc: "Pusat kebugaran yang ingin memperluas jangkauan dan rekrut member baru." },
  { label: "Hotel & Venue",    desc: "Penyedia venue atau hotel untuk hosting event di kota Anda." },
  { label: "Komunitas",        desc: "Komunitas Zumba, running, atau fitness yang ingin kolaborasi nationwide." },
  { label: "Pemerintah Daerah",desc: "Dinas Pemuda & Olahraga, Pariwisata, atau Bappeda yang mendukung gerakan hidup aktif." },
  { label: "Media Partner",    desc: "Media cetak, online, TV, atau influencer untuk amplifikasi campaign." },
];

export const PARTNER_TIERS = [
  {
    name: "Platinum",
    color: "from-stone-600 to-orange-600",
    benefit: "Title sponsor seluruh 20 kota, branding stage utama, 50 slot VIP per kota, sesi meet-and-greet dengan Riana, integrasi brand di seluruh konten digital, headline press release.",
  },
  {
    name: "Gold",
    color: "from-orange-400 to-orange-500",
    benefit: "Co-sponsor regional (5 kota), booth eksklusif di venue, 25 slot VIP per kota, logo di backdrop utama, konten co-branded di sosmed Riana.",
  },
  {
    name: "Silver",
    color: "from-stone-600 to-stone-800",
    benefit: "Sponsor kota tunggal, booth standar di venue, 10 slot VIP, logo di banner event kota, mention di sosmed lokal.",
  },
];

// ============================================================
// Riana Profile
// ============================================================

export const RIANA_STATS = [
  { label: "Tahun Mengajar Zumba", value: "10+" },
  { label: "Komunitas Aktif", value: "50+" },
  { label: "Pengikut Sosmed", value: "850K" },
  { label: "Kota Sudah Dikunjungi", value: "120+" },
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
// Gallery
// ============================================================

export const GALLERY_ITEMS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  hue: [320, 25, 280, 340, 15, 50, 300, 200][i],
  label: ["Warm-up Bandung", "Grand Squad Surabaya", "Riana Showcase", "Komunitas Yogyakarta", "Step Board Action", "Doorprize Bali", "Group Photo Semarang", "Energy Boost Malang"][i],
}));
