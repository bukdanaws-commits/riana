import type { Metadata } from "next";
import { Bebas_Neue, Montserrat, Inter, Pacifico } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const bebas = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const pacifico = Pacifico({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
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
        className={`${bebas.variable} ${montserrat.variable} ${inter.variable} ${pacifico.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
