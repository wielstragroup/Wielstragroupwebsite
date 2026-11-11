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
    <div
      role="region"
      aria-label="Cookiemelding"
      className="fixed inset-x-3 bottom-3 z-50 rounded-2xl bg-ink px-5 py-4 text-white shadow-[0_20px_50px_-20px_rgb(0_0_0/0.5)] sm:inset-x-auto sm:bottom-5 sm:right-5 sm:max-w-md"
    >
      <div className="flex flex-col items-start gap-3">
        <p className="text-sm leading-relaxed text-white/75">
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
          className="shrink-0 rounded-full bg-paper px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-signal hover:text-white"
        >
          Begrepen
        </button>
      </div>
    </div>
  );
}
