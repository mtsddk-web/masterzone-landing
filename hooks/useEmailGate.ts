import { useState } from 'react';
import { trackEvent } from '@/components/FacebookPixel';

export function useEmailGate(ctaUrl: string = 'https://www.skool.com/masterzone') {
  const [isEmailGateOpen, setIsEmailGateOpen] = useState(false);

  const openEmailGate = (source: string) => {
    trackEvent("Lead", { source });
    setIsEmailGateOpen(true);
  };

  const closeEmailGate = () => {
    setIsEmailGateOpen(false);
  };

  const handleEmailSuccess = () => {
    // Email captured successfully - redirect to Skool
    window.location.href = ctaUrl;
  };

  return {
    isEmailGateOpen,
    openEmailGate,
    closeEmailGate,
    handleEmailSuccess,
  };
}
