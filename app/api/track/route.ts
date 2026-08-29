import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { hashVisitor } from "@/lib/analytics";
import { getClientIp } from "@/lib/request";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const MAX_PATH_LENGTH = 300;

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ ok: false }, { status: 204 });
  }

  const body = await request.json().catch(() => null);
  const path = typeof body?.path === "string" ? body.path.trim().slice(0, MAX_PATH_LENGTH) : "";

  if (!path.startsWith("/") || path.startsWith("/admin") || path.startsWith("/api")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const headerList = await headers();
  const ip = await getClientIp();
  const userAgent = headerList.get("user-agent") ?? "unknown";

  await supabase.from("page_views").insert({
    path,
    visitor_hash: hashVisitor(ip, userAgent),
  });

  return NextResponse.json({ ok: true });
}
