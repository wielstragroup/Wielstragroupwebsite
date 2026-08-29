/**
 * Kleine, bewust beperkte markup voor de juridische pagina's, zodat de
 * inhoud via een simpel tekstveld in het dashboard bewerkbaar is zonder
 * een rich-text-editor of markdown-library nodig te hebben.
 *
 * Ondersteund:
 *   ## Kop 2
 *   ### Kop 3
 *   - Lijstitem
 *   **vet**
 *   [linktekst](url)
 *   {{companyName}} / {{email}} / {{phone}} / {{address}} als placeholders
 */

export type LegalInline =
  | { type: "text"; value: string }
  | { type: "bold"; value: string }
  | { type: "link"; label: string; url: string };

export type LegalBlock =
  | { type: "h2"; inline: LegalInline[] }
  | { type: "h3"; inline: LegalInline[] }
  | { type: "p"; inline: LegalInline[] }
  | { type: "ul"; items: LegalInline[][] };

const INLINE_PATTERN = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;

export function parseInline(text: string): LegalInline[] {
  const result: LegalInline[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  INLINE_PATTERN.lastIndex = 0;
  while ((match = INLINE_PATTERN.exec(text))) {
    if (match.index > lastIndex) {
      result.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }

    if (match[1] !== undefined) {
      result.push({ type: "bold", value: match[1] });
    } else if (match[2] !== undefined && match[3] !== undefined) {
      result.push({ type: "link", label: match[2], url: match[3] });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    result.push({ type: "text", value: text.slice(lastIndex) });
  }

  return result;
}

export function parseLegalContent(raw: string): LegalBlock[] {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const blocks: LegalBlock[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];

  function flushParagraph() {
    if (paragraphLines.length > 0) {
      blocks.push({ type: "p", inline: parseInline(paragraphLines.join(" ")) });
      paragraphLines = [];
    }
  }

  function flushList() {
    if (listItems.length > 0) {
      blocks.push({ type: "ul", items: listItems.map((item) => parseInline(item)) });
      listItems = [];
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line === "") {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h3", inline: parseInline(line.slice(4)) });
      continue;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h2", inline: parseInline(line.slice(3)) });
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      listItems.push(line.slice(2));
      continue;
    }

    flushList();
    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();

  return blocks;
}

const PLACEHOLDER_PATTERN = /\{\{(\w+)\}\}/g;

export function fillPlaceholders(text: string, values: Record<string, string>): string {
  return text.replace(PLACEHOLDER_PATTERN, (match, key: string) => values[key] ?? match);
}
