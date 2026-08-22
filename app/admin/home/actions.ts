"use server";

import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { getAllHomeSections, getHomeSectionById } from "@/lib/sections/data";
import {
  emptySectionContent,
  isSectionType,
  SECTION_LABELS,
  SECTION_SCHEMAS,
  type SectionType,
} from "@/lib/sections/schema";

const LIST_PATH = "/admin/home";

function refreshHome() {
  revalidatePath("/");
  revalidatePath(LIST_PATH);
}

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function bool(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

/** Leest een genummerde lijst uit het formulier: veld_0, veld_1, ... */
function readIndexedList(
  formData: FormData,
  prefix: string,
  fields: string[],
): Record<string, unknown>[] {
  const items: Record<string, unknown>[] = [];

  for (let index = 0; index < 20; index += 1) {
    const entry: Record<string, unknown> = {};
    let hasValue = false;

    for (const field of fields) {
      const raw = formData.get(`${prefix}_${index}_${field}`);

      if (raw === null) {
        continue;
      }

      const value = String(raw).trim();
      entry[field] = value;

      if (value !== "") {
        hasValue = true;
      }
    }

    // Rij overslaan wanneer alle velden leeg zijn.
    if (Object.keys(entry).length > 0 && hasValue) {
      items.push(entry);
    }
  }

  return items;
}

/** Splitst een tekstveld met één waarde per regel. */
function readLines(formData: FormData, key: string): string[] {
  return String(formData.get(key) ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 8);
}

// ---------------------------------------------------------------------
// Sectie toevoegen
// ---------------------------------------------------------------------
export async function createSectionAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const type = str(formData, "type");

  if (!isSectionType(type)) {
    redirect(`${LIST_PATH}?error=Onbekend+sectietype`);
  }

  const sections = await getAllHomeSections();
  const nextPosition =
    sections.length > 0 ? Math.max(...sections.map((s) => s.position)) + 1 : 0;

  const { error } = await supabase.from("home_sections").insert({
    type,
    position: nextPosition,
    enabled: false, // nieuw = eerst concept, zodat je hem eerst kunt invullen
    admin_label: SECTION_LABELS[type],
    content: emptySectionContent(type),
  });

  if (error) {
    redirect(`${LIST_PATH}?error=${encodeURIComponent(error.message)}`);
  }

  refreshHome();
  redirect(`${LIST_PATH}?success=Sectie+toegevoegd+(nog+niet+zichtbaar)`);
}

// ---------------------------------------------------------------------
// Volgorde wijzigen
// ---------------------------------------------------------------------
export async function moveSectionAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = str(formData, "id");
  const direction = str(formData, "direction");

  if (direction !== "up" && direction !== "down") {
    redirect(`${LIST_PATH}?error=Ongeldige+richting`);
  }

  const sections = await getAllHomeSections();
  const index = sections.findIndex((section) => section.id === id);

  if (index === -1) {
    redirect(`${LIST_PATH}?error=Sectie+niet+gevonden`);
  }

  const targetIndex = direction === "up" ? index - 1 : index + 1;

  if (targetIndex < 0 || targetIndex >= sections.length) {
    // Al bovenaan of onderaan: stil teruggaan.
    redirect(LIST_PATH);
  }

  const current = sections[index]!;
  const target = sections[targetIndex]!;

  // Posities omwisselen. Twee losse updates omdat er geen unique
  // constraint op position zit; een tijdelijke botsing is dus geen
  // probleem.
  await supabase
    .from("home_sections")
    .update({ position: target.position })
    .eq("id", current.id);

  await supabase
    .from("home_sections")
    .update({ position: current.position })
    .eq("id", target.id);

  refreshHome();
  redirect(`${LIST_PATH}?success=Volgorde+aangepast`);
}

/**
 * Slaat een volledige volgorde op (gebruikt door de drag & drop-lijst).
 * Verwacht een veld `order` met komma-gescheiden id's.
 */
