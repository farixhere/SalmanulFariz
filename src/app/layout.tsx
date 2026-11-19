import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "./site";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", style: ["normal", "italic"], display: "swap" });

const description = "Explore. Discover. Get Inspired. Faris's portfolio, with Nova, his little AI companion.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Faris — Welcome to my Portfolio",
  description,
  openGraph: { title: "Welcome to my Portfolio", description, type: "website" },
  twitter: { card: "summary", title: "Welcome to my Portfolio", description },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#02030a", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body>{children}</body>
    </html>
  );
}
