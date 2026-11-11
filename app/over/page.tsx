import { LogoMark } from "@/components/brand/logo";
import { CtaBand } from "@/components/ui/cta-band";
import { PageHero } from "@/components/ui/page-hero";
import { Parallax } from "@/components/ui/parallax";
import { Container, SectionTitle } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { principles, processSteps } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Over Joël Wielstra",
  description:
    "Wielstra Group is het bedrijf van Joël Wielstra. Hij bouwt software, automatiseringen en websites voor ondernemers, en je spreekt hem rechtstreeks.",
  path: "/over",
});

const commitments = [
  ["Een duidelijk voorstel", "Je weet vooraf wat ik ga bouwen, wat het kost en wanneer je wat kunt verwachten."],
  ["Eén aanspreekpunt", "Je hoeft je verhaal niet steeds opnieuw te vertellen. Ik ken je bedrijf en je project."],
  ["Tussentijds resultaat", "Je ziet en test werkende versies terwijl ik bouw, niet pas bij de oplevering."],
  ["Eerlijk advies", "Past een bestaand pakket of een kleinere oplossing beter? Dan zeg ik dat."],
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Over mij"
        title="De persoon achter Wielstra Group."
        intro="Ik ben Joël Wielstra. Met Wielstra Group bouw ik software, automatiseringen en websites voor ondernemers. Je spreekt mij rechtstreeks, van het eerste gesprek tot lang na de oplevering. Zonder vakjargon, tenzij je dat zelf wilt."
      />

      <section className="py-20 sm:py-28">
        <Container className="grid gap-16 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionTitle index="01" eyebrow="Waarom Wielstra Group" title="Een digitaal probleem is meestal een bedrijfsprobleem." />
            </Reveal>
            <Reveal delay={80} className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
              <p>
                Veel ondernemers kennen het: een website bij het ene bureau, een pakket voor de planning, een spreadsheet
                voor de voorraad en een collega die alles met de hand bijhoudt. Elk onderdeel werkt op zich, maar samen
                kost het veel tijd en gaat er regelmatig iets mis.
              </p>
              <p>
                Ik ben Wielstra Group begonnen omdat digitaal werk niet ingewikkeld of onpersoonlijk hoeft te zijn. Ik kijk
                eerst hoe je werkt en waar tijd verloren gaat. Pas daarna kies ik wat daarbij helpt: soms een website, soms
                een eigen systeem, vaak een combinatie met een paar goede koppelingen.
              </p>
              <p className="text-ink">
                Ik wil geen groot IT-bedrijf zijn waar je een ticketnummer krijgt. Ik wil degene zijn die je belt als er
                iets digitaals moet gebeuren, en die je bedrijf goed genoeg kent om direct mee te denken.
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
            <SectionTitle index="02" eyebrow="Waar ik voor sta" title="Vier dingen waar je op kunt rekenen." />
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
              eyebrow="Werkwijze"
              title="Elk project volgt dezelfde vaste stappen."
              intro="Zo weet je altijd waar het project staat en wat er als volgende gebeurt."
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
            <SectionTitle tone="light" index="04" eyebrow="Wat je van mij mag verwachten" title="Afspraken waar je me op kunt aanspreken." />
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

      <CtaBand title="Zullen we kennismaken?" text="Vertel me over je bedrijf en waar je tegenaan loopt. In een half uur weet je of en hoe ik je kan helpen." />
    </>
  );
}
