import { cache } from "react";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/lib/site-settings";

export const LEGAL_PAGE_SLUGS = [
  "privacybeleid",
  "cookiebeleid",
  "algemene-voorwaarden",
  "disclaimer",
] as const;

export type LegalPageSlug = (typeof LEGAL_PAGE_SLUGS)[number];

export function isLegalPageSlug(value: string): value is LegalPageSlug {
  return (LEGAL_PAGE_SLUGS as readonly string[]).includes(value);
}

export type LegalPage = {
  slug: LegalPageSlug;
  title: string;
  intro: string;
  content: string;
  updatedAt: string | null;
};

/** Menselijke namen voor het dashboard. */
export const LEGAL_PAGE_LABELS: Record<LegalPageSlug, string> = {
  privacybeleid: "Privacybeleid",
  cookiebeleid: "Cookiebeleid",
  "algemene-voorwaarden": "Algemene voorwaarden",
  disclaimer: "Disclaimer",
};

/**
 * Standaardinhoud, gebruikt zolang er nog geen (aangepaste) rij in de
 * database staat. Bewust in dezelfde lichte markup als wat beheerders
 * later zelf invoeren, zodat er geen apart pad voor "standaardtekst" nodig
 * is.
 */
export const DEFAULT_LEGAL_PAGES: Record<
  LegalPageSlug,
  { title: string; intro: string; content: string }
