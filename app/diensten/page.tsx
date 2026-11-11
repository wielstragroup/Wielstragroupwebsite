import Link from "next/link";

import { CtaBand } from "@/components/ui/cta-band";
import { PageHero } from "@/components/ui/page-hero";
import { ArrowIcon, ButtonLink, CheckList, Container } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { serviceGroups } from "@/lib/content";
import { siteUrl } from "@/lib/env";
import { jsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Diensten",
  description:
    "Web development, maatwerksoftware, automatisering & AI, data & infrastructuur en doorlopende ondersteuning. Bekijk wat Wielstra Group voor je bedrijf kan bouwen.",
  path: "/diensten",
});

export default function ServicesPage() {
  const servicesLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: serviceGroups.map((group, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: group.title,
        description: group.outcome,
        url: `${siteUrl}/diensten#${group.id}`,
        provider: { "@type": "Organization", name: "Wielstra Group", url: siteUrl },
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(servicesLd)} />
      <PageHero
        eyebrow="Diensten"
        title="Alles wat je bedrijf digitaal nodig heeft. Gebouwd als één geheel."
        intro="We werken in vijf disciplines die naadloos op elkaar aansluiten. Je kunt met één vraag beginnen; we kijken altijd naar hoe het past in het grotere geheel."
      >
        <ButtonLink href="/contact?type=offerte">Vraag een offerte aan</ButtonLink>
        <ButtonLink href="/contact?type=kennismaking" variant="secondary">
          Plan een kennismaking
        </ButtonLink>
      </PageHero>

      {/* Snelnavigatie */}
      <nav aria-label="Diensten op deze pagina" className="sticky top-[4.5rem] z-30 border-b border-line bg-paper/90 backdrop-blur-md">
        <Container>
          <ul className="-mx-2 flex gap-1 overflow-x-auto py-3">
            {serviceGroups.map((group) => (
              <li key={group.id}>
                <a
                  href={`#${group.id}`}
                  className="flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-ink hover:text-paper"
                >
                  <span className="font-mono text-[0.68rem]">{group.index}</span>
                  {group.title}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      <div>
        {serviceGroups.map((group, i) => (
          <section
            key={group.id}
            id={group.id}
            aria-labelledby={`${group.id}-title`}
            className={`scroll-mt-36 border-b border-line py-20 sm:py-28 ${i % 2 === 1 ? "bg-card/60" : ""}`}
          >
            <Container className="grid gap-12 lg:grid-cols-12">
              <Reveal className="lg:col-span-5">
                <p className="font-display text-[5rem] font-semibold leading-none tracking-[-0.06em] text-ink/10 sm:text-[7rem]">
                  {group.index}
                </p>
                <h2
                  id={`${group.id}-title`}
                  className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em] sm:text-5xl"
                >
                  {group.title}
                </h2>
                <p className="mt-4 text-xl text-muted">{group.tagline}</p>
                {group.href ? (
                  <Link href={group.href} className="group mt-8 inline-flex items-center gap-2 font-semibold">
                    <span className="link-underline">Lees de volledige toelichting</span>
                    <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                ) : null}
              </Reveal>

              <div className="grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line md:grid-cols-2 lg:col-span-7">
                <Reveal className="bg-paper p-8">
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-signal-ink">Het probleem</p>
                  <p className="mt-4 text-lg leading-relaxed">{group.problem}</p>
                </Reveal>
                <Reveal delay={80} className="bg-paper p-8">
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-pine">Wat het oplevert</p>
                  <p className="mt-4 text-lg leading-relaxed">{group.outcome}</p>
                </Reveal>
                <Reveal delay={160} className="bg-paper p-8 md:col-span-2">
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-subtle">Wat we ontwikkelen</p>
                  <CheckList items={group.build} columns className="mt-5" />
                </Reveal>
              </div>
            </Container>
          </section>
        ))}
      </div>

      <section className="py-20 sm:py-24">
        <Container>
          <Reveal className="grid gap-8 rounded-[1.5rem] border border-line bg-card p-8 sm:p-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Staat jouw vraag er niet tussen?
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
                Deze lijst is niet uitputtend. Als het een digitaal probleem is binnen je bedrijf, denken we graag mee
                over een oplossing. En als iets beter met een bestaand pakket kan, zeggen we dat ook.
              </p>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <ButtonLink href="/contact">Leg je vraag voor</ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
