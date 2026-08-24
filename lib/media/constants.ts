/**
 * Media library — constanten.
 *
 * Deze allowlist staat bewust op drie plekken: in de bucketconfiguratie
 * (`allowed_mime_types`), in de check-constraints op `public.media`, en hier.
 * Bij een wijziging moeten alle drie mee. Dit bestand is de bron voor de
 * applicatiekant.
 */

export const MEDIA_BUCKET = "media";

/** 10 MB. Gelijk aan `file_size_limit` op de bucket en de check op `size_bytes`. */
export const MEDIA_MAX_SIZE_BYTES = 10 * 1024 * 1024;

export const ALLOWED_MEDIA_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export type MediaMimeType = (typeof ALLOWED_MEDIA_MIME_TYPES)[number];

export const ALLOWED_MEDIA_EXTENSIONS = ["jpg", "png", "webp", "avif"] as const;

export type MediaExtension = (typeof ALLOWED_MEDIA_EXTENSIONS)[number];

/** De extensie wordt hieruit afgeleid, nooit uit de aangeleverde bestandsnaam. */
export const MIME_TO_EXTENSION: Record<MediaMimeType, MediaExtension> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

/**
 * Browsers melden soms `image/jpg`. Dat is geen geldig MIME-type maar wel
 * dezelfde inhoud, dus we normaliseren het in plaats van te weigeren.
 */
export const MIME_ALIASES: Record<string, MediaMimeType> = {
  "image/jpg": "image/jpeg",
  "image/pjpeg": "image/jpeg",
  "image/x-png": "image/png",
};

/** Aantal bytes dat minimaal nodig is om betrouwbaar te kunnen sniffen. */
export const MEDIA_SNIFF_MIN_BYTES = 16;

/** Maximale lengte van de bewaarde (gesaneerde) bestandsnaam. */
export const MEDIA_MAX_FILE_NAME_LENGTH = 120;

/** Naam die gebruikt wordt als er na sanitizing niets bruikbaars overblijft. */
export const MEDIA_FALLBACK_FILE_NAME = "afbeelding";

/**
 * Magic bytes van de toegestane formaten.
 * WebP en AVIF hebben een containerstructuur en worden apart afgehandeld in
 * `sniffImageMimeType`; alleen de eenvoudige prefix-signatures staan hier.
 */
export const MEDIA_MAGIC_BYTES: ReadonlyArray<{
  readonly mimeType: MediaMimeType;
  readonly signature: readonly number[];
}> = [
  { mimeType: "image/jpeg", signature: [0xff, 0xd8, 0xff] },
  { mimeType: "image/png", signature: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
];

/**
 * Formaten die we herkennen om een begrijpelijke foutmelding te kunnen geven.
 * Ze zijn allemaal geweigerd; dit is puur diagnostiek.
 */
export const REJECTED_FORMAT_SIGNATURES: ReadonlyArray<{
  readonly label: string;
  readonly signature: readonly number[];
}> = [
  { label: "GIF", signature: [0x47, 0x49, 0x46, 0x38] },
  { label: "PDF", signature: [0x25, 0x50, 0x44, 0x46] },
  { label: "ZIP-archief", signature: [0x50, 0x4b, 0x03, 0x04] },
  { label: "Windows-programma", signature: [0x4d, 0x5a] },
  { label: "ELF-programma", signature: [0x7f, 0x45, 0x4c, 0x46] },
];

export const MEDIA_ERROR_MESSAGES = {
  empty: "Het bestand is leeg.",
  tooLarge: `Het bestand is groter dan ${Math.round(MEDIA_MAX_SIZE_BYTES / (1024 * 1024))} MB.`,
  tooSmall: "Het bestand is te klein om een geldige afbeelding te zijn.",
  unknownType: "Dit bestandstype wordt niet ondersteund. Gebruik JPEG, PNG, WebP of AVIF.",
  rejectedType: "Dit bestandstype is niet toegestaan. Gebruik JPEG, PNG, WebP of AVIF.",
  svg: "SVG-bestanden zijn niet toegestaan.",
  mismatch: "De inhoud van het bestand komt niet overeen met het opgegeven type.",
} as const;
