'use client';

import { useRouter } from 'next/navigation';
import { trackEvent } from '@/components/FacebookPixel';

export function useCheckout() {
  const router = useRouter();

  const goToCheckout = (source: string) => {
    trackEvent('InitiateCheckout', { source });
    router.push('/checkout');
  };

  return { goToCheckout };
}
