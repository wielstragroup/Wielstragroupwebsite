import type { Metadata } from "next";

import { loginAction } from "@/app/admin/login/actions";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <section className="mx-auto flex w-full max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <form action={loginAction} className="w-full space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">Admin login</h1>
        <label className="flex flex-col gap-2 text-sm text-slate-700">
          E-mail
          <input type="email" name="email" required className="rounded-xl border border-slate-300 px-3 py-2" />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-700">
          Wachtwoord
          <input type="password" name="password" required className="rounded-xl border border-slate-300 px-3 py-2" />
        </label>
        <button type="submit" className="w-full rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">
          Inloggen
        </button>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
      </form>
    </section>
  );
}
