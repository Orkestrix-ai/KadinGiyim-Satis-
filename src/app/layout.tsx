import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant } from "next/font/google";
import "../globals.css";
import { SessionProvider } from "@/components/shared/session-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Nevrak | Kadın Giyim",
    template: "%s | Nevrak",
  },
  description: "Kadın giyimde en yeni trendler, şık elbiseler, üst giyim, dış giyim ve aksesuarlar. Kaliteli ve uygun fiyatlı kadın giyim ürünleri.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
