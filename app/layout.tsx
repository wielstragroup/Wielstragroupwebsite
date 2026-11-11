import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { AnalyticsTracker } from "@/components/analytics-tracker";
import { CookieBanner } from "@/components/cookie-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteUrl } from "@/lib/env";
import { safeUrlOrNull } from "@/lib/security";
import { OWNER_NAME } from "@/lib/content";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, jsonLd } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-settings";

const heading = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const body = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const code = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-code",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#f5f3ee",
};

/**
 * Metadata komt uit de dashboardinstellingen, met de nieuwe merkteksten
 * als fallback wanneer een veld leeg is.
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings.defaultSeoTitle || DEFAULT_TITLE;
  const description = settings.defaultMetaDescription || DEFAULT_DESCRIPTION;
  const ogImage = safeUrlOrNull(settings.defaultOgImage);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${settings.companyName}`,
    },
    description,
    icons: settings.faviconUrl ? { icon: settings.faviconUrl } : undefined,
    openGraph: {
      type: "website",
      locale: "nl_NL",
      title,
      description,
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

  const sameAs = settings.socials
    .filter((social) => social.enabled)
    .map((social) => safeUrlOrNull(social.url))
    .filter((url): url is string => Boolean(url && url.startsWith("http")));

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.companyName,
    url: siteUrl,
    logo: `${siteUrl}/brand/wielstra-mark.svg`,
    description: DEFAULT_DESCRIPTION,
    founder: { "@type": "Person", name: OWNER_NAME },
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };

  return (
    <html lang="nl" className={`${heading.variable} ${body.variable} ${code.variable}`}>
      <body className="flex min-h-dvh flex-col bg-paper text-ink antialiased">
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(organizationLd)}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-paper"
        >
          Naar hoofdinhoud
        </a>
        <SiteHeader ctaLabel={settings.ctaLabel || "Plan een kennismaking"} ctaUrl={safeUrlOrNull(settings.ctaUrl) ?? "/contact"} />
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
