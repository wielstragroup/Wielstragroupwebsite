import type { Metadata } from "next";

import { LegalContent } from "@/components/legal-content";
import { LegalPage } from "@/components/legal-page";
import { fillPlaceholders } from "@/lib/legal-content";
import { formatLegalUpdatedDate, getLegalPage, legalPlaceholderValues } from "@/lib/legal-pages";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Cookiebeleid",
  description: "Overzicht van de cookies en vergelijkbare technieken die deze website gebruikt.",
  alternates: { canonical: "/cookiebeleid" },
};

export default async function CookiePolicyPage() {
  const [settings, page] = await Promise.all([getSiteSettings(), getLegalPage("cookiebeleid")]);
  const values = legalPlaceholderValues(settings);
  const updated = formatLegalUpdatedDate(page.updatedAt);

  return (
    <LegalPage title={page.title} updated={updated} intro={fillPlaceholders(page.intro, values)}>
      <LegalContent content={fillPlaceholders(page.content, values)} />
    </LegalPage>
  );
}
