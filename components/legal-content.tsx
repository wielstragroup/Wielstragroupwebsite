import type { LegalInline } from "@/lib/legal-content";
import { parseLegalContent } from "@/lib/legal-content";
import { safeUrlOrNull } from "@/lib/security";

function renderInline(inline: LegalInline[], keyPrefix: string) {
  return inline.map((part, index) => {
    const key = `${keyPrefix}-${index}`;

    if (part.type === "bold") {
      return <strong key={key}>{part.value}</strong>;
    }

    if (part.type === "link") {
      const href = safeUrlOrNull(part.url);
      if (!href) {
        return <span key={key}>{part.label}</span>;
      }
      const isExternal = href.startsWith("http");
      return (
        <a key={key} href={href} {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {part.label}
        </a>
      );
    }

    return <span key={key}>{part.value}</span>;
  });
}

export function LegalContent({ content }: { content: string }) {
  const blocks = parseLegalContent(content);

  return (
    <>
      {blocks.map((block, index) => {
        const key = `block-${index}`;

        if (block.type === "h2") {
          return <h2 key={key}>{renderInline(block.inline, key)}</h2>;
        }

        if (block.type === "h3") {
          return <h3 key={key}>{renderInline(block.inline, key)}</h3>;
        }

        if (block.type === "ul") {
          return (
            <ul key={key}>
              {block.items.map((item, itemIndex) => (
                <li key={`${key}-${itemIndex}`}>{renderInline(item, `${key}-${itemIndex}`)}</li>
              ))}
            </ul>
          );
        }

        return <p key={key}>{renderInline(block.inline, key)}</p>;
      })}
    </>
  );
}
