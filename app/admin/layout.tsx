import Link from "next/link";

import { logoutAction } from "@/app/admin/login/actions";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/home", label: "Homepagina" },
  { href: "/admin/media", label: "Mediabibliotheek" },
  { href: "/admin/projects", label: "Portfolio" },
  { href: "/admin/projects/new", label: "Nieuw project" },
  { href: "/admin/settings", label: "Website-instellingen" },
];

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  let isAdmin = false;
  const supabase = await createServerSupabaseClient();

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      isAdmin = profile?.role === "admin";
    }
  }

  if (!isAdmin) {
    return (
      <div className="min-h-full bg-slate-100 text-slate-900">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-100 text-slate-900">
    <div className="mx-auto w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 md:flex lg:px-8 lg:py-8">
      {/* Mobiele navigatie: horizontaal scrollbaar, blijft bruikbaar op 320px */}
      <nav
        aria-label="Beheer"
        className="-mx-4 mb-5 overflow-x-auto border-b border-slate-200 px-4 pb-3 md:hidden"
      >
        <ul className="flex w-max gap-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <form action={logoutAction}>
              <button
                type="submit"
                className="whitespace-nowrap rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                Uitloggen
              </button>
            </form>
          </li>
        </ul>
      </nav>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 self-start rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:block">
        <p className="mb-4 text-sm font-semibold text-slate-900">Beheer</p>
        <nav aria-label="Beheer">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <form action={logoutAction} className="mt-6">
          <button
            type="submit"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
          >
            Uitloggen
          </button>
        </form>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
    </div>
  );
}
