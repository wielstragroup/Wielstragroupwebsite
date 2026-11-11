import { jsonLd } from "@/lib/seo";

export type FaqItem = { q: string; a: string };

/** Toegankelijke FAQ op basis van <details>, inclusief FAQPage structured data. */
export function Faq({ items }: { items: FaqItem[] }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(ld)} />
      <div className="border-t border-ink">
        {items.map((item) => (
          <details key={item.q} className="group border-b border-line">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-xl font-semibold tracking-[-0.02em] [&::-webkit-details-marker]:hidden">
              {item.q}
              <span
                aria-hidden="true"
                className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line-strong transition-colors group-open:border-ink group-open:bg-ink"
              >
                <span className="absolute h-[1.5px] w-3.5 bg-ink transition-colors group-open:bg-paper" />
                <span className="absolute h-3.5 w-[1.5px] bg-ink transition-transform duration-300 group-open:rotate-90 group-open:bg-paper" />
              </span>
            </summary>
            <p className="max-w-3xl pb-7 text-lg leading-relaxed text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </>
  );
}
