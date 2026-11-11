import { LegalContent } from "@/components/legal-content";
import { LegalPage } from "@/components/legal-page";
import { fillPlaceholders } from "@/lib/legal-content";
import { formatLegalUpdatedDate, getLegalPage, legalPlaceholderValues } from "@/lib/legal-pages";
import { pageMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata = pageMetadata({
  title: "Disclaimer",
  description: "Disclaimer voor het gebruik van de website van Wielstra Group.",
  path: "/disclaimer",
});

export default async function DisclaimerPage() {
  const [settings, page] = await Promise.all([getSiteSettings(), getLegalPage("disclaimer")]);
  const values = legalPlaceholderValues(settings);
  const updated = formatLegalUpdatedDate(page.updatedAt);

  return (
    <LegalPage title={page.title} updated={updated} intro={fillPlaceholders(page.intro, values)}>
      <LegalContent content={fillPlaceholders(page.content, values)} />
    </LegalPage>
  );
}
