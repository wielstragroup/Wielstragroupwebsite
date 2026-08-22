"use server";

import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { SOCIAL_PLATFORMS, siteSettingsSchema } from "@/lib/validation";

function toBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function updateSiteSettingsAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();

  try {
    // Social links komen als parallelle velden binnen:
    // social_<platform>_url en social_<platform>_enabled
    const socials = SOCIAL_PLATFORMS.map((platform) => ({
      platform,
      url: str(formData, `social_${platform}_url`),
      enabled: toBoolean(formData, `social_${platform}_enabled`),
    })).filter((social) => social.url !== "");

    const input = siteSettingsSchema.parse({
      companyName: str(formData, "companyName"),
      logoUrl: str(formData, "logoUrl"),
      faviconUrl: str(formData, "faviconUrl"),
      email: str(formData, "email"),
      phone: str(formData, "phone"),
      whatsappUrl: str(formData, "whatsappUrl"),
      address: str(formData, "address"),
      copyrightText: str(formData, "copyrightText"),

      ctaLabel: str(formData, "ctaLabel"),
      ctaUrl: str(formData, "ctaUrl"),

      defaultSeoTitle: str(formData, "defaultSeoTitle"),
      defaultMetaDescription: str(formData, "defaultMetaDescription"),
      defaultOgImage: str(formData, "defaultOgImage"),

      contactFormEnabled: toBoolean(formData, "contactFormEnabled"),
      contactFormRecipient: str(formData, "contactFormRecipient"),
      contactFormSubject: str(formData, "contactFormSubject"),
      contactFormSuccessMessage: str(formData, "contactFormSuccessMessage"),
      contactFormErrorMessage: str(formData, "contactFormErrorMessage"),

      socials,
    });

    const { error } = await supabase
      .from("site_settings")
      .update({
        company_name: input.companyName,
        logo_url: input.logoUrl,
        favicon_url: input.faviconUrl,
        email: input.email,
        phone: input.phone,
        whatsapp_url: input.whatsappUrl,
        address: input.address,
        copyright_text: input.copyrightText,

        cta_label: input.ctaLabel,
        cta_url: input.ctaUrl,

        default_seo_title: input.defaultSeoTitle,
        default_meta_description: input.defaultMetaDescription,
        default_og_image: input.defaultOgImage,

        contact_form_enabled: input.contactFormEnabled,
        contact_form_recipient: input.contactFormRecipient,
        contact_form_subject: input.contactFormSubject,
        contact_form_success_message: input.contactFormSuccessMessage,
        contact_form_error_message: input.contactFormErrorMessage,

        socials: input.socials,
        updated_by: user.id,
      })
      .eq("id", true);

    if (error) {
      redirect(`/admin/settings?error=${encodeURIComponent(error.message)}`);
    }
  } catch (err) {
    unstable_rethrow(err);

    redirect(
      "/admin/settings?error=Controleer+de+velden.+Let+op+geldige+e-mailadressen+en+URL's.",
    );
  }

  // Instellingen worden overal gebruikt, dus de hele site verversen.
  revalidatePath("/", "layout");

  redirect("/admin/settings?success=Instellingen+opgeslagen");
}
