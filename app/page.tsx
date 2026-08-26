import type { Metadata } from "next";

import {
  SectionRenderer,
  type SectionRenderContext,
} from "@/components/sections/section-renderer";
import { getEnabledHomeSections } from "@/lib/sections/data";
import { getFeaturedProjects } from "@/lib/projects";
import { safeUrlOrNull } from "@/lib/security";
import { getSiteSettings } from "@/lib/site-settings";

const FALLBACK_IMAGE = "/placeholders/alaregina-main.svg";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  const title =
    settings.defaultSeoTitle ||
    `${settings.companyName} | Websites voor lokale ondernemers`;

  const ogImage = safeUrlOrNull(settings.defaultOgImage);

  return {
    title: {
      absolute: title,
    },
    description: settings.defaultMetaDescription || undefined,
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description: settings.defaultMetaDescription || undefined,
      url: "/",
      type: "website",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default async function Home() {
  // Parallel ophalen: deze queries zijn onafhankelijk van elkaar.
  const [sections, settings, featuredProjects] = await Promise.all([
    getEnabledHomeSections(),
    getSiteSettings(),
    // Ruim genoeg voor elke portfolio-sectie; het schema begrenst limit op 12.
    getFeaturedProjects(12),
  ]);

  const context: SectionRenderContext = {
    settings,
    featuredProjects,
    fallbackImage: featuredProjects[0]?.image ?? FALLBACK_IMAGE,
  };

  // Wanneer de migratie nog niet is uitgevoerd of de database niet
  // bereikbaar is, tonen we een nette minimale pagina in plaats van
  // een lege body.
  if (sections.length === 0) {
    return (
      <div className="bg-slate-950">
        <section className="mx-auto w-full max-w-3xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            {settings.companyName}
          </h1>
          <p className="mt-4 text-base text-slate-300 sm:text-lg">
            {settings.defaultMetaDescription ||
              "Professionele websites en online diensten voor lokale ondernemers."}
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href={safeUrlOrNull(settings.ctaUrl) ?? "/contact"}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              {settings.ctaLabel}
            </a>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-slate-950">
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} context={context} />
      ))}
    </div>
  );
}
