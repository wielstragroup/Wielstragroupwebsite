import { SoftwareMock } from "@/components/home/software-mock";
import { CtaBand } from "@/components/ui/cta-band";
import { Faq } from "@/components/ui/faq";
import { PageHero } from "@/components/ui/page-hero";
import { ButtonLink, Container, SectionTitle } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Maatwerksoftware",
  description:
    "CRM, planning, voorraadbeheer, klant- en personeelsportalen of een eigen SaaS-platform: Wielstra Group ontwikkelt software rond de processen van jouw bedrijf.",
  path: "/maatwerksoftware",
});

const systems = [
  { code: "CRM", title: "CRM-systemen", text: "Klanten, contactmomenten, offertes en opvolging, ingericht op jouw verkoopproces." },
  { code: "ERP", title: "Bedrijfssoftware", text: "Het centrale systeem waarin orders, projecten en administratie samenkomen." },
  { code: "DSH", title: "Interne dashboards", text: "Realtime inzicht in de cijfers die voor jouw bedrijf echt tellen." },
  { code: "PLN", title: "Planningssystemen", text: "Roosters, capaciteit, afspraken en routes, zonder dubbele boekingen." },
  { code: "INV", title: "Voorraadbeheer", text: "Voorraadniveaus, bestellingen en locaties, actueel en traceerbaar." },
  { code: "KLP", title: "Klantportalen", text: "Een eigen omgeving waar klanten status, documenten en facturen inzien." },
  { code: "HRP", title: "Personeelsportalen", text: "Uren, verlof, documenten en interne communicatie op één plek." },
  { code: "SAS", title: "SaaS-platformen", text: "Je eigen softwareproduct, schaalbaar opgezet voor meerdere klanten." },
  { code: "AUT", title: "Procesautomatisering", text: "Workflows die stappen, mails en documentverwerking automatisch afhandelen." },
];

const pillars = [
  {
    title: "Gebruiksvriendelijk",
    text: "Software werkt alleen als mensen het graag gebruiken. We ontwerpen schermen rond de taken van je team, in jullie eigen terminologie.",
  },
  {
    title: "Schaalbaar",
    text: "Een solide datamodel en modulaire opbouw. Nieuwe functies, gebruikers of vestigingen toevoegen zonder opnieuw te beginnen.",
  },
  {
    title: "Veilig",
    text: "Rollen en rechten, versleutelde verbindingen, back-ups en zorgvuldige omgang met persoonsgegevens, vanaf het eerste ontwerp.",
  },
  {
    title: "Echt maatwerk",
    text: "Geen pakket met aanpassingen, maar software die precies doet wat jouw bedrijf nodig heeft, niet meer en niet minder.",
  },
];

const faq = [
  {
    q: "Is maatwerksoftware niet veel duurder dan een standaardpakket?",
    a: "De eerste investering is meestal hoger. Daar staat tegenover dat je geen licenties betaalt voor functies die je niet gebruikt en geen tijd verliest aan omwegen. We beginnen klein met wat het meeste oplevert en breiden uit wanneer dat zinvol is. En als een bestaand pakket beter past, adviseren we dat.",
  },
  {
    q: "Kan de software koppelen met wat we nu al gebruiken?",
    a: "In de meeste gevallen wel. Boekhoudpakketten, webshops, e-mail en andere systemen bieden vaak een API. Tijdens de analyse brengen we in kaart welke koppelingen nodig en mogelijk zijn.",
  },
  {
    q: "Hoe lang duurt het om een systeem te ontwikkelen?",
    a: "Dat hangt af van de omvang. Na de analyse krijg je een concrete planning. We werken in korte rondes, zodat je al vroeg een werkende eerste versie ziet en kunt bijsturen.",
  },
  {
    q: "Wat als ons bedrijf verandert?",
    a: "Daar houden we vanaf het begin rekening mee. De software is modulair opgebouwd, zodat we functies kunnen aanpassen of toevoegen wanneer je processen veranderen.",
  },
  {
    q: "Wie onderhoudt de software na oplevering?",
    a: "Wij blijven graag betrokken voor onderhoud, beveiligingsupdates en doorontwikkeling. Welke afspraken daarbij passen, bespreken we samen.",
  },
];

