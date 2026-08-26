import type { ReactNode } from "react";

/**
 * Gedeelde, responsive formulier-bouwstenen voor het dashboard.
 * Bewust server-componenten: geen state nodig.
 */

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function TextField({
  name,
  label,
  defaultValue = "",
  placeholder,
  hint,
  type = "text",
  required = false,
  full = false,
  maxLength,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  hint?: string;
  type?: "text" | "email" | "url" | "tel";
  required?: boolean;
  full?: boolean;
  maxLength?: number;
}) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm ${full ? "sm:col-span-2" : ""}`}>
      <span className="font-medium text-slate-800">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className="rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
      />
      {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

export function TextAreaField({
  name,
  label,
  defaultValue = "",
  placeholder,
  hint,
  rows = 3,
  maxLength,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  hint?: string;
  rows?: number;
  maxLength?: number;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
      <span className="font-medium text-slate-800">{label}</span>
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
        maxLength={maxLength}
        className="rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
      />
      {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

export function CheckboxField({
  name,
  label,
  defaultChecked = false,
  hint,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
  hint?: string;
}) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm sm:col-span-2">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-400"
      />
      <span>
        <span className="font-medium text-slate-800">{label}</span>
        {hint ? <span className="block text-xs text-slate-500">{hint}</span> : null}
      </span>
    </label>
  );
}

export function StatusMessage({
  success,
  error,
}: {
  success?: string;
  error?: string;
}) {
  if (!success && !error) {
    return null;
  }

  return (
    <div role="status" aria-live="polite">
      {success ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-900 ring-1 ring-emerald-200">
          {success}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-900 ring-1 ring-red-200">
          {error}
        </p>
      ) : null}
    </div>
  );
}