export async function reorderSectionsAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const order = str(formData, "order")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (order.length === 0) {
    redirect(`${LIST_PATH}?error=Geen+volgorde+ontvangen`);
  }

  const sections = await getAllHomeSections();
  const knownIds = new Set(sections.map((section) => section.id));

  // Alleen id's die daadwerkelijk bestaan, zodat een gemanipuleerd
  // formulier geen vreemde rijen kan raken.
  const validOrder = order.filter((id) => knownIds.has(id));

  if (validOrder.length !== sections.length) {
    redirect(`${LIST_PATH}?error=Volgorde+is+onvolledig`);
  }

  await Promise.all(
    validOrder.map((id, index) =>
      supabase.from("home_sections").update({ position: index }).eq("id", id),
    ),
  );

  refreshHome();
  redirect(`${LIST_PATH}?success=Volgorde+opgeslagen`);
}

// ---------------------------------------------------------------------
// Aan/uit zetten
// ---------------------------------------------------------------------
export async function toggleSectionAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = str(formData, "id");
  const enabled = str(formData, "value") === "true";

  await supabase.from("home_sections").update({ enabled }).eq("id", id);

  refreshHome();
  redirect(
    `${LIST_PATH}?success=${enabled ? "Sectie+ingeschakeld" : "Sectie+uitgeschakeld"}`,
  );
}

// ---------------------------------------------------------------------
// Dupliceren
// ---------------------------------------------------------------------
export async function duplicateSectionAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = str(formData, "id");
  const section = await getHomeSectionById(id);

  if (!section) {
    redirect(`${LIST_PATH}?error=Sectie+niet+gevonden`);
  }

  const sections = await getAllHomeSections();
  const nextPosition =
    sections.length > 0 ? Math.max(...sections.map((s) => s.position)) + 1 : 0;

  const { error } = await supabase.from("home_sections").insert({
    type: section.type,
    position: nextPosition,
    enabled: false, // kopie staat uit, zodat er niet ineens dubbele content live staat
    admin_label: `${section.adminLabel || SECTION_LABELS[section.type]} (kopie)`,
    content: section.content,
  });

  if (error) {
    redirect(`${LIST_PATH}?error=${encodeURIComponent(error.message)}`);
  }

  refreshHome();
  redirect(`${LIST_PATH}?success=Sectie+gedupliceerd+(staat+uit)`);
}

// ---------------------------------------------------------------------
// Verwijderen
// ---------------------------------------------------------------------
export async function deleteSectionAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = str(formData, "id");

  await supabase.from("home_sections").delete().eq("id", id);

  refreshHome();
  redirect(`${LIST_PATH}?success=Sectie+verwijderd`);
}

// ---------------------------------------------------------------------
// Content opslaan
// ---------------------------------------------------------------------

