"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/brand/logo";
import { ArrowIcon } from "@/components/ui/primitives";
import { mainNav } from "@/lib/content";

type SiteHeaderProps = {
  ctaLabel: string;
  ctaUrl: string;
};

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({ ctaLabel, ctaUrl }: SiteHeaderProps) {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);

  // Menu sluiten bij navigatie (state afleiden tijdens render i.p.v. effect).
  if (open && openedAt !== pathname) {
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,border-color] duration-300 ${
        scrolled || open ? "border-b border-line bg-paper/90 backdrop-blur-md" : "border-b border-transparent bg-paper"
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] w-full max-w-[84rem] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
        <Link href="/" className="relative z-10 text-ink" aria-label="Wielstra Group, naar de homepage">
          <Logo />
        </Link>

        <nav aria-label="Hoofdnavigatie" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative rounded-full px-4 py-2 text-[0.93rem] font-medium transition-colors ${
                      active ? "text-ink" : "text-muted hover:text-ink"
                    }`}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={`absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 bg-signal transition-opacity ${
                        active ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={ctaUrl}
            className="group hidden items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[0.9rem] font-semibold text-paper transition-colors hover:bg-signal sm:inline-flex"
          >
            {ctaLabel}
            <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <button
            type="button"
            onClick={() => {
              setOpenedAt(pathname);
              setOpen((value) => !value);
            }}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Menu sluiten" : "Menu openen"}
            className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-line-strong lg:hidden"
          >
            <span className="relative block h-3 w-5" aria-hidden="true">
              <span
                className={`absolute left-0 h-[1.5px] w-5 bg-ink transition-transform duration-300 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 h-[1.5px] w-5 bg-ink transition-transform duration-300 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[4.5rem] overflow-y-auto border-t border-line bg-paper lg:hidden"
      >
        <nav aria-label="Mobiele navigatie" className="flex min-h-full flex-col px-5 pb-10 pt-6 sm:px-8">
          <ul className="divide-y divide-line border-b border-line">
            {[{ href: "/", label: "Home" }, ...mainNav, { href: "/contact", label: "Contact" }].map((link, i) => {
              const active = link.href === "/" ? pathname === "/" : isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className="flex items-baseline gap-4 py-4 font-display text-3xl font-semibold tracking-[-0.03em]"
                  >
                    <span className="font-mono text-xs font-normal tracking-normal text-subtle">
                      {String(i).padStart(2, "0")}
                    </span>
                    <span className={active ? "text-signal-ink" : ""}>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href={ctaUrl}
            onClick={() => setOpen(false)}
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 font-semibold text-paper"
          >
            {ctaLabel}
            <ArrowIcon />
          </Link>
        </nav>
      </div>
    </header>
  );
}
