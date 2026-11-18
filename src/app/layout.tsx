import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Faris — Nova's Universe",
  description: "A little personality. A little curiosity. A whole world to discover.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
