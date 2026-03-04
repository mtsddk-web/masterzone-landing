"use client";

import { useEffect } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { trackEvent } from "@/components/FacebookPixel";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      trackEvent("Purchase", {
        value: 97,
        currency: "PLN",
        content_name: "MasterZone Community",
      });
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Success header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Płatność zakończona sukcesem!
          </h1>

          <p className="text-xl text-blue-200 mb-2">
            Witaj w MasterZone! Zaproszenie do społeczności leci na Twój email.
          </p>
        </div>

        {/* Video */}
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-2xl mb-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white mb-2">
              Jak zacząć w MasterZone
            </h2>
            <p className="text-blue-200">
              Obejrzyj ten krótki film - wyjaśnia wszystko:
            </p>
          </div>

          <div className="relative rounded-xl overflow-hidden bg-black" style={{ paddingTop: '62.5%' }}>
            <iframe
              src="https://fast.wistia.net/embed/iframe/65js2p406n?seo=true&videoFoam=true&autoPlay=true&volume=1&silentAutoPlay=false"
              title="Jak poruszać się po MasterZone"
              allow="autoplay; fullscreen"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
              style={{ border: 'none' }}
            />
          </div>
        </div>

        {/* Next steps */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Co dalej:</h3>
          <ol className="space-y-3 text-blue-100">
            <li className="flex items-start gap-3">
              <span className="bg-yellow-400 text-gray-900 font-bold w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm">1</span>
              <span>Sprawdź email - wysłaliśmy zaproszenie do społeczności Skool</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-yellow-400 text-gray-900 font-bold w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm">2</span>
              <span>Kliknij link w mailu i załóż konto na Skool (darmowe)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-yellow-400 text-gray-900 font-bold w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm">3</span>
              <span>Dołącz do pierwszego bloku pracy głębokiej!</span>
            </li>
          </ol>
        </div>

        {/* CTA buttons */}
        <div className="text-center space-y-4">
          <a
            href="https://www.skool.com/masterzone"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full md:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-5 px-12 rounded-xl transition-all duration-300 text-lg shadow-2xl hover:shadow-green-500/50 transform hover:scale-105"
          >
            Przejdź do MasterZone (Skool)
          </a>

          <div>
            <a
              href="https://tydzien.masterzone.edu.pl"
              className="text-blue-300 hover:text-white text-sm transition-colors"
            >
              Lub przejdź do aplikacji tydzien-app
            </a>
          </div>

          <p className="text-xs text-blue-400">
            Masz pytania? Napisz do nas na biuro@masterzone.edu.pl
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Ładowanie...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
