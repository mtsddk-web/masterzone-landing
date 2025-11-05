import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import FacebookPixel from "@/components/FacebookPixel";
import MicrosoftClarity from "@/components/MicrosoftClarity";
import Hotjar from "@/components/Hotjar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MasterZone - Koniec z Rozproszeniem",
  description: "Program pomoże Ci odzyskać fokus, produktywność i kontrolę nad czasem. Dołącz do społeczności MasterZone i zacznij pracować głęboko.",
  keywords: "fokus, produktywność, rozproszenie, koncentracja, deep work, praca głęboka",
  verification: {
    google: "qT6xxbkTyOYWZ05vBVgFUYbll0yCE7qGIkDdqIwSUSM",
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: "MasterZone - Koniec z Rozproszeniem",
    description: "Odzyskaj fokus i produktywność",
    url: "https://masterzone.edu.pl",
    siteName: "MasterZone",
    locale: "pl_PL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className={inter.className}>
        <FacebookPixel />
        <MicrosoftClarity />
        <Hotjar />
        {children}
      </body>
    </html>
  );
}
