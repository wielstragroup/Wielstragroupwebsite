import type { ReactNode } from "react";

export type SectionTheme = "light" | "dark";

/**
 * Gedeelde omhulling voor alle secties. Zorgt voor consistente
 * verticale ritmiek, kleurthema en containerbreedte, zodat losse
 * secties in willekeurige volgorde altijd goed op elkaar aansluiten.
 */
export function SectionShell({
  theme = "light",
  children,
  className = "",
  id,
}: {
  theme?: SectionTheme;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const isDark = theme === "dark";

  return (
    <section
      id={id}
      className={`${
        isDark
          ? "border-t border-slate-800 bg-slate-950 text-slate-100"
          : "bg-slate-50 text-slate-900"
      } py-16 sm:py-20 lg:py-28 ${className}`}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}

/**
 * Pijl-icoon voor knoppen. Als los component zodat de SVG niet
 * tien keer herhaald wordt.
 */
export function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
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
  );
}

/**
 * Primaire knop. Minimale hoogte van 44px zodat het klikgebied op
 * mobiel voldoet aan de toegankelijkheidsrichtlijn.
 */
export function PrimaryButton({
  href,
  children,
  theme = "light",
}: {
  href: string;
  children: ReactNode;
  theme?: SectionTheme;
}) {
  const isDark = theme === "dark";

  return (
    <a
      href={href}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-lg transition active:scale-95 ${
        isDark
          ? "bg-white text-slate-950 hover:bg-slate-200"
          : "bg-slate-900 text-white hover:bg-slate-700"
      }`}
    >
      <span>{children}</span>
      <ArrowIcon />
    </a>
  );
}

export function SecondaryButton({
  href,
  children,
  theme = "light",
}: {
  href: string;
  children: ReactNode;
  theme?: SectionTheme;
}) {
  const isDark = theme === "dark";

  return (
    <a
      href={href}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold transition ${
        isDark
          ? "border-slate-800 bg-slate-900/90 text-slate-200 hover:border-slate-700 hover:bg-slate-800 hover:text-white"
          : "border-slate-300 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-100"
      }`}
    >
      <span>{children}</span>
    </a>
  );
}
