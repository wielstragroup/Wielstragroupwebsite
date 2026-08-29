import type { ReactNode } from "react";

type LegalPageProps = {
  title: string;
  updated: string;
  intro?: string;
  children: ReactNode;
};

export function LegalPage({ title, updated, intro, children }: LegalPageProps) {
  return (
    <div className="bg-slate-950 text-slate-100">
      <section className="border-b border-slate-800 bg-slate-950 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm text-slate-400">Laatst bijgewerkt: {updated}</p>
          {intro ? <p className="mt-4 text-base leading-relaxed text-slate-300">{intro}</p> : null}
        </div>
      </section>

      <section className="bg-slate-50 py-16 text-slate-900 sm:py-20">
        <div
          className="mx-auto max-w-3xl space-y-10 px-4 sm:px-6 lg:px-8
            [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-slate-950
            [&_h3]:mt-5 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-slate-900
            [&_p]:mt-3 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-slate-700
            [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ul]:text-sm [&_ul]:leading-relaxed [&_ul]:text-slate-700
            [&_a]:font-medium [&_a]:text-slate-900 [&_a]:underline [&_a]:underline-offset-2
            [&_table]:mt-4 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm
            [&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-100 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold
            [&_td]:border [&_td]:border-slate-200 [&_td]:px-3 [&_td]:py-2 [&_td]:align-top"
        >
          {children}
        </div>
      </section>
    </div>
  );
}
