import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CtaBand } from "@/components/ui/cta-band";
import { ArrowIcon, ButtonLink, Container, Eyebrow } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { siteUrl } from "@/lib/env";
import { getProjectBySlug } from "@/lib/projects";
import { safeUrlOrNull } from "@/lib/security";
import { jsonLd } from "@/lib/seo";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project niet gevonden", robots: { index: false } };
  }

  return {
    title: project.title,
    description: project.shortDescription,
    alternates: { canonical: `/portfolio/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      url: `/portfolio/${project.slug}`,
      images: [{ url: project.image, alt: project.title }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.shortDescription,
      images: [project.image],
    },
  };
}

function formatDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("nl-NL", { month: "long", year: "numeric" }).format(parsed);
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const [cover, ...gallery] = [project.image, ...project.additionalImages];
  const liveUrl = safeUrlOrNull(project.liveUrl);

  const ld = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.shortDescription,
    image: project.image.startsWith("http") ? project.image : `${siteUrl}${project.image}`,
    url: `${siteUrl}/portfolio/${project.slug}`,
    dateCreated: project.date,
    creator: { "@type": "Organization", name: "Wielstra Group", url: siteUrl },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />

      <section className="border-b border-line">
        <Container className="pb-12 pt-10 sm:pt-14">
          <Link href="/portfolio" className="group inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
            <ArrowIcon className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" />
            Alle projecten
          </Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <Eyebrow>{project.category}</Eyebrow>
              <h1 className="mt-6 font-display text-[2.6rem] font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                {project.title}
              </h1>
              <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted">{project.shortDescription}</p>
            </div>
            <dl className="grid grid-cols-2 gap-6 border-t border-line pt-6 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <div>
                <dt className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-subtle">Klant</dt>
                <dd className="mt-2 font-semibold">{project.client}</dd>
              </div>
              {project.date ? (
                <div>
                  <dt className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-subtle">Oplevering</dt>
                  <dd className="mt-2 font-semibold">{formatDate(project.date)}</dd>
                </div>
              ) : null}
              {liveUrl ? (
                <div className="col-span-2">
                  <ButtonLink href={liveUrl} external variant="secondary">
                    Bekijk live
                  </ButtonLink>
                </div>
              ) : null}
            </dl>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <Reveal className="relative aspect-[16/9] overflow-hidden rounded-[1.75rem] border border-line bg-paper-2">
            <Image
              src={cover}
              alt={`${project.title}, hoofdbeeld`}
              fill
              priority
              sizes="(min-width: 1344px) 1248px, 100vw"
              className="object-cover"
            />
          </Reveal>
        </Container>
      </section>

      <section className="pb-16 sm:pb-24">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-subtle">Over het project</p>
          </div>
          <div className="lg:col-span-8">
            <p className="whitespace-pre-line text-xl leading-relaxed">{project.description}</p>
          </div>
        </Container>
      </section>

      {gallery.length > 0 ? (
        <section className="border-t border-line pb-8 pt-16 sm:pt-24">
          <Container>
            <h2 className="sr-only">Beeldmateriaal</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {gallery.map((image, index) => (
                <Reveal
                  key={image + index}
                  delay={(index % 2) * 90}
                  className={`relative overflow-hidden rounded-[1.5rem] border border-line bg-paper-2 ${
                    gallery.length % 2 === 1 && index === 0 ? "aspect-[16/9] md:col-span-2" : "aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${project.title}, afbeelding ${index + 2}`}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <CtaBand title="Iets vergelijkbaars nodig?" />
    </>
  );
}
