import type { Metadata } from "next";

import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Over",
  description: "Lees meer over Wielstra Group en de persoonlijke aanpak achter de websites en online diensten.",
  alternates: { canonical: "/over" },
};

export default function AboutPage() {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Over"
        title="Persoonlijke samenwerking met professionele uitvoering"
        text="Wielstra Group helpt lokale ondernemers met websites die vertrouwen geven en klanten laten converteren."
      />
      <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-700 shadow-sm">
        <p>
          Achter Wielstra Group staat een hands-on ontwikkelaar die meedenkt, doorvraagt en helder communiceert. Geen ingewikkeld traject, maar stap voor stap bouwen aan een website die past bij jouw onderneming.
        </p>
        <p>
          Elke keuze is gericht op snelheid, gebruiksvriendelijkheid en schaalbaarheid, zodat jouw online basis klaar is voor groei.
        </p>
      </div>
    </section>
  );
}
