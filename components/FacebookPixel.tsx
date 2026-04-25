"use client";

import Script from "next/script";

const PIXEL_ID = "1203345207633415";

export default function FacebookPixel() {
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
            fbq('track', 'PageView');
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

// Helper: ensures events fire even before fbevents.js finishes loading.
// The stub created by the init snippet has a `.queue` array that fbevents
// drains once it loads. Calling fbq() before load is safe — it queues.
export const trackEvent = (eventName: string, data?: Record<string, any>) => {
  if (typeof window === "undefined") return;
  const fbq = (window as any).fbq;
  if (typeof fbq === "function") {
    fbq("track", eventName, data);
  }
};
