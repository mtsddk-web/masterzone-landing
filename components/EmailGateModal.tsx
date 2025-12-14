"use client";

import { useState } from "react";
import { trackEvent } from "./FacebookPixel";

interface EmailGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EmailGateModal({ isOpen, onClose, onSuccess }: EmailGateModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Basic validation
    if (!name || name.trim().length < 2) {
      setError("Podaj swoje imię");
      setIsSubmitting(false);
      return;
    }
    if (!email || !email.includes('@')) {
      setError("Podaj prawidłowy adres email");
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('🚀 Sending to API:', { name, email });

      // Send to MailerLite
      const response = await fetch('/api/subscribe-trial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email,
          source: 'Email Gate - Skool Trial'
        }),
      });

      console.log('📡 API response status:', response.status);
      const data = await response.json();
      console.log('📦 API response data:', data);

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Coś poszło nie tak');
      }

      // Track success
      trackEvent("Lead", {
        source: "email_gate_modal",
        email: email
      });

      // Track w MailerLite Universal (jeśli dostępne)
      if (typeof window !== 'undefined' && (window as any).ml) {
        (window as any).ml('track', 'email_gate_submitted', {
          email: email
        });
      }

      // Success - show success message (no redirect - user must click link in email)
      setIsSuccess(true);
      setIsSubmitting(false);

    } catch (err) {
      console.error('Email gate error:', err);
      setError(err instanceof Error ? err.message : 'Wystąpił błąd. Spróbuj ponownie.');
      setIsSubmitting(false);
    }
  };


  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-8 md:p-10 animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Zamknij"
          disabled={isSubmitting}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center">
          {isSuccess ? (
            // SUCCESS VIEW - Check email message
            <>
              {/* Success Icon */}
              <div className="text-6xl mb-4">📬</div>

              {/* Success Headline */}
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Sprawdź swoją skrzynkę!
              </h2>

              {/* Main Message */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-6 mb-4">
                <p className="text-lg text-gray-800 mb-4">
                  Wysłaliśmy Ci <strong>email z zaproszeniem</strong> do społeczności MasterZone.
                </p>

                {/* Email CTA Box */}
                <div className="bg-white border-2 border-blue-400 rounded-lg p-4 text-center">
                  <p className="text-base font-bold text-gray-900 mb-2">
                    Kliknij link w emailu, żeby dołączyć
                  </p>
                  <p className="text-sm text-gray-600">
                    7 dni za darmo, potem $14/mies
                  </p>
                </div>
              </div>

              {/* SPAM Warning */}
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 mb-4">
                <p className="text-base font-bold text-yellow-800 flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  <span>Nie widzisz emaila?</span>
                </p>
                <p className="text-sm text-yellow-700 mt-2">
                  Sprawdź folder <strong>SPAM</strong> lub <strong>Oferty</strong> - czasem trafiamy tam przez pomyłkę!
                </p>
              </div>

              {/* Footer */}
              <p className="text-sm text-gray-600 mb-4">
                Email powinien dotrzeć w ciągu kilku minut. Masz pytania? Napisz do nas!
              </p>

              {/* Close button */}
              <button
                onClick={onClose}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Rozumiem, sprawdzam email
              </button>

              <p className="text-xs text-gray-500 mt-4">
                <strong>Radek Pustelnik & Mateusz Dudek</strong><br/>
                MasterZone – Strefa Skupienia
              </p>
            </>
          ) : (
            // FORM VIEW
            <>
              {/* Icon */}
              <div className="text-5xl mb-4">🎁</div>

              {/* Headline */}
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Ostatni krok do 7 dni FREE!
              </h2>

              {/* Subheadline */}
              <p className="text-base text-gray-600 mb-6">
                Podaj email → wyślemy Ci link do społeczności MasterZone
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Twoje imię"
                disabled={isSubmitting}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>

            {/* Email Input */}
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="twoj@email.pl"
                disabled={isSubmitting}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2 border-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? "Zapisuję..." : "Wyślij mi dostęp →"}
            </button>
          </form>

              {/* Trust Signals */}
              <div className="mt-6 space-y-2">
                <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  7 dni za darmo • Potem $14/mies
                </p>
                <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Możesz anulować w każdej chwili
                </p>
              </div>
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
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
