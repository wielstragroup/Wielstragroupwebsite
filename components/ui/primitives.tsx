import Link from "next/link";
import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[84rem] px-5 sm:px-8 lg:px-12 ${className}`}>{children}</div>;
}

export function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
    </svg>
  );
}

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "light" | "ghost-light";
  className?: string;
  external?: boolean;
};

const variants: Record<NonNullable<ButtonLinkProps["variant"]>, string> = {
  primary: "bg-ink text-paper hover:bg-signal",
  secondary: "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-paper",
  light: "bg-paper text-ink hover:bg-signal hover:text-white",
  "ghost-light": "border border-white/25 text-white hover:border-white hover:bg-white hover:text-ink",
};

export function ButtonLink({ href, children, variant = "primary", className = "", external }: ButtonLinkProps) {
  const classes = `group inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-6 py-3 text-[0.95rem] font-semibold transition-[background-color,color,border-color] duration-300 ${variants[variant]} ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      <span className="relative flex h-4 w-4 overflow-hidden">
        <ArrowIcon className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-5" />
        <ArrowIcon className="absolute h-4 w-4 -translate-x-5 transition-transform duration-300 ease-out group-hover:translate-x-0" />
      </span>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}

/** Klein technisch label: [01] Tekst */
export function Eyebrow({
  children,
  index,
  tone = "dark",
  className = "",
}: {
  children: ReactNode;
  index?: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <p
      className={`flex items-center gap-3 font-mono text-[0.72rem] font-medium uppercase tracking-[0.18em] ${
        tone === "dark" ? "text-muted" : "text-white/60"
      } ${className}`}
    >
      <span className="inline-block h-2 w-2 bg-signal" aria-hidden="true" />
      {index ? <span className={tone === "dark" ? "text-ink" : "text-white"}>{index}</span> : null}
      <span>{children}</span>
    </p>
  );
}

export function SectionTitle({
  eyebrow,
  index,
  title,
  intro,
  tone = "dark",
  className = "",
}: {
  eyebrow: string;
  index?: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <Eyebrow index={index} tone={tone}>
        {eyebrow}
      </Eyebrow>
      <h2
        className={`mt-5 font-display text-[2.1rem] font-semibold leading-[1.04] tracking-[-0.035em] sm:text-5xl lg:text-[3.6rem] ${
          tone === "dark" ? "text-ink" : "text-white"
        }`}
      >
        {title}
      </h2>
      {intro ? (
        <p className={`mt-6 max-w-2xl text-lg leading-relaxed ${tone === "dark" ? "text-muted" : "text-white/70"}`}>
          {intro}
        </p>
      ) : null}
    </div>
  );
}

export function CheckList({
  items,
  className = "",
  columns = false,
}: {
  items: string[];
  className?: string;
  columns?: boolean;
}) {
  return (
    <ul className={`grid gap-3 ${columns ? "gap-x-8 sm:grid-cols-2" : ""} ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[0.97rem] leading-relaxed">
          <svg className="mt-1 h-4 w-4 shrink-0 text-pine" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="m3 8.5 3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
          </svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
