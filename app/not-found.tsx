import type { Metadata } from "next";

import { LogoMark } from "@/components/brand/logo";
import { ButtonLink, Container, Eyebrow } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Pagina niet gevonden",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid mask-fade-b pointer-events-none absolute inset-0" aria-hidden="true" />
      <Container className="relative grid gap-12 py-24 sm:py-32 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <Eyebrow>Fout 404</Eyebrow>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-7xl">
            Deze verbinding loopt dood<span className="text-signal">.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
            De pagina die je zoekt bestaat niet (meer) of is verplaatst. Geen zorgen, de rest van het systeem werkt nog
            prima.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/">Naar de homepage</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Neem contact op
            </ButtonLink>
          </div>
        </div>
        <div className="hidden lg:col-span-5 lg:block">
          <LogoMark className="ml-auto h-64 w-64 text-ink/10" accent="var(--color-signal)" />
        </div>
      </Container>
    </section>
  );
}
