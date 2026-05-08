'use client';

import { useRouter } from 'next/navigation';
import { trackEvent } from '@/components/FacebookPixel';

export function useCheckout() {
  const router = useRouter();

  const goToCheckout = (source: string) => {
    trackEvent('InitiateCheckout', { source });
    const qs = typeof window !== 'undefined' ? window.location.search : '';
    const params = new URLSearchParams(qs);
    if (!params.has('trial')) params.set('trial', '7');
    router.push(`/checkout?${params.toString()}`);
  };

  return { goToCheckout };
}
