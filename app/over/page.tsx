import { LogoMark } from "@/components/brand/logo";
import { CtaBand } from "@/components/ui/cta-band";
import { PageHero } from "@/components/ui/page-hero";
import { Parallax } from "@/components/ui/parallax";
import { Container, SectionTitle } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { principles, processSteps } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Over ons",
  description:
    "Wie is Wielstra Group? Een technologiebedrijf dat complexe digitale vraagstukken omzet in praktische oplossingen, met persoonlijk contact en korte lijnen.",
  path: "/over",
});

const commitments = [
  ["Een helder voorstel", "Je weet vooraf wat we gaan bouwen, wat het kost en wanneer je wat kunt verwachten."],
  ["Eén vast aanspreekpunt", "Je hoeft je verhaal niet steeds opnieuw te vertellen. We kennen je bedrijf en je project."],
  ["Tussentijds resultaat", "Je ziet en test werkende versies tijdens het bouwen, niet pas bij de oplevering."],
  ["Eerlijk advies", "Als een bestaand pakket of een kleinere oplossing beter past, zeggen we dat."],
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Over Wielstra Group"
        title="Technologie met een gezicht."
        intro="Wielstra Group is een technologiebedrijf voor ondernemers die verder willen dan standaard. We bouwen software, automatiseringen en websites, en we doen dat op een manier die persoonlijk en begrijpelijk blijft."
      />

      <section className="py-20 sm:py-28">
        <Container className="grid gap-16 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionTitle index="01" eyebrow="Waarom we bestaan" title="Digitale vraagstukken zijn bedrijfsvraagstukken." />
            </Reveal>
            <Reveal delay={80} className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
              <p>
                Veel ondernemers kennen het: een website bij het ene bureau, een pakket voor de planning, een spreadsheet
                voor de voorraad en een collega die alles met de hand aan elkaar knoopt. Ieder onderdeel werkt, maar het
                geheel niet.
              </p>
              <p>
                Wielstra Group is ontstaan om dat anders te doen. We kijken naar het complete plaatje: hoe je werkt, waar
                tijd verloren gaat en welke technologie daar echt bij helpt. Soms is dat een website, soms een
                maatwerksysteem, vaak een combinatie met slimme koppelingen.
              </p>
              <p className="text-ink">
                We willen niet het grootste IT-bedrijf zijn. Wel de partner die je belt als er iets digitaals moet
                gebeuren, en die je bedrijf goed genoeg kent om meteen mee te denken.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Parallax speed={0.08}>
              <Reveal delay={120} className="relative aspect-square overflow-hidden rounded-[2rem] bg-ink">
                <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
                <LogoMark className="absolute inset-[18%] h-[64%] w-[64%] text-paper" />
                <p className="absolute bottom-6 left-6 right-6 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-white/60">
                  Het merkteken: één doorlopende lijn, en het punt waar alles samenkomt.
                </p>
              </Reveal>
            </Parallax>
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-card/60 py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionTitle index="02" eyebrow="Waar we voor staan" title="Vier principes die elk project sturen." />
          </Reveal>
          <div className="mt-14 grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line md:grid-cols-2">
            {principles.map((item, i) => (
              <Reveal key={item.title} delay={(i % 2) * 80} className="bg-paper p-8 sm:p-10">
                <span className="font-mono text-xs text-signal-ink">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 font-display text-2xl font-semibold tracking-[-0.03em]">{item.title}</h3>
                <p className="mt-3 text-lg leading-relaxed text-muted">{item.text}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <SectionTitle
              index="03"
              eyebrow="Hoe we werken"
              title="Gestructureerd, transparant en in jouw tempo."
              intro="Iedere samenwerking volgt dezelfde heldere stappen. Zo weet je altijd waar je staat."
            />
          </Reveal>
          <ol className="lg:col-span-7">
            {processSteps.map((step, i) => (
              <Reveal as="li" key={step.index} delay={i * 70} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-line py-7 last:border-b">
                <span className="font-mono text-sm text-signal-ink">{step.index}</span>
                <div>
                  <h3 className="font-display text-2xl font-semibold tracking-[-0.03em]">{step.title}</h3>
                  <p className="mt-2 text-lg leading-relaxed text-muted">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-ink py-20 text-white sm:py-28">
        <div className="bg-grid-dark pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        <Container className="relative">
          <Reveal>
            <SectionTitle tone="light" index="04" eyebrow="Wat je van ons mag verwachten" title="Afspraken waar je ons op kunt aanspreken." />
          </Reveal>
          <dl className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {commitments.map(([title, text], i) => (
              <Reveal key={title} delay={i * 80} className="border-t border-white/15 pt-6">
                <dt className="font-display text-xl font-semibold">{title}</dt>
                <dd className="mt-3 leading-relaxed text-white/70">{text}</dd>
              </Reveal>
            ))}
          </dl>
        </Container>
      </section>

      <CtaBand title="Zullen we kennismaken?" />
    </>
  );
}
