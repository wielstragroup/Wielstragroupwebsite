import { LogoMark } from "@/components/brand/logo";
import { ButtonLink, Container } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

type CtaBandProps = {
  title?: string;
  text?: string;
};

export function CtaBand({
  title = "Vertel me waar het nu schuurt.",
  text = "In een kennismakingsgesprek van een half uur kijk ik met je mee naar je situatie. Je krijgt een eerlijk beeld van wat er mogelijk is, ook als blijkt dat je helemaal geen maatwerk nodig hebt.",
}: CtaBandProps) {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-14 text-white sm:px-12 sm:py-20 lg:px-16">
          <div className="bg-grid-dark pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
          <LogoMark
            className="pointer-events-none absolute -bottom-16 -right-10 h-72 w-72 text-white/[0.05] sm:h-96 sm:w-96"
            accent="rgb(232 67 26 / 0.5)"
          />
          <div className="relative max-w-3xl">
            <h2 className="font-display text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl">{title}</h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">{text}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/contact?type=kennismaking" variant="light">
                Plan een kennismaking
              </ButtonLink>
              <ButtonLink href="/contact?type=offerte" variant="ghost-light">
                Vraag een offerte aan
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
