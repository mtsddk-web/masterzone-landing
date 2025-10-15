import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MasterZone - Koniec z Rozproszeniem",
  description: "Program pomoże Ci odzyskać fokus, produktywność i kontrolę nad czasem. Dołącz do społeczności MasterZone i zacznij pracować głęboko.",
  keywords: "fokus, produktywność, rozproszenie, koncentracja, deep work, praca głęboka",
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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
