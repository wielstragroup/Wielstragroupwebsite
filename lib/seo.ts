import type { Metadata } from "next";

export const DEFAULT_TITLE = "Wielstra Group | Maatwerksoftware, automatisering en websites";
export const DEFAULT_DESCRIPTION =
  "Wielstra Group ontwikkelt maatwerksoftware, bedrijfsautomatisering, AI-integraties en websites voor ondernemers die verder willen dan standaard.";

/** Paginametadata met canonical en Open Graph in één keer. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website", locale: "nl_NL" },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** Veilige serialisatie van JSON-LD voor gebruik in een <script>-tag. */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
