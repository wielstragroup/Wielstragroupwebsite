"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { projectInputToDb } from "@/lib/projects";
import { projectSchema } from "@/lib/validation";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml"]);

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

export async function createProjectAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  try {
    const input = getProjectInput(formData);
    const { error } = await supabase.from("projects").insert(projectInputToDb(input));

    if (error) {
      redirect(`/admin/projects/new?error=${encodeURIComponent(error.message)}`);
    }

    revalidatePath("/");
    revalidatePath("/portfolio");
    revalidatePath("/admin/projects");
    redirect("/admin/projects?success=Project+toegevoegd");
  } catch {
    redirect("/admin/projects/new?error=Controleer+alle+velden");
  }
}

export async function updateProjectAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");

  try {
    const input = getProjectInput(formData);
    const { error } = await supabase.from("projects").update(projectInputToDb(input)).eq("id", id);

    if (error) {
      redirect(`/admin/projects/${id}/edit?error=${encodeURIComponent(error.message)}`);
    }

    revalidatePath("/");
    revalidatePath("/portfolio");
    revalidatePath(`/portfolio/${input.slug}`);
    revalidatePath("/admin/projects");
    redirect("/admin/projects?success=Project+opgeslagen");
  } catch {
    redirect(`/admin/projects/${id}/edit?error=Controleer+alle+velden`);
  }
}

export async function deleteProjectAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");

  await supabase.from("projects").delete().eq("id", id);

  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath("/admin/projects");
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

  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath("/admin/projects");
  redirect("/admin/projects?success=Project+bijgewerkt");
}

export async function uploadImageAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const file = formData.get("image");

  if (!(file instanceof File) || file.size === 0) {
    redirect("/admin/projects?error=Selecteer+een+bestand");
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    redirect("/admin/projects?error=Alleen+JPG,+PNG,+WEBP+of+SVG");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    redirect("/admin/projects?error=Bestand+te+groot+(max+5MB)");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const safeName = file.name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  const path = `${Date.now()}-${safeName || "image"}.${extension}`;

  const { error } = await supabase.storage.from("project-images").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    redirect(`/admin/projects?error=${encodeURIComponent(error.message)}`);
  }

  const { data } = supabase.storage.from("project-images").getPublicUrl(path);
  redirect(`/admin/projects?uploaded=${encodeURIComponent(data.publicUrl)}`);
}
