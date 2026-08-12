import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Over",
  description: "Lees meer over Wielstra Group en de persoonlijke aanpak achter de websites en online diensten.",
  alternates: { canonical: "/over" },
};

export default function AboutPage() {
  return (
    <div className="bg-slate-950 text-slate-100">
      {/* Header */}
      <section className="relative border-b border-slate-800 bg-slate-950 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            theme="dark"
            eyebrow="Over Wielstra Group"
            title="Persoonlijke samenwerking met vakmanschap"
            text="Wielstra Group helpt lokale ondernemers met professionele websites die helder communiceren en vertrouwen uitstralen."
          />
        </div>
      </section>

      {/* Main Narrative & Founder Story */}
      <section className="bg-slate-50 py-16 text-slate-900 sm:py-24">
        <div className="mx-auto max-w-5xl space-y-12 px-4 sm:px-6 lg:px-8">
          
          {/* Section 1: Wie is Wielstra Group & Wie zit erachter */}
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Wie is Wielstra Group?</span>
              <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Eén vast aanspreekpunt voor jouw online aanwezigheid
              </h2>
              <p className="text-base leading-relaxed text-slate-700">
                Wielstra Group is opgericht vanuit het idee dat een professionele website niet ingewikkeld hoeft te zijn. Veel ondernemers worstelen met onduidelijke communicatie bij grote bureaus of verouderde systemen die lastig te beheren zijn.
              </p>
              <p className="text-base leading-relaxed text-slate-700">
                Achter Wielstra Group staat een hands-on ontwikkelaar die meedenkt, doorvraagt en het werk rechtstreeks uitvoert. Je praat direct met degene die jouw website bouwt, wat zorgt voor korte lijnen en snelle schakeling.
              </p>
            </div>

            {/* Founder Photo Frame Container (Placeholder for real photo) */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-md">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-900 flex flex-col justify-end p-6">
                  <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-500">
                    <svg className="h-16 w-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="relative z-10 rounded-xl bg-slate-950/90 p-4 backdrop-blur-md border border-white/10 text-white">
                    <p className="font-bold text-sm">Direct contact</p>
                    <p className="text-xs text-slate-400">Eén vast aanspreekpunt van start tot oplevering</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Hoe werk ik? */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm sm:p-12 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Werkwijze</span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">
              Hoe werk ik?
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                <h3 className="font-bold text-slate-900">1. Luisteren & Mappen</h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  We starten met een helder gesprek over jouw bedrijf, je doelgroep en wat je met de website wilt bereiken.
                </p>
              </div>
              <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                <h3 className="font-bold text-slate-900">2. Ontwerp & Opbouw</h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  Er wordt een strak, modern ontwerp uitgewerkt met de focus op duidelijkheid, laadsnelheid en gebruiksgemak.
                </p>
              </div>
              <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                <h3 className="font-bold text-slate-900">3. Overleggen & Verfijnen</h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  Samen nemen we het tussenresultaat door en zetten we de puntjes op de i waar nodig.
                </p>
              </div>
              <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                <h3 className="font-bold text-slate-900">4. Opleveren & Beheren</h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  Na livegang blijft de website goed werken en sta ik klaar voor eventuele vragen of updates.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Waarom persoonlijke samenwerking belangrijk is */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm sm:p-12 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Visie</span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">
              Waarom persoonlijke samenwerking het verschil maakt
            </h2>
            <p className="text-base leading-relaxed text-slate-700">
              Een website is het digitale visitekaartje van jouw onderneming. Wanneer een website wordt gemaakt door iemand die jouw bedrijf echt begrijpt en meedenkt, zie je dat direct terug in het resultaat. Geen standaard templates die toevallig aangepast zijn, maar een helder platform dat precies laat zien wie jij bent.
            </p>
            <div className="pt-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800"
              >
                <span>Bespreek jouw wensen</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
