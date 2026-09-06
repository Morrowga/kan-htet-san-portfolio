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

/** Your live domain — used to turn image paths into the absolute URLs link previews need. */
const SITE_URL = "https://your-site.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Kan Htet San",
  description: "Content Creator",
  openGraph: {
    title: "Kan Htet San",
    description: "Content Creator",
    url: SITE_URL,
    siteName: "Kan Htet San",
    images: [{ url: "/person.webp", width: 1400, height: 1050, alt: "Kan Htet San" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kan Htet San",
    description: "Content Creator",
    images: ["/person.webp"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={display.variable}>
      <body className="bg-background font-sans text-foreground antialiased">{children}</body>
    </html>
  );
}