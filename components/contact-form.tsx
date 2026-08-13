"use client";

import { useActionState, useState } from "react";
import { submitContactForm, type ContactState } from "@/app/contact/actions";

const initialState: ContactState = {};

export function ContactForm({ theme = "light" }: { theme?: "dark" | "light" }) {
const [state, action, pending] = useActionState(submitContactForm, initialState);
const [messageLength, setMessageLength] = useState(0);
const isDark = theme === "dark";
  return (
    <form
      action={action}
      className={`space-y-6 rounded-3xl p-6 sm:p-8 border transition-all shadow-xl ${
        isDark
          ? "border-slate-800 bg-slate-900 text-white"
          : "border-slate-200/80 bg-white text-slate-900 shadow-slate-200/60"
      }`}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-semibold">
          <span>Naam <span className="text-slate-500">*</span></span>
          <input
            name="name"
            required
            placeholder="Je voor- en achternaam"
            className={`rounded-xl border px-4 py-3 text-sm transition focus:outline-none focus:ring-2 ${
              isDark
                ? "border-slate-800 bg-slate-950 text-white placeholder-slate-500 focus:border-slate-400 focus:ring-slate-700"
                : "border-slate-300 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:bg-white focus:ring-slate-900/10"
            }`}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold">
          <span>Bedrijfsnaam <span className="text-slate-500">(optioneel)</span></span>
          <input
            name="companyName"
            required
            placeholder="Jouw bedrijfsnaam"
            className={`rounded-xl border px-4 py-3 text-sm transition focus:outline-none focus:ring-2 ${
              isDark
                ? "border-slate-800 bg-slate-950 text-white placeholder-slate-500 focus:border-slate-400 focus:ring-slate-700"
                : "border-slate-300 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:bg-white focus:ring-slate-900/10"
            }`}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold sm:col-span-2">
          <span>E-mailadres <span className="text-slate-500">*</span></span>
          <input
            type="email"
            name="email"
            required
            placeholder="naam@bedrijf.nl"
            className={`rounded-xl border px-4 py-3 text-sm transition focus:outline-none focus:ring-2 ${
              isDark
                ? "border-slate-800 bg-slate-950 text-white placeholder-slate-500 focus:border-slate-400 focus:ring-slate-700"
                : "border-slate-300 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:bg-white focus:ring-slate-900/10"
            }`}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold sm:col-span-2">
          <span>Bericht <span className="text-slate-500">*</span></span>
          <textarea
  name="message"
  required
  rows={5}
  maxLength={3000}
  onChange={(e) => setMessageLength(e.target.value.length)}
  placeholder="Waar kunnen we je mee helpen?"
  className={`rounded-xl border px-4 py-3 text-sm transition focus:outline-none focus:ring-2 ${
    isDark
      ? "border-slate-800 bg-slate-950 text-white placeholder-slate-500 focus:border-slate-400 focus:ring-slate-700"
      : "border-slate-300 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:bg-white focus:ring-slate-900/10"
  }`}
/>
<div className="flex items-center justify-between text-xs font-normal text-slate-500">
  <span>
    {messageLength < 20
      ? `Nog ${20 - messageLength} tekens`
      : "Voldoende tekens"}
  </span>
  <span>{messageLength} / 3000 tekens</span>
</div>
        </label>
      </div>

      {/* Anti-spam honeypot */}
      <label className="hidden" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800 active:scale-98 disabled:opacity-50 sm:w-auto"
      >
        {pending ? (
          <>
            <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Verzenden...</span>
          </>
        ) : (
          <>
            <span>Verstuur bericht</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </button>

      {state.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {state.error}
        </div>
      ) : null}
      {state.success ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
          {state.success}
        </div>
      ) : null}
    </form>
  );
}
