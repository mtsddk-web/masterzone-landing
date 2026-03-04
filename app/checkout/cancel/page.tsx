"use client";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="inline-block mb-6">
          <div className="w-20 h-20 bg-gray-500 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Płatność nie została zakończona
        </h1>

        <p className="text-lg text-blue-200 mb-2">
          Nic nie zostało pobrane z Twojego konta.
        </p>

        <p className="text-blue-300 mb-8">
          Jeśli masz pytania lub napotkałeś problem, napisz do nas.
        </p>

        {/* Buttons */}
        <div className="space-y-4">
          <a
            href="/checkout"
            className="block w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 text-lg shadow-xl border-2 border-yellow-300"
          >
            Spróbuj ponownie
          </a>

          <a
            href="/"
            className="block text-blue-300 hover:text-white text-sm transition-colors"
          >
            &larr; Wróć na stronę główną
          </a>
        </div>

        <p className="text-xs text-blue-400 mt-8">
          Masz pytania? biuro@masterzone.edu.pl
        </p>
      </div>
    </div>
  );
}
