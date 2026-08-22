import { z } from "zod";

import { safeUrlSchema } from "@/lib/validation";

/**
 * Sectietypes en hun contentschema's.
 *
 * Een nieuw sectietype toevoegen kost drie stappen:
 *   1. Voeg de waarde toe aan de enum in de database-migratie.
 *   2. Voeg hier een schema + entry in SECTION_DEFINITIONS toe.
 *   3. Voeg een renderer toe in components/sections/.
 */

export const SECTION_TYPES = [
  "hero",
  "services",
  "portfolio",
  "usp",
  "testimonials",
  "text",
  "image_text",
  "cta",
  "faq",
  "contact",
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];

/** Licht of donker gekleurde sectie. */
export const themeSchema = z.enum(["light", "dark"]).catch("light");

/** Korte tekstvelden die overal terugkomen. */
const title = z.string().trim().max(200).catch("");
const longText = z.string().trim().max(2000).catch("");
const label = z.string().trim().max(120).catch("");
const url = safeUrlSchema.catch("");
const image = z.string().trim().max(2000).catch("");

// ---------------------------------------------------------------------
// Per-type contentschema's
// ---------------------------------------------------------------------

export const heroContentSchema = z.object({
  badge: label,
  title: title,
  /** Woord in de titel dat visueel benadrukt wordt. */
  highlight: label,
  subtitle: longText,
  primaryCtaLabel: label,
  primaryCtaUrl: url,
  secondaryCtaLabel: label,
  secondaryCtaUrl: url,
  desktopImage: image,
  desktopImageAlt: label,
  mobileImage: image,
  mobileImageAlt: label,
});

const serviceItemSchema = z.object({
  title: title,
  subtitle: label,
  description: longText,
  ctaLabel: label,
  ctaUrl: url,
  highlights: z.array(z.string().trim().max(160)).max(8).catch([]),
});

export const servicesContentSchema = z.object({
  eyebrow: label,
  title: title,
  text: longText,
  theme: themeSchema,
  items: z.array(serviceItemSchema).max(12).catch([]),
});

const uspItemSchema = z.object({
  label: label,
  title: title,
  description: longText,
});

export const uspContentSchema = z.object({
  eyebrow: label,
  title: title,
  text: longText,
  theme: themeSchema,
  items: z.array(uspItemSchema).max(12).catch([]),
});

export const portfolioContentSchema = z.object({
  eyebrow: label,
  title: title,
  text: longText,
  theme: themeSchema,
  limit: z.coerce.number().int().min(1).max(12).catch(3),
  ctaLabel: label,
  ctaUrl: url,
  emptyText: longText,
});

const testimonialItemSchema = z.object({
  quote: longText,
  author: label,
  role: label,
});

export const testimonialsContentSchema = z.object({
  eyebrow: label,
  title: title,
  text: longText,
  theme: themeSchema,
  items: z.array(testimonialItemSchema).max(12).catch([]),
});

export const textContentSchema = z.object({
  eyebrow: label,
  title: title,
  text: z.string().trim().max(6000).catch(""),
  theme: themeSchema,
  align: z.enum(["left", "center"]).catch("center"),
});

export const imageTextContentSchema = z.object({
  eyebrow: label,
  title: title,
  text: z.string().trim().max(4000).catch(""),
  theme: themeSchema,
  image: image,
  imageAlt: label,
  /** Kant waar de afbeelding staat op desktop. */
  imagePosition: z.enum(["left", "right"]).catch("right"),
  ctaLabel: label,
  ctaUrl: url,
});

export const ctaContentSchema = z.object({
  title: title,
  text: longText,
  theme: themeSchema,
  /** Leeg = de globale CTA uit de website-instellingen. */
  ctaLabel: label,
  ctaUrl: url,
});

const faqItemSchema = z.object({
  question: title,
  answer: longText,
});

export const faqContentSchema = z.object({
  eyebrow: label,
  title: title,
  text: longText,
  theme: themeSchema,
  items: z.array(faqItemSchema).max(20).catch([]),
});

export const contactContentSchema = z.object({
  eyebrow: label,
  title: title,
  text: longText,
  theme: themeSchema,
  /** Toont e-mail/telefoon uit de website-instellingen. */
  showContactDetails: z.boolean().catch(true),
  ctaLabel: label,
  ctaUrl: url,
});

// ---------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------

export const SECTION_SCHEMAS = {
  hero: heroContentSchema,
  services: servicesContentSchema,
  portfolio: portfolioContentSchema,
  usp: uspContentSchema,
  testimonials: testimonialsContentSchema,
  text: textContentSchema,
  image_text: imageTextContentSchema,
  cta: ctaContentSchema,
  faq: faqContentSchema,
  contact: contactContentSchema,
} as const;

