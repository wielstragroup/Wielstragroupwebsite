import type { Metadata } from "next";

import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { getPublishedProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Bekijk recente websiteprojecten en online opleveringen van Wielstra Group.",
  alternates: { canonical: "/portfolio" },
};

export default async function PortfolioPage() {
  const projects = await getPublishedProjects();

  return (
    <div className="bg-slate-950 text-slate-100">
      {/* Header */}
      <section className="relative border-b border-slate-800 bg-slate-950 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            theme="dark"
            eyebrow="Portfolio"
            title="Recente projecten"
            text="Een overzicht van websites en online oplossingen die we voor ondernemers hebben ontwikkeld."
          />
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="bg-slate-50 py-16 text-slate-900 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {projects.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <p className="text-base text-slate-600">Er zijn momenteel nog geen openbare projecten te tonen.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} theme="light" />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
