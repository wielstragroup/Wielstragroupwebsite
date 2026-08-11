import type { Metadata } from "next";
import "./globals.css";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteUrl } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Wielstra Group | Websites voor lokale ondernemers",
    template: "%s | Wielstra Group",
  },
  description:
    "Wielstra Group bouwt moderne websites en online diensten voor lokale ondernemers. Persoonlijk contact, duidelijke communicatie en resultaat.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "Wielstra Group",
    description:
      "Professionele websites en online diensten voor lokale ondernemers. Klaar om je online zichtbaarheid te versterken.",
    url: siteUrl,
    siteName: "Wielstra Group",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wielstra Group",
    description:
      "Professionele websites en online diensten voor lokale ondernemers. Klaar om je online zichtbaarheid te versterken.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="nl" className="h-full">
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
