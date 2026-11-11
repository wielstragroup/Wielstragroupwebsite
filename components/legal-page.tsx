import type { ReactNode } from "react";

import { Container, Eyebrow } from "@/components/ui/primitives";

type LegalPageProps = {
  title: string;
  updated: string;
  intro?: string;
  children: ReactNode;
};

export function LegalPage({ title, updated, intro, children }: LegalPageProps) {
  return (
    <>
      <section className="border-b border-line">
        <Container className="pb-14 pt-14 sm:pt-20">
          <div className="max-w-3xl">
            <Eyebrow>Juridisch · bijgewerkt {updated}</Eyebrow>
            <h1 className="mt-6 font-display text-[2.4rem] font-semibold leading-[1] tracking-[-0.04em] sm:text-6xl">
              {title}
            </h1>
            {intro ? <p className="mt-6 text-lg leading-relaxed text-muted">{intro}</p> : null}
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <div
            className="max-w-3xl space-y-8
              [&_a]:font-medium [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-2
              [&_h2]:pt-4 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-[-0.02em]
              [&_h3]:mt-5 [&_h3]:text-lg [&_h3]:font-semibold
              [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-ink-2
              [&_table]:mt-4 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm
              [&_td]:border [&_td]:border-line [&_td]:px-3 [&_td]:py-2 [&_td]:align-top
              [&_th]:border [&_th]:border-line [&_th]:bg-paper-2 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold
              [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ul]:leading-relaxed [&_ul]:text-ink-2"
          >
            {children}
          </div>
        </Container>
      </section>
    </>
  );
}
