'use client';

import { useRouter } from 'next/navigation';
import { trackEvent } from '@/components/FacebookPixel';

export function useCheckout() {
  const router = useRouter();

  const goToCheckout = (source: string) => {
    trackEvent('InitiateCheckout', { source });
    const qs = typeof window !== 'undefined' ? window.location.search : '';
    router.push(`/checkout${qs}`);
  };

  return { goToCheckout };
}
