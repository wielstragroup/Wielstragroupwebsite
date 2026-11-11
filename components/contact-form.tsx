"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";

import { submitContactForm, type ContactField, type ContactState } from "@/app/contact/actions";
import { ArrowIcon } from "@/components/ui/primitives";
import { BUDGET_OPTIONS, REQUEST_TYPES, SERVICE_OPTIONS } from "@/lib/contact-options";

const initialState: ContactState = {};

type ContactFormProps = {
  defaultType?: string;
  defaultService?: string;
};

const inputClass =
  "w-full rounded-xl border bg-card px-4 py-3.5 text-base text-ink placeholder:text-subtle transition-colors focus:border-ink focus:outline-none focus:ring-4 focus:ring-ink/5 aria-[invalid=true]:border-signal-ink";

export function ContactForm({ defaultType = "kennismaking", defaultService = "" }: ContactFormProps) {
  const [state, action, pending] = useActionState(submitContactForm, initialState);
  const [messageLength, setMessageLength] = useState(state.values?.message?.length ?? 0);
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const values = state.values ?? {};
  const errors = state.fieldErrors ?? {};

  useEffect(() => {
    if (state.success) successRef.current?.focus();
    else if (state.error) errorRef.current?.focus();
  }, [state]);

  if (state.success) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-[1.5rem] border border-pine/30 bg-pine-soft p-8 focus:outline-none sm:p-12"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-pine text-white">
          <svg className="h-5 w-5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="m3 8.5 3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
          </svg>
        </span>
        <h2 className="mt-6 font-display text-3xl font-semibold tracking-[-0.03em]">Aanvraag verstuurd</h2>
        <p className="mt-3 max-w-lg text-lg leading-relaxed text-ink-2">{state.success}</p>
        <Link href="/" className="group mt-8 inline-flex items-center gap-2 font-semibold">
          <span className="link-underline">Terug naar de homepage</span>
          <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    );
  }

  const fieldProps = (name: ContactField) => ({
    id: `contact-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
  });

  const selectedType = values.requestType ?? defaultType;
  const selectedService = values.service ?? (SERVICE_OPTIONS.some((o) => o.value === defaultService) ? defaultService : "");

  return (
    <form action={action} noValidate className="space-y-10">
      {state.error ? (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="rounded-xl border border-signal-ink/30 bg-signal-soft px-5 py-4 text-[0.95rem] font-medium text-signal-ink focus:outline-none"
        >
          {state.error}
        </div>
      ) : null}

      {/* Stap 1 */}
      <fieldset>
        <legend className="flex items-baseline gap-3 font-display text-xl font-semibold tracking-[-0.02em]">
          <span className="font-mono text-xs font-normal text-signal-ink">01</span>
          Waarmee kan ik je helpen?
        </legend>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {REQUEST_TYPES.map((type) => (
            <label key={type.value} className="group relative cursor-pointer">
              <input
                type="radio"
                name="requestType"
                value={type.value}
                defaultChecked={selectedType === type.value}
                required
                className="peer sr-only"
              />
              <span className="flex h-full flex-col rounded-xl border border-line-strong bg-card p-4 transition-all peer-checked:border-ink peer-checked:shadow-[3px_3px_0_0_var(--color-signal)] peer-focus-visible:ring-4 peer-focus-visible:ring-signal/30 group-hover:border-ink">
                <span className="font-semibold">{type.label}</span>
                <span className="mt-1 text-sm leading-snug text-muted">{type.hint}</span>
              </span>
            </label>
          ))}
        </div>
        <FieldError name="requestType" errors={errors} />
      </fieldset>

      {/* Stap 2 */}
      <fieldset>
        <legend className="flex items-baseline gap-3 font-display text-xl font-semibold tracking-[-0.02em]">
          <span className="font-mono text-xs font-normal text-signal-ink">02</span>
          Over je project
        </legend>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field label="Onderwerp" name="service" required errors={errors}>
            <select
              {...fieldProps("service")}
              required
              defaultValue={selectedService}
              className={`${inputClass} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22><path d=%22M5 8l5 5 5-5%22 fill=%22none%22 stroke=%22%2311151a%22 stroke-width=%221.6%22/></svg>')] bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pr-10 ${errors.service ? "" : "border-line-strong"}`}
            >
              <option value="" disabled>
                Kies een onderwerp
              </option>
              {SERVICE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Indicatie budget" name="budget" optional errors={errors}>
            <select
              {...fieldProps("budget")}
              defaultValue={values.budget ?? ""}
              className={`${inputClass} appearance-none border-line-strong bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22><path d=%22M5 8l5 5 5-5%22 fill=%22none%22 stroke=%22%2311151a%22 stroke-width=%221.6%22/></svg>')] bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pr-10`}
            >
              {BUDGET_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Je vraag of situatie" name="message" required errors={errors}>
              <textarea
                {...fieldProps("message")}
                required
                rows={6}
                minLength={20}
                maxLength={3000}
                defaultValue={values.message ?? ""}
                onChange={(event) => setMessageLength(event.target.value.length)}
                placeholder="Bijvoorbeeld: we plannen onze monteurs nu in Excel en willen een systeem waarin ook klanten hun afspraak kunnen zien."
                className={`${inputClass} resize-y ${errors.message ? "" : "border-line-strong"}`}
              />
            </Field>
            <p className="mt-2 flex justify-between font-mono text-xs text-subtle" aria-live="polite">
              <span>{messageLength < 20 ? `Nog minimaal ${20 - messageLength} tekens` : "Genoeg om mee te beginnen"}</span>
              <span>{messageLength} / 3000</span>
            </p>
          </div>
        </div>
      </fieldset>

      {/* Stap 3 */}
      <fieldset>
        <legend className="flex items-baseline gap-3 font-display text-xl font-semibold tracking-[-0.02em]">
          <span className="font-mono text-xs font-normal text-signal-ink">03</span>
          Je gegevens
        </legend>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field label="Naam" name="name" required errors={errors}>
            <input
              {...fieldProps("name")}
              required
              autoComplete="name"
              defaultValue={values.name ?? ""}
              className={`${inputClass} ${errors.name ? "" : "border-line-strong"}`}
            />
          </Field>
          <Field label="Bedrijfsnaam" name="companyName" optional errors={errors}>
            <input
              {...fieldProps("companyName")}
              autoComplete="organization"
              defaultValue={values.companyName ?? ""}
              className={`${inputClass} ${errors.companyName ? "" : "border-line-strong"}`}
            />
          </Field>
          <Field label="E-mailadres" name="email" required errors={errors}>
            <input
              {...fieldProps("email")}
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              defaultValue={values.email ?? ""}
              className={`${inputClass} ${errors.email ? "" : "border-line-strong"}`}
            />
          </Field>
          <Field label="Telefoonnummer" name="phone" optional errors={errors}>
            <input
              {...fieldProps("phone")}
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              defaultValue={values.phone ?? ""}
              className={`${inputClass} ${errors.phone ? "" : "border-line-strong"}`}
            />
          </Field>
        </div>
      </fieldset>

      {/* Anti-spam honeypot: onzichtbaar voor mensen en hulptechnologie */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="space-y-6 border-t border-line pt-8">
        <div>
          <label className="flex cursor-pointer items-start gap-3 text-[0.95rem] leading-relaxed text-muted">
            <input
              {...fieldProps("consent")}
              type="checkbox"
              required
              defaultChecked={values.consent === "on"}
              className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-ink)]"
            />
            <span>
              Ik ga akkoord met het verwerken van mijn gegevens om mijn aanvraag te beantwoorden, zoals beschreven in het{" "}
              <Link href="/privacybeleid" className="font-medium text-ink underline underline-offset-2">
                privacybeleid
              </Link>
              .
            </span>
          </label>
          <FieldError name="consent" errors={errors} />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="group inline-flex min-h-13 w-full items-center justify-center gap-3 rounded-full bg-ink px-8 py-4 font-semibold text-paper transition-colors hover:bg-signal disabled:cursor-wait disabled:opacity-60 sm:w-auto"
        >
          {pending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-paper/30 border-t-paper" aria-hidden="true" />
              Versturen…
            </>
          ) : (
            <>
              Verstuur aanvraag
              <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  required,
  optional,
  errors,
  children,
}: {
  label: string;
  name: ContactField;
  required?: boolean;
  optional?: boolean;
  errors: Partial<Record<ContactField, string>>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={`contact-${name}`} className="mb-2 flex items-baseline gap-2 text-[0.92rem] font-semibold">
        {label}
        {required ? (
          <span className="text-signal-ink" aria-hidden="true">
            *
          </span>
        ) : null}
        {optional ? <span className="font-normal text-subtle">(optioneel)</span> : null}
      </label>
      {children}
      <FieldError name={name} errors={errors} />
    </div>
  );
}

function FieldError({ name, errors }: { name: ContactField; errors: Partial<Record<ContactField, string>> }) {
  if (!errors[name]) return null;
  return (
    <p id={`contact-${name}-error`} className="mt-2 text-sm font-medium text-signal-ink">
      {errors[name]}
    </p>
  );
}
