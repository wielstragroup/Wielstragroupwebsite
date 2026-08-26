import type { Metadata } from "next";

import { updateSiteSettingsAction } from "@/app/admin/settings/actions";
import {
  CheckboxField,
  FormSection,
  StatusMessage,
  TextAreaField,
  TextField,
} from "@/components/admin/form-fields";
import { requireAdmin } from "@/lib/auth";
import { getSiteSettings, SOCIAL_LABELS } from "@/lib/site-settings";
import { SOCIAL_PLATFORMS } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Website-instellingen",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  await requireAdmin();

  const settings = await getSiteSettings();
  const { success, error } = await searchParams;

  const socialByPlatform = new Map(
    settings.socials.map((social) => [social.platform, social]),
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
          Website-instellingen
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Deze gegevens worden overal op de website gebruikt. Eén wijziging hier
          werkt automatisch door in de header, footer, contactpagina en CTA&apos;s.
        </p>
      </div>

      <StatusMessage success={success} error={error} />

      <form action={updateSiteSettingsAction} className="space-y-5">
        <FormSection
          title="Bedrijfsgegevens"
          description="De basisidentiteit van je website."
        >
          <TextField
            name="companyName"
            label="Bedrijfsnaam"
            defaultValue={settings.companyName}
            required
            maxLength={120}
          />
          <TextField
            name="copyrightText"
            label="Copyrighttekst"
            defaultValue={settings.copyrightText}
            placeholder="Alle rechten voorbehouden."
            hint="Het jaartal wordt automatisch toegevoegd."
            maxLength={200}
          />
          <TextField
            name="logoUrl"
            label="Logo (URL)"
            defaultValue={settings.logoUrl}
            placeholder="https://... of /logo.svg"
            hint="Laat leeg om het standaard tekstlogo te gebruiken."
          />
          <TextField
            name="faviconUrl"
            label="Favicon (URL)"
            defaultValue={settings.faviconUrl}
            placeholder="https://... of /favicon.ico"
          />
        </FormSection>

        <FormSection
          title="Contactgegevens"
          description="Gebruikt in de footer, op de contactpagina en in contactsecties."
        >
          <TextField
            name="email"
            label="E-mailadres"
            type="email"
            defaultValue={settings.email}
            placeholder="info@wielstragroup.nl"
          />
          <TextField
            name="phone"
            label="Telefoonnummer"
            type="tel"
            defaultValue={settings.phone}
            placeholder="+31 6 12345678"
          />
          <TextField
            name="whatsappUrl"
            label="WhatsApp-link"
            defaultValue={settings.whatsappUrl}
            placeholder="https://wa.me/31612345678"
          />
          <TextField
            name="address"
            label="Adres"
            defaultValue={settings.address}
            maxLength={300}
          />
        </FormSection>

        <FormSection
          title="Standaard call-to-action"
          description="Secties zonder eigen CTA gebruiken deze knop."
        >
          <TextField
            name="ctaLabel"
            label="CTA-tekst"
            defaultValue={settings.ctaLabel}
            placeholder="Bespreek je project"
            maxLength={80}
          />
          <TextField
            name="ctaUrl"
            label="CTA-link"
            defaultValue={settings.ctaUrl}
            placeholder="/contact"
            hint="Relatieve links (/contact) of volledige https-URL's."
          />
        </FormSection>

        <FormSection
          title="Social media"
          description="Alleen ingevulde én ingeschakelde platforms worden getoond."
        >
          {SOCIAL_PLATFORMS.map((platform) => {
            const existing = socialByPlatform.get(platform);

            return (
              <div key={platform} className="sm:col-span-2">
                <div className="grid gap-3 rounded-xl border border-slate-200 p-3 sm:grid-cols-[1fr_auto] sm:items-end">
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-medium text-slate-800">
                      {SOCIAL_LABELS[platform]}
                    </span>
                    <input
                      type="text"
                      name={`social_${platform}_url`}
                      defaultValue={existing?.url ?? ""}
                      placeholder={`https://${platform}.com/...`}
                      className="rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    />
                  </label>
                  <label className="flex items-center gap-2 pb-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name={`social_${platform}_enabled`}
                      defaultChecked={existing?.enabled ?? false}
                      className="h-4 w-4 rounded border-slate-400"
                    />
                    <span>Tonen</span>
                  </label>
                </div>
              </div>
            );
          })}
        </FormSection>

        <FormSection
          title="Contactformulier"
          description="Bepaal waar berichten heen gaan en wat bezoekers te zien krijgen."
        >
          <CheckboxField
            name="contactFormEnabled"
            label="Contactformulier inschakelen"
            defaultChecked={settings.contactFormEnabled}
            hint="Uitgeschakeld toont de contactpagina alleen je contactgegevens."
          />
          <TextField
            name="contactFormRecipient"
            label="Ontvanger"
            type="email"
            defaultValue={settings.contactFormRecipient}
            placeholder="info@wielstragroup.nl"
            hint="Leeg = het e-mailadres bij Contactgegevens wordt gebruikt."
          />
          <TextField
            name="contactFormSubject"
            label="Onderwerp e-mail"
            defaultValue={settings.contactFormSubject}
            maxLength={150}
          />
          <TextAreaField
            name="contactFormSuccessMessage"
            label="Succesmelding"
            defaultValue={settings.contactFormSuccessMessage}
            rows={2}
            maxLength={300}
          />
          <TextAreaField
            name="contactFormErrorMessage"
            label="Foutmelding"
            defaultValue={settings.contactFormErrorMessage}
            rows={2}
            maxLength={300}
          />
        </FormSection>

        <FormSection
          title="SEO-standaarden"
          description="Fallback voor pagina's zonder eigen SEO-waarden."
        >
          <TextField
            name="defaultSeoTitle"
            label="Standaard SEO-titel"
            defaultValue={settings.defaultSeoTitle}
            hint="Aanbevolen lengte: 50-60 tekens."
            maxLength={120}
            full
          />
          <TextAreaField
            name="defaultMetaDescription"
            label="Standaard meta description"
            defaultValue={settings.defaultMetaDescription}
            hint="Aanbevolen lengte: 120-160 tekens."
            rows={3}
            maxLength={300}
          />
          <TextField
            name="defaultOgImage"
            label="Standaard OG-afbeelding (URL)"
            defaultValue={settings.defaultOgImage}
            hint="Aanbevolen formaat: 1200x630 pixels."
            full
          />
        </FormSection>

        <div className="sticky bottom-0 -mx-4 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-5">
          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 sm:w-auto"
          >
            Instellingen opslaan
          </button>
        </div>
      </form>
    </div>
  );
}
