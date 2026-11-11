import Link from "next/link";

import { LogoMark } from "@/components/brand/logo";
import { ButtonLink, Container } from "@/components/ui/primitives";
import { legalNav, mainNav, serviceGroups } from "@/lib/content";
import { safeUrlOrNull } from "@/lib/security";
import { getSiteSettings, getVisibleSocials, SOCIAL_LABELS } from "@/lib/site-settings";

export async function SiteFooter() {
  const settings = await getSiteSettings();
  const socials = getVisibleSocials(settings);
  const whatsappUrl = safeUrlOrNull(settings.whatsappUrl);

  return (
    <footer className="relative overflow-hidden bg-ink text-white/70">
      <div className="bg-grid-dark pointer-events-none absolute inset-0 opacity-40 mask-fade-b" aria-hidden="true" />
      <Container className="relative">
        <div className="flex flex-col gap-10 border-b border-white/10 py-16 sm:py-20 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-3xl font-display text-[2.4rem] font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl">
            Van vastlopend proces naar <span className="text-signal">werkend systeem.</span>
          </p>
          <ButtonLink href="/contact" variant="light" className="self-start lg:self-auto">
            Start een gesprek
          </ButtonLink>
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2.5 text-white" aria-label="Wielstra Group, naar de homepage">
              <LogoMark className="h-8 w-8" />
              <span className="font-display text-xl font-bold tracking-[-0.03em]">Wielstra</span>
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-white/60">Group</span>
            </Link>
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed">
              Technologiebedrijf voor maatwerksoftware, automatisering, AI-integraties en websites. Persoonlijk contact,
              technisch sterk.
            </p>
            {socials.length > 0 ? (
              <ul className="mt-6 flex flex-wrap gap-2">
                {socials.map((social) => {
                  const href = safeUrlOrNull(social.url);
                  if (!href) return null;
                  return (
                    <li key={social.platform}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-white/80 transition-colors hover:border-white hover:text-white"
                      >
                        {SOCIAL_LABELS[social.platform]}
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          <FooterColumn title="Navigatie" className="lg:col-span-2">
            {[{ href: "/", label: "Home" }, ...mainNav, { href: "/contact", label: "Contact" }].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="link-underline transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Expertise" className="lg:col-span-3">
            {serviceGroups.map((group) => (
              <li key={group.id}>
                <Link href={`/diensten#${group.id}`} className="link-underline transition-colors hover:text-white">
                  {group.title}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Contact" className="lg:col-span-3">
            {settings.email ? (
              <li>
                <a href={`mailto:${settings.email}`} className="link-underline transition-colors hover:text-white">
                  {settings.email}
                </a>
              </li>
            ) : null}
            {settings.phone ? (
              <li>
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                  className="link-underline transition-colors hover:text-white"
                >
                  {settings.phone}
                </a>
              </li>
            ) : null}
            {whatsappUrl ? (
              <li>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-white">
                  WhatsApp
                </a>
              </li>
            ) : null}
            {settings.address ? <li className="whitespace-pre-line">{settings.address}</li> : null}
            <li>
              <Link href="/contact" className="link-underline transition-colors hover:text-white">
                Contactformulier
              </Link>
            </li>
          </FooterColumn>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-8 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {settings.companyName}. {settings.copyrightText || "Alle rechten voorbehouden."}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalNav.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-white/50">{title}</p>
      <ul className="mt-5 space-y-3 text-[0.95rem]">{children}</ul>
    </div>
  );
}
