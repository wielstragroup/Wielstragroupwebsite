"use server";

import { Resend } from "resend";

import { BUDGET_OPTIONS, labelFor, REQUEST_TYPES, SERVICE_OPTIONS } from "@/lib/contact-options";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request";
import { escapeHtml, escapeHtmlMultiline, sanitizeEmailHeader } from "@/lib/security";
import { getSiteSettings } from "@/lib/site-settings";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { contactSchema } from "@/lib/validation";

export type ContactField =
  | "requestType"
  | "service"
  | "budget"
  | "name"
  | "companyName"
  | "email"
  | "phone"
  | "message"
  | "consent";

export type ContactState = {
  success?: string;
  error?: string;
  fieldErrors?: Partial<Record<ContactField, string>>;
  /** Ingevulde waarden, zodat het formulier na een fout niet leeg raakt. */
  values?: Partial<Record<ContactField, string>>;
};

/** Max 5 inzendingen per IP per 10 minuten. */
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

const DEFAULT_SUCCESS = "Bedankt voor je bericht! Ik heb je aanvraag ontvangen en neem zo snel mogelijk contact met je op.";

export async function submitContactForm(_: ContactState, formData: FormData): Promise<ContactState> {
  const read = (key: string) => String(formData.get(key) ?? "");

  const payload = {
    requestType: read("requestType"),
    service: read("service"),
    budget: read("budget"),
    name: read("name"),
    companyName: read("companyName"),
    email: read("email"),
    phone: read("phone"),
    message: read("message"),
    consent: read("consent"),
    website: read("website"),
  };

  const values: ContactState["values"] = {
    requestType: payload.requestType,
    service: payload.service,
    budget: payload.budget,
    name: payload.name,
    companyName: payload.companyName,
    email: payload.email,
    phone: payload.phone,
    message: payload.message,
    consent: payload.consent,
  };

  const settings = await getSiteSettings();

  if (!settings.contactFormEnabled) {
    return { error: "Het contactformulier is tijdelijk uitgeschakeld. Je kunt me bereiken via e-mail of telefoon.", values };
  }

  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as ContactField;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: "Controleer de gemarkeerde velden.", fieldErrors, values };
  }

  const data = parsed.data;

  // Honeypot tegen spam. Bewust dezelfde melding als bij succes,
  // zodat een bot niet kan afleiden dat hij herkend is.
  if (data.website) {
    return { success: DEFAULT_SUCCESS };
  }

  const ip = await getClientIp();
  const rate = checkRateLimit(`contact:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);

  if (!rate.allowed) {
    const minutes = Math.ceil(rate.retryAfterSeconds / 60);
    return {
      error: `Je hebt te veel berichten verstuurd. Probeer het over ${minutes} minuut${minutes === 1 ? "" : "en"} opnieuw.`,
      values,
    };
  }

  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return { error: "Het contactformulier werkt op dit moment niet. Mail me gerust rechtstreeks.", values };
  }

  const requestLabel = labelFor(REQUEST_TYPES, data.requestType) ?? data.requestType;
  const serviceLabel = labelFor(SERVICE_OPTIONS, data.service) ?? data.service;
  const budgetLabel = labelFor(BUDGET_OPTIONS, data.budget);

  const baseRow = {
    name: data.name,
    company_name: data.companyName,
    email: data.email,
    message: data.message,
  };

  // 1. Opslaan in Supabase, inclusief de nieuwe velden.
  let { error } = await supabase.from("contact_messages").insert({
    ...baseRow,
    request_type: data.requestType,
    service: data.service,
    budget: data.budget || null,
    phone: data.phone || null,
  });

  // Is de migratie met de nieuwe kolommen nog niet uitgevoerd? Dan slaan we
  // de extra gegevens op in het bericht zelf, zodat er niets verloren gaat.
  if (error && (error.code === "PGRST204" || error.code === "42703")) {
    const details = [
      `Type aanvraag: ${requestLabel}`,
      `Onderwerp: ${serviceLabel}`,
      budgetLabel ? `Budget: ${budgetLabel}` : null,
      data.phone ? `Telefoon: ${data.phone}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    ({ error } = await supabase
      .from("contact_messages")
      .insert({ ...baseRow, message: `${details}\n\n${data.message}` }));
  }

  if (error) {
    console.error("Contactformulier opslaan mislukt:", error.code, error.message);
    return {
      error: settings.contactFormErrorMessage || "Versturen is niet gelukt. Probeer het later opnieuw.",
      values,
    };
  }

  // 2. Notificatie per e-mail via Resend.
  const resendApiKey = process.env.RESEND_API_KEY;
  const recipient = settings.contactFormRecipient || settings.email || process.env.CONTACT_RECIPIENT_EMAIL;
  const successMessage = settings.contactFormSuccessMessage || DEFAULT_SUCCESS;

  if (!resendApiKey || !recipient) {
    if (!resendApiKey) console.error("RESEND_API_KEY ontbreekt; aanvraag staat wel in de database.");
    if (!recipient) console.error("Geen ontvanger ingesteld voor het contactformulier.");
    return { success: successMessage };
  }

  const fromAddress = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const resend = new Resend(resendApiKey);

  // Alle bezoekerswaarden worden ge-escaped (voorkomt HTML/e-mail-injectie).
  const rows: [string, string][] = [
    ["Type aanvraag", requestLabel],
    ["Onderwerp", serviceLabel],
    ["Budget", budgetLabel ?? "Niet opgegeven"],
    ["Naam", data.name],
    ["Bedrijf", data.companyName || "Niet opgegeven"],
    ["E-mail", data.email],
    ["Telefoon", data.phone || "Niet opgegeven"],
  ];

  try {
    await resend.emails.send({
      from: `${sanitizeEmailHeader(settings.companyName)} <${fromAddress}>`,
      to: [recipient],
      subject: sanitizeEmailHeader(`${settings.contactFormSubject || "Nieuwe aanvraag"} (${requestLabel}): ${data.name}`),
      replyTo: sanitizeEmailHeader(data.email),
      html: `
        <h2>Nieuwe aanvraag via de website</h2>
        <table cellpadding="6" style="border-collapse:collapse">
          ${rows
            .map(([label, value]) => `<tr><td><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value)}</td></tr>`)
            .join("")}
        </table>
        <h3>Bericht</h3>
        <p>${escapeHtmlMultiline(data.message)}</p>
      `,
    });
  } catch (emailError) {
    // De aanvraag staat al veilig in Supabase; geen fout tonen aan de bezoeker.
    console.error("Resend error:", emailError);
  }

  return { success: successMessage };
}
