"use client";

import { useEffect, useState } from "react";

import { LogoMark } from "@/components/brand/logo";

/**
 * Interactieve systeemkaart: modules rondom "jouw bedrijf", verbonden
 * via sporen zoals op een printplaat. Hover/focus licht een verbinding op;
 * zonder interactie loopt de kaart zelf rustig door de modules.
 */

const W = 600;
const H = 560;
const NODE_W = 152;
const NODE_H = 46;

const nodes = [
  { id: "web", label: "Website", x: 88, y: 96, text: "Je digitale voordeur, direct gekoppeld aan de rest van je bedrijf." },
  { id: "plan", label: "Planning", x: 88, y: 280, text: "Roosters, afspraken en capaciteit in één overzicht, zonder Excel." },
  { id: "stock", label: "Voorraad", x: 88, y: 464, text: "Actueel inzicht in voorraad, orders en leveringen." },
  { id: "crm", label: "CRM", x: 512, y: 96, text: "Klanten, contactmomenten en offertes op één plek." },
  { id: "ai", label: "AI", x: 512, y: 280, text: "Documenten, e-mails en gegevens automatisch verwerkt." },
  { id: "dash", label: "Dashboard", x: 512, y: 464, text: "De cijfers die ertoe doen, altijd actueel." },
] as const;

const HUB = { x: 300, y: 280, w: 176, h: 72 };

function tracePath(node: (typeof nodes)[number]) {
  const left = node.x < HUB.x;
  const startX = left ? HUB.x - HUB.w / 2 : HUB.x + HUB.w / 2;
  const startY = HUB.y + (node.y < HUB.y ? -18 : node.y > HUB.y ? 18 : 0);
  const midX = left ? 190 : 410;
  const endX = left ? node.x + NODE_W / 2 : node.x - NODE_W / 2;
  return `M${startX} ${startY} H${midX} V${node.y} H${endX}`;
}

const pct = (value: number, total: number) => `${(value / total) * 100}%`;

export function SystemMap() {
  const [active, setActive] = useState(0);
  const [interacting, setInteracting] = useState(false);

  useEffect(() => {
    if (interacting) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((i) => (i + 1) % nodes.length), 2800);
    return () => window.clearInterval(timer);
  }, [interacting]);

  const current = nodes[active];

  return (
    <figure
      className="relative w-full select-none"
      onMouseLeave={() => setInteracting(false)}
      aria-label="Schematische weergave: modules die samen één bedrijfssysteem vormen"
    >
      <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
          {nodes.map((node, i) => {
            const d = tracePath(node);
            const on = i === active;
            return (
              <g key={node.id}>
                <path d={d} fill="none" stroke="var(--color-line-strong)" strokeWidth="1.5" />
                <path
                  d={d}
                  fill="none"
                  stroke="var(--color-signal)"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  className="animate-dash transition-opacity duration-500"
                  style={{ opacity: on ? 1 : 0 }}
                />
                {/* Soldeerpunt op de bocht */}
                <rect
                  x={(node.x < HUB.x ? 190 : 410) - 3}
                  y={node.y - 3}
                  width="6"
                  height="6"
                  fill={on ? "var(--color-signal)" : "var(--color-line-strong)"}
                  className="transition-colors duration-500"
                />
              </g>
            );
          })}
        </svg>

        {/* Centrale hub */}
        <div
          className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-2 rounded-xl bg-ink px-3 text-paper shadow-[0_18px_40px_-18px_rgb(17_21_26/0.6)]"
          style={{ left: pct(HUB.x, W), top: pct(HUB.y, H), width: pct(HUB.w, W), height: pct(HUB.h, H) }}
        >
          <LogoMark className="h-[38%] w-auto shrink-0" />
          <span className="font-display text-[clamp(0.62rem,2.2vw,1rem)] font-semibold leading-tight tracking-[-0.02em]">
            Jouw bedrijf
          </span>
        </div>

        {nodes.map((node, i) => {
          const on = i === active;
          return (
            <button
              key={node.id}
              type="button"
              onMouseEnter={() => {
                setInteracting(true);
                setActive(i);
              }}
              onFocus={() => {
                setInteracting(true);
                setActive(i);
              }}
              onBlur={() => setInteracting(false)}
              onClick={() => {
                setInteracting(true);
                setActive(i);
              }}
              aria-pressed={on}
              className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-between gap-1 rounded-lg border px-[3%] text-[clamp(0.66rem,2vw,0.9rem)] font-semibold tracking-[-0.01em] transition-all duration-300 ${
                on
                  ? "border-ink bg-card text-ink shadow-[4px_4px_0_0_var(--color-signal)]"
                  : "border-line-strong bg-paper text-muted hover:border-ink hover:text-ink"
              }`}
              style={{ left: pct(node.x, W), top: pct(node.y, H), width: pct(NODE_W, W), height: pct(NODE_H, H) }}
            >
              <span className="truncate">{node.label}</span>
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${on ? "bg-signal" : "bg-line-strong"}`}
              />
            </button>
          );
        })}
      </div>

      <figcaption className="mt-5 flex min-h-[3.25rem] items-start gap-3 border-t border-line pt-4 text-[0.95rem] leading-snug text-muted">
        <span className="mt-0.5 font-mono text-xs uppercase tracking-[0.14em] text-signal-ink">{current.label}</span>
        <span>{current.text}</span>
      </figcaption>
    </figure>
  );
}
