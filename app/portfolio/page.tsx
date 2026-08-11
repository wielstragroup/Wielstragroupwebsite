import type { Metadata } from "next";

import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { getPublishedProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Bekijk recente websiteprojecten van Wielstra Group, opgebouwd vanuit het portfolio CMS.",
  alternates: { canonical: "/portfolio" },
};

export default async function PortfolioPage() {
  const projects = await getPublishedProjects();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="sr-only">Portfolio van Wielstra Group</h1>
      <SectionHeading
        eyebrow="Portfolio"
        title="Projecten die direct uit het CMS worden geladen"
        text="Nieuwe projecten verschijnen automatisch zodra ze gepubliceerd zijn in het dashboard."
      />
      {projects.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Er zijn nog geen gepubliceerde projecten.
        </p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}
