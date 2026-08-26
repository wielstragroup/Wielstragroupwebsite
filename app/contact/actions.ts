"use server";

import { headers } from "next/headers";
import { Resend } from "resend";

import { getSiteSettings } from "@/lib/site-settings";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  escapeHtml,
  escapeHtmlMultiline,
  sanitizeEmailHeader,
} from "@/lib/security";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { contactSchema } from "@/lib/validation";

export type ContactState = {
  success?: string;
  error?: string;
};

/** Max 5 inzendingen per IP per 10 minuten. */
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

async function getClientIp(): Promise<string> {
  const headerList = await headers();

  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) {
    // Eerste waarde is de oorspronkelijke client.
    return forwardedFor.split(",")[0]!.trim();
  }

  return headerList.get("x-real-ip") ?? "unknown";
}

export async function submitContactForm(
  _: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const payload = {
    name: String(formData.get("name") ?? ""),
    companyName: String(formData.get("companyName") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
    website: String(formData.get("website") ?? ""),
  };

  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return { error: "Controleer je invoer en probeer opnieuw." };
  }

  // Honeypot tegen spam. Bewust dezelfde melding als bij succes,
  // zodat een bot niet kan afleiden dat hij herkend is.
  if (parsed.data.website) {
    return { success: "Bedankt! Je bericht is ontvangen." };
  }

  // Rate limiting op IP-niveau.
  const ip = await getClientIp();
  const rate = checkRateLimit(`contact:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);

  if (!rate.allowed) {
    const minutes = Math.ceil(rate.retryAfterSeconds / 60);
    return {
      error: `Je hebt te veel berichten verstuurd. Probeer het over ${minutes} minuut${
        minutes === 1 ? "" : "en"
      } opnieuw.`,
    };
  }

  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return { error: "Contactformulier is nog niet geconfigureerd." };
  }

  // 1. Bericht opslaan in Supabase.
  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    company_name: parsed.data.companyName,
    email: parsed.data.email,
    message: parsed.data.message,
  });

  if (error) {
    return { error: "Opslaan mislukt. Probeer het later opnieuw." };
  }

  // 2. E-mail versturen via Resend.
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.error("RESEND_API_KEY ontbreekt.");
    // Het bericht staat al veilig in Supabase, dus dit is geen
    // fout voor de bezoeker.
    return { success: "Bedankt! Je bericht is ontvangen." };
  }

  // Ontvanger komt uit de dashboardinstellingen, met env-variabele
  // als fallback zodat er nooit een hardcoded adres in de code staat.
  const settings = await getSiteSettings();
  const recipient =
    settings.contactFormRecipient ||
    settings.email ||
    process.env.CONTACT_RECIPIENT_EMAIL;

  if (!recipient) {
    console.error("Geen ontvanger ingesteld voor het contactformulier.");
    return { success: "Bedankt! Je bericht is ontvangen." };
  }

  const fromAddress = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const resend = new Resend(resendApiKey);

  // Alle door de bezoeker aangeleverde waarden worden ge-escaped voordat
  // ze in de HTML-mail terechtkomen (voorkomt HTML/e-mail-injectie).
  const safeName = escapeHtml(parsed.data.name);
  const safeCompany = parsed.data.companyName
    ? escapeHtml(parsed.data.companyName)
    : "Niet opgegeven";
  const safeEmail = escapeHtml(parsed.data.email);
  const safeMessage = escapeHtmlMultiline(parsed.data.message);

  try {
    await resend.emails.send({
      from: `${sanitizeEmailHeader(settings.companyName)} <${fromAddress}>`,
      to: [recipient],
      subject: sanitizeEmailHeader(
        `${settings.contactFormSubject || "Nieuw contactformulier"}: ${parsed.data.name}`,
      ),
      replyTo: sanitizeEmailHeader(parsed.data.email),
      html: `
        <h2>Nieuw bericht via de website</h2>

        <p><strong>Naam:</strong> ${safeName}</p>
        <p><strong>Bedrijf:</strong> ${safeCompany}</p>
        <p><strong>E-mail:</strong> ${safeEmail}</p>

        <h3>Bericht</h3>
        <p>${safeMessage}</p>
      `,
    });
  } catch (emailError) {
    console.error("Resend error:", emailError);

    // Het bericht staat al veilig in Supabase.
    // We geven daarom geen foutmelding waardoor de klant denkt
    // dat het formulier helemaal mislukt is.
  }

  return {
    success: settings.contactFormSuccessMessage || "Bedankt! Je bericht is ontvangen.",
  };
}
