import Link from "next/link";

import { ProjectCard } from "@/components/project-card";
import { CtaBand } from "@/components/ui/cta-band";
import { PageHero } from "@/components/ui/page-hero";
import { ButtonLink, Container } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { projectTypes } from "@/lib/content";
import { getPublishedProjects } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Projecten",
  description:
    "Bekijk gerealiseerde projecten van Wielstra Group: websites, webshops, maatwerksoftware en automatiseringen.",
  path: "/portfolio",
});

type PortfolioPageProps = {
  searchParams: Promise<{ type?: string | string[] }>;
};

export default async function PortfolioPage({ searchParams }: PortfolioPageProps) {
  const [projects, params] = await Promise.all([getPublishedProjects(), searchParams]);

  const categories = Array.from(new Set(projects.map((project) => project.category))).sort((a, b) =>
    a.localeCompare(b, "nl"),
  );
  const requested = typeof params.type === "string" ? params.type : null;
  const activeCategory = requested && categories.includes(requested) ? requested : null;
  const visible = activeCategory ? projects.filter((project) => project.category === activeCategory) : projects;

  return (
    <>
      <PageHero
        eyebrow="Projecten"
        title="Werk dat in de praktijk draait."
        intro="Een selectie van wat we hebben gebouwd. Iedere opdracht begint met een concreet probleem en eindigt met een oplossing die je dagelijks gebruikt."
      />

      <section className="py-16 sm:py-24">
        <Container>
          {categories.length > 1 ? (
            <nav aria-label="Filter op type project" className="mb-12">
              <ul className="flex flex-wrap gap-2">
                <FilterChip href="/portfolio" active={!activeCategory} label="Alles" count={projects.length} />
                {categories.map((category) => (
                  <FilterChip
                    key={category}
                    href={`/portfolio?type=${encodeURIComponent(category)}`}
                    active={activeCategory === category}
                    label={category}
                    count={projects.filter((project) => project.category === category).length}
                  />
                ))}
              </ul>
            </nav>
          ) : null}

          {visible.length > 0 ? (
            <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
              {visible.map((project, i) => (
                <Reveal
                  key={project.id}
                  delay={(i % 2) * 90}
                  className={i === 0 && !activeCategory && visible.length > 2 ? "md:col-span-2" : ""}
                >
                  <ProjectCard
                    project={project}
                    index={i}
                    feature={i === 0 && !activeCategory && visible.length > 2}
                    priority={i === 0}
                  />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyPortfolio />
          )}
        </Container>
      </section>

      {/* Wat we bouwen: helpt bezoekers die (nog) geen vergelijkbaar project zien */}
      <section className="border-t border-line bg-card/60 py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Geen vergelijkbaar project gezien?
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
              Lang niet alles wat we bouwen is publiek zichtbaar: interne systemen en portalen draaien achter een login.
              Vraag gerust of we ervaring hebben met jouw type vraagstuk.
            </p>
          </div>
          <ul className="flex flex-wrap gap-2 lg:col-span-6 lg:justify-end">
            {projectTypes.map((type) => (
              <li key={type} className="rounded-full border border-line-strong px-4 py-2 text-sm text-muted">
                {type}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand title="Jouw project hier?" />
    </>
  );
}

function FilterChip({ href, active, label, count }: { href: string; active: boolean; label: string; count: number }) {
  return (
    <li>
      <Link
        href={href}
        scroll={false}
        aria-current={active ? "page" : undefined}
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
          active ? "border-ink bg-ink text-paper" : "border-line-strong text-muted hover:border-ink hover:text-ink"
        }`}
      >
        {label}
        <span className={`font-mono text-[0.68rem] ${active ? "text-paper/60" : "text-subtle"}`}>{count}</span>
      </Link>
    </li>
  );
}

function EmptyPortfolio() {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-line-strong p-10 text-center sm:p-16">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-subtle">Portfolio in opbouw</p>
      <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted">
        Projecten worden hier gepubliceerd zodra ze live staan en de klant akkoord heeft gegeven. In een gesprek laten we
        je graag zien hoe we werken.
      </p>
      <div className="mt-8 flex justify-center">
        <ButtonLink href="/contact?type=kennismaking">Plan een kennismaking</ButtonLink>
      </div>
    </div>
  );
}
