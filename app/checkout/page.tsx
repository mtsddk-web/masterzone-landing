"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { trackEvent } from "@/components/FacebookPixel";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const trial = searchParams.get("trial");
  const emailParam = searchParams.get("email");
  const utmSource = searchParams.get("utm_source");
  const utmMedium = searchParams.get("utm_medium");
  const utmCampaign = searchParams.get("utm_campaign");

  const trialDays = trial ? parseInt(trial, 10) : 0;

  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<"stripe" | "payu" | null>(null);

  const handleCheckout = async (provider: "stripe" | "payu") => {
    setIsLoading(true);
    setSelectedProvider(provider);

    trackEvent("InitiateCheckout", {
      value: 97,
      currency: "PLN",
      trial: trialDays > 0,
      provider,
    });

    try {
      const endpoint = provider === "stripe" ? "/api/stripe/checkout" : "/api/payu/checkout";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trial: trialDays || undefined,
          email: emailParam || undefined,
          utm: {
            source: utmSource || undefined,
            medium: utmMedium || undefined,
            campaign: utmCampaign || undefined,
          },
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned");
        setIsLoading(false);
        setSelectedProvider(null);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setIsLoading(false);
      setSelectedProvider(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/images/logo-masterzone.png"
            alt="MasterZone"
            className="w-16 h-16 mx-auto mb-4 object-contain"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Dołącz do MasterZone
          </h1>
          <p className="text-blue-200">
            Społeczność ludzi, którzy pracują głęboko
          </p>
        </div>

        {/* Order summary card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          {/* Price */}
          <div className="text-center mb-6 pb-6 border-b border-gray-200">
            {trialDays > 0 ? (
              <>
                <div className="inline-block bg-green-100 text-green-800 font-bold text-sm px-4 py-1 rounded-full mb-3">
                  {trialDays} dni za darmo
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  97 PLN<span className="text-lg font-normal text-gray-500">/miesiąc</span>
                </div>
                <p className="text-sm text-gray-500">
                  Pierwsza płatność po {trialDays} dniach. Anulujesz kiedy chcesz.
                </p>
              </>
            ) : (
              <>
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  97 PLN<span className="text-lg font-normal text-gray-500">/miesiąc</span>
                </div>
                <p className="text-sm text-gray-500">
                  Subskrypcja miesięczna. Anulujesz kiedy chcesz.
                </p>
              </>
            )}
          </div>

          {/* Benefits */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Co dostajesz:</h3>
            <ul className="space-y-2">
              {[
                "4 bloki pracy głębokiej dziennie (pon-pt)",
                "Społeczność skupionych ludzi na Skool",
                "Planowanie tygodnia i kwartału",
                "Cotygodniowe mastermind sessions",
                "Dostęp do aplikacji tydzien-app",
              ].map((benefit, i) => (
                <li key={i} className="flex items-start text-sm text-gray-700">
                  <svg
                    className="w-5 h-5 mr-2 flex-shrink-0 text-green-500 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Payment method selection */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">Wybierz metodę płatności:</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Stripe - Karty */}
              <button
                onClick={() => handleCheckout("stripe")}
                disabled={isLoading}
                className={`
                  flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all duration-200
                  ${isLoading && selectedProvider === "stripe"
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-orange-400 hover:bg-orange-50"
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <svg className="w-8 h-8 mb-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M0 8v8c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H2c-1.1 0-2 .9-2 2zm2 0h20v2H2V8zm0 8h20v-4H2v4z"/>
                </svg>
                <span className="font-semibold text-sm text-gray-800">Karta płatnicza</span>
                <span className="text-xs text-gray-500 mt-1">Visa, Mastercard</span>
                {isLoading && selectedProvider === "stripe" && (
                  <span className="text-xs text-orange-600 mt-2">Przekierowuję...</span>
                )}
              </button>

              {/* PayU - BLIK/Przelewy24 */}
              <button
                onClick={() => handleCheckout("payu")}
                disabled={isLoading}
                className={`
                  flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all duration-200
                  ${isLoading && selectedProvider === "payu"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-green-400 hover:bg-green-50"
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <svg className="w-8 h-8 mb-2 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"/>
                </svg>
                <span className="font-semibold text-sm text-gray-800">BLIK / Przelew</span>
                <span className="text-xs text-gray-500 mt-1">Przelewy24, mBank</span>
                {isLoading && selectedProvider === "payu" && (
                  <span className="text-xs text-green-600 mt-2">Przekierowuję...</span>
                )}
              </button>
            </div>
          </div>

          {/* Trust signals */}
          <div className="mt-4 space-y-2 text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Szyfrowane i bezpieczne płatności
            </p>
            <p className="text-xs text-gray-500">
              30-dniowa gwarancja zwrotu pieniędzy
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center">
          <a href="/" className="text-blue-300 hover:text-white text-sm transition-colors">
            &larr; Wróć na stronę główną
          </a>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Ładowanie...</div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
