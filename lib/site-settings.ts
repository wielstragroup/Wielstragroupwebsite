import { cache } from "react";

import { safeUrlOrNull } from "@/lib/security";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { SocialPlatform } from "@/lib/validation";

export type SocialLink = {
  platform: SocialPlatform;
  url: string;
  enabled: boolean;
};

export type SiteSettings = {
  companyName: string;
  logoUrl: string;
  faviconUrl: string;

  email: string;
  phone: string;
  whatsappUrl: string;
  address: string;
  copyrightText: string;

  ctaLabel: string;
  ctaUrl: string;

  defaultSeoTitle: string;
  defaultMetaDescription: string;
  defaultOgImage: string;

  contactFormEnabled: boolean;
  contactFormRecipient: string;
  contactFormSubject: string;
  contactFormSuccessMessage: string;
  contactFormErrorMessage: string;

  socials: SocialLink[];
};

/**
 * Waarden die gebruikt worden wanneer de database niet bereikbaar is
 * of nog niet gemigreerd. Zo blijft de site altijd renderen.
 */
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  companyName: "Wielstra Group",
  logoUrl: "",
  faviconUrl: "",

  email: "",
  phone: "",
  whatsappUrl: "",
  address: "",
  copyrightText: "",

  ctaLabel: "Bespreek je project",
  ctaUrl: "/contact",

  defaultSeoTitle: "Wielstra Group | Websites voor lokale ondernemers",
  defaultMetaDescription:
    "Wielstra Group bouwt moderne websites en online diensten voor lokale ondernemers. Persoonlijk contact, duidelijke communicatie en resultaat.",
  defaultOgImage: "",

  contactFormEnabled: true,
  contactFormRecipient: "",
  contactFormSubject: "Nieuw contactformulier",
  contactFormSuccessMessage: "Bedankt! Je bericht is ontvangen.",
  contactFormErrorMessage: "Er ging iets mis. Probeer het later opnieuw.",

  socials: [],
};

const VALID_PLATFORMS = new Set<string>([
  "instagram",
  "facebook",
  "linkedin",
  "tiktok",
  "youtube",
]);

function text(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

/**
 * Zet de jsonb-kolom om naar een getypeerde lijst. Onbekende platforms
 * en onveilige URL's worden weggefilterd; de database is niet de laatste
 * verdedigingslinie voor wat we in een href zetten.
 */
function mapSocials(raw: unknown): SocialLink[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  const result: SocialLink[] = [];

  for (const entry of raw) {
    if (typeof entry !== "object" || entry === null) {
      continue;
    }

    const record = entry as Record<string, unknown>;
    const platform = text(record.platform);
    const url = text(record.url);

    if (!VALID_PLATFORMS.has(platform)) {
      continue;
    }

    if (!safeUrlOrNull(url)) {
      continue;
    }

    result.push({
      platform: platform as SocialPlatform,
      url,
      enabled: record.enabled !== false,
    });
  }

  return result;
}

function mapSettings(row: Record<string, unknown>): SiteSettings {
  const d = DEFAULT_SITE_SETTINGS;

  return {
    companyName: text(row.company_name, d.companyName) || d.companyName,
    logoUrl: text(row.logo_url),
    faviconUrl: text(row.favicon_url),

    email: text(row.email),
    phone: text(row.phone),
    whatsappUrl: text(row.whatsapp_url),
    address: text(row.address),
    copyrightText: text(row.copyright_text),

    ctaLabel: text(row.cta_label, d.ctaLabel) || d.ctaLabel,
    ctaUrl: text(row.cta_url, d.ctaUrl) || d.ctaUrl,

    defaultSeoTitle: text(row.default_seo_title),
    defaultMetaDescription: text(row.default_meta_description),
    defaultOgImage: text(row.default_og_image),

    contactFormEnabled: row.contact_form_enabled !== false,
    contactFormRecipient: text(row.contact_form_recipient),
    contactFormSubject: text(row.contact_form_subject, d.contactFormSubject),
    contactFormSuccessMessage: text(
      row.contact_form_success_message,
      d.contactFormSuccessMessage,
    ),
    contactFormErrorMessage: text(
      row.contact_form_error_message,
      d.contactFormErrorMessage,
    ),

    socials: mapSocials(row.socials),
  };
}

/**
 * Haalt de globale website-instellingen op.
 *
 * `cache()` zorgt dat dit per request maar één keer gebeurt, ook als
 * header, footer en pagina het allemaal aanroepen.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return DEFAULT_SITE_SETTINGS;
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", true)
    .maybeSingle();

  if (error || !data) {
    return DEFAULT_SITE_SETTINGS;
  }

  return mapSettings(data);
});

/** Alleen ingeschakelde socials met een veilige URL. */
export function getVisibleSocials(settings: SiteSettings): SocialLink[] {
  return settings.socials.filter((social) => social.enabled);
}

/** Labels voor weergave in dashboard en footer. */
export const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  youtube: "YouTube",
};
