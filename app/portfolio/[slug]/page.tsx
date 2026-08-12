import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { getProjectBySlug } from "@/lib/projects";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project niet gevonden" };
  }

  return {
    title: project.title,
    description: project.shortDescription,
    alternates: { canonical: `/portfolio/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.shortDescription,
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

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const images = [project.image, ...project.additionalImages];

  return (
    <div className="bg-slate-950 text-slate-100">
      {/* Header & Meta Section */}
      <section className="relative border-b border-slate-800 bg-slate-950 py-12 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/portfolio"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Terug naar portfolio</span>
          </Link>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-300">
              {project.category}
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Klant:</span>
                <span className="font-semibold text-white">{project.client}</span>
              </div>
              {project.date ? (
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Oplevering:</span>
                  <span className="font-semibold text-white">{project.date}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Content & Gallery Section */}
      <section className="bg-slate-50 py-16 text-slate-900 sm:py-24">
        <div className="mx-auto max-w-5xl space-y-12 px-4 sm:px-6 lg:px-8">
          {/* Description Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm sm:p-10">
            <h2 className="mb-4 text-xl font-bold text-slate-950">Over het project</h2>
            <p className="text-base leading-relaxed text-slate-700 whitespace-pre-line">
              {project.description}
            </p>

            {project.liveUrl ? (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800"
                >
                  <span>Bekijk live website</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            ) : null}
          </div>

          {/* Visual Showcase Gallery */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">Beeldmateriaal</h2>
            <div className="grid gap-6">
              {images.map((image, index) => (
                <figure key={image + index} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">
                  <Image
                    src={image}
                    alt={`${project.title} afbeelding ${index + 1}`}
                    width={1200}
                    height={800}
                    className="h-full w-full object-cover"
                  />
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
