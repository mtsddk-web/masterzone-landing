"use client";

import { useEffect } from "react";

export default function MicrosoftClarity() {
  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

    if (!projectId) {
      console.warn("Microsoft Clarity: NEXT_PUBLIC_CLARITY_PROJECT_ID not set");
      return;
    }

    // Microsoft Clarity tracking code
    (function(c: any, l: any, a: any, r: any, i: string){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      const t=l.createElement(r);
      t.async=1;
      t.src="https://www.clarity.ms/tag/"+i;
      const y=l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", projectId);
  }, []);

  return null;
}
