import Image from "next/image";
import Link from "next/link";

import { ArrowIcon } from "@/components/ui/primitives";
import type { Project } from "@/lib/types";

type ProjectCardProps = {
  project: Project;
  index?: number;
  /** Groot formaat voor uitgelichte projecten. */
  feature?: boolean;
  priority?: boolean;
};

export function ProjectCard({ project, index, feature = false, priority = false }: ProjectCardProps) {
  const year = project.date ? new Date(project.date).getFullYear() : null;

  return (
    <article className="group relative">
      <Link href={`/portfolio/${project.slug}`} className="block focus-visible:outline-none">
        <div
          className={`relative overflow-hidden rounded-[1.5rem] border border-line bg-paper-2 ${
            feature ? "aspect-[16/10]" : "aspect-[4/3]"
          } group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-signal`}
        >
          <Image
            src={project.image}
            alt={`Beeld van project ${project.title}`}
            fill
            priority={priority}
            sizes={feature ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute left-4 top-4 flex gap-2">
            <span className="rounded-full bg-paper/90 px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink backdrop-blur">
              {project.category}
            </span>
          </div>
          <span className="absolute bottom-4 right-4 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-ink text-paper opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowIcon />
          </span>
        </div>
        <div className="mt-5 flex items-start justify-between gap-6">
          <div>
            <h3 className={`font-display font-semibold tracking-[-0.03em] ${feature ? "text-3xl" : "text-2xl"}`}>
              {project.title}
            </h3>
            <p className="mt-2 max-w-xl leading-relaxed text-muted">{project.shortDescription}</p>
          </div>
          <p className="shrink-0 pt-1.5 font-mono text-xs text-subtle">
            {typeof index === "number" ? String(index + 1).padStart(2, "0") : null}
            {year ? ` / ${year}` : null}
          </p>
        </div>
      </Link>
    </article>
  );
}
