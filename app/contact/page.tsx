import { ContactForm } from "@/components/contact-form";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { safeUrlOrNull } from "@/lib/security";
import { pageMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Neem contact op met Joël Wielstra van Wielstra Group. Plan een vrijblijvend kennismakingsgesprek of vraag een offerte aan voor software, automatisering of een website.",
  path: "/contact",
});

const expectations = [
  ["Een persoonlijke reactie", "Ik lees je aanvraag zelf en neem zo snel mogelijk contact met je op om een moment af te spreken."],
  ["Kennismaking van ongeveer 30 minuten", "Online of telefonisch. Ik stel vragen over je bedrijf, hoe je nu werkt en wat je wilt bereiken."],
  ["Eerlijk advies", "Je hoort wat ik je zou aanraden, ook als dat kleiner of anders is dan je had verwacht."],
  ["Een duidelijk voorstel", "Vraag je een offerte aan, dan ontvang je een voorstel met aanpak, planning en prijs. Vrijblijvend."],
] as const;

type ContactPageProps = {
  searchParams: Promise<{ type?: string | string[]; dienst?: string | string[] }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const [settings, params] = await Promise.all([getSiteSettings(), searchParams]);
  const whatsappUrl = safeUrlOrNull(settings.whatsappUrl);
  const type = typeof params.type === "string" ? params.type : undefined;
  const service = typeof params.dienst === "string" ? params.dienst : undefined;

  const channels = [
    settings.email ? { label: "E-mail", value: settings.email, href: `mailto:${settings.email}` } : null,
    settings.phone ? { label: "Telefoon", value: settings.phone, href: `tel:${settings.phone.replace(/\s+/g, "")}` } : null,
    whatsappUrl ? { label: "WhatsApp", value: "Stuur een bericht", href: whatsappUrl, external: true } : null,
  ].filter((item): item is { label: string; value: string; href: string; external?: boolean } => Boolean(item));

  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid mask-fade-b pointer-events-none absolute inset-x-0 top-0 h-[32rem]" aria-hidden="true" />
      <Container className="relative grid gap-14 pb-20 pt-14 sm:pt-20 lg:grid-cols-12 lg:gap-16 lg:pb-28 lg:pt-24">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Eyebrow>Contact</Eyebrow>
            <h1 className="mt-6 font-display text-[2.6rem] font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl">
              Laten we kijken wat er mogelijk is<span className="text-signal">.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
              Plan een vrijblijvend kennismakingsgesprek, vraag een offerte aan of stel gewoon je vraag. Je bericht komt
              rechtstreeks bij mij terecht.
            </p>

            {channels.length > 0 || settings.address ? (
              <dl className="mt-10 divide-y divide-line border-y border-line">
                {channels.map((channel) => (
                  <div key={channel.label} className="flex items-baseline justify-between gap-6 py-4">
                    <dt className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-subtle">{channel.label}</dt>
                    <dd className="min-w-0 text-right">
                      <a
                        href={channel.href}
                        {...(channel.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="link-underline break-all font-semibold"
                      >
                        {channel.value}
                      </a>
                    </dd>
                  </div>
                ))}
                {settings.address ? (
                  <div className="flex items-baseline justify-between gap-6 py-4">
                    <dt className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-subtle">Adres</dt>
                    <dd className="whitespace-pre-line text-right font-semibold">{settings.address}</dd>
                  </div>
                ) : null}
              </dl>
            ) : null}

            <div className="mt-10">
              <h2 className="font-display text-xl font-semibold tracking-[-0.02em]">Wat kun je verwachten?</h2>
              <ol className="mt-5 space-y-5">
                {expectations.map(([title, text], i) => (
                  <li key={title} className="grid grid-cols-[2rem_1fr] gap-3">
                    <span className="font-mono text-xs leading-6 text-signal-ink">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="font-semibold">{title}</p>
                      <p className="mt-1 leading-relaxed text-muted">{text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-[1.75rem] border border-line bg-paper p-6 shadow-[0_30px_60px_-40px_rgb(17_21_26/0.35)] sm:p-10">
            {settings.contactFormEnabled ? (
              <ContactForm defaultType={type} defaultService={service} />
            ) : (
              <div>
                <h2 className="font-display text-2xl font-semibold">Het formulier is tijdelijk niet beschikbaar.</h2>
                <p className="mt-3 text-lg text-muted">Je kunt me bereiken via de contactgegevens op deze pagina.</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
