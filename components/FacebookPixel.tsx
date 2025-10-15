"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function FacebookPixel() {
  const pixelId = "1203345207633415";

  useEffect(() => {
    // Initialize Facebook Pixel
    if (typeof window !== "undefined") {
      (window as any).fbq =
        (window as any).fbq ||
        function () {
          ((window as any).fbq.q = (window as any).fbq.q || []).push(arguments);
        };
      (window as any).fbq.loaded = true;
      (window as any).fbq.version = "2.0";
      (window as any).fbq.queue = [];

      // Track PageView
      (window as any).fbq("init", pixelId);
      (window as any).fbq("track", "PageView");
    }
  }, []);

  return (
    <>
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
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
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

// Helper function to track custom events
export const trackEvent = (eventName: string, data?: Record<string, any>) => {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", eventName, data);
  }
};
