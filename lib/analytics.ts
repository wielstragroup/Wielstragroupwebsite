import { createHash, randomBytes } from "crypto";

/**
 * Salt die dagelijks automatisch roteert (alleen in het geheugen).
 * Hierdoor is een bezoeker binnen één dag als "uniek" te herkennen,
 * maar nooit over meerdere dagen heen te volgen — en wordt er nergens
 * een IP-adres opgeslagen. Zelfde aanpak als privacyvriendelijke
 * analytics-tools zoals Plausible.
 */
let cachedSalt: { day: string; value: string } | null = null;

function getDailySalt(): string {
  const day = new Date().toISOString().slice(0, 10);

  if (cachedSalt?.day !== day) {
    cachedSalt = { day, value: randomBytes(16).toString("hex") };
  }

  return cachedSalt.value;
}

/** Onomkeerbare, dagelijks roterende hash — nooit herleidbaar tot een IP-adres. */
export function hashVisitor(ip: string, userAgent: string): string {
  const salt = getDailySalt();
  return createHash("sha256").update(`${salt}:${ip}:${userAgent}`).digest("hex");
}
