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
    "Een eigen CRM, planningssysteem, voorraadbeheer, klantportaal of SaaS-platform. Joël Wielstra bouwt software rond de werkwijze van jouw bedrijf.",
  path: "/maatwerksoftware",
});

const systems = [
  { code: "CRM", title: "CRM-systemen", text: "Klanten, contactmomenten, offertes en opvolging, ingericht op jouw verkoopproces." },
  { code: "ERP", title: "Bedrijfssoftware", text: "Het centrale systeem waarin orders, projecten en administratie samenkomen." },
  { code: "DSH", title: "Interne dashboards", text: "Actueel inzicht in de cijfers die voor jouw bedrijf belangrijk zijn." },
  { code: "PLN", title: "Planningssystemen", text: "Roosters, capaciteit, afspraken en routes, zonder dubbele boekingen." },
  { code: "INV", title: "Voorraadbeheer", text: "Voorraadniveaus, bestellingen en locaties, actueel en traceerbaar." },
  { code: "KLP", title: "Klantportalen", text: "Een eigen omgeving waar klanten status, documenten en facturen inzien." },
  { code: "HRP", title: "Personeelsportalen", text: "Uren, verlof, documenten en interne communicatie op één plek." },
  { code: "SAS", title: "SaaS-platformen", text: "Je eigen softwareproduct, schaalbaar opgezet voor meerdere klanten." },
  { code: "AUT", title: "Procesautomatisering", text: "Terugkerende stappen, mails en documenten die automatisch worden afgehandeld." },
];

const pillars = [
  {
    title: "Prettig om mee te werken",
    text: "Software werkt alleen als mensen het graag gebruiken. Ik ontwerp de schermen rond de dagelijkse taken van je medewerkers, met de woorden die jullie zelf gebruiken.",
  },
  {
    title: "Klaar om te groeien",
    text: "Een goed doordachte database en een opbouw in losse onderdelen. Zo voeg je later functies, gebruikers of vestigingen toe zonder opnieuw te beginnen.",
  },
  {
    title: "Veilig",
    text: "Rollen en rechten, versleutelde verbindingen, back-ups en zorgvuldige omgang met persoonsgegevens. Daar houd ik vanaf het eerste ontwerp rekening mee.",
  },
  {
    title: "Echt op maat",
    text: "Geen bestaand pakket met wat aanpassingen, maar software die doet wat jouw bedrijf nodig heeft. Niet meer en niet minder.",
  },
];

const faq = [
  {
    q: "Is maatwerksoftware niet veel duurder dan een standaardpakket?",
    a: "De eerste investering is meestal hoger. Daar staat tegenover dat je geen licenties betaalt voor functies die je nooit gebruikt, en geen tijd kwijt bent aan omwegen. Ik begin graag klein, met het onderdeel dat het meeste oplevert, en breid uit als dat zinvol is. Past een bestaand pakket beter? Dan zeg ik dat.",
  },
  {
    q: "Kan de software koppelen met wat we nu al gebruiken?",
    a: "Meestal wel. Boekhoudpakketten, webshops, mailprogramma's en veel andere systemen hebben een koppelmogelijkheid (een API). Voordat ik ga bouwen, zoek ik uit welke koppelingen nodig en mogelijk zijn.",
  },
  {
    q: "Hoe lang duurt het om een systeem te laten bouwen?",
    a: "Dat hangt af van de omvang. Nadat ik je situatie in kaart heb gebracht, krijg je een concrete planning. Ik werk in korte stappen, zodat je al vroeg een eerste werkende versie ziet en kunt bijsturen.",
  },
  {
    q: "Wat als ons bedrijf verandert?",
    a: "Daar houd ik vanaf het begin rekening mee. De software bestaat uit losse onderdelen, zodat ik functies kan aanpassen of toevoegen als jullie werkwijze verandert.",
  },
  {
    q: "Wie onderhoudt de software na de oplevering?",
    a: "Dat doe ik. Ik blijf beschikbaar voor onderhoud, beveiligingsupdates en nieuwe functies. Welke afspraken daarbij passen, bespreken we samen.",
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
        intro="Een standaardpakket dwingt je om te werken zoals de software dat wil. Ik bouw systemen die werken zoals jouw bedrijf werkt. Van een eenvoudig klantbeheer tot een compleet SaaS-platform."
      >
        <ButtonLink href="/contact?type=kennismaking&dienst=software">Bespreek je idee</ButtonLink>
        <ButtonLink href="#systemen" variant="secondary">
          Wat ik bouw
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
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-signal">Maatwerk door Wielstra Group</p>
              <ul className="mt-6 space-y-4 text-lg">
                {[
                  "De software volgt jouw werkwijze en jullie eigen termen",
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
              eyebrow="Wat ik bouw"
              title="Van intern hulpmiddel tot volwaardig platform."
              intro="Een greep uit wat ik voor bedrijven kan bouwen. Vaak is de beste oplossing een combinatie van een paar onderdelen die met elkaar samenwerken."
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
                eyebrow="Mijn uitgangspunten"
                title="Software voor dagelijks gebruik, gebouwd voor de lange termijn."
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
              title="Ik bouw pas als ik begrijp hoe je werkt."
              intro="Goede software begint niet bij code, maar bij de vraag hoe het werk vandaag verloopt. En waar het beter kan."
            />
          </Reveal>
          <ol className="space-y-px lg:col-span-7">
            {[
              ["Proces in kaart", "Ik loop het huidige proces door met de mensen die het werk doen. Waar wordt iets dubbel gedaan, waar wordt gewacht, waar gaat het vaak mis?"],
              ["Datamodel en ontwerp", "Ik bepaal welke gegevens centraal staan en hoe de schermen eruit komen te zien. Je ziet een klikbaar ontwerp voordat ik ga bouwen."],
              ["Bouwen in rondes", "Ik bouw in korte stappen en lever tussendoor werkende versies op. Zo kun je vroeg testen en bijsturen."],
              ["Invoeren en overdragen", "Ik zet bestaande gegevens over, breng het systeem live en zorg dat iedereen er meteen mee aan de slag kan."],
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
        text="Vertel me hoe je nu werkt en waar het knelt. Ik denk mee over wat maatwerk je kan opleveren, en of het de investering waard is."
      />
    </>
  );
}
