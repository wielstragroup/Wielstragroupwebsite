"use client";

import Link from "next/link";
import { useState } from "react";

import { ArrowIcon, CheckList } from "@/components/ui/primitives";
import type { ServiceGroup } from "@/lib/content";

/**
 * Interactieve dienstenkiezer. Desktop: lijst links, detail rechts.
 * Mobiel: accordeon, waarbij het detail direct onder de gekozen dienst opent.
 */
export function ServiceExplorer({ groups }: { groups: ServiceGroup[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      <ul className="lg:col-span-5">
        {groups.map((group, i) => {
          const on = i === active;
          return (
            <li key={group.id} className="border-t border-line last:border-b">
              <button
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                aria-expanded={on}
                aria-controls={`service-panel-${group.id}`}
                className="group flex w-full items-center gap-5 py-6 text-left"
              >
                <span
                  className={`font-mono text-xs transition-colors ${on ? "text-signal-ink" : "text-subtle"}`}
                >
                  {group.index}
                </span>
                <span
                  className={`flex-1 font-display text-2xl font-semibold tracking-[-0.03em] transition-all duration-300 sm:text-[2rem] ${
                    on ? "translate-x-1 text-ink" : "text-ink/45 group-hover:text-ink/80"
                  }`}
                >
                  {group.title}
                </span>
                <span
                  aria-hidden="true"
                  className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 ${
                    on ? "rotate-0 border-ink bg-ink text-paper" : "-rotate-45 border-line-strong text-subtle"
                  }`}
                >
                  <ArrowIcon />
                </span>
              </button>
              <div className={`pb-8 lg:hidden ${on ? "block" : "hidden"}`}>
                <ServicePanel group={group} />
              </div>
            </li>
          );
        })}
      </ul>

      <div className="hidden lg:col-span-7 lg:block">
        <div
          key={groups[active].id}
          id={`service-panel-${groups[active].id}`}
          className="animate-page-in sticky top-28 rounded-[1.75rem] border border-line bg-card p-10"
        >
          <ServicePanel group={groups[active]} large />
        </div>
      </div>
    </div>
  );
}

function ServicePanel({ group, large = false }: { group: ServiceGroup; large?: boolean }) {
  return (
    <div>
      <p className={`font-display font-semibold tracking-[-0.02em] ${large ? "text-3xl" : "text-xl"}`}>{group.tagline}</p>
      <div className={`mt-6 grid gap-8 ${large ? "md:grid-cols-2" : ""}`}>
        <div>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-subtle">Het probleem</p>
          <p className="mt-3 leading-relaxed text-muted">{group.problem}</p>
          <p className="mt-6 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-subtle">Wat het oplevert</p>
          <p className="mt-3 leading-relaxed text-ink">{group.outcome}</p>
        </div>
        <div>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-subtle">Wat ik bouw</p>
          <CheckList items={group.build} className="mt-4" />
        </div>
      </div>
      <Link
        href={group.href ?? `/diensten#${group.id}`}
        className="group mt-8 inline-flex items-center gap-2 font-semibold text-ink"
      >
        <span className="link-underline">Meer over {group.title}</span>
        <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
