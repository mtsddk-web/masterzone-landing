"use client";

import { useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { trackEvent } from "@/components/FacebookPixel";
import { getAttribution } from "@/lib/utmCapture";

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const trial = searchParams.get("trial");
  const emailParam = searchParams.get("email");
  // URL params maja priorytet; jak pusto - fallback na first-touch z localStorage.
  const attr = typeof window !== "undefined" ? getAttribution() : {};
  const utmSource = searchParams.get("utm_source") || attr.utm_source;
  const utmMedium = searchParams.get("utm_medium") || attr.utm_medium;
  const utmCampaign = searchParams.get("utm_campaign") || attr.utm_campaign;
  const utmContent = searchParams.get("utm_content") || attr.utm_content;
  const fbclid = searchParams.get("fbclid") || attr.fbclid;

  const trialDays = trial !== null ? parseInt(trial, 10) : 7;

  // BLIK / PayU - włącz dopiero po naprawieniu OAuth POS w panelu PayU
  // (PAYU_CLIENT_ID / PAYU_CLIENT_SECRET) i udanym teście transakcji.
  const PAYU_ENABLED = false;

  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<"stripe" | "payu" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>(emailParam || "");
  const [emailError, setEmailError] = useState<string | null>(null);

  const validateEmail = (val: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val.trim());
  };

  const handleCheckout = async (provider: "stripe" | "payu") => {
    // Walidacja email przed Stripe
    const cleanEmail = email.trim();
    if (!validateEmail(cleanEmail)) {
      setEmailError("Podaj prawidłowy adres email");
      return;
    }
    setEmailError(null);
    setIsLoading(true);
    setSelectedProvider(provider);
    setError(null);

    trackEvent("InitiateCheckout", {
      value: 67,
      currency: "PLN",
      trial: trialDays > 0,
      provider,
    });

    // Pre-warm Sender PRZED Stripe - jesli network fail, kontynuuj (zapisemy z webhook).
    fetch("/api/subscribe-trial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: cleanEmail,
        source: "checkout_page",
        utm: {
          utm_source: utmSource || undefined,
          utm_medium: utmMedium || undefined,
          utm_campaign: utmCampaign || undefined,
          utm_content: utmContent || undefined,
          landing_url: attr.landing_url || undefined,
        },
      }),
    }).catch((err) => {
      console.warn("[checkout] subscribe-trial pre-warm failed (non-blocking):", err);
    });

    try {
      const endpoint = provider === "stripe" ? "/api/stripe/checkout" : "/api/payu/checkout";

      // Meta click identifiers - kluczowe dla atrybucji Purchase z reklamy.
      // _fbc nadawany przez pixel z fbclid; jak go nie ma, budujemy z fbclid w URL.
      const fbp = readCookie("_fbp");
      const fbc = readCookie("_fbc") || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trial: trialDays || undefined,
          email: cleanEmail,
          utm: {
            source: utmSource || undefined,
            medium: utmMedium || undefined,
            campaign: utmCampaign || undefined,
            content: utmContent || undefined,
          },
          fbp,
          fbc,
          landingUrl:
            attr.landing_url ||
            (typeof document !== "undefined" ? document.referrer || undefined : undefined),
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned:", data);
        setError("Nie udało się utworzyć płatności. Spróbuj ponownie lub wybierz inną metodę.");
        setIsLoading(false);
        setSelectedProvider(null);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Wystąpił błąd połączenia. Sprawdź internet i spróbuj ponownie.");
      setIsLoading(false);
      setSelectedProvider(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/images/logo-masterzone.png"
            alt="MasterZone"
            width={64}
            height={64}
            priority
            className="w-16 h-16 mx-auto mb-4 object-contain rounded-lg"
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
            {trialDays > 0 && (
              <div className="inline-block bg-green-100 text-green-800 font-bold text-sm px-4 py-1 rounded-full mb-3">
                {trialDays} dni za darmo
              </div>
            )}
            <div className="inline-block bg-amber-100 text-amber-800 font-semibold text-xs px-3 py-1 rounded-full mb-2">
              Promo założycielska dla pierwszych 100 osób
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1 flex items-baseline justify-center gap-2">
              <span className="text-lg font-normal text-gray-400 line-through">97 zł</span>
              <span>67 zł<span className="text-lg font-normal text-gray-500">/miesiąc</span></span>
            </div>
            <p className="text-sm text-gray-500">
              {trialDays > 0
                ? `Cena 67 zł zablokowana na zawsze. Pierwsza płatność po ${trialDays} dniach. Anulujesz kiedy chcesz.`
                : "Cena 67 zł zablokowana na zawsze. Subskrypcja miesięczna. Anulujesz kiedy chcesz."}
            </p>
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

          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="checkout-email" className="block text-sm font-semibold text-gray-700 mb-2">
              Twój email
            </label>
            <input
              id="checkout-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(null); }}
              placeholder="twoj@email.pl"
              disabled={isLoading}
              required
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none text-base ${
                emailError ? "border-red-400 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
              } disabled:bg-gray-100 disabled:cursor-not-allowed`}
            />
            {emailError && (
              <p className="mt-2 text-sm text-red-600">{emailError}</p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Na ten adres wyślemy zaproszenie do społeczności Skool.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 text-center">{error}</p>
            </div>
          )}

          {/* Payment */}
          <div className="mb-6 space-y-3">
            {PAYU_ENABLED && (
              <>
                {/* BLIK / szybki przelew (PayU) - bez karty */}
                <button
                  onClick={() => handleCheckout("payu")}
                  disabled={isLoading}
                  className={`
                    w-full flex flex-col items-center justify-center p-5 border-2 rounded-xl transition-all duration-200
                    ${isLoading && selectedProvider === "payu"
                      ? "border-green-600 bg-green-100"
                      : "border-green-500 bg-green-50 hover:border-green-600 hover:bg-green-100"
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  <span className="text-2xl mb-1">📲</span>
                  <span className="font-bold text-base text-gray-900">Zapłać BLIKiem - 67 zł</span>
                  <span className="text-xs text-gray-600 mt-1 text-center">
                    Bez karty. Płacisz z apki bankowej (BLIK lub szybki przelew). Pierwszy miesiąc - 30 dni gwarancji zwrotu.
                  </span>
                  {isLoading && selectedProvider === "payu" && (
                    <span className="text-xs text-green-700 mt-2">Przekierowuję do płatności...</span>
                  )}
                </button>

                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="h-px bg-gray-200 flex-1" />
                  albo
                  <span className="h-px bg-gray-200 flex-1" />
                </div>
              </>
            )}

            {/* Karta (Stripe) - zachowuje darmowy okres próbny */}
            <button
              onClick={() => handleCheckout("stripe")}
              disabled={isLoading}
              className={`
                w-full flex flex-col items-center justify-center p-5 border-2 rounded-xl transition-all duration-200
                ${isLoading && selectedProvider === "stripe"
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 hover:border-orange-400 hover:bg-orange-50"
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <svg className="w-7 h-7 mb-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M0 8v8c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H2c-1.1 0-2 .9-2 2zm2 0h20v2H2V8zm0 8h20v-4H2v4z"/>
              </svg>
              <span className="font-semibold text-base text-gray-800">
                {trialDays > 0 ? `Kartą - ${trialDays} dni za darmo` : "Kartą"}
              </span>
              <span className="text-xs text-gray-500 mt-1 text-center">
                {trialDays > 0
                  ? `0 zł dzisiaj. Karta tylko zabezpieczająca, pierwsza płatność za ${trialDays} dni. Subskrypcja odnawia się automatycznie.`
                  : "Visa, Mastercard. Subskrypcja odnawia się automatycznie."}
              </span>
              {isLoading && selectedProvider === "stripe" && (
                <span className="text-xs text-orange-600 mt-2">Przekierowuję...</span>
              )}
            </button>
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
