import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    redirect("/admin/login?error=Supabase+is+niet+geconfigureerd");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    redirect("/");
  }

  return { supabase, user };
}
