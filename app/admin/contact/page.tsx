import type { Metadata } from "next";

import { deleteContactMessageAction } from "@/app/admin/contact/actions";
import { requireAdmin } from "@/lib/auth";
import { BUDGET_OPTIONS, labelFor, REQUEST_TYPES, SERVICE_OPTIONS } from "@/lib/contact-options";

export const metadata: Metadata = {
  title: "Contactaanvragen",
  robots: { index: false, follow: false },
};

export default async function AdminContactPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { supabase } = await requireAdmin();
  // Eerst met de nieuwe kolommen; valt terug op de basisvelden zolang
  // de migratie 20261111120000_contact_request_details nog niet is uitgevoerd.
  type Message = {
    id: string;
    name: string;
    company_name: string;
    email: string;
    message: string;
    created_at: string;
    request_type?: string | null;
    service?: string | null;
    budget?: string | null;
    phone?: string | null;
  };

  const full = await supabase
    .from("contact_messages")
    .select("id,name,company_name,email,message,created_at,request_type,service,budget,phone")
    .order("created_at", { ascending: false });

  let messages: Message[] | null = full.data as Message[] | null;
  if (full.error) {
    const basic = await supabase
      .from("contact_messages")
      .select("id,name,company_name,email,message,created_at")
      .order("created_at", { ascending: false });
    messages = basic.data as Message[] | null;
  }

  const { success, error } = await searchParams;

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Contactaanvragen</h1>

      {success ? <p className="rounded-xl bg-emerald-100 px-4 py-2 text-sm text-emerald-900">{success}</p> : null}
      {error ? <p className="rounded-xl bg-red-100 px-4 py-2 text-sm text-red-900">{error}</p> : null}

      {(messages ?? []).length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
          Nog geen aanvragen ontvangen.
        </p>
      ) : (
        <div className="space-y-4">
          {(messages ?? []).map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">
                    {item.name}
                    {item.company_name ? (
                      <span className="font-normal text-slate-500"> — {item.company_name}</span>
                    ) : null}
                  </p>
                  <a href={`mailto:${item.email}`} className="text-sm text-slate-600 hover:underline">
                    {item.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <time className="text-xs text-slate-400" dateTime={item.created_at}>
                    {new Date(item.created_at).toLocaleString("nl-NL", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </time>
                  <form action={deleteContactMessageAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <button type="submit" className="rounded-lg border border-red-300 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50">
                      Verwijderen
                    </button>
                  </form>
                </div>
              </div>
              {item.request_type || item.service || item.budget || item.phone ? (
                <ul className="mt-3 flex flex-wrap gap-2 text-xs">
                  {[
                    labelFor(REQUEST_TYPES, item.request_type),
                    labelFor(SERVICE_OPTIONS, item.service),
                    item.budget ? `Budget: ${labelFor(BUDGET_OPTIONS, item.budget) ?? item.budget}` : null,
                    item.phone ? `Tel: ${item.phone}` : null,
                  ]
                    .filter(Boolean)
                    .map((tag) => (
                      <li key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                        {tag}
                      </li>
                    ))}
                </ul>
              ) : null}
              <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{item.message}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
