import Link from "next/link";

import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { getFeaturedProjects } from "@/lib/projects";

const services = [
  "Website bouwen",
  "Website verbeteren",
  "Website onderhoud",
  "Online zichtbaarheid",
];

const reasons = [
  "Persoonlijk contact",
  "Moderne websites",
  "Gericht op resultaat",
  "Korte lijnen",
  "Persoonlijke service",
];

const steps = ["Kennismaken", "Plan bepalen", "Website bouwen", "Feedback verwerken", "Opleveren"];

export default async function Home() {
  const featuredProjects = await getFeaturedProjects(3);

  return (
    <div className="space-y-20 pb-20">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-18 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Wielstra Group</p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Websites die jouw bedrijf online sterker maken.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Voor lokale ondernemers die professioneel zichtbaar willen zijn. Van strategie tot livegang, met korte lijnen en een persoonlijke aanpak.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">
                Bespreek je project
              </Link>
              <Link href="/portfolio" className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:border-slate-400">
                Bekijk mijn werk
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-100 p-6 shadow-sm">
            <p className="text-sm leading-7 text-slate-700">
              Een website die niet alleen mooi is, maar ook helder communiceert, vertrouwen geeft en klanten in beweging brengt.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Diensten" title="Wat ik voor je kan betekenen" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <article key={service} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <h3 className="text-base font-semibold text-slate-900">{service}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Waarom Wielstra Group" title="Professioneel, persoonlijk en doelgericht" />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason) => (
            <li key={reason} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
              {reason}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Portfolio" title="Uitgelichte projecten" text="Projecten komen direct uit het CMS, zonder hardcoded content." />
        {featuredProjects.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            Nog geen uitgelichte projecten gevonden. Publiceer projecten via het dashboard.
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Werkwijze" title="Van idee naar live website" />
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => (
            <li key={step} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Stap {index + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 px-6 py-10 text-center text-white">
          <h2 className="text-2xl font-semibold">Klaar om jouw website naar een hoger niveau te brengen?</h2>
          <p className="mt-3 text-sm text-slate-200">Plan een vrijblijvende kennismaking en ontvang een helder voorstel.</p>
          <Link href="/contact" className="mt-6 inline-flex rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900">
            Neem contact op
          </Link>
        </div>
      </section>
    </div>
  );
}
