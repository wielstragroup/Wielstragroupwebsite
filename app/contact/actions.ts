"use server";

import { contactSchema } from "@/lib/validation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type ContactState = {
  success?: string;
  error?: string;
};

export async function submitContactForm(_: ContactState, formData: FormData): Promise<ContactState> {
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

  if (parsed.data.website) {
    return { success: "Bedankt! Je bericht is ontvangen." };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { error: "Contactformulier is nog niet geconfigureerd." };
  }

  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    company_name: parsed.data.companyName,
    email: parsed.data.email,
    message: parsed.data.message,
  });

  if (error) {
    return { error: "Opslaan mislukt. Probeer het later opnieuw." };
  }

  return { success: "Bedankt! Je bericht is ontvangen." };
}