export default function CustomSoftwarePage() {
  return (
    <>
      <PageHero
        eyebrow="Maatwerksoftware"
        title={
          <>
            Stop met werken rond je software<span className="text-signal">.</span>
          </>
        }
        intro="Standaardpakketten dwingen je in hun logica. Wij bouwen systemen die werken zoals jouw bedrijf werkt: van een CRM op maat tot een compleet SaaS-platform."
      >
        <ButtonLink href="/contact?type=kennismaking&dienst=software">Bespreek je idee</ButtonLink>
        <ButtonLink href="#systemen" variant="secondary">
          Wat we bouwen
        </ButtonLink>
      </PageHero>

      {/* Standaard vs maatwerk */}
      <section className="py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionTitle
              index="01"
              eyebrow="Het verschil"
              title="Standaardsoftware is gemaakt voor iedereen. Dus voor niemand precies."
            />
          </Reveal>
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <Reveal className="rounded-[1.5rem] border border-line p-8 sm:p-10">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-subtle">Standaardpakket</p>
              <ul className="mt-6 space-y-4 text-lg text-muted">
                {[
                  "Jij past je werkwijze aan op de software",
                  "Je betaalt voor functies die je nooit gebruikt",
                  "Wat ontbreekt, regel je in Excel ernaast",
                  "Koppelingen zijn beperkt of kosten extra",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-3 h-[1.5px] w-3 shrink-0 bg-line-strong" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={100} className="rounded-[1.5rem] bg-ink p-8 text-white sm:p-10">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-signal">Maatwerk van Wielstra Group</p>
              <ul className="mt-6 space-y-4 text-lg">
                {[
                  "De software volgt jouw proces en terminologie",
                  "Alleen wat je nodig hebt, uitbreidbaar wanneer jij wilt",
                  "Alle informatie op één plek, voor iedereen actueel",
                  "Koppelingen met je bestaande systemen waar mogelijk",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2.5 h-2 w-2 shrink-0 bg-signal" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Systemen */}
      <section id="systemen" className="scroll-mt-24 border-t border-line bg-card/60 py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionTitle
              index="02"
              eyebrow="Wat we ontwikkelen"
              title="Van intern hulpmiddel tot volwaardig platform."
              intro="Een greep uit de systemen die we bouwen. Vaak is de beste oplossing een combinatie, die als één samenhangend geheel werkt."
            />
          </Reveal>
          <ul className="mt-14 grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {systems.map((system, i) => (
              <Reveal as="li" key={system.code} delay={(i % 3) * 70} className="group relative bg-paper p-8 transition-colors duration-300 hover:bg-ink">
                <div className="flex items-center justify-between">
                  <span className="rounded-md border border-line-strong px-2 py-1 font-mono text-[0.68rem] tracking-[0.14em] text-muted transition-colors group-hover:border-white/20 group-hover:text-signal">
                    {system.code}
                  </span>
                  <span className="font-mono text-xs text-subtle transition-colors group-hover:text-white/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-10 font-display text-2xl font-semibold tracking-[-0.03em] transition-colors group-hover:text-white">
                  {system.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted transition-colors group-hover:text-white/70">{system.text}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Pijlers */}
      <section className="relative overflow-hidden bg-ink py-20 text-white sm:py-28">
        <div className="bg-grid-dark pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        <Container className="relative grid gap-16 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <Reveal>
              <SectionTitle
                tone="light"
                index="03"
                eyebrow="Onze uitgangspunten"
                title="Gebouwd om dagelijks mee te werken, en jaren mee te gaan."
              />
            </Reveal>
            <dl className="mt-12 grid gap-8 sm:grid-cols-2">
              {pillars.map((pillar, i) => (
                <Reveal key={pillar.title} delay={i * 80}>
                  <dt className="flex items-center gap-3 font-display text-xl font-semibold">
                    <span className="h-2 w-2 bg-signal" aria-hidden="true" />
                    {pillar.title}
                  </dt>
                  <dd className="mt-3 leading-relaxed text-white/70">{pillar.text}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
          <Reveal delay={120} className="lg:col-span-6">
            <SoftwareMock />
            <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/50">
              Illustratie · schermopbouw van een maatwerkapplicatie
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Aanpak */}
      <section className="py-20 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <SectionTitle
              index="04"
              eyebrow="Rond jouw proces"
              title="We bouwen pas als we begrijpen hoe je werkt."
              intro="Goede software begint niet bij code, maar bij de vraag hoe het werk vandaag écht verloopt."
            />
          </Reveal>
          <ol className="space-y-px lg:col-span-7">
            {[
              ["Proces in kaart", "We lopen samen met de mensen die het werk doen door het huidige proces: waar zitten dubbele stappen, wachttijden en foutgevoelige handelingen?"],
              ["Datamodel en ontwerp", "We bepalen welke gegevens centraal staan en hoe schermen eruit moeten zien. Je ziet een klikbaar ontwerp voordat er gebouwd wordt."],
              ["Bouwen in rondes", "We ontwikkelen in korte iteraties en leveren tussentijds werkende versies op, zodat je vroeg kunt testen en bijsturen."],
              ["Invoeren en overdragen", "We migreren bestaande gegevens, zetten het systeem live en zorgen dat je team er direct mee overweg kan."],
            ].map(([title, text], i) => (
              <Reveal as="li" key={title} delay={i * 80} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-line py-7">
                <span className="font-mono text-sm text-signal-ink">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-display text-2xl font-semibold tracking-[-0.03em]">{title}</h3>
                  <p className="mt-2 text-lg leading-relaxed text-muted">{text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-t border-line bg-card/60 py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <SectionTitle index="05" eyebrow="Veelgestelde vragen" title="Goed om te weten." />
          </Reveal>
          <div className="lg:col-span-8">
            <Faq items={faq} />
          </div>
        </Container>
      </section>

      <CtaBand
        title="Loopt je bedrijf tegen de grenzen van je software aan?"
        text="Vertel ons hoe je nu werkt en waar het knelt. We denken mee over wat een maatwerkoplossing kan opleveren, en of het de investering waard is."
      />
    </>
  );
}
