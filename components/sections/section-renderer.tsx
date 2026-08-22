import type { HomeSection } from "@/lib/sections/data";
import { parseSectionContent } from "@/lib/sections/schema";
import type { SiteSettings } from "@/lib/site-settings";
import type { Project } from "@/lib/types";

import {
  ContactSection,
  CtaSection,
  FaqSection,
  ImageTextSection,
  PortfolioSection,
  ServicesSection,
  TestimonialsSection,
  TextSection,
  UspSection,
} from "./content-sections";
import { HeroSection } from "./hero-section";

export type SectionRenderContext = {
  settings: SiteSettings;
  /** Uitgelichte projecten voor portfolio-secties. */
  featuredProjects: Project[];
  /** Fallbackafbeelding voor de hero wanneer er geen is ingesteld. */
  fallbackImage: string;
};

/**
 * Rendert één sectie op basis van het type.
 *
 * Elk sectietype heeft hier precies één case. Een nieuw type toevoegen
 * betekent: schema in lib/sections/schema.ts, renderer in
 * content-sections.tsx, en een case hier.
 */
export function SectionRenderer({
  section,
  context,
}: {
  section: HomeSection;
  context: SectionRenderContext;
}) {
  const { settings, featuredProjects, fallbackImage } = context;

  switch (section.type) {
    case "hero":
      return (
        <HeroSection
          content={parseSectionContent("hero", section.content)}
          settings={settings}
          fallbackImage={fallbackImage}
        />
      );

    case "services":
      return (
        <ServicesSection
          content={parseSectionContent("services", section.content)}
        />
      );

    case "portfolio": {
      const content = parseSectionContent("portfolio", section.content);
      return (
        <PortfolioSection
          content={content}
          projects={featuredProjects.slice(0, content.limit)}
        />
      );
    }

    case "usp":
      return <UspSection content={parseSectionContent("usp", section.content)} />;

    case "testimonials":
      return (
        <TestimonialsSection
          content={parseSectionContent("testimonials", section.content)}
        />
      );

    case "text":
      return <TextSection content={parseSectionContent("text", section.content)} />;

    case "image_text":
      return (
        <ImageTextSection
          content={parseSectionContent("image_text", section.content)}
        />
      );

    case "cta":
      return (
        <CtaSection
          content={parseSectionContent("cta", section.content)}
          settings={settings}
        />
      );

    case "faq":
      return <FaqSection content={parseSectionContent("faq", section.content)} />;

    case "contact":
      return (
        <ContactSection
          content={parseSectionContent("contact", section.content)}
          settings={settings}
        />
      );

    default: {
      // Exhaustiveness-check: TypeScript geeft een fout wanneer een
      // nieuw sectietype hier geen case heeft.
      const exhaustive: never = section.type;
      void exhaustive;
      return null;
    }
  }
}
