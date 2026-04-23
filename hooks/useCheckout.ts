'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { trackEvent } from '@/components/FacebookPixel';

export function useCheckout() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToCheckout = (source: string) => {
    trackEvent('InitiateCheckout', { source });
    const qs = searchParams.toString();
    router.push(`/checkout${qs ? `?${qs}` : ''}`);
  };

  return { goToCheckout };
}