> = {
  privacybeleid: {
    title: "Privacybeleid",
    intro:
      "{{companyName}} respecteert je privacy en gaat zorgvuldig om met persoonsgegevens, in lijn met de Algemene Verordening Gegevensbescherming (AVG/GDPR).",
    content: `## 1. Wie is verantwoordelijk voor je gegevens?
{{companyName}} is de verwerkingsverantwoordelijke voor de persoonsgegevens die via deze website worden verzameld. {{companyName}} is de onderneming van Joël Wielstra; waar in dit privacybeleid 'ik' staat, wordt {{companyName}} bedoeld.

- Bedrijfsnaam: {{companyName}}
- Adres: {{address}}
- E-mail: [{{email}}](mailto:{{email}})
- Telefoon: {{phone}}

## 2. Welke gegevens verzamel ik en waarom?

### Contactformulier
Wanneer je het contactformulier invult, verwerk ik je naam, e-mailadres, het soort aanvraag, het onderwerp en je bericht, en als je die invult ook je bedrijfsnaam, telefoonnummer en budgetindicatie. Ik gebruik deze gegevens uitsluitend om op je aanvraag te reageren. De grondslag hiervoor is mijn gerechtvaardigd belang om vragen van (potentiële) klanten te beantwoorden, en waar van toepassing de uitvoering van (voor)overeenkomsten.

### Bezoekstatistieken (analytics)
Ik houd bezoekstatistieken bij om te zien welke pagina's worden bezocht en hoe vaak. Hiervoor gebruik ik geen cookies en sla ik niets op je apparaat op. Per paginabezoek bewaar ik alleen de bezochte pagina, het tijdstip en een onomkeerbare code (hash). Die code wordt berekend uit je IP-adres en browsertype, gecombineerd met een geheime sleutel die elke dag verandert. Je IP-adres zelf sla ik niet op en ik kan je niet over meerdere dagen volgen. De grondslag is mijn gerechtvaardigd belang om te begrijpen hoe de website wordt gebruikt. Zie het [cookiebeleid](/cookiebeleid) voor meer details.

## 3. Hoe lang bewaar ik gegevens?
- Berichten via het contactformulier bewaar ik zolang dat nodig is om je aanvraag af te handelen, en daarna maximaal 2 jaar, tenzij je eerder om verwijdering vraagt.
- Bezoekstatistieken bevatten geen gegevens waarmee ik je kan identificeren. Ik bewaar ze zolang ik ze nodig heb voor inzicht in het gebruik van de website.

## 4. Deel ik gegevens met derden?
Ik deel je gegevens niet met derden voor commerciële doeleinden. Ik maak wel gebruik van de volgende verwerkers, die uitsluitend in mijn opdracht en volgens mijn instructies gegevens verwerken:

- **Supabase** — voor het opslaan van gegevens (database en hosting).
- **Resend** — voor het versturen van e-mailnotificaties bij een nieuw contactformulier.

Met deze partijen zijn passende afspraken gemaakt over de bescherming van je gegevens.

## 5. Beveiliging
Ik neem passende technische en organisatorische maatregelen om je gegevens te beveiligen tegen verlies of onrechtmatig gebruik, waaronder versleutelde verbindingen (HTTPS) en toegangsbeveiliging voor het beheerderspaneel.

## 6. Jouw rechten
Op grond van de AVG heb je de volgende rechten:

- Recht op inzage in de gegevens die ik van je verwerk.
- Recht op rectificatie van onjuiste gegevens.
- Recht op verwijdering van je gegevens.
- Recht op beperking van de verwerking.
- Recht op bezwaar tegen de verwerking.
- Recht op overdraagbaarheid van je gegevens.

Wil je een van deze rechten uitoefenen? Neem contact op via [{{email}}](mailto:{{email}}). Je hebt ook het recht om een klacht in te dienen bij de Autoriteit Persoonsgegevens.

## 7. Wijzigingen
Ik kan dit privacybeleid van tijd tot tijd aanpassen. De meest actuele versie staat altijd op deze pagina.

## 8. Contact
Heb je vragen over dit privacybeleid? Neem contact op via [{{email}}](mailto:{{email}}).`,
  },

  cookiebeleid: {
    title: "Cookiebeleid",
    intro:
      "Op deze pagina lees je welke cookies en vergelijkbare technieken de website van {{companyName}} gebruikt. Kort gezegd: ik plaats geen tracking- of marketingcookies, en ik houd bezoekstatistieken bij zonder cookies.",
    content: `## 1. Wat zijn cookies?

Cookies zijn kleine tekstbestanden die een website op je apparaat kan opslaan. Ze worden bijvoorbeeld gebruikt om een inlogsessie te onthouden of om bezoekers over verschillende websites te volgen. Daarnaast bestaan er vergelijkbare technieken, zoals lokale opslag in je browser (localStorage).

## 2. Welke cookies en opslag gebruikt deze website?

Deze website plaatst **geen trackingcookies, analytische cookies of marketingcookies**. Ik gebruik alleen wat nodig is om de website te laten werken:

- **sb-…-auth-token** (functionele cookie): houdt de inlogsessie van de beheeromgeving actief. Deze cookie wordt alleen geplaatst wanneer een beheerder inlogt via /admin, niet bij gewone bezoekers. Bewaartermijn: tot het uitloggen of tot de sessie verloopt.
- **cookie-notice-dismissed** (lokale opslag in je browser): onthoudt dat je de cookiemelding hebt gesloten, zodat je die niet bij elk bezoek opnieuw ziet. Bewaartermijn: tot je je browsergegevens wist.

## 3. Bezoekstatistieken zonder cookies

Om te zien welke pagina's worden bezocht, tel ik paginabezoeken zonder cookies en zonder iets op je apparaat op te slaan. Per bezoek bewaar ik alleen de bezochte pagina en een onomkeerbare code (hash). Die code wordt berekend uit je IP-adres en browsertype, gecombineerd met een geheime sleutel die elke dag verandert. Je IP-adres zelf sla ik niet op, en omdat de sleutel dagelijks wisselt, kan ik bezoekers niet over meerdere dagen volgen.

## 4. Toestemming

Voor de cookie en de lokale opslag uit hoofdstuk 2 is geen toestemming nodig, omdat ze strikt noodzakelijk zijn. De bezoekstatistieken plaatsen niets op je apparaat. Daarom heeft deze website geen cookie-instellingen. Ga ik in de toekomst cookies gebruiken waarvoor wel toestemming nodig is, dan vraag ik die vooraf en pas ik dit cookiebeleid aan.

## 5. Inhoud van andere partijen

Deze website bevat geen ingesloten inhoud van andere partijen die cookies plaatst, zoals video's, kaarten of social-media-knoppen. Links naar social media en naar websites uit mijn portfolio zijn gewone links. Pas wanneer je zo'n link volgt, gelden de cookieregels van die andere website.

## 6. Cookies beheren of verwijderen

Je kunt cookies en lokaal opgeslagen gegevens altijd bekijken en verwijderen via de instellingen van je browser. Omdat deze website geen tracking- of marketingcookies gebruikt, verandert dat niets aan hoe de website werkt. Je ziet daarna alleen de cookiemelding opnieuw, en als beheerder moet je opnieuw inloggen.

## 7. Privacy

Hoe ik omga met persoonsgegevens, bijvoorbeeld van het contactformulier, lees je in het [privacybeleid](/privacybeleid).

## 8. Wijzigingen

Ik kan dit cookiebeleid aanpassen als de website of de gebruikte technieken veranderen. De meest recente versie staat altijd op deze pagina.

## 9. Contact

Heb je vragen over cookies op deze website? Neem dan contact met mij op:

- Bedrijf: {{companyName}}
- E-mail: {{email}}
- Telefoon: {{phone}}
- Adres: {{address}}`,
  },

  "algemene-voorwaarden": {
    title: "Algemene voorwaarden",
    intro:
      "Deze algemene voorwaarden zijn van toepassing op alle offertes, opdrachten en overeenkomsten tussen {{companyName}} (KVK-nummer: [invullen]) en haar opdrachtgevers.",
    content: `## Artikel 1 — Definities
- Opdrachtnemer: {{companyName}}.
- Opdrachtgever: de natuurlijke of rechtspersoon die een overeenkomst aangaat met opdrachtnemer.
- Overeenkomst: iedere afspraak tussen opdrachtnemer en opdrachtgever tot het leveren van diensten, zoals het ontwikkelen, verbeteren of onderhouden van websites, software, koppelingen en automatiseringen.

## Artikel 2 — Toepasselijkheid
Deze voorwaarden zijn van toepassing op alle offertes en overeenkomsten van opdrachtnemer, tenzij schriftelijk anders is overeengekomen. Afwijkingen zijn alleen geldig indien uitdrukkelijk en schriftelijk overeengekomen.

## Artikel 3 — Offertes en totstandkoming
Alle offertes zijn vrijblijvend en geldig gedurende 30 dagen, tenzij anders vermeld. Een overeenkomst komt tot stand op het moment dat opdrachtgever een offerte schriftelijk (of per e-mail) aanvaardt, of zodra opdrachtnemer op verzoek van opdrachtgever met de uitvoering start.

## Artikel 4 — Uitvoering van de overeenkomst
Opdrachtnemer voert de overeenkomst naar beste inzicht en vermogen uit. Opdrachtgever zorgt ervoor dat alle gegevens, teksten, afbeeldingen en overige informatie die nodig zijn voor de uitvoering tijdig worden aangeleverd.

## Artikel 5 — Wijzigingen en meerwerk
Wijzigingen in de oorspronkelijke opdracht, op verzoek van opdrachtgever, die leiden tot extra werkzaamheden, worden als meerwerk beschouwd en apart in rekening gebracht, na overleg met opdrachtgever.

## Artikel 6 — Levertijden
Genoemde (op)levertermijnen zijn indicatief en gelden nooit als fatale termijn, tenzij uitdrukkelijk schriftelijk anders overeengekomen. Vertraging door het laat aanleveren van benodigde informatie door opdrachtgever komt niet voor rekening van opdrachtnemer.

## Artikel 7 — Prijzen en betaling
Alle genoemde prijzen zijn exclusief btw, tenzij anders vermeld. Facturen dienen binnen 14 dagen na factuurdatum te worden voldaan. Bij overschrijding van deze termijn is opdrachtgever van rechtswege in verzuim en is opdrachtnemer gerechtigd wettelijke rente en redelijke incassokosten in rekening te brengen.

## Artikel 8 — Intellectueel eigendom
Alle rechten van intellectuele eigendom op de door opdrachtnemer ontwikkelde of gebruikte werken (waaronder ontwerpen, code en teksten) berusten bij opdrachtnemer, tenzij schriftelijk anders is overeengekomen. Na volledige betaling verkrijgt opdrachtgever een gebruiksrecht op het opgeleverde eindresultaat voor het overeengekomen doel.

## Artikel 9 — Aansprakelijkheid
Opdrachtnemer is uitsluitend aansprakelijk voor directe schade die het gevolg is van een toerekenbare tekortkoming, tot maximaal het bedrag dat voor de betreffende overeenkomst in rekening is gebracht. Opdrachtnemer is nooit aansprakelijk voor indirecte schade, waaronder gevolgschade en gederfde winst.

## Artikel 10 — Overmacht
In geval van overmacht is opdrachtnemer niet gehouden haar verplichtingen na te komen. Onder overmacht wordt onder meer verstaan: storingen bij hostingpartijen of andere derden, internetstoringen en andere omstandigheden buiten de invloedssfeer van opdrachtnemer.

## Artikel 11 — Geheimhouding
Beide partijen zijn verplicht tot geheimhouding van vertrouwelijke informatie die zij van elkaar hebben verkregen in het kader van de overeenkomst.

## Artikel 12 — Duur, onderhoud en opzegging
Overeenkomsten voor doorlopende diensten (zoals onderhoud) worden aangegaan voor de overeengekomen periode en kunnen door beide partijen schriftelijk worden opgezegd met inachtneming van een opzegtermijn van één maand, tenzij anders overeengekomen.

## Artikel 13 — Herroepingsrecht (consumenten)
Indien opdrachtgever een consument is en de overeenkomst op afstand is gesloten, kan een wettelijk herroepingsrecht van 14 dagen van toepassing zijn. Dit recht vervalt zodra opdrachtnemer, met uitdrukkelijke instemming van opdrachtgever, is gestart met de uitvoering van de dienst voordat de herroepingstermijn is verstreken.

## Artikel 14 — Toepasselijk recht en geschillen
Op alle overeenkomsten met opdrachtnemer is Nederlands recht van toepassing. Geschillen worden bij voorkeur in onderling overleg opgelost. Komen partijen er niet uit, dan is de bevoegde rechter in Nederland aangewezen om van het geschil kennis te nemen.

## Contact
Vragen over deze algemene voorwaarden? Neem contact op via [{{email}}](mailto:{{email}}).`,
  },

  disclaimer: {
    title: "Disclaimer",
    intro: "Deze disclaimer is van toepassing op het gebruik van de website van {{companyName}}.",
    content: `## 1. Inhoud van de website
{{companyName}} besteedt zorgvuldige aandacht aan de inhoud van deze website, maar kan niet garanderen dat alle informatie te allen tijde juist, volledig of actueel is. Aan de inhoud van deze website kunnen geen rechten worden ontleend.

## 2. Aansprakelijkheid
{{companyName}} is niet aansprakelijk voor schade die voortvloeit uit het gebruik van deze website, of uit het (tijdelijk) niet beschikbaar zijn van de website, tenzij sprake is van opzet of grove schuld.

## 3. Externe links
Deze website kan links bevatten naar websites van derden. {{companyName}} heeft geen invloed op en is niet verantwoordelijk voor de inhoud van deze externe websites.

## 4. Intellectueel eigendom
Alle teksten, afbeeldingen, vormgeving en overige inhoud op deze website zijn eigendom van {{companyName}} of worden met toestemming gebruikt, en zijn beschermd door het auteursrecht. Niets van deze website mag zonder voorafgaande schriftelijke toestemming worden overgenomen of verveelvoudigd.

## 5. Wijzigingen
{{companyName}} behoudt zich het recht voor de inhoud van deze website, inclusief deze disclaimer, op elk moment te wijzigen zonder voorafgaande kennisgeving.

## 6. Contact
Vragen over deze disclaimer? Neem contact op via [{{email}}](mailto:{{email}}).`,
  },
};

