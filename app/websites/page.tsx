import Link from "next/link";

import { CtaBand } from "@/components/ui/cta-band";
import { Faq } from "@/components/ui/faq";
import { PageHero } from "@/components/ui/page-hero";
import { Parallax } from "@/components/ui/parallax";
import { ArrowIcon, ButtonLink, Container, SectionTitle } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Websites & webshops",
  description:
    "Professioneel webdesign, responsive ontwikkeling, snelheid, SEO, CMS-koppelingen en webshops. Websites van Wielstra Group die bezoekers omzetten in aanvragen.",
  path: "/websites",
});

const features = [
  {
    title: "Professioneel webdesign",
    text: "Een eigen ontwerp dat past bij je merk en je boodschap helder brengt. Geen thema dat ook bij honderd anderen draait.",
  },
  {
    title: "Responsive ontwikkeling",
    text: "Ontworpen voor elk scherm, van telefoon tot breed beeldscherm. Mobiel is geen bijzaak, het is vaak de eerste indruk.",
  },
  {
    title: "Snelheid en performance",
    text: "Geoptimaliseerde afbeeldingen, weinig overbodige scripts en moderne hosting. Snel laden is beter voor bezoekers én voor Google.",
  },
  {
    title: "SEO als fundament",
    text: "Een logische structuur, goede metadata, structured data en een sitemap. Vindbaarheid wordt vanaf het begin meegebouwd.",
  },
  {
    title: "CMS-integraties",
    text: "Zelf teksten, projecten en afbeeldingen beheren via een overzichtelijk dashboard, zonder dat je iets van code hoeft te weten.",
  },
  {
    title: "Webshops",
    text: "Van een compacte bestelmodule tot een volledige webshop, gekoppeld aan je voorraad, betaalprovider en administratie.",
  },
  {
    title: "Onderhoud en beheer",
    text: "Updates, beveiliging, back-ups en kleine aanpassingen. Je website blijft veilig en actueel, ook na de lancering.",
  },
];

const faq = [
  {
    q: "Kan ik de website zelf bijwerken?",
    a: "Ja. We koppelen een CMS waarmee je zelf teksten, afbeeldingen en bijvoorbeeld projecten of producten beheert. Welke onderdelen je zelf wilt beheren, bepalen we samen.",
  },
  {
    q: "Kunnen jullie mijn bestaande website verbeteren in plaats van vervangen?",
    a: "Dat kan. We kijken eerst naar de huidige site: soms levert gericht verbeteren meer op dan opnieuw beginnen. We adviseren je daar eerlijk over.",
  },
  {
    q: "Regelen jullie ook hosting en het domein?",
    a: "We adviseren over hosting en zetten de website live. Hoe het beheer daarna is ingericht, spreken we samen af.",
  },
  {
    q: "Kan de website koppelen met andere systemen?",
    a: "Juist daarin onderscheiden we ons. Een aanvraag op je website kan direct in je CRM of planning terechtkomen. Zo wordt je website onderdeel van je bedrijfsproces.",
  },
];

