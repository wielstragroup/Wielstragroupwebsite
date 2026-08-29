import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Disclaimer voor het gebruik van de website van Wielstra Group.",
  alternates: { canonical: "/disclaimer" },
};

export default async function DisclaimerPage() {
  const settings = await getSiteSettings();
  const contactEmail = settings.email || "[e-mailadres invullen]";

  return (
    <LegalPage
      title="Disclaimer"
      updated="29 augustus 2026"
      intro={`Deze disclaimer is van toepassing op het gebruik van de website van ${settings.companyName}.`}
    >
      <div>
        <h2>1. Inhoud van de website</h2>
        <p>
          {settings.companyName} besteedt zorgvuldige aandacht aan de inhoud van deze website, maar
          kan niet garanderen dat alle informatie te allen tijde juist, volledig of actueel is. Aan
          de inhoud van deze website kunnen geen rechten worden ontleend.
        </p>
      </div>

      <div>
        <h2>2. Aansprakelijkheid</h2>
        <p>
          {settings.companyName} is niet aansprakelijk voor schade die voortvloeit uit het gebruik
          van deze website, of uit het (tijdelijk) niet beschikbaar zijn van de website, tenzij
          sprake is van opzet of grove schuld.
        </p>
      </div>

      <div>
        <h2>3. Externe links</h2>
        <p>
          Deze website kan links bevatten naar websites van derden. {settings.companyName} heeft geen
          invloed op en is niet verantwoordelijk voor de inhoud van deze externe websites.
        </p>
      </div>

      <div>
        <h2>4. Intellectueel eigendom</h2>
        <p>
          Alle teksten, afbeeldingen, vormgeving en overige inhoud op deze website zijn eigendom van{" "}
          {settings.companyName} of worden met toestemming gebruikt, en zijn beschermd door het
          auteursrecht. Niets van deze website mag zonder voorafgaande schriftelijke toestemming
          worden overgenomen of verveelvoudigd.
        </p>
      </div>

      <div>
        <h2>5. Wijzigingen</h2>
        <p>
          {settings.companyName} behoudt zich het recht voor de inhoud van deze website, inclusief
          deze disclaimer, op elk moment te wijzigen zonder voorafgaande kennisgeving.
        </p>
      </div>

      <div>
        <h2>6. Contact</h2>
        <p>
          Vragen over deze disclaimer? Neem contact op via{" "}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </div>
    </LegalPage>
  );
}
