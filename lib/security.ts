/**
 * Gedeelde beveiligingshelpers.
 *
 * Deze module bevat bewust geen React/Next-imports zodat hij overal
 * (server actions, validatie, rendering) gebruikt kan worden.
 */

/** Protocollen die we accepteren voor door beheerders ingevoerde links. */
const SAFE_URL_PROTOCOLS = new Set(["https:", "http:"]);

/** Protocollen die expliciet gevaarlijk zijn (XSS via href). */
const DANGEROUS_URL_PROTOCOLS = new Set([
  "javascript:",
  "data:",
  "vbscript:",
  "file:",
  "blob:",
]);

/**
 * Escapet tekst zodat die veilig in een HTML-context geplaatst kan worden.
 * Gebruik dit voor ALLE door bezoekers ingevoerde tekst die in e-mail of
 * markup terechtkomt.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Escapet tekst en zet regeleindes om naar <br>. Voor meerregelige
 * berichten in e-mails.
 */
export function escapeHtmlMultiline(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, "<br>");
}

/**
 * Verwijdert CR/LF uit waarden die in een e-mailheader terechtkomen
 * (onderwerp, from-naam, reply-to). Voorkomt header-injectie.
 */
export function sanitizeEmailHeader(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

/**
 * Controleert of een URL veilig is om als href te gebruiken.
 * Relatieve links (/contact, #anchor) zijn toegestaan.
 */
export function isSafeUrl(value: string): boolean {
  const trimmed = value.trim();

  if (trimmed === "") {
    return false;
  }

  // Relatieve links en anchors zijn veilig.
  if (trimmed.startsWith("/") || trimmed.startsWith("#")) {
    // Voorkom protocol-relative URLs (//evil.com) die naar extern wijzen.
    return !trimmed.startsWith("//");
  }

  // mailto: en tel: zijn veilig en nuttig voor contactgegevens.
  if (trimmed.startsWith("mailto:") || trimmed.startsWith("tel:")) {
    return !/[\r\n]/.test(trimmed);
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return false;
  }

  const protocol = parsed.protocol.toLowerCase();

  if (DANGEROUS_URL_PROTOCOLS.has(protocol)) {
    return false;
  }

  return SAFE_URL_PROTOCOLS.has(protocol);
}

/**
 * Geeft de URL terug als die veilig is, anders null.
 * Gebruik dit vlak voor het renderen van een href.
 */
export function safeUrlOrNull(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  return isSafeUrl(value) ? value.trim() : null;
}
