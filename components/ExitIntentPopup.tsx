"use client";

import { useEffect, useState } from "react";
import { useEmailGate } from "@/hooks/useEmailGate";
import { trackEvent } from "./FacebookPixel";
import EmailGateModal from "./EmailGateModal";

export default function ExitIntentPopup() {
  const { isEmailGateOpen, openEmailGate, closeEmailGate, handleEmailSuccess } = useEmailGate();
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if popup was already shown in this session
    const popupShown = sessionStorage.getItem("exitIntentShown");
    if (popupShown) {
      setHasShown(true);
      return;
    }

    // Wait 5 seconds before activating exit intent
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady || hasShown) return;

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
  }, [isReady, hasShown]);

  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSubmit = async () => {
    const reason = selectedReason === "other" ? otherReason : selectedReason;

    // Track w Facebook Pixel
    trackEvent("Survey", {
      source: "exit_intent_survey",
      reason: reason
    });

    // Wyślij do Google Sheets via API
    try {
      await fetch('/api/exit-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: reason,
          timestamp: Date.now(),
          url: window.location.href
        }),
      });
    } catch (error) {
      console.error('Failed to send exit survey:', error);
      // Nie blokuj UI nawet jeśli webhook nie działa
    }

    setIsVisible(false);
  };

  const handleCTA = () => {
    setIsVisible(false);
    openEmailGate("exit_intent_popup_cta_after_survey");
  };

  if (!isVisible) return null;

  return (
    <>
      <EmailGateModal
        isOpen={isEmailGateOpen}
        onClose={closeEmailGate}
        onSuccess={handleEmailSuccess}
      />
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
        <div className="text-left">
          {/* Icon */}
          <div className="text-5xl mb-4 text-center">💬</div>

          {/* Headline */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 text-center">
            Zanim odejdziesz - pomóż nam!
          </h2>

          {/* Subheadline */}
          <p className="text-base text-gray-600 mb-6 text-center">
            Co sprawiło, że opuszczasz stronę? Twoja opinia pomoże nam stworzyć lepszą ofertę.
          </p>

          {/* Survey Options */}
          <div className="space-y-3 mb-6">
            <label className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors border-2 border-transparent has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
              <input
                type="radio"
                name="exit-reason"
                value="price"
                checked={selectedReason === "price"}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="mt-1 mr-3"
              />
              <span className="text-gray-800">Za drogo - 97 PLN/msc to za dużo</span>
            </label>

            <label className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors border-2 border-transparent has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
              <input
                type="radio"
                name="exit-reason"
                value="not-for-me"
                checked={selectedReason === "not-for-me"}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="mt-1 mr-3"
              />
              <span className="text-gray-800">To nie dla mnie / Nie potrzebuję tego</span>
            </label>

            <label className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors border-2 border-transparent has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
              <input
                type="radio"
                name="exit-reason"
                value="no-time"
                checked={selectedReason === "no-time"}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="mt-1 mr-3"
              />
              <span className="text-gray-800">Nie mam teraz czasu / Wrócę później</span>
            </label>

            <label className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors border-2 border-transparent has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
              <input
                type="radio"
                name="exit-reason"
                value="need-more-info"
                checked={selectedReason === "need-more-info"}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="mt-1 mr-3"
              />
              <span className="text-gray-800">Potrzebuję więcej informacji</span>
            </label>

            <label className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors border-2 border-transparent has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
              <input
                type="radio"
                name="exit-reason"
                value="other"
                checked={selectedReason === "other"}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="mt-1 mr-3"
              />
              <span className="text-gray-800">Inne (wpisz poniżej)</span>
            </label>

            {selectedReason === "other" && (
              <textarea
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                placeholder="Powiedz nam więcej..."
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                rows={3}
              />
            )}
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSubmit}
              disabled={!selectedReason || (selectedReason === "other" && !otherReason)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Wyślij opinię
            </button>

            <button
              onClick={handleCTA}
              className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-center font-bold py-3 px-6 rounded-lg transition-all cursor-pointer"
            >
              Jednak chcę dołączyć do MasterZone →
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-4 text-center">
            Dziękujemy za feedback - pomaga nam to rozwijać MasterZone
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
    </>
  );
}
