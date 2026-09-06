import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Jockey_One } from "next/font/google";
import "./globals.css";

/** Jockey One ships in a single weight (400). */
const display = Jockey_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Your Name",
  description: "Content creator portfolio",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={display.variable}>
      <body className="bg-background font-sans text-foreground antialiased">{children}</body>
    </html>
  );
}