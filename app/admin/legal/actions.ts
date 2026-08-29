"use server";

import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { isLegalPageSlug } from "@/lib/legal-pages";
import { legalPageSchema } from "@/lib/validation";

export async function updateLegalPageAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const slug = String(formData.get("slug") ?? "");

  if (!isLegalPageSlug(slug)) {
    redirect("/admin/legal?error=Onbekende+pagina");
  }

  try {
    const input = legalPageSchema.parse({
      title: String(formData.get("title") ?? ""),
      intro: String(formData.get("intro") ?? ""),
      content: String(formData.get("content") ?? ""),
    });

    const { error } = await supabase.from("legal_pages").update(input).eq("slug", slug);

    if (error) {
      redirect(`/admin/legal/${slug}?error=${encodeURIComponent(error.message)}`);
    }
  } catch (err) {
    unstable_rethrow(err);
    redirect(`/admin/legal/${slug}?error=Controleer+alle+velden`);
  }

  revalidatePath(`/admin/legal/${slug}`);
  revalidatePath("/admin/legal");
  revalidatePath(`/${slug}`);
  redirect(`/admin/legal/${slug}?success=Opgeslagen`);
}
