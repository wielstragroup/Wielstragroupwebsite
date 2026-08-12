import Link from "next/link";
import Image from "next/image";

import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { getFeaturedProjects } from "@/lib/projects";

const services = [
  {
    title: "Website bouwen",
    subtitle: "Een gloednieuwe online basis voor jouw onderneming",
    description: "Een moderne, snelle website die volledig aansluit op jouw bedrijf, doelgroep en doelstellingen.",
    ctaLabel: "Meer over website bouwen",
    href: "/diensten#bouwen",
    highlights: ["Uniek ontwerp op maat", "Mobiel geoptimaliseerd", "Helder & overzichtelijk"],
  },
  {
    title: "Website verbeteren",
    subtitle: "Vernieuwing en optimalisatie van je bestaande website",
    description: "Het moderniseren van een verouderde website voor een frisse uitstraling en beter gebruiksgemak.",
    ctaLabel: "Meer over website verbeteren",
    href: "/diensten#verbeteren",
    highlights: ["Modern design", "Snellere laadtijden", "Hogere conversie"],
  },
  {
    title: "Website onderhoud",
    subtitle: "Zorgeloos technisch beheer en ondersteuning",
    description: "Doorlopende ondersteuning zodat jouw website veilig, actueel en optimaal bereikbaar blijft.",
    ctaLabel: "Meer over website onderhoud",
    href: "/diensten#onderhoud",
    highlights: ["Periodieke updates", "Veilige hosting & beheer", "Korte communicatielijnen"],
  },
  {
    title: "Online zichtbaarheid",
    subtitle: "Helder gevonden worden door de juiste doelgroep",
    description: "Een sterke structuur en zoekmachinebasis voor betere online vindbaarheid van je diensten.",
    ctaLabel: "Meer over online zichtbaarheid",
    href: "/diensten#zichtbaarheid",
    highlights: ["SEO-basisinrichting", "Duidelijke websitestructuur", "Lokale vindbaarheid"],
  },
];

const whyChooseUs = [
  {
    label: "PERSOONLIJK",
    title: "Direct contact",
    description: "Je hebt direct contact en kunt snel schakelen met de ontwikkelaar zelf. Geen wisselende projectmanagers.",
  },
  {
    label: "OP MAAT",
    title: "Afgestemd op jou",
    description: "Geen standaardwebsite die toevallig bij je bedrijf moet passen, maar maatwerk gericht op jouw doelgroep.",
  },
  {
    label: "DUIDELIJK",
    title: "Helder & Begrijpelijk",
    description: "Een website die bezoekers binnen enkele seconden laat begrijpen wat je doet en wat je te bieden hebt.",
  },
  {
    label: "MEEDENKEND",
    title: "Proactief meedenken",
    description: "Niet alleen uitvoeren wat je vraagt, maar ook proactief meedenken over slimme keuzes en een beter resultaat.",
  },
];

