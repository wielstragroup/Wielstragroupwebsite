import type { ReactNode } from "react";

import { Container, Eyebrow } from "@/components/ui/primitives";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
};

/** Consistente paginakop voor alle subpagina's. */
export function PageHero({ eyebrow, title, intro, children, aside }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="bg-grid mask-fade-b pointer-events-none absolute inset-0" aria-hidden="true" />
      <Container className="relative pb-16 pt-14 sm:pb-24 sm:pt-20 lg:pt-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className={aside ? "lg:col-span-8" : "lg:col-span-10"}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="mt-6 font-display text-[2.6rem] font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-[5.2rem]">
              {title}
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">{intro}</p>
            {children ? <div className="mt-10 flex flex-wrap gap-3">{children}</div> : null}
          </div>
          {aside ? <div className="lg:col-span-4">{aside}</div> : null}
        </div>
      </Container>
    </section>
  );
}
