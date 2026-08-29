import Link from "next/link";

import { safeUrlOrNull } from "@/lib/security";
import {
  getSiteSettings,
  getVisibleSocials,
  SOCIAL_LABELS,
} from "@/lib/site-settings";

const SOCIAL_ICONS: Record<string, string> = {
  instagram:
    "M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 5.4a4.4 4.4 0 100 8.8 4.4 4.4 0 000-8.8zm0 7.2a2.8 2.8 0 110-5.6 2.8 2.8 0 010 5.6zm5.6-7.4a1 1 0 11-2 0 1 1 0 012 0z",
  facebook:
    "M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0022 12z",
  linkedin:
    "M4.98 3.5a2.5 2.5 0 11-.01 5 2.5 2.5 0 01.01-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 5.9V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21H9z",
  tiktok:
    "M16.5 2h-3v13.5a2.5 2.5 0 11-2.5-2.5c.2 0 .4 0 .5.1V10a5.5 5.5 0 102 4.3V8.6a6.6 6.6 0 003.9 1.3V6.8a3.8 3.8 0 01-2.9-3z",
  youtube:
    "M21.6 7.2a2.5 2.5 0 00-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 002.4 7.2 26 26 0 002 12a26 26 0 00.4 4.8 2.5 2.5 0 001.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 001.8-1.8A26 26 0 0022 12a26 26 0 00-.4-4.8zM10 15V9l5.2 3z",
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/diensten", label: "Diensten" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/over", label: "Over" },
  { href: "/contact", label: "Contact" },
];

const serviceLabels = [
  "Website bouwen",
  "Website verbeteren",
  "Website onderhoud",
  "Online zichtbaarheid",
];

const legalLinks = [
  { href: "/privacybeleid", label: "Privacybeleid" },
  { href: "/cookiebeleid", label: "Cookiebeleid" },
  { href: "/algemene-voorwaarden", label: "Algemene voorwaarden" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export async function SiteFooter() {
  const settings = await getSiteSettings();
  const socials = getVisibleSocials(settings);

  const ctaUrl = safeUrlOrNull(settings.ctaUrl) ?? "/contact";
  const whatsappUrl = safeUrlOrNull(settings.whatsappUrl);

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold tracking-tight text-white"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/20 text-blue-500 ring-1 ring-blue-500/30">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </span>
              <span>{settings.companyName}</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Professionele websites en online diensten voor lokale ondernemers.
              Persoonlijk contact, korte lijnen en een strak resultaat.
            </p>

            {socials.length > 0 ? (
              <ul className="flex flex-wrap items-center gap-2 pt-1">
                {socials.map((social) => {
                  const href = safeUrlOrNull(social.url);
                  if (!href) {
                    return null;
                  }

                  return (
                    <li key={social.platform}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={SOCIAL_LABELS[social.platform]}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition hover:border-slate-700 hover:text-white"
                      >
                        <svg
                          className="h-4 w-4 fill-current"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d={SOCIAL_ICONS[social.platform]} />
                        </svg>
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          {/* Navigatie */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-200">
              Navigatie
            </p>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Diensten */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-200">
              Diensten
            </p>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {serviceLabels.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Contact
            </p>

            <ul className="space-y-2 text-sm text-slate-400">
              {settings.email ? (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="transition hover:text-white"
                  >
                    {settings.email}
                  </a>
                </li>
              ) : null}
              {settings.phone ? (
                <li>
                  <a
                    href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                    className="transition hover:text-white"
                  >
                    {settings.phone}
                  </a>
                </li>
              ) : null}
              {whatsappUrl ? (
                <li>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-white"
                  >
                    WhatsApp
                  </a>
                </li>
              ) : null}
              {settings.address ? (
                <li className="whitespace-pre-line">{settings.address}</li>
              ) : null}
            </ul>

            <div>
              <Link
                href={ctaUrl}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:border-blue-500/50 hover:bg-slate-800 hover:text-blue-400"
              >
                <span>{settings.ctaLabel}</span>
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-800/60 pt-8 text-center text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>
            © {new Date().getFullYear()} {settings.companyName}.{" "}
            {settings.copyrightText || "Alle rechten voorbehouden."}
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-end">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
