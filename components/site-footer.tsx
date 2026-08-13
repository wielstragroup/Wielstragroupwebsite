import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/20 text-blue-500 ring-1 ring-blue-500/30">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </span>
              <span>
                Wielstra<span className="text-blue-500">.</span>Group
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Professionele websites en online diensten voor lokale ondernemers. Persoonlijk contact, korte lijnen en een strak resultaat.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-200">Navigatie</p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="transition hover:text-white">Home</Link>
              </li>
              <li>
                <Link href="/diensten" className="transition hover:text-white">Diensten</Link>
              </li>
              <li>
                <Link href="/portfolio" className="transition hover:text-white">Portfolio</Link>
              </li>
              <li>
                <Link href="/over" className="transition hover:text-white">Over</Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-white">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-200">Diensten</p>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Website bouwen</li>
              <li>Website verbeteren</li>
              <li>Website onderhoud</li>
              <li>Online zichtbaarheid</li>
            </ul>
          </div>

          {/* Contact Prompt */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-200">Samenwerken</p>
            <p className="text-sm text-slate-400">
              Klaar om jouw bedrijf serieus online te presenteren? Neem gerust contact op.
            </p>
            <div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:border-blue-500/50 hover:bg-slate-800 hover:text-blue-400"
              >
                <span>Bericht sturen</span>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800/60 pt-8 text-center text-xs text-slate-400 sm:flex sm:items-center sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} Wielstra Group. Alle rechten voorbehouden.</p>
          <p className="mt-2 sm:mt-0 text-slate-400">Websites voor lokale ondernemers</p>
        </div>
      </div>
    </footer>
  );
}