export default async function Home() {
  const featuredProjects = await getFeaturedProjects(3);
  const heroFeaturedImage = featuredProjects.length > 0 ? featuredProjects[0].image : "/placeholders/alaregina-main.svg";

  return (
    <div className="space-y-0 bg-slate-950 text-slate-100">
      {/* 1. HERO SECTION (Dark & Grounded with Realistic Browser Mockup) */}
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-slate-950 py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Left Column: Headline & Value Prop */}
            <div className="space-y-6 lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-300">
                <span>Wielstra Group</span>
                <span className="text-slate-600">•</span>
                <span>Webdesign & Development</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.12]">
                Een website die jouw bedrijf <span className="text-slate-300 underline decoration-slate-600 underline-offset-8">serieus</span> laat zien.
              </h1>

              <p className="max-w-xl text-lg leading-relaxed text-slate-300">
                Voor lokale ondernemers die professioneel zichtbaar willen zijn. Met heldere communicatie, korte lijnen en een persoonlijke aanpak van idee tot livegang.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2.5 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-slate-200 active:scale-95"
                >
                  <span>Bespreek je project</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-6 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
                >
                  <span>Bekijk ons werk</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Realistic Browser Window Mockup (Webdesign Visual) */}
            <div className="lg:col-span-6">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Main Desktop Browser Mockup */}
                <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl transition hover:border-slate-700">
                  {/* Browser Window Bar */}
                  <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-slate-800" />
                      <span className="h-3 w-3 rounded-full bg-slate-800" />
                      <span className="h-3 w-3 rounded-full bg-slate-800" />
                    </div>
                    <div className="flex items-center gap-2 rounded-md border border-slate-800 bg-slate-900 px-3 py-1 text-xs text-slate-400">
                      <svg className="h-3 w-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>wielstragroup.nl/preview</span>
                    </div>
                    <div className="w-12" />
                  </div>

                  {/* Browser Window Body with Realistic Preview Image */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                    <Image
                      src={heroFeaturedImage}
                      alt="Wielstra Group website preview"
                      width={1000}
                      height={625}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-102"
                      priority
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
                  </div>
                </div>

                {/* Overlapping Secondary Mobile Viewport Mockup */}
                <div className="absolute -bottom-6 -left-6 hidden w-44 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl sm:block lg:-bottom-8 lg:-left-8">
                  <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-3 py-2 text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-300">Mobiel</span>
                    <span>Responsive</span>
                  </div>
                  <div className="relative aspect-[9/16] w-full overflow-hidden bg-slate-950">
                    <Image
                      src={heroFeaturedImage}
                      alt="Mobile preview"
                      width={300}
                      height={533}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SERVICES SECTION (Clean Light Contrast) */}
      <section className="bg-slate-50 py-20 text-slate-900 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Diensten"
            title="Praktische ondersteuning voor jouw online uitstraling"
            text="Geen overbodige pakketten, maar heldere diensten afgestemd op jouw onderneming."
          />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <article
                key={service.title}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">0{index + 1}</span>
                    <span className="h-2 w-2 rounded-full bg-slate-300 group-hover:bg-slate-950 transition-colors" />
                  </div>
                  
                  <h3 className="text-xl font-bold tracking-tight text-slate-950">{service.title}</h3>
                  <p className="mt-1.5 text-xs font-semibold text-slate-500">{service.subtitle}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{service.description}</p>
                  
                  <ul className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-xs font-medium text-slate-700">
                    {service.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-center gap-2">
                        <svg className="h-3.5 w-3.5 text-slate-900 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    href={service.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 transition group-hover:translate-x-1 group-hover:text-black"
                  >
                    <span>{service.ctaLabel}</span>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. NEW SECTION: WAAROM WIELSTRA GROUP (Grounded & Human) */}
      <section className="border-t border-slate-800 bg-slate-900 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            theme="dark"
            eyebrow="Samenwerken"
            title="Waarom bedrijven voor Wielstra Group kiezen"
            text="Geen ingewikkelde bureau-overlegstructuren, maar direct en persoonlijk contact."
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 transition hover:border-slate-700"
              >
                <span className="inline-block rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 text-[10px] font-bold tracking-wider text-slate-300">
                  {item.label}
                </span>
                <h3 className="mt-4 text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PORTFOLIO (Dynamic from Supabase) */}
      <section className="bg-slate-50 py-20 text-slate-900 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Portfolio"
            title="Recent werk"
            text="Een selectie van websites die ik heb gemaakt voor ondernemers."
          />

          {featuredProjects.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
              Er zijn op dit moment geen uitgelichte projecten beschikbaar.
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} theme="light" />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-100"
            >
              <span>Bekijk alle projecten</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. CLOSING CTA SECTION */}
      <section className="border-t border-slate-800 bg-slate-950 py-20 text-center sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 sm:p-14">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Klaar om je bedrijf online sterker neer te zetten?
            </h2>
            <p className="mt-4 text-base text-slate-300 sm:text-lg">
              Laten we bespreken wat je nodig hebt. Neem gerust contact op voor een kennismaking.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-slate-200 active:scale-95"
              >
                <span>Bespreek je project</span>
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
