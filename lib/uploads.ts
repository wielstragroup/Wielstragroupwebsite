/**
 * Centrale regels voor afbeelding-uploads.
 *
 * SVG is bewust NIET toegestaan. De bucket `project-images` is publiek
 * leesbaar; een SVG kan <script> bevatten en wordt door de browser als
 * document uitgevoerd wanneer de URL rechtstreeks bezocht wordt. Dat is
 * een stored-XSS-risico op hetzelfde Supabase-domein.
 *
 * Wil je toch SVG ondersteunen, dan is er sanitization nodig (bijvoorbeeld
 * DOMPurify server-side) plus serveren met een Content-Disposition- of
 * CSP-header. Zolang dat er niet is, blokkeren we het.
 */

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
]);

/** Extensies die bij de toegestane mimetypes horen. */
const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "avif"]);

export const IMAGE_ACCEPT_ATTRIBUTE =
  "image/png,image/jpeg,image/webp,image/avif";

export type UploadValidationResult =
  | { ok: true; extension: string }
  | { ok: false; error: string };

/**
 * Valideert een geüpload bestand op type, extensie en grootte.
 * Zowel mimetype als extensie worden gecontroleerd, zodat een
 * hernoemd bestand niet alsnog doorglipt.
 */
export function validateImageUpload(file: File): UploadValidationResult {
  if (file.size === 0) {
    return { ok: false, error: "Het bestand is leeg." };
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return {
      ok: false,
      error: "Deze afbeelding is te groot. Maximaal 5MB toegestaan.",
    };
  }

  const mimeType = file.type.toLowerCase();

  if (!ALLOWED_IMAGE_TYPES.has(mimeType)) {
    return {
      ok: false,
      error: "Dit bestandstype wordt niet ondersteund. Alleen JPG, PNG, WebP of AVIF.",
    };
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (!ALLOWED_EXTENSIONS.has(extension)) {
    return {
      ok: false,
      error: "De bestandsextensie komt niet overeen met een toegestaan afbeeldingstype.",
    };
  }

  return { ok: true, extension };
}

/**
 * Maakt een veilige, unieke opslagnaam. Voorkomt path traversal en
 * botsingen tussen uploads met dezelfde naam.
 */
export function buildStoragePath(fileName: string, extension: string): string {
  const safeName = fileName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return `${unique}-${safeName || "image"}.${extension}`;
}
