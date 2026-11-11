/**
 * Centrale merkcontent. Pagina's halen hun teksten hieruit, zodat
 * diensten, navigatie en footer altijd met elkaar in lijn blijven.
 *
 * Schrijfwijze: Joël spreekt in de ik-vorm over zijn werk; "Wielstra Group"
 * alleen wanneer het over het bedrijf of merk gaat.
 */

export const OWNER_NAME = "Joël Wielstra";

export const mainNav = [
  { href: "/diensten", label: "Diensten" },
  { href: "/maatwerksoftware", label: "Maatwerksoftware" },
  { href: "/websites", label: "Websites" },
  { href: "/portfolio", label: "Projecten" },
  { href: "/over", label: "Over mij" },
] as const;

export const legalNav = [
  { href: "/privacybeleid", label: "Privacybeleid" },
  { href: "/cookiebeleid", label: "Cookiebeleid" },
  { href: "/algemene-voorwaarden", label: "Algemene voorwaarden" },
  { href: "/disclaimer", label: "Disclaimer" },
] as const;

export type ServiceGroup = {
  id: string;
  index: string;
  title: string;
  tagline: string;
  problem: string;
  build: string[];
  outcome: string;
  href?: string;
};

export const serviceGroups: ServiceGroup[] = [
  {
    id: "web",
    index: "01",
    title: "Websites & webshops",
    tagline: "Een website die aanvragen oplevert.",
    problem:
      "Je website ziet er netjes uit, maar er komen weinig aanvragen binnen. Of hij is traag, of je moet voor elke tekstwijziging iemand bellen.",
    build: [
      "Bedrijfswebsites met een eigen ontwerp",
      "Webshops en bestelmodules",
      "Landingspagina's voor campagnes",
      "Een beheeromgeving waarin je zelf teksten aanpast",
      "Technische SEO en snelle laadtijden",
    ],
    outcome:
      "Een snelle website die goed vindbaar is, in één oogopslag laat zien wat je doet en bezoekers makkelijk contact laat opnemen.",
    href: "/websites",
  },
  {
    id: "software",
    index: "02",
    title: "Maatwerksoftware",
    tagline: "Software die aansluit op hoe je werkt.",
    problem:
      "Een standaardpakket dwingt je om anders te werken dan je wilt. Of je bedrijf draait op een verzameling spreadsheets die alleen jij nog snapt.",
    build: [
      "CRM en klantbeheer",
      "Planning en roosters",
      "Voorraad- en orderbeheer",
      "Portalen voor klanten of personeel",
      "Interne dashboards en SaaS-platformen",
    ],
    outcome:
      "Eén systeem dat precies doet wat jouw bedrijf nodig heeft, waarin iedereen met dezelfde, actuele gegevens werkt.",
    href: "/maatwerksoftware",
  },
  {
    id: "automation",
    index: "03",
    title: "Automatisering & AI",
    tagline: "Minder handwerk, minder fouten.",
    problem:
      "Er worden gegevens overgetypt van het ene systeem naar het andere, dezelfde mails steeds opnieuw verstuurd en documenten met de hand verwerkt.",
    build: [
      "Koppelingen die stappen tussen systemen automatisch afhandelen",
      "AI voor het lezen, sorteren en samenvatten van documenten en e-mails",
      "Automatische meldingen en rapportages",
      "Offertes en facturen die zichzelf klaarzetten",
      "Een AI-assistent die werkt met je eigen bedrijfsinformatie",
    ],
    outcome:
      "Terugkerend werk gebeurt automatisch, zodat jij en je medewerkers tijd overhouden voor het werk dat echt aandacht vraagt.",
  },
  {
    id: "data",
    index: "04",
    title: "Data & koppelingen",
    tagline: "Je gegevens op één plek, en kloppend.",
    problem:
      "Klantgegevens, orders en planning staan op verschillende plekken. Niemand weet zeker welke versie klopt.",
    build: [
      "Database-ontwerp en datamodel",
      "Koppelingen (API's) tussen je systemen",
      "Overzetten van gegevens uit oude software of Excel",
      "Beveiligde hosting en back-ups",
      "Inloggen met rollen en rechten",
    ],
    outcome:
      "Betrouwbare gegevens op één centrale plek, veilig opgeslagen en via koppelingen beschikbaar waar je ze nodig hebt.",
  },
  {
    id: "support",
    index: "05",
    title: "Onderhoud & doorontwikkeling",
    tagline: "Ook na de oplevering blijf ik betrokken.",
    problem:
      "Een website of systeem waar na de oplevering niemand meer naar omkijkt, raakt verouderd, wordt kwetsbaar en past na een tijd niet meer bij je bedrijf.",
    build: [
      "Updates en technisch onderhoud",
      "Beveiligingsupdates en controle op storingen",
      "Nieuwe functies in overzichtelijke stappen",
      "Hulp bij vragen van gebruikers",
      "Advies wanneer je bedrijf groeit of verandert",
    ],
    outcome:
      "Je website en software blijven veilig en actueel, en veranderen mee met je bedrijf.",
  },
];

