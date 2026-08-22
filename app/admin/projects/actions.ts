"use server";

import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { projectInputToDb } from "@/lib/projects";
import { buildStoragePath, validateImageUpload } from "@/lib/uploads";
import { projectSchema } from "@/lib/validation";

const BUCKET = "project-images";

function normalizeImageList(raw: string) {
  return raw
    .split("\n")
    .map((value) => value.trim())
    .filter(Boolean);
}

function toBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function getProjectInput(formData: FormData) {
  return projectSchema.parse({
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    client: String(formData.get("client") ?? ""),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    description: String(formData.get("description") ?? ""),
    category: String(formData.get("category") ?? ""),
    image: String(formData.get("image") ?? ""),
    additionalImages: normalizeImageList(String(formData.get("additionalImages") ?? "")),
    liveUrl: String(formData.get("liveUrl") ?? ""),
    date: String(formData.get("date") ?? ""),
    featured: toBoolean(formData, "featured"),
    published: toBoolean(formData, "published"),
  });
}

function revalidatePublicPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/portfolio");
  if (slug) {
    revalidatePath(`/portfolio/${slug}`);
  }
  revalidatePath("/admin/projects");
}

export async function createProjectAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  let slug = "";

  try {
    const input = getProjectInput(formData);
    slug = input.slug;

    const { error } = await supabase.from("projects").insert(projectInputToDb(input));

    if (error) {
      redirect(`/admin/projects/new?error=${encodeURIComponent(error.message)}`);
    }
  } catch (err) {
    // redirect() werkt door een error te gooien. unstable_rethrow gooit
    // Next-interne errors (redirect/notFound) door, zodat een geslaagde
    // redirect niet als validatiefout wordt getoond.
    unstable_rethrow(err);

    redirect("/admin/projects/new?error=Controleer+alle+velden");
  }

  revalidatePublicPaths(slug);
  redirect("/admin/projects?success=Project+toegevoegd");
}

export async function updateProjectAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");

  let slug = "";

  try {
    const input = getProjectInput(formData);
    slug = input.slug;

    const { error } = await supabase
      .from("projects")
      .update(projectInputToDb(input))
      .eq("id", id);

    if (error) {
      redirect(`/admin/projects/${id}/edit?error=${encodeURIComponent(error.message)}`);
    }
  } catch (err) {
    unstable_rethrow(err);

    redirect(`/admin/projects/${id}/edit?error=Controleer+alle+velden`);
  }

  revalidatePublicPaths(slug);
  redirect("/admin/projects?success=Project+opgeslagen");
}

export async function deleteProjectAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");

  await supabase.from("projects").delete().eq("id", id);

  revalidatePublicPaths();
  redirect("/admin/projects?success=Project+verwijderd");
}

export async function toggleProjectAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const key = String(formData.get("key") ?? "");
  const value = String(formData.get("value") ?? "") === "true";

  if (key !== "featured" && key !== "published") {
    redirect("/admin/projects?error=Ongeldige+actie");
  }

  await supabase.from("projects").update({ [key]: value }).eq("id", id);

  revalidatePublicPaths();
  redirect("/admin/projects?success=Project+bijgewerkt");
}

export async function uploadSingleImageServerAction(
  formData: FormData,
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const { supabase } = await requireAdmin();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return { success: false, error: "Selecteer een geldig bestand." };
    }

    const validation = validateImageUpload(file);

    if (!validation.ok) {
      return { success: false, error: validation.error };
    }

    const path = buildStoragePath(file.name, validation.extension);

    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { success: true, url: data.publicUrl };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload mislukt.";
    return { success: false, error: message };
  }
}

export async function uploadImageAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const file = formData.get("image");

  if (!(file instanceof File)) {
    redirect("/admin/projects?error=Selecteer+een+bestand");
  }

  const validation = validateImageUpload(file);

  if (!validation.ok) {
    redirect(`/admin/projects?error=${encodeURIComponent(validation.error)}`);
  }

  const path = buildStoragePath(file.name, validation.extension);

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    redirect(`/admin/projects?error=${encodeURIComponent(error.message)}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  redirect(`/admin/projects?uploaded=${encodeURIComponent(data.publicUrl)}`);
}
