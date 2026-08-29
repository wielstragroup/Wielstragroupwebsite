import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Cookiebeleid",
  description: "Overzicht van de cookies en vergelijkbare technieken die deze website gebruikt.",
  alternates: { canonical: "/cookiebeleid" },
};

export default async function CookiePolicyPage() {
  const settings = await getSiteSettings();
  const contactEmail = settings.email || "[e-mailadres invullen]";

  return (
    <LegalPage
      title="Cookiebeleid"
      updated="29 augustus 2026"
      intro="Deze pagina legt uit welke cookies en vergelijkbare technieken deze website gebruikt en waarom."
    >
      <div>
        <h2>1. Wat zijn cookies?</h2>
        <p>
          Cookies zijn kleine tekstbestandjes die een website op je apparaat kan plaatsen. Ze kunnen
          worden gebruikt om instellingen te onthouden of gebruikers te herkennen. Sommige
          technieken werken vergelijkbaar met cookies, zoals opslag in de browser
          (&quot;localStorage&quot;).
        </p>
      </div>

      <div>
        <h2>2. Welke cookies gebruiken wij?</h2>
        <p>
          Deze website plaatst <strong>geen trackingcookies of marketingcookies</strong>. We
          gebruiken alleen technisch noodzakelijke opslag:
        </p>
        <table>
          <thead>
            <tr>
              <th>Naam</th>
              <th>Type</th>
              <th>Doel</th>
              <th>Bewaartermijn</th>
              <th>Toestemming nodig?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>sb-*-auth-token</td>
              <td>Functionele cookie</td>
              <td>
                Houdt de inlogsessie van een beheerder in het beheerderspaneel actief. Wordt alleen
                geplaatst wanneer iemand inlogt op /admin, niet voor reguliere bezoekers.
              </td>
              <td>Tot uitloggen of sessie verloopt</td>
              <td>Nee — strikt noodzakelijk</td>
            </tr>
            <tr>
              <td>cookie-notice-dismissed</td>
              <td>Functionele opslag (localStorage)</td>
              <td>Onthoudt dat je deze cookiemelding hebt gezien en gesloten.</td>
              <td>Tot je browsergegevens wist</td>
              <td>Nee — strikt noodzakelijk</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h2>3. Bezoekstatistieken zonder cookies</h2>
        <p>
          Voor inzicht in bezoekersaantallen gebruiken we een privacyvriendelijke, cookieloze
          methode: we slaan geen IP-adres op en plaatsen geen cookie in je browser. In plaats
          daarvan berekenen we bij elk paginabezoek server-side een onomkeerbare hash op basis van
          een dagelijks wisselend, willekeurig geheim. Hierdoor kunnen we globaal het aantal unieke
          bezoekers per dag schatten, zonder dat bezoekers herkenbaar of over meerdere dagen
          volgbaar zijn. Omdat deze methode geen of nauwelijks impact heeft op je privacy, is
          hiervoor volgens de richtlijnen van de Autoriteit Consument &amp; Markt (ACM) geen
          toestemming vereist. Meer informatie hierover staat in ons{" "}
          <a href="/privacybeleid">privacybeleid</a>.
        </p>
      </div>

      <div>
        <h2>4. Cookies beheren of verwijderen</h2>
        <p>
          Je kunt cookies en opgeslagen browsergegevens altijd zelf beheren of verwijderen via de
          instellingen van je browser. Omdat we geen trackingcookies gebruiken, heeft dit geen
          invloed op hoe de website functioneert — met uitzondering van het beheerderspaneel, waar
          je opnieuw moet inloggen.
        </p>
      </div>

      <div>
        <h2>5. Vragen</h2>
        <p>
          Heb je vragen over dit cookiebeleid? Neem contact op via{" "}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </div>
    </LegalPage>
  );
}
