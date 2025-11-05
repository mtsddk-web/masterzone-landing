"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "./FacebookPixel";
import { scrollToContactForm } from "@/lib/scrollToForm";

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if popup was already shown in this session
    const popupShown = sessionStorage.getItem("exitIntentShown");
    if (popupShown) {
      setHasShown(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger only when cursor moves to top of screen (likely closing tab/window)
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem("exitIntentShown", "true");
        trackEvent("ViewContent", { source: "exit_intent_popup" });
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleCTA = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackEvent("Lead", { source: "exit_intent_popup_cta" });
    scrollToContactForm(e);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      {/* Popup Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg mx-4 p-8 md:p-10 animate-scale-in">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Zamknij"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="text-6xl mb-4">⚠️</div>

          {/* Headline */}
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
            Czekaj! Nie odchodź jeszcze...
          </h2>

          {/* Subheadline */}
          <p className="text-lg text-gray-700 mb-6">
            Dołącz do społeczności przedsiębiorców walczących z rozproszeniem
            <br />
            Tylko <strong className="text-indigo-600">$14/msc</strong> - pełen dostęp do wszystkiego
          </p>

          {/* Value Props */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 text-left">
            <p className="font-bold text-gray-900 mb-3">Otrzymasz NATYCHMIAST:</p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                120+ godzin pracy głębokiej miesięcznie
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Kursy: Praca Głęboka + System BLS + ClickUp
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Społeczność 30+ przedsiębiorców
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Gwarancja zwrotu pieniędzy
              </li>
            </ul>
          </div>

          {/* CTA Button */}
          <a
            href="#contact-form"
            onClick={handleCTA}
            className="inline-block w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-navy font-black py-4 px-8 rounded-xl transition-all duration-300 text-lg shadow-2xl hover:shadow-yellow-500/50 transform hover:scale-105 mb-4 cursor-pointer"
          >
            👉 Dołączam za $14/msc (oszczędzam $658)
          </a>

          {/* Risk Reversal */}
          <p className="text-xs text-gray-500">
            🔒 Bezpieczna płatność przez Skool | 💯 Gwarancja satysfakcji
          </p>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
