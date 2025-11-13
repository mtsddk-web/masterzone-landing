"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ThankYouPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState<number | null>(null);

  // Auto-redirect po 60 sekundach (daje czas obejrzeć film)
  useEffect(() => {
    const timer = setTimeout(() => {
      setCountdown(10);
    }, 50000); // Po 50 sekundach zaczyna countdown

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      window.location.href = "https://www.skool.com/masterzone";
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  const handleSkoolRedirect = () => {
    window.location.href = "https://www.skool.com/masterzone";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Success Message */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-scale-in">
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

          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            🎉 Świetnie! Jesteś zapisany!
          </h1>

          <p className="text-xl text-blue-200 mb-2">
            Za chwilę przekierujemy Cię do społeczności MasterZone
          </p>

          <p className="text-lg text-blue-300">
            Ale najpierw - <strong>obejrzyj ten krótki film</strong> 👇
          </p>
        </div>

        {/* Video Container */}
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-2xl mb-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white mb-2">
              📺 Jak poruszać się po MasterZone
            </h2>
            <p className="text-blue-200">
              Film wyjaśnia wszystko co musisz wiedzieć żeby zacząć:
            </p>
            <ul className="text-blue-300 mt-2 space-y-1 ml-4">
              <li>✓ Jak działa platforma Skool</li>
              <li>✓ Dlaczego płatności w dolarach (i jak to działa)</li>
              <li>✓ Jak dołączyć do bloków pracy głębokiej</li>
              <li>✓ Co zrobić w pierwszych 24h</li>
            </ul>
          </div>

          {/* Wistia Video Embed - iframe version (Next.js compatible) */}
          <div className="relative rounded-xl overflow-hidden bg-black" style={{ paddingTop: '56.25%' }}>
            <iframe
              src="https://fast.wistia.net/embed/iframe/7ueol9vha3?seo=true&videoFoam=true"
              title="Jak poruszać się po MasterZone"
              allow="autoplay; fullscreen"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
              style={{ border: 'none' }}
            ></iframe>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center space-y-4">
          <button
            onClick={handleSkoolRedirect}
            className="w-full md:w-auto inline-block bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-black py-5 px-12 rounded-xl transition-all duration-300 text-lg shadow-2xl hover:shadow-green-500/50 transform hover:scale-105"
          >
            🚀 Przejdź do MasterZone (Skool) →
          </button>

          {countdown !== null && (
            <p className="text-sm text-blue-300 animate-pulse">
              Automatyczne przekierowanie za {countdown}s...
            </p>
          )}

          <p className="text-xs text-blue-400">
            💡 <strong>Pamiętaj:</strong> Masz 7 dni ZA DARMO, potem $14/miesiąc.
            <br />
            Możesz anulować w każdej chwili bez pytań.
          </p>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
}
