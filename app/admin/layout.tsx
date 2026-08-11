import Link from "next/link";

import { logoutAction } from "@/app/admin/login/actions";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/projects", label: "Portfolio" },
  { href: "/admin/projects/new", label: "Nieuw project" },
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
    return <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>;
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <aside className="hidden w-64 shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:block">
        <p className="mb-4 text-sm font-semibold text-slate-900">Beheer</p>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction} className="mt-6">
          <button type="submit" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
            Uitloggen
          </button>
        </form>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
