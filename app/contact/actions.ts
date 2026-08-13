"use server";

import { Resend } from "resend";
import { contactSchema } from "@/lib/validation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type ContactState = {
  success?: string;
  error?: string;
};

export async function submitContactForm(
  _: ContactState,
  formData: FormData
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

  // Honeypot tegen spam
  if (parsed.data.website) {
    return { success: "Bedankt! Je bericht is ontvangen." };
  }

  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return { error: "Contactformulier is nog niet geconfigureerd." };
  }

  // 1. Bericht opslaan in Supabase
  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    company_name: parsed.data.companyName,
    email: parsed.data.email,
    message: parsed.data.message,
  });

  if (error) {
    return { error: "Opslaan mislukt. Probeer het later opnieuw." };
  }

  // 2. E-mail versturen via Resend
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.error("RESEND_API_KEY ontbreekt.");
    return { error: "E-mailservice is nog niet geconfigureerd." };
  }

  const resend = new Resend(resendApiKey);

  try {
    await resend.emails.send({
      from: "Wielstra Group <onboarding@resend.dev>",
      to: ["jwielstrajoel@gmail.com"],
      subject: `Nieuw contactformulier: ${parsed.data.name}`,
      replyTo: parsed.data.email,
      html: `
        <h2>Nieuw bericht via de website</h2>

        <p><strong>Naam:</strong> ${parsed.data.name}</p>
        <p><strong>Bedrijf:</strong> ${parsed.data.companyName || "Niet opgegeven"}</p>
        <p><strong>E-mail:</strong> ${parsed.data.email}</p>

        <h3>Bericht</h3>
        <p>${parsed.data.message.replace(/\n/g, "<br>")}</p>
      `,
    });
  } catch (emailError) {
    console.error("Resend error:", emailError);

    // Het bericht staat al veilig in Supabase.
    // We geven daarom geen foutmelding waardoor de klant denkt
    // dat het formulier helemaal mislukt is.
  }

  return { success: "Bedankt! Je bericht is ontvangen." };
}