import type { Metadata } from "next";

import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Analytics",
  robots: { index: false, follow: false },
};

const DAYS = 14;

type PageViewRow = { path: string; visitor_hash: string; created_at: string };

function startOfDaysAgo(days: number): string {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - (days - 1));
  return date.toISOString();
}

export default async function AdminAnalyticsPage() {
  const { supabase } = await requireAdmin();

  const since = startOfDaysAgo(DAYS);
  const { data: rows } = await supabase
    .from("page_views")
    .select("path,visitor_hash,created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(20000);

  const views: PageViewRow[] = rows ?? [];

  const totalViews = views.length;
  const uniqueVisitors = new Set(views.map((v) => v.visitor_hash)).size;

  const perPath = new Map<string, number>();
  for (const view of views) {
    perPath.set(view.path, (perPath.get(view.path) ?? 0) + 1);
  }
  const topPages = [...perPath.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);

  const perDay = new Map<string, number>();
  for (let i = 0; i < DAYS; i++) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (DAYS - 1 - i));
    perDay.set(date.toISOString().slice(0, 10), 0);
  }
  for (const view of views) {
    const day = view.created_at.slice(0, 10);
    if (perDay.has(day)) {
      perDay.set(day, (perDay.get(day) ?? 0) + 1);
    }
  }
  const dailyCounts = [...perDay.entries()];
  const maxDaily = Math.max(1, ...dailyCounts.map(([, count]) => count));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Analytics</h1>
        <p className="mt-1 text-sm text-slate-500">
          Privacyvriendelijke, cookieloze bezoekstatistieken van de afgelopen {DAYS} dagen.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Paginaweergaven</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{totalViews}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Unieke bezoekers (per dag geteld)</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{uniqueVisitors}</p>
        </article>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Weergaven per dag</h2>
        {totalViews === 0 ? (
          <p className="mt-3 text-sm text-slate-500">Nog geen bezoekgegevens.</p>
        ) : (
          <div className="mt-4 flex h-40 items-end gap-1.5">
            {dailyCounts.map(([day, count]) => (
              <div key={day} className="flex flex-1 flex-col items-center gap-1.5">
                <div
                  className="w-full rounded-t-md bg-slate-900"
                  style={{ height: `${Math.max(4, (count / maxDaily) * 100)}%` }}
                  title={`${day}: ${count} weergaven`}
                />
                <span className="text-[10px] text-slate-400">
                  {new Date(day).toLocaleDateString("nl-NL", { day: "numeric", month: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Populairste pagina&apos;s</h2>
        {topPages.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">Nog geen bezoekgegevens.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {topPages.map(([path, count]) => (
              <li key={path} className="flex items-center gap-3 text-sm">
                <span className="min-w-0 flex-1 truncate font-medium text-slate-700">{path}</span>
                <span className="shrink-0 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  {count}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
