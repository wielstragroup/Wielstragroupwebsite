import type { Metadata } from "next";

import { LegalContent } from "@/components/legal-content";
import { LegalPage } from "@/components/legal-page";
import { fillPlaceholders } from "@/lib/legal-content";
import { formatLegalUpdatedDate, getLegalPage, legalPlaceholderValues } from "@/lib/legal-pages";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Algemene voorwaarden",
  description: "Algemene voorwaarden voor diensten van Wielstra Group.",
  alternates: { canonical: "/algemene-voorwaarden" },
};

export default async function TermsPage() {
  const [settings, page] = await Promise.all([
    getSiteSettings(),
    getLegalPage("algemene-voorwaarden"),
  ]);
  const values = legalPlaceholderValues(settings);
  const updated = formatLegalUpdatedDate(page.updatedAt);

  return (
    <LegalPage title={page.title} updated={updated} intro={fillPlaceholders(page.intro, values)}>
      <LegalContent content={fillPlaceholders(page.content, values)} />
    </LegalPage>
  );
}
