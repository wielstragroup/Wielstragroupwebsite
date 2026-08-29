"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";

export async function deleteContactMessageAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");

  await supabase.from("contact_messages").delete().eq("id", id);

  revalidatePath("/admin/contact");
  redirect("/admin/contact?success=Bericht+verwijderd");
}
