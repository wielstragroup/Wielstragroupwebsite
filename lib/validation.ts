import { z } from "zod";

import { isSafeUrl } from "@/lib/security";

/**
 * Herbruikbaar schema voor een door de beheerder ingevoerde link.
 * Staat relatieve links, https/http, mailto: en tel: toe.
 * Blokkeert javascript:, data:, vbscript: enzovoort.
 */
export const safeUrlSchema = z
  .string()
  .trim()
  .max(2000)
  .refine((value) => value === "" || isSafeUrl(value), {
    message: "Ongeldige of onveilige URL.",
  });

/** Optionele link: lege waarde wordt null. */
export const optionalSafeUrlSchema = safeUrlSchema.transform((value) =>
  value === "" ? null : value,
);

export const projectSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(140)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  client: z.string().trim().min(2).max(120),
  shortDescription: z.string().trim().min(12).max(220),
  description: z.string().trim().min(20),
  category: z.string().trim().min(2).max(80),
  image: z.string().trim().min(1),
  additionalImages: z.array(z.string().trim()).max(10),
  liveUrl: optionalSafeUrlSchema,
  date: z.string().date(),
  featured: z.boolean(),
  published: z.boolean(),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  companyName: z.string().trim().max(120),
  email: z.string().trim().email().max(160),
  message: z.string().trim().min(20).max(3000),
  website: z.string().optional(),
});

/** Ondersteunde social-platforms in de website-instellingen. */
export const SOCIAL_PLATFORMS = [
  "instagram",
  "facebook",
  "linkedin",
  "tiktok",
  "youtube",
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export const socialLinkSchema = z.object({
  platform: z.enum(SOCIAL_PLATFORMS),
  url: safeUrlSchema,
  enabled: z.boolean(),
});

export const siteSettingsSchema = z.object({
  companyName: z.string().trim().min(1).max(120),
  logoUrl: safeUrlSchema,
  faviconUrl: safeUrlSchema,
  email: z.string().trim().email().max(160).or(z.literal("")),
  phone: z.string().trim().max(40),
  whatsappUrl: safeUrlSchema,
  address: z.string().trim().max(300),
  copyrightText: z.string().trim().max(200),

  ctaLabel: z.string().trim().max(80),
  ctaUrl: safeUrlSchema,

  defaultSeoTitle: z.string().trim().max(120),
  defaultMetaDescription: z.string().trim().max(300),
  defaultOgImage: safeUrlSchema,

  contactFormEnabled: z.boolean(),
  contactFormRecipient: z.string().trim().email().max(160).or(z.literal("")),
  contactFormSubject: z.string().trim().max(150),
  contactFormSuccessMessage: z.string().trim().max(300),
  contactFormErrorMessage: z.string().trim().max(300),

  socials: z.array(socialLinkSchema).max(SOCIAL_PLATFORMS.length),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
