/**
 * Media library — validatie.
 *
 * Puur en synchroon: geen Next, geen Supabase, geen I/O. Alles werkt op een
 * `Uint8Array`, zodat dit bestand volledig unit-testbaar is met kale Node.
 *
 * Uitgangspunt: de client is niet te vertrouwen. Het echte type komt uit de
 * bytes, de extensie wordt daaruit afgeleid, en de aangeleverde bestandsnaam
 * wordt uitsluitend als metadata bewaard — nooit als pad.
 */

import {
  ALLOWED_MEDIA_MIME_TYPES,
  MEDIA_ERROR_MESSAGES,
  MEDIA_FALLBACK_FILE_NAME,
  MEDIA_MAGIC_BYTES,
  MEDIA_MAX_FILE_NAME_LENGTH,
  MEDIA_MAX_SIZE_BYTES,
  MEDIA_SNIFF_MIN_BYTES,
  MIME_ALIASES,
  MIME_TO_EXTENSION,
  REJECTED_FORMAT_SIGNATURES,
  type MediaExtension,
  type MediaMimeType,
} from "@/lib/media/constants";

export type MediaValidationErrorCode =
  | "empty"
  | "too_large"
  | "too_small"
  | "unknown_type"
  | "rejected_type"
  | "svg"
  | "mime_mismatch";

export type MediaValidationResult =
  | {
      ok: true;
      mimeType: MediaMimeType;
      extension: MediaExtension;
      sizeBytes: number;
      fileName: string;
    }
  | {
      ok: false;
      code: MediaValidationErrorCode;
      message: string;
    };

/** Wat er uit de bytes komt: een toegestaan type, of een herkend-maar-geweigerd formaat. */
export type SniffResult =
  | { kind: "allowed"; mimeType: MediaMimeType }
  | { kind: "rejected"; label: string }
  | { kind: "svg" }
  | { kind: "unknown" };

function startsWith(bytes: Uint8Array, signature: readonly number[], offset = 0): boolean {
  if (bytes.length < offset + signature.length) {
    return false;
  }

  for (let i = 0; i < signature.length; i += 1) {
    if (bytes[offset + i] !== signature[i]) {
      return false;
    }
  }

  return true;
}

function readAscii(bytes: Uint8Array, offset: number, length: number): string {
  if (bytes.length < offset + length) {
    return "";
  }

  let result = "";
  for (let i = 0; i < length; i += 1) {
    result += String.fromCharCode(bytes[offset + i]);
  }

  return result;
}

function isWebp(bytes: Uint8Array): boolean {
  // RIFF....WEBP
  return readAscii(bytes, 0, 4) === "RIFF" && readAscii(bytes, 8, 4) === "WEBP";
}

/**
 * AVIF is een ISO-BMFF-container. Het `ftyp`-vak staat vooraan en bevat een
 * major brand plus een lijst compatible brands; `avif` mag in beide staan.
 */
