"use client";

import { useState } from "react";

interface HeroProps {
  headline: string;
  subheadline: string;
  description?: string;
  ctaText: string;
  ctaUrl: string;
  statsText: string;
  secondaryCta?: string;
}

export default function Hero({
  headline,
  subheadline,
  description,
  ctaText,
  ctaUrl,
  statsText,
  secondaryCta
}: HeroProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to Skool with email
    window.location.href = `${ctaUrl}?email=${encodeURIComponent(email)}`;
  };

  return (
    <section className="bg-gradient-to-br from-navy via-primary to-blue-800 text-white section-padding min-h-screen flex items-center">
      <div className="container-custom text-center">
        {/* Stats Badge */}
        <div className="inline-block mb-6 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium">
          {statsText}
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          {headline}
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl mb-6 max-w-3xl mx-auto text-white/90">
          {subheadline}
        </p>

        {/* Description */}
        {description && (
          <p className="text-lg md:text-xl mb-12 max-w-4xl mx-auto text-white/80">
            {description}
          </p>
        )}

        {/* CTA Form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Twój email"
              required
              className="flex-1 px-6 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-white/50"
            />
            <button
              type="submit"
              className="btn-primary bg-white text-navy hover:bg-lightblue whitespace-nowrap"
            >
              {ctaText}
            </button>
          </div>
        </form>

        {/* Trust Badge */}
        <p className="text-sm text-white/70">
          🔒 Dołącz za jedyne 9$ miesięcznie. Anuluj w każdej chwili.
        </p>

        {/* Scroll Indicator */}
        <div className="mt-16 animate-bounce">
          <svg
            className="w-6 h-6 mx-auto text-white/70"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
