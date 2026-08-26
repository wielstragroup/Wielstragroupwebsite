import Image from "next/image";
import Link from "next/link";

import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import type { SectionContentMap } from "@/lib/sections/schema";
import { safeUrlOrNull } from "@/lib/security";
import type { SiteSettings } from "@/lib/site-settings";
import type { Project } from "@/lib/types";

import {
  ArrowIcon,
  PrimaryButton,
  SecondaryButton,
  SectionShell,
} from "./section-shell";

const CheckIcon = () => (
  <svg
    className="h-3.5 w-3.5 shrink-0 text-slate-900"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.5"
      d="M5 13l4 4L19 7"
    />
  </svg>
);

// ---------------------------------------------------------------------
// Diensten
// ---------------------------------------------------------------------
export function ServicesSection({
  content,
}: {
  content: SectionContentMap["services"];
}) {
  if (content.items.length === 0) {
    return null;
  }

  return (
    <SectionShell theme={content.theme}>
      <SectionHeading
        theme={content.theme}
        eyebrow={content.eyebrow || undefined}
        title={content.title}
        text={content.text || undefined}
      />

      <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
        {content.items.map((service, index) => {
          const href = safeUrlOrNull(service.ctaUrl);

          return (
            <article
              key={`${service.title}-${index}`}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 motion-reduce:transform-none sm:p-6"
            >
              <div>
                <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-slate-300 transition-colors group-hover:bg-slate-950" />
                </div>

                <h3 className="text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
                  {service.title}
                </h3>
                {service.subtitle ? (
                  <p className="mt-1.5 text-xs font-semibold text-slate-500">
                    {service.subtitle}
                  </p>
                ) : null}
                {service.description ? (
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {service.description}
                  </p>
                ) : null}

                {service.highlights.length > 0 ? (
                  <ul className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-xs font-medium text-slate-700">
                    {service.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-center gap-2">
                        <CheckIcon />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              {service.ctaLabel && href ? (
                <div className="mt-8 pt-4">
                  <Link
                    href={href}
                    className="inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold text-slate-900 transition group-hover:translate-x-1 group-hover:text-black motion-reduce:transform-none"
                  >
                    <span>{service.ctaLabel}</span>
                    <ArrowIcon className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </SectionShell>
  );
}

// ---------------------------------------------------------------------
// USP's
// ---------------------------------------------------------------------
export function UspSection({ content }: { content: SectionContentMap["usp"] }) {
  if (content.items.length === 0) {
    return null;
  }

  const isDark = content.theme === "dark";

  return (
    <SectionShell theme={content.theme}>
      <SectionHeading
        theme={content.theme}
        eyebrow={content.eyebrow || undefined}
        title={content.title}
        text={content.text || undefined}
      />

      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {content.items.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className={`rounded-2xl border p-5 transition sm:p-6 ${
              isDark
                ? "border-slate-800 bg-slate-950/80 hover:border-slate-700"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            {item.label ? (
              <span
                className={`inline-block rounded-md border px-2.5 py-1 text-[10px] font-bold tracking-wider ${
                  isDark
                    ? "border-slate-800 bg-slate-900 text-slate-300"
                    : "border-slate-200 bg-slate-100 text-slate-600"
                }`}
              >
                {item.label}
              </span>
            ) : null}
            <h3
              className={`mt-4 text-lg font-bold ${
                isDark ? "text-white" : "text-slate-950"
              }`}
            >
              {item.title}
            </h3>
            <p
              className={`mt-2 text-sm leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

// ---------------------------------------------------------------------
// Portfolio
// ---------------------------------------------------------------------
export function PortfolioSection({
  content,
  projects,
}: {
  content: SectionContentMap["portfolio"];
  projects: Project[];
}) {
  const href = safeUrlOrNull(content.ctaUrl);

  return (
    <SectionShell theme={content.theme}>
      <SectionHeading
        theme={content.theme}
        eyebrow={content.eyebrow || undefined}
        title={content.title}
        text={content.text || undefined}
      />

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600 sm:p-8">
          {content.emptyText ||
            "Er zijn op dit moment geen uitgelichte projecten beschikbaar."}
        </div>
      ) : (
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              theme={content.theme}
            />
          ))}
        </div>
      )}

      {content.ctaLabel && href ? (
        <div className="mt-10 text-center sm:mt-12">
          <SecondaryButton href={href} theme={content.theme}>
            {content.ctaLabel}
          </SecondaryButton>
        </div>
      ) : null}
    </SectionShell>
  );
}

// ---------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------
export function TestimonialsSection({
  content,
}: {
  content: SectionContentMap["testimonials"];
}) {
  if (content.items.length === 0) {
    return null;
  }

  const isDark = content.theme === "dark";

  return (
    <SectionShell theme={content.theme}>
      <SectionHeading
        theme={content.theme}
        eyebrow={content.eyebrow || undefined}
        title={content.title}
        text={content.text || undefined}
      />

      <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {content.items.map((item, index) => (
          <figure
            key={`${item.author}-${index}`}
            className={`flex h-full flex-col rounded-2xl border p-5 sm:p-6 ${
              isDark
                ? "border-slate-800 bg-slate-950/80"
                : "border-slate-200 bg-white shadow-sm"
            }`}
          >
            <blockquote
              className={`flex-1 text-sm leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              {item.quote}
            </blockquote>
            <figcaption className="mt-5 border-t border-slate-200/20 pt-4">
              <span
                className={`block text-sm font-semibold ${
                  isDark ? "text-white" : "text-slate-950"
                }`}
              >
                {item.author}
              </span>
              {item.role ? (
                <span
                  className={`block text-xs ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {item.role}
                </span>
              ) : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </SectionShell>
  );
}

// ---------------------------------------------------------------------
// Vrije tekst
// ---------------------------------------------------------------------
export function TextSection({
  content,
}: {
  content: SectionContentMap["text"];
}) {
  if (!content.title && !content.text) {
    return null;
  }

  const isDark = content.theme === "dark";

  return (
    <SectionShell theme={content.theme}>
      <div
        className={`max-w-3xl ${
          content.align === "center" ? "mx-auto text-center" : "text-left"
        }`}
      >
        {content.eyebrow ? (
          <p
            className={`mb-4 inline-flex rounded-full border px-3.5 py-1 text-xs font-semibold uppercase tracking-wider ${
              isDark
                ? "border-slate-800 bg-slate-900 text-slate-300"
                : "border-slate-200 bg-slate-100 text-slate-700"
            }`}
          >
            {content.eyebrow}
          </p>
        ) : null}

        {content.title ? (
          <h2
            className={`text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl ${
              isDark ? "text-white" : "text-slate-950"
            }`}
          >
            {content.title}
          </h2>
        ) : null}

        {content.text ? (
          // whitespace-pre-line respecteert alinea's zonder HTML toe te
          // staan; de tekst wordt als platte tekst gerenderd (geen XSS).
          <p
            className={`mt-4 whitespace-pre-line text-base leading-relaxed ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {content.text}
          </p>
        ) : null}
      </div>
    </SectionShell>
  );
}

// ---------------------------------------------------------------------
// Tekst met afbeelding
// ---------------------------------------------------------------------
export function ImageTextSection({
  content,
}: {
  content: SectionContentMap["image_text"];
}) {
  const isDark = content.theme === "dark";
  const href = safeUrlOrNull(content.ctaUrl);
  const imageFirst = content.imagePosition === "left";

  return (
    <SectionShell theme={content.theme}>
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        {content.image ? (
          <div
            className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl border ${
              isDark ? "border-slate-800" : "border-slate-200"
            } ${imageFirst ? "lg:order-1" : "lg:order-2"}`}
          >
            <Image
              src={content.image}
              alt={content.imageAlt}
              fill
              sizes="(max-width: 1024px) 92vw, 560px"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className={imageFirst ? "lg:order-2" : "lg:order-1"}>
          {content.eyebrow ? (
            <p
              className={`mb-4 inline-flex rounded-full border px-3.5 py-1 text-xs font-semibold uppercase tracking-wider ${
                isDark
                  ? "border-slate-800 bg-slate-900 text-slate-300"
                  : "border-slate-200 bg-slate-100 text-slate-700"
              }`}
            >
              {content.eyebrow}
            </p>
          ) : null}

          {content.title ? (
            <h2
              className={`text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl ${
                isDark ? "text-white" : "text-slate-950"
              }`}
            >
              {content.title}
            </h2>
          ) : null}

          {content.text ? (
            <p
              className={`mt-4 whitespace-pre-line text-base leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              {content.text}
            </p>
          ) : null}

          {content.ctaLabel && href ? (
            <div className="mt-7">
              <PrimaryButton href={href} theme={content.theme}>
                {content.ctaLabel}
              </PrimaryButton>
            </div>
          ) : null}
        </div>
      </div>
    </SectionShell>
  );
}

// ---------------------------------------------------------------------
// Call-to-action
// ---------------------------------------------------------------------
export function CtaSection({
  content,
  settings,
}: {
  content: SectionContentMap["cta"];
  settings: SiteSettings;
}) {
  const isDark = content.theme === "dark";

  // Valt terug op de globale CTA uit de website-instellingen.
  const label = content.ctaLabel || settings.ctaLabel;
  const href =
    safeUrlOrNull(content.ctaUrl) ?? safeUrlOrNull(settings.ctaUrl) ?? "/contact";

  return (
    <section
      className={`${
        isDark
          ? "border-t border-slate-800 bg-slate-950 text-slate-100"
          : "bg-slate-50 text-slate-900"
      } py-16 sm:py-20 lg:py-28`}
    >
      <div className="mx-auto w-full max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div
          className={`rounded-3xl border p-6 sm:p-10 lg:p-14 ${
            isDark
              ? "border-slate-800 bg-slate-900"
              : "border-slate-200 bg-white shadow-sm"
          }`}
        >
          {content.title ? (
            <h2
              className={`text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl ${
                isDark ? "text-white" : "text-slate-950"
              }`}
            >
              {content.title}
            </h2>
          ) : null}

          {content.text ? (
            <p
              className={`mt-4 text-base sm:text-lg ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              {content.text}
            </p>
          ) : null}

          {label ? (
            <div className="mt-7 flex justify-center sm:mt-8">
              <PrimaryButton href={href} theme={content.theme}>
                {label}
              </PrimaryButton>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------
export function FaqSection({ content }: { content: SectionContentMap["faq"] }) {
  if (content.items.length === 0) {
    return null;
  }

  const isDark = content.theme === "dark";

  return (
    <SectionShell theme={content.theme}>
      <SectionHeading
        theme={content.theme}
        eyebrow={content.eyebrow || undefined}
        title={content.title}
        text={content.text || undefined}
      />

      <div className="mx-auto max-w-3xl space-y-3">
        {content.items.map((item, index) => (
          <details
            key={`${item.question}-${index}`}
            className={`group rounded-2xl border px-4 py-3 sm:px-5 sm:py-4 ${
              isDark
                ? "border-slate-800 bg-slate-950/80"
                : "border-slate-200 bg-white shadow-sm"
            }`}
          >
            <summary
              className={`flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold sm:text-base ${
                isDark ? "text-white" : "text-slate-950"
              }`}
            >
              <span>{item.question}</span>
              <svg
                className="h-4 w-4 shrink-0 transition-transform group-open:rotate-45 motion-reduce:transition-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </summary>
            <p
              className={`mt-3 whitespace-pre-line text-sm leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </SectionShell>
  );
}

// ---------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------
export function ContactSection({
  content,
  settings,
}: {
  content: SectionContentMap["contact"];
  settings: SiteSettings;
}) {
  const isDark = content.theme === "dark";
  const label = content.ctaLabel || settings.ctaLabel;
  const href =
    safeUrlOrNull(content.ctaUrl) ?? safeUrlOrNull(settings.ctaUrl) ?? "/contact";
  const whatsappUrl = safeUrlOrNull(settings.whatsappUrl);

  const hasDetails =
    content.showContactDetails &&
    (settings.email || settings.phone || whatsappUrl || settings.address);

  return (
    <SectionShell theme={content.theme}>
      <div className="mx-auto max-w-3xl text-center">
        {content.eyebrow ? (
          <p
            className={`mb-4 inline-flex rounded-full border px-3.5 py-1 text-xs font-semibold uppercase tracking-wider ${
              isDark
                ? "border-slate-800 bg-slate-900 text-slate-300"
                : "border-slate-200 bg-slate-100 text-slate-700"
            }`}
          >
            {content.eyebrow}
          </p>
        ) : null}

        {content.title ? (
          <h2
            className={`text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl ${
              isDark ? "text-white" : "text-slate-950"
            }`}
          >
            {content.title}
          </h2>
        ) : null}

        {content.text ? (
          <p
            className={`mt-4 text-base leading-relaxed ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {content.text}
          </p>
        ) : null}

        {hasDetails ? (
          <ul
            className={`mt-8 flex flex-col items-center gap-3 text-sm sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6 ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            {settings.email ? (
              <li>
                <a
                  className="underline-offset-4 hover:underline"
                  href={`mailto:${settings.email}`}
                >
                  {settings.email}
                </a>
              </li>
            ) : null}
            {settings.phone ? (
              <li>
                <a
                  className="underline-offset-4 hover:underline"
                  href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                >
                  {settings.phone}
                </a>
              </li>
            ) : null}
            {whatsappUrl ? (
              <li>
                <a
                  className="underline-offset-4 hover:underline"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
            ) : null}
            {settings.address ? <li>{settings.address}</li> : null}
          </ul>
        ) : null}

        {label ? (
          <div className="mt-8 flex justify-center">
            <PrimaryButton href={href} theme={content.theme}>
              {label}
            </PrimaryButton>
          </div>
        ) : null}
      </div>
    </SectionShell>
  );
}
