import { cache } from "react";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Project, ProjectInput } from "@/lib/types";

function mapProject(row: Record<string, unknown>): Project {
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    client: String(row.client),
    shortDescription: String(row.short_description),
    description: String(row.description),
    category: String(row.category),
    image: String(row.image),
    additionalImages: Array.isArray(row.additional_images)
      ? row.additional_images.map((item) => String(item))
      : [],
    liveUrl: row.live_url ? String(row.live_url) : null,
    date: String(row.date),
    featured: Boolean(row.featured),
    published: Boolean(row.published),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export const getPublishedProjects = cache(async () => {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [] as Project[];
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("date", { ascending: false });

  if (error || !data) {
    return [] as Project[];
  }

  return data.map((row) => mapProject(row));
});

export const getFeaturedProjects = cache(async (limit = 3) => {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [] as Project[];
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .eq("featured", true)
    .order("date", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [] as Project[];
  }

  return data.map((row) => mapProject(row));
});

export async function getProjectBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapProject(data);
}

export async function getProjectById(id: string) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapProject(data);
}

export async function getAllProjectsForAdmin() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return [] as Project[];
  }

  const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });

  if (error || !data) {
    return [] as Project[];
  }

  return data.map((row) => mapProject(row));
}

export function projectInputToDb(input: ProjectInput) {
  return {
    title: input.title,
    slug: input.slug,
    client: input.client,
    short_description: input.shortDescription,
    description: input.description,
    category: input.category,
    image: input.image,
    additional_images: input.additionalImages,
    live_url: input.liveUrl,
    date: input.date,
    featured: input.featured,
    published: input.published,
  };
}
