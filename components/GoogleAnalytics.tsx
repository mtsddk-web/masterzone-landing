"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const previousPathname = useRef<string | null>(null);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || typeof window.gtag !== "function") return;
    if (previousPathname.current === null) {
      previousPathname.current = pathname;
      return;
    }
    if (previousPathname.current === pathname) return;

    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
    previousPathname.current = pathname;
  }, [pathname]);

  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              page_location: window.location.href,
              page_title: document.title
            });
          `,
        }}
      />
    </>
  );
}

export const trackGoogleEvent = (
  eventName: string,
  parameters?: Record<string, unknown>,
) => {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;

  window.gtag("event", eventName, parameters || {});
};
