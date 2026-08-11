import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Contact",
  description: "Bespreek je websiteproject met Wielstra Group. Neem contact op voor een vrijblijvend voorstel.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Contact"
        title="Bespreek je project"
        text="Vertel kort waar je naar op zoek bent. Je ontvangt snel een reactie."
      />
      <ContactForm />
    </section>
  );
}
