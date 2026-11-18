import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const description = "Faris's little AI companion. A little personality. A little curiosity. A whole world to discover.";

export const metadata: Metadata = {
  title: "Faris — Nova's Universe",
  description,
  openGraph: {
    title: "Hey there! I'm Nova.",
    description,
    type: "website",
  },
  twitter: { card: "summary", title: "Hey there! I'm Nova.", description },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#02030a", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
