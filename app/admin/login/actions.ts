"use server";

import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    redirect("/admin/login?error=Supabase+is+niet+geconfigureerd");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent("Inloggen mislukt")}`);
  }

  redirect("/admin/dashboard");
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/");
}