export type SectionContentMap = {
  [K in SectionType]: z.infer<(typeof SECTION_SCHEMAS)[K]>;
};

/** Menselijke namen voor het dashboard. */
export const SECTION_LABELS: Record<SectionType, string> = {
  hero: "Hero",
  services: "Diensten",
  portfolio: "Portfolio",
  usp: "USP's",
  testimonials: "Reviews",
  text: "Tekst",
  image_text: "Tekst met afbeelding",
  cta: "Call-to-action",
  faq: "Veelgestelde vragen",
  contact: "Contact",
};

export const SECTION_DESCRIPTIONS: Record<SectionType, string> = {
  hero: "Grote openingssectie met titel, tekst en knoppen.",
  services: "Overzicht van je diensten in kaarten.",
  portfolio: "Toont uitgelichte projecten uit je portfolio.",
  usp: "Korte punten waarom klanten voor jou kiezen.",
  testimonials: "Citaten van klanten.",
  text: "Vrije tekstsectie.",
  image_text: "Afbeelding naast tekst.",
  cta: "Afsluitende oproep met knop.",
  faq: "Vraag-en-antwoordlijst.",
  contact: "Contactgegevens en een knop.",
};

/**
 * Lege basiswaarden per sectietype.
 *
 * Deze worden onder de opgeslagen content gelegd voordat we parsen.
 * Daardoor is het resultaat ook correct wanneer een sleutel volledig
 * ontbreekt (bijvoorbeeld na het toevoegen van een nieuw veld aan een
 * bestaand sectietype), zonder afhankelijk te zijn van hoe `.catch()`
 * met `undefined` omgaat.
 */
const SECTION_CONTENT_BASE: Record<SectionType, Record<string, unknown>> = {
  hero: {
    badge: "",
    title: "",
    highlight: "",
    subtitle: "",
    primaryCtaLabel: "",
    primaryCtaUrl: "",
    secondaryCtaLabel: "",
    secondaryCtaUrl: "",
    desktopImage: "",
    desktopImageAlt: "",
    mobileImage: "",
    mobileImageAlt: "",
  },
  services: { eyebrow: "", title: "", text: "", theme: "light", items: [] },
  portfolio: {
    eyebrow: "",
    title: "",
    text: "",
    theme: "light",
    limit: 3,
    ctaLabel: "",
    ctaUrl: "",
    emptyText: "",
  },
  usp: { eyebrow: "", title: "", text: "", theme: "dark", items: [] },
  testimonials: { eyebrow: "", title: "", text: "", theme: "light", items: [] },
  text: { eyebrow: "", title: "", text: "", theme: "light", align: "center" },
  image_text: {
    eyebrow: "",
    title: "",
    text: "",
    theme: "light",
    image: "",
    imageAlt: "",
    imagePosition: "right",
    ctaLabel: "",
    ctaUrl: "",
  },
  cta: { title: "", text: "", theme: "dark", ctaLabel: "", ctaUrl: "" },
  faq: { eyebrow: "", title: "", text: "", theme: "light", items: [] },
  contact: {
    eyebrow: "",
    title: "",
    text: "",
    theme: "light",
    showContactDetails: true,
    ctaLabel: "",
    ctaUrl: "",
  },
};

/**
 * Parset onbekende jsonb-content naar een getypeerd object.
 *
 * Ontbrekende sleutels worden aangevuld met lege basiswaarden en elk
 * veld heeft een `.catch()`, dus corrupte of onvolledige content levert
 * nooit een crash op maar een veilig leeg veld.
 */
export function parseSectionContent<T extends SectionType>(
  type: T,
  raw: unknown,
): SectionContentMap[T] {
  const schema = SECTION_SCHEMAS[type];
  const stored = typeof raw === "object" && raw !== null ? raw : {};
  const input = { ...SECTION_CONTENT_BASE[type], ...stored };

  const result = schema.safeParse(input);

  if (result.success) {
    return result.data as SectionContentMap[T];
  }

  // Laatste vangnet: parse de kale basis, die per definitie geldig is.
  return schema.parse(SECTION_CONTENT_BASE[type]) as SectionContentMap[T];
}

/** Lege content voor een nieuw aangemaakte sectie. */
export function emptySectionContent<T extends SectionType>(
  type: T,
): SectionContentMap[T] {
  return parseSectionContent(type, {});
}

export function isSectionType(value: string): value is SectionType {
  return (SECTION_TYPES as readonly string[]).includes(value);
}
