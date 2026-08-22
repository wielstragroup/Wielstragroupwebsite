import type { ReactNode } from "react";

import { TextAreaField, TextField } from "@/components/admin/form-fields";
import type { SectionContentMap, SectionType } from "@/lib/sections/schema";

/**
 * Typespecifieke formuliervelden.
 *
 * Bewust alleen de velden die voor dat sectietype betekenis hebben,
 * zodat een sectie geen formulier van 50 opties wordt.
 */

function ThemeField({ value }: { value: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-slate-800">Achtergrond</span>
      <select
        name="theme"
        defaultValue={value}
        className="rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
      >
        <option value="light">Licht</option>
        <option value="dark">Donker</option>
      </select>
    </label>
  );
}

function SelectField({
  name,
  label,
  value,
  options,
}: {
  name: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-slate-800">{label}</span>
      <select
        name={name}
        defaultValue={value}
        className="rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Herbruikbaar blok voor een genummerde lijst met items. */
function RepeatableItems({
  title,
  hint,
  count,
  renderItem,
}: {
  title: string;
  hint: string;
  count: number;
  renderItem: (index: number) => ReactNode;
}) {
  return (
    <div className="sm:col-span-2">
      <div className="mb-3">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">{hint}</p>
      </div>
      <div className="space-y-4">
        {Array.from({ length: count }, (_, index) => (
          <fieldset
            key={index}
            className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4"
          >
            <legend className="px-1 text-xs font-semibold text-slate-500">
              Item {index + 1}
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">{renderItem(index)}</div>
          </fieldset>
        ))}
      </div>
    </div>
  );
}

/** Aantal item-formulieren: bestaande items + 2 lege om toe te voegen. */
function slotCount(existing: number, max = 12) {
  return Math.min(existing + 2, max);
}

export function SectionFields({
  type,
  content,
}: {
  type: SectionType;
  content: SectionContentMap[SectionType];
}) {
  switch (type) {
    case "hero": {
      const c = content as SectionContentMap["hero"];
      return (
        <>
          <TextField name="badge" label="Badge (kleine tekst boven de titel)" defaultValue={c.badge} />
          <TextField
            name="highlight"
            label="Nadrukwoord"
            defaultValue={c.highlight}
            hint="Dit woord uit de titel wordt visueel benadrukt."
          />
          <TextAreaField name="title" label="Hoofdtitel" defaultValue={c.title} rows={2} />
          <TextAreaField name="subtitle" label="Subtitel" defaultValue={c.subtitle} rows={3} />
          <TextField name="primaryCtaLabel" label="Primaire knop: tekst" defaultValue={c.primaryCtaLabel} hint="Leeg = globale CTA." />
          <TextField name="primaryCtaUrl" label="Primaire knop: link" defaultValue={c.primaryCtaUrl} />
          <TextField name="secondaryCtaLabel" label="Secundaire knop: tekst" defaultValue={c.secondaryCtaLabel} />
          <TextField name="secondaryCtaUrl" label="Secundaire knop: link" defaultValue={c.secondaryCtaUrl} />
          <TextField
            name="desktopImage"
            label="Afbeelding desktop (browservenster)"
            defaultValue={c.desktopImage}
            hint="Leeg = de afbeelding van het eerste uitgelichte project."
            full
          />
          <TextField name="desktopImageAlt" label="Alt-tekst desktopafbeelding" defaultValue={c.desktopImageAlt} full />
          <TextField
            name="mobileImage"
            label="Afbeelding mobiel (telefoon)"
            defaultValue={c.mobileImage}
            hint="Leeg = dezelfde afbeelding als desktop."
            full
          />
          <TextField name="mobileImageAlt" label="Alt-tekst mobiele afbeelding" defaultValue={c.mobileImageAlt} full />
        </>
      );
    }

    case "services": {
      const c = content as SectionContentMap["services"];
      const count = slotCount(c.items.length);
      return (
        <>
          <TextField name="eyebrow" label="Bovenschrift" defaultValue={c.eyebrow} />
          <ThemeField value={c.theme} />
          <TextField name="title" label="Titel" defaultValue={c.title} full />
          <TextAreaField name="text" label="Introtekst" defaultValue={c.text} rows={2} />
          <RepeatableItems
            title="Diensten"
            hint="Laat een item helemaal leeg om het te verwijderen."
            count={count}
            renderItem={(index) => {
              const item = c.items[index];
              return (
                <>
                  <TextField name={`item_${index}_title`} label="Titel" defaultValue={item?.title ?? ""} />
                  <TextField name={`item_${index}_subtitle`} label="Subtitel" defaultValue={item?.subtitle ?? ""} />
                  <TextAreaField name={`item_${index}_description`} label="Beschrijving" defaultValue={item?.description ?? ""} rows={2} />
                  <TextField name={`item_${index}_ctaLabel`} label="Linktekst" defaultValue={item?.ctaLabel ?? ""} />
                  <TextField name={`item_${index}_ctaUrl`} label="Link" defaultValue={item?.ctaUrl ?? ""} />
                  <TextAreaField
                    name={`item_${index}_highlights`}
                    label="Kenmerken"
                    defaultValue={(item?.highlights ?? []).join("\n")}
                    hint="Eén per regel, maximaal 8."
                    rows={3}
                  />
                </>
              );
            }}
          />
        </>
      );
    }

    case "usp": {
      const c = content as SectionContentMap["usp"];
      return (
        <>
          <TextField name="eyebrow" label="Bovenschrift" defaultValue={c.eyebrow} />
          <ThemeField value={c.theme} />
          <TextField name="title" label="Titel" defaultValue={c.title} full />
          <TextAreaField name="text" label="Introtekst" defaultValue={c.text} rows={2} />
          <RepeatableItems
            title="Punten"
            hint="Laat een item helemaal leeg om het te verwijderen."
            count={slotCount(c.items.length)}
            renderItem={(index) => {
              const item = c.items[index];
              return (
                <>
                  <TextField name={`item_${index}_label`} label="Label" defaultValue={item?.label ?? ""} />
                  <TextField name={`item_${index}_title`} label="Titel" defaultValue={item?.title ?? ""} />
                  <TextAreaField name={`item_${index}_description`} label="Beschrijving" defaultValue={item?.description ?? ""} rows={2} />
                </>
              );
            }}
          />
        </>
      );
    }

    case "portfolio": {
      const c = content as SectionContentMap["portfolio"];
      return (
        <>
          <TextField name="eyebrow" label="Bovenschrift" defaultValue={c.eyebrow} />
          <ThemeField value={c.theme} />
          <TextField name="title" label="Titel" defaultValue={c.title} full />
          <TextAreaField name="text" label="Introtekst" defaultValue={c.text} rows={2} />
          <TextField
            name="limit"
            label="Aantal projecten"
            defaultValue={String(c.limit)}
            hint="1 t/m 12. Toont uitgelichte, gepubliceerde projecten."
          />
          <TextField name="ctaLabel" label="Knoptekst" defaultValue={c.ctaLabel} />
          <TextField name="ctaUrl" label="Knoplink" defaultValue={c.ctaUrl} full />
          <TextAreaField
            name="emptyText"
            label="Tekst als er geen projecten zijn"
            defaultValue={c.emptyText}
            rows={2}
          />
        </>
      );
    }

    case "testimonials": {
      const c = content as SectionContentMap["testimonials"];
      return (
        <>
          <TextField name="eyebrow" label="Bovenschrift" defaultValue={c.eyebrow} />
          <ThemeField value={c.theme} />
          <TextField name="title" label="Titel" defaultValue={c.title} full />
          <TextAreaField name="text" label="Introtekst" defaultValue={c.text} rows={2} />
          <RepeatableItems
            title="Reviews"
            hint="Gebruik alleen echte, door de klant gegeven citaten."
            count={slotCount(c.items.length)}
            renderItem={(index) => {
              const item = c.items[index];
              return (
                <>
                  <TextAreaField name={`item_${index}_quote`} label="Citaat" defaultValue={item?.quote ?? ""} rows={3} />
                  <TextField name={`item_${index}_author`} label="Naam" defaultValue={item?.author ?? ""} />
                  <TextField name={`item_${index}_role`} label="Functie / bedrijf" defaultValue={item?.role ?? ""} />
                </>
              );
            }}
          />
        </>
      );
    }

    case "text": {
      const c = content as SectionContentMap["text"];
      return (
        <>
          <TextField name="eyebrow" label="Bovenschrift" defaultValue={c.eyebrow} />
          <ThemeField value={c.theme} />
          <SelectField
            name="align"
            label="Uitlijning"
            value={c.align}
            options={[
              { value: "center", label: "Gecentreerd" },
              { value: "left", label: "Links" },
            ]}
          />
          <TextField name="title" label="Titel" defaultValue={c.title} full />
          <TextAreaField
            name="text"
            label="Tekst"
            defaultValue={c.text}
            rows={8}
            hint="Platte tekst. Lege regels worden alinea's."
          />
        </>
      );
    }

    case "image_text": {
      const c = content as SectionContentMap["image_text"];
      return (
        <>
          <TextField name="eyebrow" label="Bovenschrift" defaultValue={c.eyebrow} />
          <ThemeField value={c.theme} />
          <TextField name="title" label="Titel" defaultValue={c.title} full />
          <TextAreaField name="text" label="Tekst" defaultValue={c.text} rows={6} />
          <TextField name="image" label="Afbeelding (URL)" defaultValue={c.image} />
          <TextField name="imageAlt" label="Alt-tekst" defaultValue={c.imageAlt} />
          <SelectField
            name="imagePosition"
            label="Positie afbeelding (desktop)"
            value={c.imagePosition}
            options={[
              { value: "right", label: "Rechts" },
              { value: "left", label: "Links" },
            ]}
          />
          <TextField name="ctaLabel" label="Knoptekst" defaultValue={c.ctaLabel} />
          <TextField name="ctaUrl" label="Knoplink" defaultValue={c.ctaUrl} full />
        </>
      );
    }

    case "cta": {
      const c = content as SectionContentMap["cta"];
      return (
        <>
          <ThemeField value={c.theme} />
          <TextField name="title" label="Titel" defaultValue={c.title} full />
          <TextAreaField name="text" label="Tekst" defaultValue={c.text} rows={3} />
          <TextField
            name="ctaLabel"
            label="Knoptekst"
            defaultValue={c.ctaLabel}
            hint="Leeg = de globale CTA uit de website-instellingen."
          />
          <TextField
            name="ctaUrl"
            label="Knoplink"
            defaultValue={c.ctaUrl}
            hint="Leeg = de globale CTA-link."
          />
        </>
      );
    }

    case "faq": {
      const c = content as SectionContentMap["faq"];
      return (
        <>
          <TextField name="eyebrow" label="Bovenschrift" defaultValue={c.eyebrow} />
          <ThemeField value={c.theme} />
          <TextField name="title" label="Titel" defaultValue={c.title} full />
          <TextAreaField name="text" label="Introtekst" defaultValue={c.text} rows={2} />
          <RepeatableItems
            title="Vragen"
            hint="Laat een item helemaal leeg om het te verwijderen."
            count={slotCount(c.items.length, 20)}
            renderItem={(index) => {
              const item = c.items[index];
              return (
                <>
                  <TextField name={`item_${index}_question`} label="Vraag" defaultValue={item?.question ?? ""} />
                  <TextAreaField name={`item_${index}_answer`} label="Antwoord" defaultValue={item?.answer ?? ""} rows={3} />
                </>
              );
            }}
          />
        </>
      );
    }

    case "contact": {
      const c = content as SectionContentMap["contact"];
      return (
        <>
          <TextField name="eyebrow" label="Bovenschrift" defaultValue={c.eyebrow} />
          <ThemeField value={c.theme} />
          <TextField name="title" label="Titel" defaultValue={c.title} full />
          <TextAreaField name="text" label="Tekst" defaultValue={c.text} rows={3} />
          <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm sm:col-span-2">
            <input
              type="checkbox"
              name="showContactDetails"
              defaultChecked={c.showContactDetails}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-400"
            />
            <span>
              <span className="font-medium text-slate-800">
                Contactgegevens tonen
              </span>
              <span className="block text-xs text-slate-500">
                Gebruikt e-mail, telefoon en adres uit de website-instellingen.
              </span>
            </span>
          </label>
          <TextField name="ctaLabel" label="Knoptekst" defaultValue={c.ctaLabel} hint="Leeg = globale CTA." />
          <TextField name="ctaUrl" label="Knoplink" defaultValue={c.ctaUrl} />
        </>
      );
    }

    default: {
      const exhaustive: never = type;
      void exhaustive;
      return null;
    }
  }
}
