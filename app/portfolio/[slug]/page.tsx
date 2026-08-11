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
    <section className="mx-auto w-full max-w-4xl space-y-8 px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/portfolio" className="text-sm font-medium text-slate-600 hover:text-slate-900">
        ← Terug naar portfolio
      </Link>
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">{project.category}</p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">{project.title}</h1>
        <p className="text-base text-slate-600">Voor {project.client}</p>
        <p className="text-lg leading-8 text-slate-700">{project.description}</p>
      </header>

      <div className="grid gap-4">
        {images.map((image, index) => (
          <figure key={image + index} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
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

      {project.liveUrl ? (
        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">
          Bekijk live website
        </a>
      ) : null}
    </section>
  );
}
