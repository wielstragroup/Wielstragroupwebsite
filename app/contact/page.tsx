import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { SectionHeading } from "@/components/section-heading";
import { safeUrlOrNull } from "@/lib/security";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Bespreek je websiteproject met Wielstra Group. Neem contact op voor een vrijblijvend voorstel.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const whatsappUrl = safeUrlOrNull(settings.whatsappUrl);
  return (
    <div className="bg-slate-950 text-slate-100">
      {/* Header */}
      <section className="relative border-b border-slate-800 bg-slate-950 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            theme="dark"
            eyebrow="Contact"
            title="Bespreek je project"
            text="Vertel kort waar je naar op zoek bent. We nemen zo snel mogelijk contact met je op."
          />
        </div>
      </section>

      {/* Form & Info Section */}
      <section className="bg-slate-50 py-16 text-slate-900 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            {/* Contact Information & Expectations */}
            <div className="space-y-6 lg:col-span-5">
              <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                  Direct en vrijblijvend overleggen
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  Heb je een vraag over een nieuwe website, het vernieuwen van je huidige site of technisch onderhoud? Vul het formulier in en we reageren spoedig.
                </p>

                <div className="mt-8 space-y-4 border-t border-slate-100 pt-6">
                  {settings.email ? (
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">E-mail</p>
                        <a href={`mailto:${settings.email}`} className="break-all text-sm font-semibold text-slate-900 underline-offset-4 hover:underline">
                          {settings.email}
                        </a>
                      </div>
                    </div>
                  ) : null}

                  {settings.phone ? (
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.49a1 1 0 01-.5 1.21l-2.26 1.13a11 11 0 005.52 5.52l1.13-2.26a1 1 0 011.21-.5l4.49 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Telefoon</p>
                        <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="text-sm font-semibold text-slate-900 underline-offset-4 hover:underline">
                          {settings.phone}
                        </a>
                      </div>
                    </div>
                  ) : null}

                  {whatsappUrl ? (
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 01-13.5 7.8L3 21l1.2-4.5A9 9 0 1121 12z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">WhatsApp</p>
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-slate-900 underline-offset-4 hover:underline">
                          Stuur een bericht
                        </a>
                      </div>
                    </div>
                  ) : null}

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {settings.address ? "Adres" : "Werkgebied"}
                      </p>
                      <p className="whitespace-pre-line text-sm font-semibold text-slate-900">
                        {settings.address || "Nederland & lokale ondernemers"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-blue-500/20 bg-blue-500/5 p-6 text-sm text-slate-700">
                <p className="font-semibold text-blue-950">Wat gebeurt er na je bericht?</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  We bekijken je vraag aandachtig en nemen contact op om de mogelijkheden en eventuele vervolgstappen door te spreken.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              {settings.contactFormEnabled ? (
                <ContactForm theme="light" />
              ) : (
                <div className="rounded-3xl border border-slate-200/80 bg-white p-8 text-sm text-slate-600 shadow-sm">
                  <p className="font-semibold text-slate-900">
                    Het contactformulier is tijdelijk uitgeschakeld.
                  </p>
                  <p className="mt-2">
                    Je kunt ons bereiken via de contactgegevens hiernaast.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
