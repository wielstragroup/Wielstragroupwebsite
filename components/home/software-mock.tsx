/**
 * Abstracte weergave van een maatwerkapplicatie (planning/overzicht).
 * Bewust zonder echte cijfers of klantdata: het illustreert de vorm,
 * niet een bestaand project.
 */
export function SoftwareMock({ className = "" }: { className?: string }) {
  const rows = [
    [1, 3, "signal"],
    [2, 2, "pine"],
    [0, 2, "ink"],
    [3, 2, "signal"],
    [1, 2, "pine"],
  ] as const;

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/10 bg-[#1a1f26] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)] ${className}`}
      aria-hidden="true"
    >
      {/* Vensterbalk */}
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-3 h-5 flex-1 rounded-md bg-white/5 px-3 font-mono text-[0.6rem] leading-5 text-white/40">
          app.jouwbedrijf.nl/planning
        </span>
      </div>

      <div className="grid grid-cols-[3.25rem_1fr] sm:grid-cols-[9rem_1fr]">
        {/* Zijbalk */}
        <div className="space-y-2 border-r border-white/10 p-3">
          {[1, 0, 0, 0, 0].map((on, i) => (
            <div key={i} className={`flex items-center gap-2 rounded-md p-1.5 ${on ? "bg-white/10" : ""}`}>
              <span className={`h-3 w-3 shrink-0 rounded-sm ${on ? "bg-signal" : "bg-white/20"}`} />
              <span className="hidden h-2 flex-1 rounded bg-white/15 sm:block" />
            </div>
          ))}
        </div>

        {/* Planningsraster */}
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="h-3 w-28 rounded bg-white/25" />
            <span className="h-6 w-16 rounded-md bg-signal/90" />
          </div>
          <div className="grid grid-cols-5 gap-1.5 border-b border-white/10 pb-2">
            {["ma", "di", "wo", "do", "vr"].map((d) => (
              <span key={d} className="font-mono text-[0.6rem] uppercase text-white/40">
                {d}
              </span>
            ))}
          </div>
          <div className="mt-3 space-y-2">
            {rows.map(([start, span, tone], i) => (
              <div key={i} className="grid grid-cols-5 gap-1.5">
                <span
                  className={`h-6 rounded-md ${
                    tone === "signal" ? "bg-signal/80" : tone === "pine" ? "bg-[#2f9c8c]/80" : "bg-white/25"
                  }`}
                  style={{ gridColumn: `${start + 1} / span ${span}` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-lg border border-white/10 p-2.5">
                <span className="block h-1.5 w-10 rounded bg-white/20" />
                <span className="mt-2 block h-3 w-14 rounded bg-white/40" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
