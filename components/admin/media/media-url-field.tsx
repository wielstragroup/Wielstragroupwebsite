"use client";

import Image from "next/image";
import { useState } from "react";

import { MediaPicker } from "@/components/admin/media/media-picker";

export type MediaUrlFieldProps = {
  /** Naam van het formulierveld — blijft precies zoals het nu is. */
  name: string;
  label: string;
  defaultValue?: string | null;
  id?: string;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  /** Optioneel: veldnaam waarin de alt-tekst uit de bibliotheek terechtkomt. */
  altFieldName?: string;
  altDefaultValue?: string | null;
};

/**
 * Tekstveld voor een afbeeldings-URL, met een knop om uit de mediabibliotheek
 * te kiezen. Bewust een URL-string als waarde: geen schemawijziging, geen
 * migratie van bestaande sectiecontent. Handmatig plakken blijft gewoon werken.
 */
export function MediaUrlField({
  name,
  label,
  defaultValue,
  id,
  required,
  placeholder = "https://…",
  helpText,
  altFieldName,
  altDefaultValue,
}: MediaUrlFieldProps) {
  const fieldId = id ?? `media-url-${name}`;

  const [value, setValue] = useState(defaultValue ?? "");
  const [altValue, setAltValue] = useState(altDefaultValue ?? "");
  const [open, setOpen] = useState(false);

  return (
    <div>
      <label htmlFor={fieldId} className="block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="mt-1 flex flex-wrap items-start gap-2">
        <input
          id={fieldId}
          name={name}
          type="text"
          required={required}
          value={value}
          placeholder={placeholder}
          onChange={(event) => setValue(event.target.value)}
          className="min-w-[12rem] flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
        />

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          Kies uit bibliotheek
        </button>

        {value ? (
          <button
            type="button"
            onClick={() => setValue("")}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Wissen
          </button>
        ) : null}
      </div>

      {altFieldName ? <input type="hidden" name={altFieldName} value={altValue} /> : null}

      {helpText ? <p className="mt-1 text-xs text-slate-500">{helpText}</p> : null}

      {value ? (
        <div className="relative mt-2 h-24 w-24 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          <Image src={value} alt="" fill sizes="96px" className="object-cover" unoptimized />
        </div>
      ) : null}

      <MediaPicker
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(url, altText) => {
          setValue(url);

          if (altFieldName && altText) {
            setAltValue(altText);
          }
        }}
      />
    </div>
  );
}
