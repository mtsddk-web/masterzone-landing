"use client";

import Script from "next/script";
import { useEffect } from "react";

const PIXEL_ID = "1203345207633415";

const MATCH_KEYS = ["email", "phone", "firstName", "lastName", "externalId"] as const;

const generateEventId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

const readCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
};

const buildFbcFromUrl = (): string | undefined => {
  if (typeof window === "undefined") return undefined;
  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  if (!fbclid) return undefined;
  return `fb.1.${Date.now()}.${fbclid}`;
};

const sendToCapi = (payload: Record<string, unknown>) => {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/capi/track", blob);
      return;
    }
    fetch("/api/capi/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    /* noop */
  }
};

export default function FacebookPixel() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const fbq = (window as any).fbq;
    if (typeof fbq !== "function") return;
    const eventId = generateEventId();
    fbq("track", "PageView", {}, { eventID: eventId });
    sendToCapi({
      eventName: "PageView",
      eventId,
      eventSourceUrl: window.location.href,
      fbp: readCookie("_fbp"),
      fbc: readCookie("_fbc") || buildFbcFromUrl(),
    });
  }, []);

  return (
    <>
      <Script
        id="facebook-pixel"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

export const trackEvent = (eventName: string, data?: Record<string, any>) => {
  if (typeof window === "undefined") return;
  const fbq = (window as any).fbq;
  if (typeof fbq !== "function") return;

  const eventId = generateEventId();
  const customData: Record<string, any> = {};
  const userIdentifiers: Record<string, string> = {};

  if (data) {
    for (const [key, value] of Object.entries(data)) {
      if ((MATCH_KEYS as readonly string[]).includes(key) && typeof value === "string") {
        userIdentifiers[key] = value;
      } else {
        customData[key] = value;
      }
    }
  }

  fbq("track", eventName, customData, { eventID: eventId });

  sendToCapi({
    eventName,
    eventId,
    eventSourceUrl: window.location.href,
    fbp: readCookie("_fbp"),
    fbc: readCookie("_fbc") || buildFbcFromUrl(),
    email: userIdentifiers.email,
    phone: userIdentifiers.phone,
    firstName: userIdentifiers.firstName,
    lastName: userIdentifiers.lastName,
    externalId: userIdentifiers.externalId,
    customData,
  });
};
