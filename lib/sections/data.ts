import { cache } from "react";

import { createServerSupabaseClient } from "@/lib/supabase/server";

import { isSectionType, type SectionType } from "./schema";

export type HomeSection = {
  id: string;
  type: SectionType;
  position: number;
  enabled: boolean;
  adminLabel: string;
  /** Ruwe jsonb; parse met parseSectionContent bij het renderen. */
  content: unknown;
  createdAt: string;
  updatedAt: string;
};

function mapSection(row: Record<string, unknown>): HomeSection | null {
  const type = String(row.type ?? "");

  // Onbekende types (bijvoorbeeld na een rollback) overslaan
  // in plaats van de hele pagina te laten crashen.
  if (!isSectionType(type)) {
    return null;
  }

  return {
    id: String(row.id),
    type,
    position: Number(row.position ?? 0),
    enabled: row.enabled !== false,
    adminLabel: String(row.admin_label ?? ""),
    content: row.content ?? {},
    createdAt: String(row.created_at ?? ""),
    updatedAt: String(row.updated_at ?? ""),
  };
}

/**
 * Secties voor de publieke homepagina: alleen ingeschakeld, op volgorde.
 *
 * RLS filtert uitgeschakelde secties al weg voor anonieme bezoekers,
 * maar we filteren hier ook expliciet zodat een ingelogde admin de
 * publieke pagina ziet zoals bezoekers hem zien.
 */
export const getEnabledHomeSections = cache(async (): Promise<HomeSection[]> => {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("home_sections")
    .select("*")
    .eq("enabled", true)
    .order("position", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data
    .map((row) => mapSection(row))
    .filter((section): section is HomeSection => section !== null);
});

/** Alle secties voor het dashboard, inclusief uitgeschakelde. */
export async function getAllHomeSections(): Promise<HomeSection[]> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("home_sections")
    .select("*")
    .order("position", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data
    .map((row) => mapSection(row))
    .filter((section): section is HomeSection => section !== null);
}

export async function getHomeSectionById(
  id: string,
): Promise<HomeSection | null> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("home_sections")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapSection(data);
}
