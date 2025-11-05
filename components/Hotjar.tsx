"use client";

import { useEffect } from "react";

export default function Hotjar() {
  useEffect(() => {
    const siteId = process.env.NEXT_PUBLIC_HOTJAR_SITE_ID;

    if (!siteId) {
      console.warn("Hotjar: NEXT_PUBLIC_HOTJAR_SITE_ID not set");
      return;
    }

    // Hotjar tracking code
    (function(h: any, o: any, t: string, j: string, a?: any, r?: any) {
      h.hj = h.hj || function() {
        (h.hj.q = h.hj.q || []).push(arguments);
      };
      h._hjSettings = { hjid: siteId, hjsv: 6 };
      a = o.getElementsByTagName('head')[0];
      r = o.createElement('script');
      r.async = 1;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
  }, []);

  return null;
}
