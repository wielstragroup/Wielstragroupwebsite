/**
 * Wielstra Group — merkteken.
 *
 * Het beeldmerk is een W opgebouwd uit één doorlopende lijn (een "trace"),
 * met op het middelste knooppunt een vierkant signaalblok: het punt waar
 * systemen samenkomen. Werkt in één kleur (currentColor) en schaalt
 * zonder detailverlies tot 16px.
 */

type MarkProps = {
  className?: string;
  /** Kleur van het signaalblok; standaard het merkaccent. */
  accent?: string;
  title?: string;
};

export const MARK_PATH = "M4 7.5 L10 24.5 L16 12.5 L22 24.5 L28 7.5";

export function LogoMark({ className, accent = "var(--color-signal)", title }: MarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path
        d={MARK_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="square"
        strokeLinejoin="miter"
        strokeMiterlimit="10"
      />
      <rect x="13" y="6" width="6" height="6" fill={accent} />
    </svg>
  );
}

type LogoProps = {
  className?: string;
  /** Toon de "GROUP"-toevoeging naast het woordmerk. */
  withDescriptor?: boolean;
};

export function Logo({ className = "", withDescriptor = true }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-7 w-7 shrink-0" />
      <span className="flex items-baseline gap-1.5 leading-none">
        <span className="font-display text-[1.2rem] font-bold tracking-[-0.03em]">Wielstra</span>
        {withDescriptor ? (
          <span className="font-mono text-[0.62rem] font-medium uppercase tracking-[0.22em] opacity-70">
            Group
          </span>
        ) : null}
      </span>
    </span>
  );
}
