import Link from "next/link";
import Image from "next/image";

import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="aspect-[16/10] w-full bg-slate-100">
        <Image
          src={project.image}
          alt={`${project.title} preview`}
          width={800}
          height={500}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="space-y-3 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{project.category}</p>
        <h3 className="text-xl font-semibold text-slate-950">{project.title}</h3>
        <p className="text-sm leading-6 text-slate-600">{project.shortDescription}</p>
        <Link href={`/portfolio/${project.slug}`} className="inline-flex text-sm font-semibold text-slate-900 underline-offset-4 hover:underline">
          Bekijk project
        </Link>
      </div>
    </article>
  );
}