export default function WebsitesPage() {
  return (
    <>
      <PageHero
        eyebrow="Websites & webshops"
        title={
          <>
            Een website die meer doet dan er goed uitzien<span className="text-signal">.</span>
          </>
        }
        intro="Je website is vaak het eerste contact met een nieuwe klant. Wij bouwen snelle, vindbare websites en webshops die vertrouwen wekken en bezoekers naar een volgende stap leiden."
      >
        <ButtonLink href="/contact?type=offerte&dienst=web">Vraag een offerte aan</ButtonLink>
        <ButtonLink href="/portfolio" variant="secondary">
          Bekijk projecten
        </ButtonLink>
      </PageHero>

      {/* Responsive visual + intro */}
      <section className="py-20 sm:py-28">
        <Container className="grid gap-16 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-5">
            <SectionTitle
              index="01"
              eyebrow="Op ieder scherm"
              title="Ontworpen voor hoe mensen echt browsen."
              intro="Een groot deel van je bezoekers komt via de telefoon. We ontwerpen daarom niet eerst voor desktop om mobiel er later bij te passen, maar denken vanaf het begin aan elk schermformaat."
            />
          </Reveal>
          <div className="lg:col-span-7">
            <Parallax speed={0.05}>
              <DeviceVisual />
            </Parallax>
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="border-t border-line bg-card/60 py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionTitle index="02" eyebrow="Wat je krijgt" title="Alles wat een sterke website nodig heeft." />
          </Reveal>
          <ul className="mt-14 grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <Reveal
                as="li"
                key={feature.title}
                delay={(i % 4) * 70}
                className={`group bg-paper p-8 transition-colors hover:bg-card ${i === 0 ? "lg:col-span-2" : ""}`}
              >
                <span className="font-mono text-xs text-signal-ink">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-8 font-display text-2xl font-semibold tracking-[-0.03em]">{feature.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{feature.text}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Onderdeel van het geheel */}
      <section className="py-20 sm:py-28">
        <Container>
          <Reveal className="grid gap-10 rounded-[2rem] border border-line p-8 sm:p-12 lg:grid-cols-12 lg:items-center lg:p-16">
            <div className="lg:col-span-7">
              <SectionTitle
                index="03"
                eyebrow="Meer dan een website"
                title="Je website als begin van je bedrijfsproces."
                intro="Omdat we ook software en koppelingen bouwen, kan je website meer: aanvragen die direct in je CRM landen, een klantportaal achter een login, of een webshop die je voorraad automatisch bijwerkt."
              />
            </div>
            <div className="flex flex-col gap-4 lg:col-span-5">
              {[
                { href: "/maatwerksoftware", label: "Maatwerksoftware" },
                { href: "/diensten#automation", label: "Automation & AI" },
                { href: "/diensten#data", label: "Koppelingen en API's" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center justify-between rounded-2xl border border-line bg-card px-6 py-5 font-display text-xl font-semibold tracking-[-0.02em] transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                >
                  {link.label}
                  <ArrowIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-line bg-card/60 py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <SectionTitle index="04" eyebrow="Veelgestelde vragen" title="Over websites." />
          </Reveal>
          <div className="lg:col-span-8">
            <Faq items={faq} />
          </div>
        </Container>
      </section>

      <CtaBand
        title="Klaar voor een website die werkt?"
        text="Vertel ons over je bedrijf en je doelen. We denken mee over opbouw, inhoud en techniek, en sturen je een helder voorstel."
      />
    </>
  );
}

function MockPage({ compact = false }: { compact?: boolean }) {
  return (
    <div className="space-y-2 p-3">
      <div className="flex items-center justify-between">
        <span className="h-2 w-8 rounded bg-ink/70" />
        {compact ? (
          <span className="h-2 w-3 rounded bg-ink/30" />
        ) : (
          <span className="flex gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="h-1.5 w-5 rounded bg-ink/20" />
            ))}
          </span>
        )}
      </div>
      <span className={`mt-3 block rounded bg-ink/80 ${compact ? "h-3 w-4/5" : "h-4 w-3/5"}`} />
      <span className={`block rounded bg-ink/80 ${compact ? "h-3 w-3/5" : "h-4 w-2/5"}`} />
      <span className="block h-1.5 w-1/2 rounded bg-ink/20" />
      <span className="mt-2 block h-4 w-14 rounded-full bg-signal" />
      <div className={`grid gap-1.5 pt-2 ${compact ? "grid-cols-1" : "grid-cols-3"}`}>
        {(compact ? [0, 1] : [0, 1, 2]).map((i) => (
          <span key={i} className="block h-10 rounded-md bg-paper-2" />
        ))}
      </div>
    </div>
  );
}

/** Abstract responsive-visual: desktop, tablet en telefoon. */
function DeviceVisual() {
  return (
    <div className="relative pb-10 pr-6" aria-hidden="true">
      <div className="overflow-hidden rounded-xl border border-line-strong bg-card shadow-[0_30px_60px_-30px_rgb(17_21_26/0.35)]">
        <div className="flex gap-1.5 border-b border-line px-3 py-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-2 w-2 rounded-full bg-line-strong" />
          ))}
        </div>
        <MockPage />
      </div>
      <div className="absolute -bottom-2 right-24 w-[34%] overflow-hidden rounded-xl border border-line-strong bg-card shadow-[0_24px_50px_-24px_rgb(17_21_26/0.45)] sm:right-32">
        <MockPage compact />
      </div>
      <div className="absolute -bottom-4 right-0 w-[20%] overflow-hidden rounded-[1rem] border-2 border-ink bg-card shadow-[0_24px_50px_-24px_rgb(17_21_26/0.5)]">
        <div className="mx-auto mt-1 h-1 w-6 rounded-full bg-ink/40" />
        <MockPage compact />
      </div>
    </div>
  );
}
