import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Diensten",
  description: "Ontdek de diensten van Wielstra Group: websites bouwen, verbeteren, onderhouden en online zichtbaarheid vergroten.",
  alternates: { canonical: "/diensten" },
};

const services = [
  {
    id: "bouwen",
    title: "Website bouwen",
    subtitle: "Een gloednieuwe online basis voor jouw onderneming",
    text: "Van het eerste idee tot een volledig werkende website. We bouwen een modern, snel en overzichtelijk platform dat precies past bij jouw uitstraling en doelen.",
    features: [
      "Uniek ontwerp afgestemd op jouw huisstijl",
      "Volledig responsive voor mobiel, tablet en desktop",
      "Overzichtelijke navigatie en duidelijke indeling",
      "Klaar om direct klanten aan te spreken",
    ],
  },
  {
    id: "verbeteren",
    title: "Website verbeteren",
    subtitle: "Vernieuwing en optimalisatie van je bestaande website",
    text: "Heeft jouw huidige website verouderde vormgeving of werkt hij niet prettig op mobiel? We moderniseren het design en verbeteren het gebruiksgemak.",
    features: [
      "Modernisering van visuele stijl",
      "Verbetering van mobiele weergave en snelheid",
      "Optimalisatie van conversiekansen",
      "Opschonen van structuur en content",
    ],
  },
  {
    id: "onderhoud",
    title: "Website onderhoud",
    subtitle: "Zorgeloos technisch beheer en ondersteuning",
    text: "Een website heeft periodiek onderhoud nodig om veilig en goed te blijven werken. Wij nemen het technische beheer en kleine aanpassingen uit handen.",
    features: [
      "Periodieke veiligheidsupdates",
      "Bewaking van bereikbaarheid en prestaties",
      "Directe hulp bij vragen of wijzigingen",
      "Zorgeloze werking zonder dat je er omkijken naar hebt",
    ],
  },
  {
    id: "zichtbaarheid",
    title: "Online zichtbaarheid",
    subtitle: "Helder gevonden worden door de juiste doelgroep",
    text: "Een mooie website levert pas het meeste op als bezoekers hem makkelijk kunnen vinden en meteen snappen wat je biedt.",
    features: [
      "Goede SEO-basisinrichting voor zoekmachines",
      "Heldere opbouw van pagina's en teksten",
      "Snelle laadtijden op alle apparaten",
      "Duidelijke oproepen tot actie",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-slate-950 text-slate-100">
      {/* Header Section */}
      <section className="relative border-b border-slate-800 bg-slate-950 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            theme="dark"
            eyebrow="Diensten"
            title="Praktische ondersteuning voor jouw online groei"
            text="Geen ingewikkelde pakketten, maar een persoonlijke aanpak die past bij jouw onderneming."
          />
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="bg-slate-50 py-16 text-slate-900 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.title}
                id={service.id}
                className="scroll-mt-24 flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm transition hover:border-slate-300 hover:shadow-xl"
              >
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-700">
                    <span>{service.title}</span>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-950">{service.subtitle}</h2>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">{service.text}</p>

                  <div className="mt-6 border-t border-slate-100 pt-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Belangrijkste punten</p>
                    <ul className="mt-3 space-y-2.5 text-sm text-slate-700">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <svg className="mt-0.5 h-4 w-4 shrink-0 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-black"
                  >
                    <span>Vraag een voorstel aan</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-slate-800 bg-slate-950 py-16 text-center sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Benieuwd wat het beste past bij jouw wensen?
          </h2>
          <p className="mt-4 text-base text-slate-300">
            Neem gerust contact op. We bespreken je project graag en kijken samen naar een passende oplossing.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-md transition hover:bg-slate-200"
            >
              <span>Neem contact op</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