function mapRow(slug: LegalPageSlug, row: Record<string, unknown> | null): LegalPage {
  const fallback = DEFAULT_LEGAL_PAGES[slug];

  if (!row) {
    return { slug, title: fallback.title, intro: fallback.intro, content: fallback.content, updatedAt: null };
  }

  return {
    slug,
    title: typeof row.title === "string" && row.title ? row.title : fallback.title,
    intro: typeof row.intro === "string" ? row.intro : fallback.intro,
    content: typeof row.content === "string" && row.content ? row.content : fallback.content,
    updatedAt: typeof row.updated_at === "string" ? row.updated_at : null,
  };
}

export const getLegalPage = cache(async (slug: LegalPageSlug): Promise<LegalPage> => {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return mapRow(slug, null);
  }

  const { data } = await supabase.from("legal_pages").select("*").eq("slug", slug).maybeSingle();

  return mapRow(slug, data);
});

/** Nette weergavedatum, met een vaste terugvalwaarde zolang er nog geen rij in de database staat. */
export function formatLegalUpdatedDate(updatedAt: string | null): string {
  if (!updatedAt) {
    return "29 augustus 2026";
  }

  return new Date(updatedAt).toLocaleDateString("nl-NL", { dateStyle: "long" });
}

/** Vult {{companyName}} e.d. in juridische pagina's op basis van de website-instellingen. */
export function legalPlaceholderValues(settings: SiteSettings): Record<string, string> {
  return {
    companyName: settings.companyName,
    email: settings.email || "[e-mailadres invullen]",
    phone: settings.phone || "[telefoonnummer invullen]",
    address: settings.address || "[adres invullen]",
  };
}

export async function getAllLegalPages(): Promise<LegalPage[]> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return LEGAL_PAGE_SLUGS.map((slug) => mapRow(slug, null));
  }

  const { data } = await supabase.from("legal_pages").select("*");
  const bySlug = new Map((data ?? []).map((row) => [String(row.slug), row]));

  return LEGAL_PAGE_SLUGS.map((slug) => mapRow(slug, bySlug.get(slug) ?? null));
}
