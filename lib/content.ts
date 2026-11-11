/**
 * Centrale merkcontent. Pagina's halen hun teksten hieruit, zodat
 * diensten, navigatie en footer altijd met elkaar in lijn blijven.
 */

export const mainNav = [
  { href: "/diensten", label: "Diensten" },
  { href: "/maatwerksoftware", label: "Maatwerksoftware" },
  { href: "/websites", label: "Websites" },
  { href: "/portfolio", label: "Projecten" },
  { href: "/over", label: "Over ons" },
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
    title: "Web Development",
    tagline: "Websites en webshops die werk opleveren.",
    problem:
      "Je website ziet er prima uit, maar levert weinig aanvragen op, laadt traag of is lastig zelf bij te werken.",
    build: [
      "Bedrijfswebsites met eigen ontwerp",
      "Webshops en bestelomgevingen",
      "Landingspagina's voor campagnes",
      "CMS-koppelingen zodat je zelf content beheert",
      "Technische SEO en performance-optimalisatie",
    ],
    outcome:
      "Een snelle, vindbare website die bezoekers helder vertelt wat je doet en ze naar een volgende stap leidt.",
    href: "/websites",
  },
  {
    id: "software",
    index: "02",
    title: "Software Development",
    tagline: "Software die past op hoe jij werkt.",
    problem:
      "Standaardpakketten dwingen je in hun werkwijze, of je bedrijf draait op een wirwar van spreadsheets en losse tools.",
    build: [
      "CRM-systemen en klantbeheer",
      "Planning- en roostersoftware",
      "Voorraad- en orderbeheer",
      "Klant- en personeelsportalen",
      "Interne dashboards en SaaS-platformen",
    ],
    outcome:
      "Eén systeem dat precies doet wat jouw processen vragen, met overzicht voor iedereen die ermee werkt.",
    href: "/maatwerksoftware",
  },
  {
    id: "automation",
    index: "03",
    title: "Automation & AI",
    tagline: "Minder handwerk, minder fouten.",
    problem:
      "Medewerkers kopiëren gegevens tussen systemen, sturen dezelfde mails opnieuw en verwerken documenten met de hand.",
    build: [
      "Automatische workflows tussen systemen",
      "AI-integraties voor tekst, documenten en classificatie",
      "Slimme notificaties en rapportages",
      "Automatische offerte- en factuurstromen",
      "Assistenten op basis van je eigen bedrijfsdata",
    ],
    outcome:
      "Repeterend werk loopt vanzelf, zodat je team tijd overhoudt voor werk dat aandacht nodig heeft.",
  },
  {
    id: "data",
    index: "04",
    title: "Data & Infrastructure",
    tagline: "Een fundament dat klopt en meegroeit.",
    problem:
      "Gegevens staan verspreid, systemen praten niet met elkaar en niemand weet precies welke versie de juiste is.",
    build: [
      "Databaseontwerp en datamodellering",
      "API's en systeemkoppelingen",
      "Migraties vanuit oude systemen of Excel",
      "Beveiligde hosting en back-ups",
      "Authenticatie en rechtenbeheer",
    ],
    outcome:
      "Betrouwbare data op één plek, veilig opgeslagen en via koppelingen beschikbaar waar je die nodig hebt.",
  },
  {
    id: "support",
    index: "05",
    title: "Support & Growth",
    tagline: "Na livegang begint het pas.",
    problem:
      "Software of een website die na oplevering niemand meer onderhoudt, veroudert, wordt onveilig en sluit niet meer aan.",
    build: [
      "Technisch onderhoud en updates",
      "Monitoring en beveiligingsupdates",
      "Doorontwikkeling in overzichtelijke stappen",
      "Ondersteuning voor gebruikers",
      "Advies bij nieuwe wensen en groei",
    ],
    outcome:
      "Je systemen blijven actueel en veilig, en groeien mee met wat je bedrijf morgen nodig heeft.",
  },
];

export const problems = [
  {
    pain: "Je team doet elke week hetzelfde handwerk.",
    fix: "We automatiseren terugkerende taken en koppelen de stappen aan elkaar.",
  },
  {
    pain: "Je systemen werken niet samen.",
    fix: "We bouwen koppelingen en API's, zodat gegevens één keer worden ingevoerd.",
  },
  {
    pain: "Standaardsoftware past net niet.",
    fix: "We ontwikkelen software rond jouw proces, niet andersom.",
  },
  {
    pain: "Je website levert te weinig op.",
    fix: "We bouwen een snelle, vindbare site die bezoekers omzet in aanvragen.",
  },
  {
    pain: "Je bedrijf draait op losse spreadsheets.",
    fix: "We brengen je data samen in één overzichtelijk systeem met dashboards.",
  },
];

export const processSteps = [
  {
    index: "01",
    title: "Kennismaken",
    text: "We praten over je bedrijf, je doelen en waar het nu vastloopt. Vrijblijvend en zonder verkooppraatje.",
  },
  {
    index: "02",
    title: "Analyseren",
    text: "We brengen je processen in kaart en bepalen wat echt nodig is. Je krijgt een helder voorstel met scope en planning.",
  },
  {
    index: "03",
    title: "Ontwerpen & bouwen",
    text: "We ontwikkelen in korte rondes en laten tussentijds werkende versies zien, zodat je kunt bijsturen.",
  },
  {
    index: "04",
    title: "Lanceren",
    text: "We testen grondig, zetten alles live en zorgen dat je team ermee aan de slag kan.",
  },
  {
    index: "05",
    title: "Doorontwikkelen",
    text: "Na livegang blijven we betrokken voor onderhoud, beveiliging en nieuwe wensen.",
  },
];

export const principles = [
  {
    title: "Direct contact met de bouwers",
    text: "Je spreekt met de mensen die jouw oplossing ontwikkelen. Geen accountmanagers als tussenlaag, wel korte lijnen.",
  },
  {
    title: "Eerst begrijpen, dan bouwen",
    text: "We beginnen bij je proces en je doelen, niet bij een technologie die we toevallig willen gebruiken.",
  },
  {
    title: "Breed technisch inzetbaar",
    text: "Website, software, data en automatisering onder één dak. Je hoeft niet zelf verschillende partijen te coördineren.",
  },
  {
    title: "Gebouwd om lang mee te gaan",
    text: "Onderhoudbare code, heldere documentatie en veiligheid vanaf het eerste ontwerp, zodat je kunt blijven doorbouwen.",
  },
];

export const projectTypes = ["Websites", "Webshops", "Maatwerksoftware", "Automatisering", "Koppelingen"];
