import type { Metadata } from "next";
import Link from "next/link";

import { ServiceExplorer } from "@/components/home/service-explorer";
import { SoftwareMock } from "@/components/home/software-mock";
import { SystemMap } from "@/components/home/system-map";
import { ProjectCard } from "@/components/project-card";
import { CtaBand } from "@/components/ui/cta-band";
import { Parallax } from "@/components/ui/parallax";
import { ArrowIcon, ButtonLink, Container, Eyebrow, SectionTitle } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { principles, problems, processSteps, serviceGroups } from "@/lib/content";
import { getFeaturedProjects, getPublishedProjects } from "@/lib/projects";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings.defaultSeoTitle || DEFAULT_TITLE;
  const description = settings.defaultMetaDescription || DEFAULT_DESCRIPTION;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/" },
    openGraph: { title, description, url: "/", type: "website" },
  };
}

const softwareTypes = [
  "CRM-systemen",
  "Planningssoftware",
  "Voorraadbeheer",
  "Klantportalen",
  "Personeelsportalen",
  "Interne dashboards",
  "SaaS-platformen",
  "Procesautomatisering",
];

export default async function Home() {
  const [featured, published] = await Promise.all([getFeaturedProjects(3), getPublishedProjects()]);
  const projects = (featured.length > 0 ? featured : published).slice(0, 3);

  return (
    <>
      {/* ───────────── Hero ───────────── */}
      <section className="relative overflow-hidden">
        <div className="bg-grid mask-fade-b pointer-events-none absolute inset-0" aria-hidden="true" />
        <Container className="relative grid gap-14 pb-16 pt-12 sm:pt-16 lg:grid-cols-12 lg:gap-10 lg:pb-24 lg:pt-20">
          <div className="lg:col-span-7 lg:pt-6">
            <Eyebrow>Maatwerksoftware · Automatisering · Websites</Eyebrow>
            <h1 className="mt-7 font-display text-[3rem] font-semibold leading-[0.94] tracking-[-0.05em] sm:text-7xl lg:text-[6.1rem]">
              Je bedrijf is geen standaard.
              <span className="mt-2 block text-ink/40">
                Je software ook niet
                <span className="ml-1 inline-block h-[0.16em] w-[0.16em] bg-signal align-baseline" aria-hidden="true" />
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
              Wielstra Group ontwikkelt software, automatiseringen en websites die passen op hoe jouw bedrijf écht
              werkt. Van een CRM op maat tot een AI-koppeling die handwerk overneemt.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/contact?type=kennismaking">Plan een kennismaking</ButtonLink>
              <ButtonLink href="/diensten" variant="secondary">
                Bekijk wat we bouwen
              </ButtonLink>
            </div>
          </div>
          <div className="lg:col-span-5">
            <SystemMap />
          </div>
        </Container>

        {/* Probleemband */}
        <div className="relative border-y border-line bg-card py-4">
          <div className="mask-fade-x overflow-hidden">
            <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-mono text-sm uppercase tracking-[0.12em] text-muted motion-reduce:animate-none">
              {[0, 1].map((copy) => (
                <ul key={copy} className="flex gap-10" aria-hidden={copy === 1}>
                  {[
                    "Handmatig overtypen",
                    "Losse spreadsheets",
                    "Systemen die niet koppelen",
                    "Software die net niet past",
                    "Een website zonder aanvragen",
                    "Processen die te ingewikkeld zijn",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-10">
                      <span>{item}</span>
                      <span className="h-1.5 w-1.5 bg-signal" aria-hidden="true" />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Problemen → oplossingen ───────────── */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <SectionTitle
                index="01"
                eyebrow="Herkenbaar?"
                title="We beginnen bij wat er vastloopt."
                intro="Ondernemers komen zelden bij ons voor ‘een app’. Ze komen omdat iets te veel tijd kost, fouten oplevert of groei in de weg zit. Dat is ons startpunt."
              />
            </Reveal>
            <div className="lg:col-span-7">
              <ul className="border-t border-ink">
                {problems.map((item, i) => (
                  <Reveal as="li" key={item.pain} delay={i * 60} className="group border-b border-line">
                    <div className="grid gap-2 py-6 transition-colors sm:grid-cols-[2.5rem_1fr_1fr] sm:gap-6">
                      <span className="font-mono text-xs text-subtle">{String(i + 1).padStart(2, "0")}</span>
                      <p className="font-display text-xl font-semibold leading-snug tracking-[-0.02em]">{item.pain}</p>
                      <p className="flex gap-3 leading-relaxed text-muted transition-colors group-hover:text-ink">
                        <ArrowIcon className="mt-1 h-4 w-4 shrink-0 text-signal-ink transition-transform group-hover:translate-x-1" />
                        {item.fix}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ───────────── Diensten ───────────── */}
      <section className="border-t border-line bg-card/60 py-20 sm:py-28">
        <Container>
          <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <Reveal>
              <SectionTitle
                index="02"
                eyebrow="Expertise"
                title="Eén partner voor je hele digitale fundament."
              />
            </Reveal>
            <Reveal delay={100}>
              <p className="max-w-md text-lg leading-relaxed text-muted">
                Websites, software, data en automatisering hangen steeds meer samen. Wij overzien het geheel, zodat jij
                niet hoeft te schakelen tussen vijf leveranciers.
              </p>
            </Reveal>
          </div>
          <ServiceExplorer groups={serviceGroups} />
        </Container>
      </section>

      {/* ───────────── Maatwerksoftware showcase ───────────── */}
      <section className="relative overflow-hidden bg-ink py-20 text-white sm:py-28">
        <div className="bg-grid-dark pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        <Container className="relative grid gap-16 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-5">
            <SectionTitle
              tone="light"
              index="03"
              eyebrow="Maatwerksoftware"
              title={
                <>
                  Software die zich aanpast aan jou. <span className="text-signal">Niet andersom.</span>
                </>
              }
              intro="Standaardpakketten zijn gemaakt voor het gemiddelde bedrijf. Wij bouwen systemen rond jouw processen, je terminologie en je mensen. Gebruiksvriendelijk, veilig en klaar om mee te groeien."
            />
            <ul className="mt-10 flex flex-wrap gap-2">
              {softwareTypes.map((type) => (
                <li
                  key={type}
                  className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition-colors hover:border-signal hover:text-white"
                >
                  {type}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <ButtonLink href="/maatwerksoftware" variant="light">
                Ontdek maatwerksoftware
              </ButtonLink>
            </div>
          </Reveal>
          <div className="lg:col-span-7">
            <Parallax speed={0.06}>
              <Reveal delay={120}>
                <SoftwareMock />
              </Reveal>
            </Parallax>
            <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/50">
              Illustratie · voorbeeld van een planningsmodule
            </p>
          </div>
        </Container>
      </section>

      {/* ───────────── Werkwijze ───────────── */}
      <section className="py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionTitle
              index="04"
              eyebrow="Werkwijze"
              title="Van eerste gesprek tot systeem dat draait."
              intro="Helder, stap voor stap, en met tussentijdse resultaten die je zelf kunt proberen. Zo weet je altijd waar je staat."
            />
          </Reveal>
          <ol className="mt-16 grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {processSteps.map((step, i) => (
              <Reveal as="li" key={step.index} delay={i * 80} className="group relative bg-paper p-7 transition-colors hover:bg-card">
                <span className="font-mono text-xs text-signal-ink">{step.index}</span>
                <h3 className="mt-10 font-display text-2xl font-semibold tracking-[-0.03em]">{step.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{step.text}</p>
                <span
                  className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-signal transition-transform duration-500 group-hover:scale-x-100"
                  aria-hidden="true"
                />
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* ───────────── Projecten ───────────── */}
      <section className="border-t border-line py-20 sm:py-28">
        <Container>
          <div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <Reveal>
              <SectionTitle index="05" eyebrow="Projecten" title="Werk dat live staat." />
            </Reveal>
            <Link href="/portfolio" className="group inline-flex items-center gap-2 font-semibold">
              <span className="link-underline">Alle projecten</span>
              <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {projects.length > 0 ? (
            <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, i) => (
                <Reveal key={project.id} delay={i * 90}>
                  <ProjectCard project={project} index={i} />
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal className="rounded-[1.5rem] border border-dashed border-line-strong p-10 text-center sm:p-14">
              <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted">
                Onze projecten worden hier gepubliceerd zodra ze live staan. Benieuwd wat we voor jouw situatie kunnen
                bouwen? Dan laten we je graag zien hoe we te werk gaan.
              </p>
              <div className="mt-8 flex justify-center">
                <ButtonLink href="/contact?type=kennismaking">Plan een kennismaking</ButtonLink>
              </div>
            </Reveal>
          )}
        </Container>
      </section>

      {/* ───────────── Waarom ───────────── */}
      <section className="border-t border-line bg-card/60 py-20 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <SectionTitle
              index="06"
              eyebrow="Waarom Wielstra Group"
              title="Technisch sterk. Persoonlijk bereikbaar."
              intro="Groot genoeg om complexe systemen te bouwen, klein genoeg om je bij naam te kennen."
            />
          </Reveal>
          <div className="grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line sm:grid-cols-2 lg:col-span-7">
            {principles.map((item, i) => (
              <Reveal key={item.title} delay={i * 80} className="bg-paper p-8">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-signal-soft font-mono text-xs text-signal-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold tracking-[-0.02em]">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{item.text}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