export const problems = [
  {
    pain: "Elke week hetzelfde handwerk.",
    fix: "Ik automatiseer de terugkerende stappen, zodat ze vanzelf gebeuren.",
  },
  {
    pain: "Systemen die niet met elkaar praten.",
    fix: "Ik koppel ze, zodat je alles maar één keer hoeft in te voeren.",
  },
  {
    pain: "Software die net niet past.",
    fix: "Ik bouw software die past bij hoe jij en je medewerkers werken.",
  },
  {
    pain: "Een website die weinig oplevert.",
    fix: "Ik bouw een snelle, vindbare site die bezoekers aanzet tot contact.",
  },
  {
    pain: "Alles staat in losse spreadsheets.",
    fix: "Ik breng je gegevens samen in één systeem met een helder overzicht.",
  },
];

export const processSteps = [
  {
    index: "01",
    title: "Kennismaken",
    text: "Je vertelt over je bedrijf, je doelen en waar het nu vastloopt. Ik luister en stel vragen. Vrijblijvend, en zonder verkooppraatje.",
  },
  {
    index: "02",
    title: "Uitzoeken",
    text: "Ik breng in kaart hoe het werk nu verloopt en wat er echt nodig is. Je krijgt een voorstel met aanpak, planning en prijs.",
  },
  {
    index: "03",
    title: "Ontwerpen en bouwen",
    text: "Ik bouw in korte stappen en laat tussendoor werkende versies zien. Zo kun je op tijd bijsturen.",
  },
  {
    index: "04",
    title: "Opleveren",
    text: "Ik test alles grondig, zet het live en zorg dat jij en je medewerkers er direct mee kunnen werken.",
  },
  {
    index: "05",
    title: "Doorontwikkelen",
    text: "Na de oplevering blijf ik beschikbaar voor onderhoud, beveiliging en nieuwe wensen.",
  },
];

export const principles = [
  {
    title: "Je spreekt mij direct",
    text: "Geen accountmanager of helpdesk ertussen. De persoon met wie je het project bespreekt, is ook de persoon die het bouwt.",
  },
  {
    title: "Eerst begrijpen, dan bouwen",
    text: "Ik begin bij je werkwijze en je doelen. Pas daarna kies ik de techniek die daarbij past.",
  },
  {
    title: "Alles op één adres",
    text: "Website, software, koppelingen en automatisering. Je hoeft niet zelf verschillende partijen op elkaar af te stemmen.",
  },
  {
    title: "Gebouwd om op door te bouwen",
    text: "Nette, gedocumenteerde code en beveiliging vanaf het begin. Zo kun je later uitbreiden zonder opnieuw te beginnen.",
  },
];

export const projectTypes = ["Websites", "Webshops", "Maatwerksoftware", "Automatisering", "Koppelingen"];
