import { useState } from 'react';
import { trackEvent } from '@/components/FacebookPixel';

export function useEmailGate(ctaUrl: string = 'https://www.skool.com/masterzone') {
  const [isEmailGateOpen, setIsEmailGateOpen] = useState(false);

  const openEmailGate = (source: string) => {
    // Don't track Lead here - only track when email is actually submitted
    setIsEmailGateOpen(true);
  };

  const closeEmailGate = () => {
    setIsEmailGateOpen(false);
  };

  const handleEmailSuccess = () => {
    // Email captured successfully - just close modal
    // User will get email with link to Skool
    setIsEmailGateOpen(false);
  };

  return {
    isEmailGateOpen,
    openEmailGate,
    closeEmailGate,
    handleEmailSuccess,
  };
}
