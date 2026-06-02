"use client";

/**
 * First-touch attribution capture.
 *
 * Problem (audyt 02.06.2026): UTM zylo TYLKO w window.location.search.
 * Po odswiezeniu / nawigacji wewnetrznej / powrocie z zewnatrz parametry
 * znikaly -> checkout szedl bez UTM -> 0/12 atrybucji w subscriptions.
 *
 * Fix: przy PIERWSZYM wejsciu z parametrami zapisz je do localStorage
 * (first-touch wins). Checkout czyta z URL, a jak pusto - z localStorage.
 */

const STORAGE_KEY = "mz_attribution";

const FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
] as const;

export interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
  landing_url?: string;
  ts?: number;
}

/**
 * Wywolaj raz przy starcie (root client component, useEffect).
 * Zapisuje atrybucje tylko jesli URL ma parametry I nic jeszcze nie zapisano
 * (first-touch). Nigdy nie nadpisuje istniejacej atrybucji pustym wejsciem.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const incoming: Record<string, string> = {};
    FIELDS.forEach((f) => {
      const v = params.get(f);
      if (v) incoming[f] = v;
    });

    // Brak nowych parametrow w URL -> nie ruszaj zapisanej atrybucji.
    if (Object.keys(incoming).length === 0) return;

    // First-touch wins: jak juz cos zapisano, nie nadpisuj.
    if (window.localStorage.getItem(STORAGE_KEY)) return;

    const record: Attribution = {
      ...incoming,
      landing_url: window.location.href,
      ts: Date.now(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    /* localStorage moze byc niedostepny (prywatny tryb) - ignoruj */
  }
}

/**
 * Odczyt zapisanej atrybucji. Zwraca {} jak brak / blad parsowania.
 */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}
