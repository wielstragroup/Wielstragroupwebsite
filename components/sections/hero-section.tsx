import Image from "next/image";

import type { SectionContentMap } from "@/lib/sections/schema";
import { safeUrlOrNull } from "@/lib/security";
import type { SiteSettings } from "@/lib/site-settings";

import { ArrowIcon } from "./section-shell";

/**
 * Splitst de titel op het te benadrukken woord, zodat dat woord
 * visueel onderscheiden kan worden zonder HTML in de database op te
 * slaan (en dus zonder XSS-risico).
 */
function renderTitle(title: string, highlight: string) {
  if (!highlight || !title.includes(highlight)) {
    return title;
  }

  const index = title.indexOf(highlight);
  const before = title.slice(0, index);
  const after = title.slice(index + highlight.length);

  return (
    <>
      {before}
      <span className="text-slate-300 underline decoration-slate-600 underline-offset-8">
        {highlight}
      </span>
      {after}
    </>
  );
}

/** Browservenster-mockup rond een afbeelding. */
function BrowserMockup({
  image,
  alt,
  priority = false,
}: {
  image: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-800 sm:h-3 sm:w-3" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-800 sm:h-3 sm:w-3" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-800 sm:h-3 sm:w-3" />
        </div>
        <div className="flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900 px-2 py-1 text-[10px] text-slate-400 sm:px-3 sm:text-xs">
          <svg
            className="h-3 w-3 shrink-0 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span className="truncate">wielstragroup.nl</span>
        </div>
        <div className="w-8 sm:w-12" />
      </div>

      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 92vw, 640px"
          className="object-cover"
          priority={priority}
        />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
      </div>
    </div>
  );
}

/** Telefoon-mockup. */
function PhoneMockup({ image, alt }: { image: string; alt: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-3 py-2 text-[10px] text-slate-400">
        <span className="font-semibold text-slate-300">Mobiel</span>
        <span>Responsive</span>
      </div>
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-slate-950">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 640px) 60vw, 220px"
          className="object-cover"
        />
      </div>
    </div>
  );
}

export function HeroSection({
  content,
  settings,
  fallbackImage,
}: {
  content: SectionContentMap["hero"];
  settings: SiteSettings;
  fallbackImage: string;
}) {
  const desktopImage = content.desktopImage || fallbackImage;
  const mobileImage = content.mobileImage || desktopImage;

  const desktopAlt =
    content.desktopImageAlt || `${settings.companyName} website voorbeeld`;
  const mobileAlt =
    content.mobileImageAlt || `${settings.companyName} mobiele weergave`;

  // CTA's vallen terug op de globale instelling wanneer leeg.
  const primaryLabel = content.primaryCtaLabel || settings.ctaLabel;
  const primaryUrl =
    safeUrlOrNull(content.primaryCtaUrl) ??
    safeUrlOrNull(settings.ctaUrl) ??
    "/contact";
  const secondaryUrl = safeUrlOrNull(content.secondaryCtaUrl);

  return (
    <section className="relative overflow-hidden border-b border-slate-800/80 bg-slate-950 py-14 text-slate-100 sm:py-20 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* Tekstkolom */}
          <div className="space-y-5 sm:space-y-6 lg:col-span-6">
            {content.badge ? (
              <p className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-300 sm:text-xs">
                {content.badge}
              </p>
            ) : null}

            {content.title ? (
              <h1 className="text-[1.75rem] font-extrabold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl xl:leading-[1.12]">
                {renderTitle(content.title, content.highlight)}
              </h1>
            ) : null}

            {content.subtitle ? (
              <p className="max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
                {content.subtitle}
              </p>
            ) : null}

            {/* Op mobiel staan de knoppen onder elkaar en vullen ze de
                breedte; vanaf sm naast elkaar. */}
            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 sm:pt-2">
              {primaryLabel ? (
                <a
                  href={primaryUrl}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-slate-200 active:scale-95 sm:w-auto"
                >
                  <span>{primaryLabel}</span>
                  <ArrowIcon />
                </a>
              ) : null}

              {content.secondaryCtaLabel && secondaryUrl ? (
                <a
                  href={secondaryUrl}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-6 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white sm:w-auto"
                >
                  <span>{content.secondaryCtaLabel}</span>
                </a>
              ) : null}
            </div>
          </div>

          {/* Visualkolom */}
          <div className="lg:col-span-6">
            {/* MOBIEL (< sm): één telefoon-mockup, prominent en gecentreerd.
                Bewust een andere compositie dan desktop in plaats van een
                verkleinde desktopweergave. */}
            <div className="mx-auto w-full max-w-[15rem] sm:hidden">
              <PhoneMockup image={mobileImage} alt={mobileAlt} />
            </div>

            {/* TABLET & DESKTOP: browservenster met overlappende telefoon. */}
            <div className="relative mx-auto hidden max-w-lg sm:block lg:max-w-none">
              <BrowserMockup image={desktopImage} alt={desktopAlt} priority />

              <div className="absolute -bottom-6 -left-4 w-32 md:w-40 lg:-bottom-8 lg:-left-8 lg:w-44">
                <PhoneMockup image={mobileImage} alt={mobileAlt} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
