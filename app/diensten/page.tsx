import type { Metadata } from "next";

import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Diensten",
  description: "Ontdek de diensten van Wielstra Group: websites bouwen, verbeteren, onderhouden en online zichtbaarheid vergroten.",
  alternates: { canonical: "/diensten" },
};

const services = [
  {
    title: "Website bouwen",
    text: "Een moderne website vanaf de basis, afgestemd op jouw bedrijf en doelgroep.",
  },
  {
    title: "Website verbeteren",
    text: "Optimalisatie van bestaande websites op het gebied van design, snelheid en conversie.",
  },
  {
    title: "Website onderhoud",
    text: "Doorlopend technisch beheer zodat je website veilig, snel en betrouwbaar blijft.",
  },
  {
    title: "Online zichtbaarheid",
    text: "Verbeter je vindbaarheid met een sterke structuur, SEO-basis en heldere content.",
  },
];

export default function ServicesPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Diensten"
        title="Praktische ondersteuning voor jouw online groei"
        text="Geen standaardpakket, maar een aanpak die past bij jouw onderneming."
      />
      <div className="grid gap-5 md:grid-cols-2">
        {services.map((service) => (
          <article key={service.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">{service.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{service.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
