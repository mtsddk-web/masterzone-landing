'use client';

import { trackEvent } from '@/components/FacebookPixel';

export function useCheckout() {
  const goToCheckout = (source: string) => {
    trackEvent('InitiateCheckout', { source });
    const qs = typeof window !== 'undefined' ? window.location.search : '';
    const params = new URLSearchParams(qs);
    if (!params.has('trial')) params.set('trial', '7');

    // HARD navigation (window.location), NIE router.push (soft SPA nav).
    // Powod: Microsoft Clarity i Meta Pixel rejestruja PageView TYLKO na pelnym
    // zaladowaniu strony - soft-nav App Routera nie generuje czystego page view
    // dla /checkout (Clarity = 0 wyswietlen /checkout mimo realnego ruchu, blind
    // spot SPA). Hard nav gwarantuje czysty PageView /checkout w Clarity + Pixel,
    // wiec lejek jest mierzalny end-to-end. Tracking InitiateCheckout odpala sie
    // przed nawigacja (fbq image beacon + CAPI sendBeacon = unload-safe).
    if (typeof window !== 'undefined') {
      window.location.assign(`/checkout?${params.toString()}`);
    }
  };

  return { goToCheckout };
}
