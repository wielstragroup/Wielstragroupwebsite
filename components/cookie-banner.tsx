"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "cookie-notice-dismissed";

function subscribe() {
  return () => {};
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function getServerSnapshot() {
  // Verberg de banner tijdens server-rendering / eerste paint, zodat er
  // geen hydration mismatch ontstaat zolang localStorage nog niet is gelezen.
  return true;
}

export function CookieBanner() {
  const pathname = usePathname();
  const previouslyDismissed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [justDismissed, setJustDismissed] = useState(false);

  if (previouslyDismissed || justDismissed || pathname?.startsWith("/admin")) {
    return null;
  }

  function dismiss() {
    setJustDismissed(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // localStorage niet beschikbaar (bv. privénavigatie) — banner
      // verdwijnt dan gewoon voor de rest van dit bezoek.
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-800 bg-slate-950/95 px-4 py-4 backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-slate-300">
          Deze website plaatst geen trackingcookies. We gebruiken alleen technisch
          noodzakelijke cookies (bijvoorbeeld voor het inloggen in het beheerderspaneel)
          en een privacyvriendelijke, cookieloze bezoekstatistiek. Lees meer in ons{" "}
          <Link href="/cookiebeleid" className="font-medium text-white underline underline-offset-2">
            cookiebeleid
          </Link>{" "}
          en{" "}
          <Link href="/privacybeleid" className="font-medium text-white underline underline-offset-2">
            privacybeleid
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
        >
          Begrepen
        </button>
      </div>
    </div>
  );
}
