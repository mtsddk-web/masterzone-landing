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
            Witaj w MasterZone! Kliknij przycisk poniżej, żeby dołączyć do społeczności.
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

          <div className="relative rounded-xl overflow-hidden bg-black" style={{ paddingTop: '56.25%' }}>
            <iframe
              src="https://www.youtube.com/embed/N5vxoKmNVos?autoplay=1&rel=0"
              title="Jak poruszać się po MasterZone"
              allow="autoplay; fullscreen; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
              <span><strong className="text-white">Sprawdź skrzynkę email</strong> — w ciągu kilku minut otrzymasz osobiste zaproszenie od Skool z przyciskiem &bdquo;JOIN NOW&rdquo;. Sprawdź też folder SPAM.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-yellow-400 text-gray-900 font-bold w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm">2</span>
              <span>Kliknij <strong className="text-white">JOIN NOW</strong> w mailu i załóż darmowe konto na Skool (lub zaloguj się, jeśli już masz). <strong className="text-yellow-300">Użyj tego samego adresu email</strong>, na który dostałeś zaproszenie.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-yellow-400 text-gray-900 font-bold w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm">3</span>
              <span>Witaj w MasterZone! Przedstaw się w sekcji powitalnej i dołącz do pierwszego bloku pracy głębokiej.</span>
            </li>
          </ol>

          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-200">
              <strong>⚠️ Ważne:</strong> Dostęp aktywujesz przez link w mailu od Skool — <strong>nie wchodź</strong> na publiczną stronę skool.com/masterzone, bo zobaczysz tam standardową cenę i będziesz musiał płacić ponownie.
            </p>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="text-center space-y-4">
          <p className="text-blue-200 text-base">
            Mail nie przyszedł w ciągu 10 minut? Napisz na <a href="mailto:kontakt@masterzone.edu.pl" className="text-yellow-300 underline font-semibold">kontakt@masterzone.edu.pl</a> — ręcznie wyślemy zaproszenie.
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
