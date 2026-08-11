"use client";

import { useActionState } from "react";

import { submitContactForm, type ContactState } from "@/app/contact/actions";

const initialState: ContactState = {};

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContactForm, initialState);

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-slate-700">
          Naam
          <input name="name" required className="rounded-xl border border-slate-300 px-3 py-2" />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-700">
          Bedrijfsnaam
          <input name="companyName" required className="rounded-xl border border-slate-300 px-3 py-2" />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-700 sm:col-span-2">
          E-mail
          <input type="email" name="email" required className="rounded-xl border border-slate-300 px-3 py-2" />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-700 sm:col-span-2">
          Bericht
          <textarea name="message" required rows={6} className="rounded-xl border border-slate-300 px-3 py-2" />
        </label>
      </div>

      <label className="hidden" aria-hidden>
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
      >
        {pending ? "Verzenden..." : "Verstuur bericht"}
      </button>

      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-emerald-700">{state.success}</p> : null}
    </form>
  );
}