/** Bouwt het contentobject op basis van het sectietype. */
function buildContent(type: SectionType, formData: FormData): unknown {
  switch (type) {
    case "hero":
      return {
        badge: str(formData, "badge"),
        title: str(formData, "title"),
        highlight: str(formData, "highlight"),
        subtitle: str(formData, "subtitle"),
        primaryCtaLabel: str(formData, "primaryCtaLabel"),
        primaryCtaUrl: str(formData, "primaryCtaUrl"),
        secondaryCtaLabel: str(formData, "secondaryCtaLabel"),
        secondaryCtaUrl: str(formData, "secondaryCtaUrl"),
        desktopImage: str(formData, "desktopImage"),
        desktopImageAlt: str(formData, "desktopImageAlt"),
        mobileImage: str(formData, "mobileImage"),
        mobileImageAlt: str(formData, "mobileImageAlt"),
      };

    case "services":
      return {
        eyebrow: str(formData, "eyebrow"),
        title: str(formData, "title"),
        text: str(formData, "text"),
        theme: str(formData, "theme"),
        items: readIndexedList(formData, "item", [
          "title",
          "subtitle",
          "description",
          "ctaLabel",
          "ctaUrl",
        ]).map((item, index) => ({
          ...item,
          highlights: readLines(formData, `item_${index}_highlights`),
        })),
      };

    case "usp":
      return {
        eyebrow: str(formData, "eyebrow"),
        title: str(formData, "title"),
        text: str(formData, "text"),
        theme: str(formData, "theme"),
        items: readIndexedList(formData, "item", [
          "label",
          "title",
          "description",
        ]),
      };

    case "portfolio":
      return {
        eyebrow: str(formData, "eyebrow"),
        title: str(formData, "title"),
        text: str(formData, "text"),
        theme: str(formData, "theme"),
        limit: str(formData, "limit"),
        ctaLabel: str(formData, "ctaLabel"),
        ctaUrl: str(formData, "ctaUrl"),
        emptyText: str(formData, "emptyText"),
      };

    case "testimonials":
      return {
        eyebrow: str(formData, "eyebrow"),
        title: str(formData, "title"),
        text: str(formData, "text"),
        theme: str(formData, "theme"),
        items: readIndexedList(formData, "item", ["quote", "author", "role"]),
      };

    case "text":
      return {
        eyebrow: str(formData, "eyebrow"),
        title: str(formData, "title"),
        text: str(formData, "text"),
        theme: str(formData, "theme"),
        align: str(formData, "align"),
      };

    case "image_text":
      return {
        eyebrow: str(formData, "eyebrow"),
        title: str(formData, "title"),
        text: str(formData, "text"),
        theme: str(formData, "theme"),
        image: str(formData, "image"),
        imageAlt: str(formData, "imageAlt"),
        imagePosition: str(formData, "imagePosition"),
        ctaLabel: str(formData, "ctaLabel"),
        ctaUrl: str(formData, "ctaUrl"),
      };

    case "cta":
      return {
        title: str(formData, "title"),
        text: str(formData, "text"),
        theme: str(formData, "theme"),
        ctaLabel: str(formData, "ctaLabel"),
        ctaUrl: str(formData, "ctaUrl"),
      };

    case "faq":
      return {
        eyebrow: str(formData, "eyebrow"),
        title: str(formData, "title"),
        text: str(formData, "text"),
        theme: str(formData, "theme"),
        items: readIndexedList(formData, "item", ["question", "answer"]),
      };

    case "contact":
      return {
        eyebrow: str(formData, "eyebrow"),
        title: str(formData, "title"),
        text: str(formData, "text"),
        theme: str(formData, "theme"),
        showContactDetails: bool(formData, "showContactDetails"),
        ctaLabel: str(formData, "ctaLabel"),
        ctaUrl: str(formData, "ctaUrl"),
      };

    default: {
      const exhaustive: never = type;
      return exhaustive;
    }
  }
}

export async function updateSectionAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = str(formData, "id");
  const section = await getHomeSectionById(id);

  if (!section) {
    redirect(`${LIST_PATH}?error=Sectie+niet+gevonden`);
  }

  const editPath = `${LIST_PATH}/${id}`;

  try {
    // Type komt uit de database, niet uit het formulier: een gebruiker
    // kan het type van een bestaande sectie niet omwisselen.
    const raw = buildContent(section.type, formData);
    const content = SECTION_SCHEMAS[section.type].parse(raw);

    const { error } = await supabase
      .from("home_sections")
      .update({
        admin_label: str(formData, "adminLabel") || SECTION_LABELS[section.type],
        enabled: bool(formData, "enabled"),
        content,
      })
      .eq("id", id);

    if (error) {
      redirect(`${editPath}?error=${encodeURIComponent(error.message)}`);
    }
  } catch (err) {
    unstable_rethrow(err);

    redirect(`${editPath}?error=Controleer+de+velden+(let+op+geldige+URL's)`);
  }

  refreshHome();
  redirect(`${editPath}?success=Sectie+opgeslagen`);
}
