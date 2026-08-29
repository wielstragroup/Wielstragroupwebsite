import type { Metadata } from "next";
import "./globals.css";

import { AnalyticsTracker } from "@/components/analytics-tracker";
import { CookieBanner } from "@/components/cookie-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteUrl } from "@/lib/env";
import { safeUrlOrNull } from "@/lib/security";
import { getSiteSettings } from "@/lib/site-settings";

/**
 * Metadata komt uit de dashboardinstellingen, met de bestaande
 * teksten als fallback wanneer een veld leeg is.
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  const title =
    settings.defaultSeoTitle ||
    `${settings.companyName} | Websites voor lokale ondernemers`;

  const description =
    settings.defaultMetaDescription ||
    "Wielstra Group bouwt moderne websites en online diensten voor lokale ondernemers. Persoonlijk contact, duidelijke communicatie en resultaat.";

  const ogImage = safeUrlOrNull(settings.defaultOgImage);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${settings.companyName}`,
    },
    description,
    alternates: {
      canonical: "/",
    },
    icons: settings.faviconUrl ? { icon: settings.faviconUrl } : undefined,
    openGraph: {
      type: "website",
      title,
      description,
      url: siteUrl,
      siteName: settings.companyName,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();

  return (
    <html lang="nl" className="h-full scroll-smooth">
      <body className="flex min-h-full flex-col bg-slate-950 text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-950"
        >
          Naar hoofdinhoud
        </a>
        <SiteHeader
          companyName={settings.companyName}
          ctaLabel={settings.ctaLabel}
          ctaUrl={safeUrlOrNull(settings.ctaUrl) ?? "/contact"}
        />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <CookieBanner />
        <AnalyticsTracker />
      </body>
    </html>
  );
}
