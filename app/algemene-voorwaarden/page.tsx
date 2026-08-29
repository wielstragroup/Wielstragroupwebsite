import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Algemene voorwaarden",
  description: "Algemene voorwaarden voor diensten van Wielstra Group.",
  alternates: { canonical: "/algemene-voorwaarden" },
};

export default async function TermsPage() {
  const settings = await getSiteSettings();
  const contactEmail = settings.email || "[e-mailadres invullen]";

  return (
    <LegalPage
      title="Algemene voorwaarden"
      updated="29 augustus 2026"
      intro={`Deze algemene voorwaarden zijn van toepassing op alle offertes, opdrachten en overeenkomsten tussen ${settings.companyName} (KVK-nummer: [invullen]) en haar opdrachtgevers.`}
    >
      <div>
        <h2>Artikel 1 — Definities</h2>
        <ul>
          <li>
            <strong>Opdrachtnemer:</strong> {settings.companyName}.
          </li>
          <li>
            <strong>Opdrachtgever:</strong> de natuurlijke of rechtspersoon die een overeenkomst
            aangaat met opdrachtnemer.
          </li>
          <li>
            <strong>Overeenkomst:</strong> iedere afspraak tussen opdrachtnemer en opdrachtgever tot
            het leveren van diensten, zoals het bouwen, verbeteren of onderhouden van een website.
          </li>
        </ul>
      </div>

      <div>
        <h2>Artikel 2 — Toepasselijkheid</h2>
        <p>
          Deze voorwaarden zijn van toepassing op alle offertes en overeenkomsten van opdrachtnemer,
          tenzij schriftelijk anders is overeengekomen. Afwijkingen zijn alleen geldig indien
          uitdrukkelijk en schriftelijk overeengekomen.
        </p>
      </div>

      <div>
        <h2>Artikel 3 — Offertes en totstandkoming</h2>
        <p>
          Alle offertes zijn vrijblijvend en geldig gedurende 30 dagen, tenzij anders vermeld. Een
          overeenkomst komt tot stand op het moment dat opdrachtgever een offerte schriftelijk (of
          per e-mail) aanvaardt, of zodra opdrachtnemer op verzoek van opdrachtgever met de
          uitvoering start.
        </p>
      </div>

      <div>
        <h2>Artikel 4 — Uitvoering van de overeenkomst</h2>
        <p>
          Opdrachtnemer voert de overeenkomst naar beste inzicht en vermogen uit. Opdrachtgever
          zorgt ervoor dat alle gegevens, teksten, afbeeldingen en overige informatie die nodig zijn
          voor de uitvoering tijdig worden aangeleverd.
        </p>
      </div>

      <div>
        <h2>Artikel 5 — Wijzigingen en meerwerk</h2>
        <p>
          Wijzigingen in de oorspronkelijke opdracht, op verzoek van opdrachtgever, die leiden tot
          extra werkzaamheden, worden als meerwerk beschouwd en apart in rekening gebracht, na
          overleg met opdrachtgever.
        </p>
      </div>

      <div>
        <h2>Artikel 6 — Levertijden</h2>
        <p>
          Genoemde (op)levertermijnen zijn indicatief en gelden nooit als fatale termijn, tenzij
          uitdrukkelijk schriftelijk anders overeengekomen. Vertraging door het laat aanleveren van
          benodigde informatie door opdrachtgever komt niet voor rekening van opdrachtnemer.
        </p>
      </div>

      <div>
        <h2>Artikel 7 — Prijzen en betaling</h2>
        <p>
          Alle genoemde prijzen zijn exclusief btw, tenzij anders vermeld. Facturen dienen binnen 14
          dagen na factuurdatum te worden voldaan. Bij overschrijding van deze termijn is
          opdrachtgever van rechtswege in verzuim en is opdrachtnemer gerechtigd wettelijke rente en
          redelijke incassokosten in rekening te brengen.
        </p>
      </div>

      <div>
        <h2>Artikel 8 — Intellectueel eigendom</h2>
        <p>
          Alle rechten van intellectuele eigendom op de door opdrachtnemer ontwikkelde of gebruikte
          werken (waaronder ontwerpen, code en teksten) berusten bij opdrachtnemer, tenzij
          schriftelijk anders is overeengekomen. Na volledige betaling verkrijgt opdrachtgever een
          gebruiksrecht op het opgeleverde eindresultaat voor het overeengekomen doel.
        </p>
      </div>

      <div>
        <h2>Artikel 9 — Aansprakelijkheid</h2>
        <p>
          Opdrachtnemer is uitsluitend aansprakelijk voor directe schade die het gevolg is van een
          toerekenbare tekortkoming, tot maximaal het bedrag dat voor de betreffende overeenkomst in
          rekening is gebracht. Opdrachtnemer is nooit aansprakelijk voor indirecte schade, waaronder
          gevolgschade en gederfde winst.
        </p>
      </div>

      <div>
        <h2>Artikel 10 — Overmacht</h2>
        <p>
          In geval van overmacht is opdrachtnemer niet gehouden haar verplichtingen na te komen. Onder
          overmacht wordt onder meer verstaan: storingen bij hostingpartijen of andere derden,
          internetstoringen en andere omstandigheden buiten de invloedssfeer van opdrachtnemer.
        </p>
      </div>

      <div>
        <h2>Artikel 11 — Geheimhouding</h2>
        <p>
          Beide partijen zijn verplicht tot geheimhouding van vertrouwelijke informatie die zij van
          elkaar hebben verkregen in het kader van de overeenkomst.
        </p>
      </div>

      <div>
        <h2>Artikel 12 — Duur, onderhoud en opzegging</h2>
        <p>
          Overeenkomsten voor doorlopende diensten (zoals onderhoud) worden aangegaan voor de
          overeengekomen periode en kunnen door beide partijen schriftelijk worden opgezegd met
          inachtneming van een opzegtermijn van één maand, tenzij anders overeengekomen.
        </p>
      </div>

      <div>
        <h2>Artikel 13 — Herroepingsrecht (consumenten)</h2>
        <p>
          Indien opdrachtgever een consument is en de overeenkomst op afstand is gesloten, kan een
          wettelijk herroepingsrecht van 14 dagen van toepassing zijn. Dit recht vervalt zodra
          opdrachtnemer, met uitdrukkelijke instemming van opdrachtgever, is gestart met de
          uitvoering van de dienst voordat de herroepingstermijn is verstreken.
        </p>
      </div>

      <div>
        <h2>Artikel 14 — Toepasselijk recht en geschillen</h2>
        <p>
          Op alle overeenkomsten met opdrachtnemer is Nederlands recht van toepassing. Geschillen
          worden bij voorkeur in onderling overleg opgelost. Komen partijen er niet uit, dan is de
          bevoegde rechter in Nederland aangewezen om van het geschil kennis te nemen.
        </p>
      </div>

      <div>
        <h2>Contact</h2>
        <p>
          Vragen over deze algemene voorwaarden? Neem contact op via{" "}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </div>
    </LegalPage>
  );
}
