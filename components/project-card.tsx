import Link from "next/link";
import Image from "next/image";

import type { Project } from "@/lib/types";

export function ProjectCard({ project, theme = "light" }: { project: Project; theme?: "dark" | "light" }) {
  const isDark = theme === "dark";

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 ${
        isDark
          ? "border-slate-800 bg-slate-900/80 hover:-translate-y-1 hover:border-slate-700 hover:shadow-xl"
          : "border-slate-200/80 bg-white hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50"
      }`}
    >
      {/* Image Preview Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Image
          src={project.image}
          alt={`${project.title} preview`}
          width={800}
          height={500}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Category Tag */}
        <div className="absolute left-4 top-4">
          <span className="inline-flex items-center rounded-lg border border-white/20 bg-slate-950/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            {project.category}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="space-y-2">
          <h3 className={`text-xl font-bold tracking-tight transition-colors ${
            isDark ? "text-white group-hover:text-slate-200" : "text-slate-950 group-hover:text-slate-800"
          }`}>
            {project.title}
          </h3>
          <p className={`line-clamp-2 text-sm leading-relaxed ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}>
            {project.shortDescription}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800/20">
          <Link
            href={`/portfolio/${project.slug}`}
            className={`inline-flex items-center gap-2 text-sm font-semibold transition-all ${
              isDark
                ? "text-slate-200 group-hover:text-white"
                : "text-slate-900 group-hover:text-slate-950"
            }`}
          >
            <span>Bekijk project</span>
            <svg
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
