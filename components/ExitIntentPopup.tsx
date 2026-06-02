"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "./FacebookPixel";
import { useCheckout } from "@/hooks/useCheckout";
import { getAttribution } from "@/lib/utmCapture";

export default function ExitIntentPopup() {
  const { goToCheckout } = useCheckout();
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Rescue offer state
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const handleClose = () => {
    setIsVisible(false);
  };

  const validateEmail = (val: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  // Rescue offer: capture email -> Sender (separate source for segmentation)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = email.trim();
    if (!validateEmail(clean)) {
      setError("Podaj prawidłowy adres email");
      return;
    }
    setError("");
    setIsSubmitting(true);

    trackEvent("Lead", { source: "exit_intent_rescue" });

    try {
      const res = await fetch("/api/subscribe-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: clean,
          source: "Exit Intent - oferta ratunkowa",
          utm: getAttribution(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Coś poszło nie tak");
      }
      setIsSuccess(true);
    } catch {
      // Non-blocking: even if capture fails, let them proceed to checkout
      setError("Nie udało się zapisać. Spróbuj jeszcze raz albo dołącz od razu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCTA = () => {
    setIsVisible(false);
    goToCheckout("exit_intent_popup_cta");
  };

  if (!isVisible) return null;

  return (
    <>
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
          {isSuccess ? (
            // SUCCESS VIEW
            <>
              <div className="text-5xl mb-4">📬</div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Sprawdź skrzynkę!
              </h2>
              <p className="text-base text-gray-600 mb-6">
                Wysłałem Ci na maila przewodnik po pracy głębokiej (body doubling) plus
                wszystko czego potrzebujesz, żeby zacząć 7 dni za darmo. Jeśli nie widzisz maila,
                zajrzyj do folderu SPAM.
              </p>
              <button
                onClick={handleCTA}
                className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-center font-bold py-3 px-6 rounded-lg transition-all cursor-pointer mb-2"
              >
                Zacznij 7 dni za darmo →
              </button>
              <button
                onClick={handleClose}
                className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 text-sm transition-colors"
              >
                Wrócę później
              </button>
            </>
          ) : (
            // RESCUE OFFER VIEW
            <>
              {/* Icon */}
              <div className="text-5xl mb-4">🎁</div>

              {/* Headline */}
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Zanim odejdziesz - zostaw email
              </h2>

              {/* Subheadline */}
              <p className="text-base text-gray-600 mb-6">
                Wyślę Ci przewodnik po pracy głębokiej (body doubling) plus dostęp do
                7 dni MasterZone za darmo. Bez zobowiązań, anulujesz kiedy chcesz.
              </p>

              {/* Email form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="twoj@email.pl"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-base disabled:bg-gray-100"
                  required
                />
                {error && (
                  <p className="text-sm text-red-600 text-left">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed border-2 border-yellow-300"
                >
                  {isSubmitting ? "Wysyłam..." : "Wyślij mi przewodnik + dostęp →"}
                </button>
              </form>

              {/* Secondary: go straight to checkout */}
              <button
                onClick={handleCTA}
                className="block w-full text-blue-600 hover:text-blue-800 font-semibold py-3 mt-3 text-sm transition-colors cursor-pointer"
              >
                Wolę od razu dołączyć do MasterZone →
              </button>

              <p className="text-xs text-gray-400 mt-2">
                Zero spamu. Możesz wypisać się jednym kliknięciem.
              </p>
            </>
          )}
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
