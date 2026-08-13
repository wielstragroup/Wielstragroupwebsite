"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/diensten", label: "Diensten" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/over", label: "Over" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link 
          href="/" 
          className="group flex items-center gap-2.5 text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-90"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-white font-black text-sm ring-1 ring-white/10">
            W
          </span>
          <span>
            Wielstra Group
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 active:scale-95"
          >
            <span>Bespreek je project</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigatiemenu"
          className="inline-flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white md:hidden"
        >
          {mobileMenuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-800 bg-slate-950/95 px-4 pb-6 pt-3 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col space-y-1.5">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                    isActive
                      ? "bg-slate-800 text-white font-semibold"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3">
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-center text-base font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                <span>Bespreek je project</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
