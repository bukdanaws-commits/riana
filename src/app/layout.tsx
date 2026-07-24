import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Riana On The Move — Road to MURI 2026 | Zumba Step Terbesar di Indonesia",
  description:
    "Bergabunglah dalam perjalanan menuju Pemecahan Rekor MURI Zumba Step Terbesar di Indonesia. 20 Kota. 10.000+ Peserta. 1 Rekor Sejarah. Move Together. Make History.",
  keywords: [
    "Riana On The Move",
    "Zumba Step",
    "Rekor MURI",
    "Zumba Indonesia",
    "Roadshow Zumba 2026",
    "Fitness Indonesia",
    "AktiveNation",
  ],
  authors: [{ name: "Riana On The Move" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Riana On The Move — Road to MURI 2026",
    description:
      "20 Kota. 10.000+ Peserta. 1 Rekor Sejarah. Zumba Step Terbesar di Indonesia.",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Riana On The Move — Road to MURI 2026",
    description:
      "20 Kota. 10.000+ Peserta. 1 Rekor Sejarah. Zumba Step Terbesar di Indonesia.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