function isAvif(bytes: Uint8Array): boolean {
  if (readAscii(bytes, 4, 4) !== "ftyp") {
    return false;
  }

  const avifBrands = new Set(["avif", "avis"]);

  if (avifBrands.has(readAscii(bytes, 8, 4))) {
    return true;
  }

  // Compatible brands: 4 bytes per stuk, vanaf offset 16 tot het einde van het vak.
  const boxSize = (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
  const limit = Math.min(boxSize > 0 ? boxSize : bytes.length, bytes.length);

  for (let offset = 16; offset + 4 <= limit; offset += 4) {
    if (avifBrands.has(readAscii(bytes, offset, 4))) {
      return true;
    }
  }

  return false;
}

function looksLikeSvgOrMarkup(bytes: Uint8Array): boolean {
  // Voorloopwhitespace en een BOM overslaan, dan kijken of het markup is.
  let offset = 0;

  if (startsWith(bytes, [0xef, 0xbb, 0xbf])) {
    offset = 3;
  }

  while (offset < bytes.length && bytes[offset] <= 0x20) {
    offset += 1;
  }

  if (bytes[offset] !== 0x3c) {
    return false;
  }

  const head = readAscii(bytes, offset, Math.min(512, bytes.length - offset)).toLowerCase();

  return head.includes("<svg") || head.startsWith("<?xml") || head.startsWith("<!doctype") || head.startsWith("<html");
}

/**
 * Bepaalt het werkelijke type op basis van de eerste bytes.
 * De door de browser gemelde MIME speelt hier geen enkele rol.
 */
export function sniffImageMimeType(bytes: Uint8Array): SniffResult {
  if (bytes.length < MEDIA_SNIFF_MIN_BYTES) {
    return { kind: "unknown" };
  }

  for (const { mimeType, signature } of MEDIA_MAGIC_BYTES) {
    if (startsWith(bytes, signature)) {
      return { kind: "allowed", mimeType };
    }
  }

  if (isWebp(bytes)) {
    return { kind: "allowed", mimeType: "image/webp" };
  }

  if (isAvif(bytes)) {
    return { kind: "allowed", mimeType: "image/avif" };
  }

  if (looksLikeSvgOrMarkup(bytes)) {
    return { kind: "svg" };
  }

  for (const { label, signature } of REJECTED_FORMAT_SIGNATURES) {
    if (startsWith(bytes, signature)) {
      return { kind: "rejected", label };
    }
  }

  return { kind: "unknown" };
}

function normalizeReportedMimeType(reported: string | null | undefined): string {
  const value = (reported ?? "").trim().toLowerCase().split(";")[0];

  return MIME_ALIASES[value] ?? value;
}

/**
 * Maakt een aangeleverde bestandsnaam veilig om op te slaan als metadata.
 * Deze waarde wordt nooit als pad gebruikt; dit voorkomt vooral rare
 * weergave, misleidende namen en opslagproblemen.
 */
export function sanitizeFileName(raw: string | null | undefined): string {
  if (typeof raw !== "string") {
    return MEDIA_FALLBACK_FILE_NAME;
  }

  let name = raw.normalize("NFC");

  // Alles vóór de laatste padscheider weggooien.
  name = name.split(/[\\/]/).pop() ?? "";

  // Control chars, zero-width en bidi-overrides (o.a. de RLO-truc).
  // eslint-disable-next-line no-control-regex
  name = name.replace(/[\u0000-\u001f\u007f]/g, "");
  name = name.replace(/[\u200b-\u200f\u202a-\u202e\u2066-\u2069\ufeff]/g, "");

  // Tekens die op diverse bestandssystemen problemen geven.
  name = name.replace(/[<>:"|?*]/g, "");

  // Whitespace normaliseren.
  name = name.replace(/\s+/g, " ").trim();

  // Geen naam die alleen uit punten bestaat of ermee begint.
  name = name.replace(/^\.+/, "").trim();

  if (name === "") {
    return MEDIA_FALLBACK_FILE_NAME;
  }

  if (name.length > MEDIA_MAX_FILE_NAME_LENGTH) {
    name = name.slice(0, MEDIA_MAX_FILE_NAME_LENGTH).trim();
  }

  return name === "" ? MEDIA_FALLBACK_FILE_NAME : name;
}

export type ValidateMediaUploadInput = {
  bytes: Uint8Array;
  /** Het type dat de browser meldt. Alleen gebruikt voor de mismatch-check. */
  reportedMimeType?: string | null;
  fileName?: string | null;
};

/**
 * De poort. Volgorde is bewust: eerst goedkope checks, dan pas sniffen.
 * Gooit nooit; de aanroeper matcht op `ok`.
 */
export function validateMediaUpload({
  bytes,
  reportedMimeType,
  fileName,
}: ValidateMediaUploadInput): MediaValidationResult {
  const sizeBytes = bytes.byteLength;

  if (sizeBytes === 0) {
    return { ok: false, code: "empty", message: MEDIA_ERROR_MESSAGES.empty };
  }

  if (sizeBytes > MEDIA_MAX_SIZE_BYTES) {
    return { ok: false, code: "too_large", message: MEDIA_ERROR_MESSAGES.tooLarge };
  }

  if (sizeBytes < MEDIA_SNIFF_MIN_BYTES) {
    return { ok: false, code: "too_small", message: MEDIA_ERROR_MESSAGES.tooSmall };
  }

  const sniffed = sniffImageMimeType(bytes);

  if (sniffed.kind === "svg") {
    return { ok: false, code: "svg", message: MEDIA_ERROR_MESSAGES.svg };
  }

  if (sniffed.kind === "rejected") {
    return {
      ok: false,
      code: "rejected_type",
      message: `${sniffed.label}-bestanden zijn niet toegestaan. Gebruik JPEG, PNG, WebP of AVIF.`,
    };
  }

  if (sniffed.kind === "unknown") {
    return { ok: false, code: "unknown_type", message: MEDIA_ERROR_MESSAGES.unknownType };
  }

  const reported = normalizeReportedMimeType(reportedMimeType);

  if (reported !== "" && reported !== sniffed.mimeType) {
    return { ok: false, code: "mime_mismatch", message: MEDIA_ERROR_MESSAGES.mismatch };
  }

  return {
    ok: true,
    mimeType: sniffed.mimeType,
    extension: MIME_TO_EXTENSION[sniffed.mimeType],
    sizeBytes,
    fileName: sanitizeFileName(fileName),
  };
}

export type BuildMediaStoragePathOptions = {
  /** Injecteerbaar voor deterministische tests. */
  date?: Date;
  uuid?: string;
};

/**
 * `YYYY/MM/<uuid>.<ext>` — er komt geen door de gebruiker aangeleverde tekst
 * in het pad voor. Path traversal is daarmee structureel onmogelijk.
 */
export function buildMediaStoragePath(
  extension: MediaExtension,
  options: BuildMediaStoragePathOptions = {},
): string {
  const date = options.date ?? new Date();
  const uuid = options.uuid ?? crypto.randomUUID();

  const year = String(date.getUTCFullYear()).padStart(4, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");

  return `${year}/${month}/${uuid}.${extension}`;
}

/** Type guard, handig bij het lezen van waarden uit de database. */
export function isAllowedMediaMimeType(value: string): value is MediaMimeType {
  return (ALLOWED_MEDIA_MIME_TYPES as readonly string[]).includes(value);
}
